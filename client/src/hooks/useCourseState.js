import { useState, useEffect } from 'react';

export const useCourseState = () => {
  const [courseData, setCourseData] = useState(() => {
    const saved = localStorage.getItem('courseData');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedModuleId, setSelectedModuleId] = useState(() => {
    const saved = localStorage.getItem('selectedModuleId');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedLessonId, setSelectedLessonId] = useState(() => {
    const saved = localStorage.getItem('selectedLessonId');
    return saved ? JSON.parse(saved) : null;
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('completedLessons');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist states
  useEffect(() => {
    if (courseData) {
      localStorage.setItem('courseData', JSON.stringify(courseData));
    } else {
      localStorage.removeItem('courseData');
      localStorage.removeItem('selectedModuleId');
      localStorage.removeItem('selectedLessonId');
      localStorage.removeItem('completedLessons');
    }
  }, [courseData]);

  useEffect(() => {
    if (selectedModuleId !== null) localStorage.setItem('selectedModuleId', JSON.stringify(selectedModuleId));
  }, [selectedModuleId]);

  useEffect(() => {
    if (selectedLessonId !== null) localStorage.setItem('selectedLessonId', JSON.stringify(selectedLessonId));
  }, [selectedLessonId]);

  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const markLessonCompleted = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const calculateProgress = () => {
    if (!courseData || !courseData.modules) return 0;

    let totalLessons = 0;
    courseData.modules.forEach(m => {
      totalLessons += m.lessons.length;
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  const navigateToNextLesson = () => {
    if (!courseData || !selectedModuleId || !selectedLessonId) return;

    const moduleIndex = courseData.modules.findIndex(m => m.id === selectedModuleId);
    if (moduleIndex === -1) return;

    const currentModule = courseData.modules[moduleIndex];
    const lessonIndex = currentModule.lessons.findIndex(l => l.id === selectedLessonId);

    // Next lesson in same module
    if (lessonIndex < currentModule.lessons.length - 1) {
      setSelectedLessonId(currentModule.lessons[lessonIndex + 1].id);
    }
    // First lesson in next module
    else if (moduleIndex < courseData.modules.length - 1) {
      const nextModule = courseData.modules[moduleIndex + 1];
      if (nextModule.lessons.length > 0) {
        setSelectedModuleId(nextModule.id);
        setSelectedLessonId(nextModule.lessons[0].id);
      }
    }
  };

  const clearCourse = () => {
    setCourseData(null);
    setSelectedModuleId(null);
    setSelectedLessonId(null);
    setCompletedLessons([]);
  };

  return {
    courseData,
    setCourseData,
    selectedModuleId,
    setSelectedModuleId,
    selectedLessonId,
    setSelectedLessonId,
    completedLessons,
    markLessonCompleted,
    calculateProgress,
    navigateToNextLesson,
    clearCourse
  };
}
