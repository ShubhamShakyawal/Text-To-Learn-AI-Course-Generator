import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

// ── Cache helpers ──────────────────────────────────────────────────────────────
/**
 * Returns a localStorage key scoped to the current user (or "guest").
 * The user ID is read from the 'user' entry saved by AuthContext.
 */
const getCourseCacheKey = () => {
  try {
    const saved = localStorage.getItem('user');
    const uid = saved ? JSON.parse(saved)?.id : null;
    return uid ? `courses_cache_${uid}` : 'courses_cache_guest';
  } catch {
    return 'courses_cache_guest';
  }
};

const loadCoursesFromCache = () => {
  try {
    const raw = localStorage.getItem(getCourseCacheKey());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveCoursesToCache = (courses) => {
  try {
    localStorage.setItem(getCourseCacheKey(), JSON.stringify(courses));
  } catch {
    // Ignore quota errors
  }
};

const clearCoursesCache = () => {
  try {
    localStorage.removeItem(getCourseCacheKey());
  } catch {
    // Ignore
  }
};
// ──────────────────────────────────────────────────────────────────────────────

export const CourseProvider = ({ children }) => {
  // Initialise from cache immediately — prevents a blank sidebar on every reload
  const [courses, setCourses] = useState(() => {
    const cached = loadCoursesFromCache();
    return Array.isArray(cached) ? cached : [];
  });
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // If we already have a cache, skip the loading skeleton on first render
  const [isLoadingCourses, setIsLoadingCourses] = useState(() => {
    const cached = loadCoursesFromCache();
    return !Array.isArray(cached);
  });
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
   * Fetches the current user's (or guest's) courses from the backend and
   * updates both React state and the localStorage cache.
   */
  const fetchUserCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const data = await api.getUserCourses();
      const list = Array.isArray(data) ? data : [];
      const hydrated = list.map(c => hydrateCourseProgress(c)).filter(Boolean);
      setCourses(hydrated);
      saveCoursesToCache(hydrated);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      // Don't wipe the cache on network errors — keep showing stale data
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // On mount: if we already have a cache, render it immediately and skip
  // the API call. Only fetch from the server on the very first load (no cache)
  // or after login/logout events.
  useEffect(() => {
    const cached = loadCoursesFromCache();
    if (!Array.isArray(cached)) {
      // No cache yet — do an initial fetch
      fetchUserCourses();
    } else {
      // Already populated from cache in useState initialiser; mark loading done
      setIsLoadingCourses(false);
    }

    // After login: clear stale cache (previous user / guest) and fetch fresh data
    const onAuthLogin = () => {
      clearCoursesCache();
      fetchUserCourses();
    };

    // After logout: clear courses from state and wipe the cache
    const onAuthLogout = () => {
      clearCoursesCache();
      setCourses([]);
      setActiveCourse(null);
      setActiveLesson(null);
      setIsLoadingCourses(false);
    };

    window.addEventListener('auth:login', onAuthLogin);
    window.addEventListener('auth:logout', onAuthLogout);
    return () => {
      window.removeEventListener('auth:login', onAuthLogin);
      window.removeEventListener('auth:logout', onAuthLogout);
    };
  }, []);

  const generateCourse = async (prompt) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newCourse = await api.generateCourse(prompt);
      const hydrated = hydrateCourseProgress(newCourse);
      setCourses((prev) => {
        const updated = [hydrated, ...(Array.isArray(prev) ? prev : [])].filter(Boolean);
        saveCoursesToCache(updated);
        return updated;
      });
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
