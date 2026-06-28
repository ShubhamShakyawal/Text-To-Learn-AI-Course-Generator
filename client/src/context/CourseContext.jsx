import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches the current user's (or guest's) courses from the backend.
   * Works for both authenticated users (uses JSESSIONID) and guests (uses GUEST_SESSION_ID).
   */
  const fetchUserCourses = async () => {
    try {
      const data = await api.getUserCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
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
      setCourses((prev) => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      setError('Failed to generate course. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const updateProgress = async (courseId, lessonId, completed) => {
    try {
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            completedLessons: completed
              ? [...(course.completedLessons || []), lessonId]
              : (course.completedLessons || []).filter(id => id !== lessonId)
          };
        }
        return course;
      }));

      setActiveCourse(prev => {
        if (prev && prev.id === courseId) {
          return {
            ...prev,
            completedLessons: completed
              ? [...(prev.completedLessons || []), lessonId]
              : (prev.completedLessons || []).filter(id => id !== lessonId)
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
      setActiveCourse(data);
      return data;
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
        courses,
        activeCourse,
        activeLesson,
        isGenerating,
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
