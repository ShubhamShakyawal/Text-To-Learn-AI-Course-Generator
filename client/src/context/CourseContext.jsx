import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState(null);

  // Helper to hydrate a course object with localStorage progress
  const hydrateCourseProgress = (course) => {
    if (!course) return null;
    const progressKey = `progress_${course.id}`;
    const saved = localStorage.getItem(progressKey);
    const completedLessons = saved ? JSON.parse(saved) : [];
    return {
      ...course,
      completedLessons: Array.isArray(completedLessons) ? completedLessons : []
    };
  };

  /**
   * Fetches the current user's (or guest's) courses from the backend.
   * Works for both authenticated users (uses JSESSIONID) and guests (uses GUEST_SESSION_ID).
   */
  const fetchUserCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const data = await api.getUserCourses();
      const list = Array.isArray(data) ? data : [];
      const hydrated = list.map(c => hydrateCourseProgress(c)).filter(Boolean);
      setCourses(hydrated);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Load courses on mount — works for both guests and authenticated users.
  // Also listens for 'auth:login' so courses are refreshed (including transferred
  // guest courses) immediately after the user logs in or registers.
  useEffect(() => {
    fetchUserCourses();

    const onAuthLogin = () => fetchUserCourses();
    window.addEventListener('auth:login', onAuthLogin);
    return () => window.removeEventListener('auth:login', onAuthLogin);
  }, []);

  const generateCourse = async (prompt) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newCourse = await api.generateCourse(prompt);
      const hydrated = hydrateCourseProgress(newCourse);
      setCourses((prev) => [hydrated, ...(Array.isArray(prev) ? prev : [])].filter(Boolean));
      return hydrated;
    } catch (err) {
      setError('Failed to generate course. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const updateProgress = async (courseId, lessonId, completed) => {
    try {
      const progressKey = `progress_${courseId}`;
      const saved = localStorage.getItem(progressKey);
      let currentProgress = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(currentProgress)) currentProgress = [];

      if (completed) {
        currentProgress = [...new Set([...currentProgress, lessonId])];
      } else {
        currentProgress = currentProgress.filter(id => id !== lessonId);
      }
      localStorage.setItem(progressKey, JSON.stringify(currentProgress));

      setCourses(prev => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map(course => {
          if (String(course.id) === String(courseId)) {
            return {
              ...course,
              completedLessons: currentProgress
            };
          }
          return course;
        });
      });

      setActiveCourse(prev => {
        if (prev && String(prev.id) === String(courseId)) {
          return {
            ...prev,
            completedLessons: currentProgress
          };
        }
        return prev;
      });

      await api.updateLessonProgress(courseId, lessonId, completed);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const fetchCourse = async (id) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await api.getCourse(id);
      const hydrated = hydrateCourseProgress(data);
      setActiveCourse(hydrated);
      return hydrated;
    } catch (err) {
      setError('Failed to fetch course details.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchLesson = async (id) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await api.getLesson(id);
      setActiveLesson(data);
      return data;
    } catch (err) {
      setError('Failed to fetch lesson content.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses: Array.isArray(courses) ? courses : [],
        activeCourse,
        activeLesson,
        isGenerating,
        isLoadingCourses,
        error,
        generateCourse,
        fetchCourse,
        fetchLesson,
        fetchUserCourses,
        updateProgress,
        setActiveCourse,
        setActiveLesson,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
