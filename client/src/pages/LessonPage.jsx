import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  CheckCircle2,
} from 'lucide-react';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  // Handle youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  // Handle youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  return url;
};

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const navigate = useNavigate();
  const { activeCourse, fetchCourse, setActiveLesson, activeLesson, updateProgress, isGenerating, error } = useCourse();

  const mIdx = parseInt(moduleIndex, 10);
  const lIdx = parseInt(lessonIndex, 10);

  // Compute lesson progress % for the current course
  const modulesList = Array.isArray(activeCourse?.modules) ? activeCourse.modules : [];
  const totalLessons = modulesList.reduce((acc, m) => acc + (Array.isArray(m?.lessons) ? m.lessons.length : 0), 0);
  const completedCount = Array.isArray(activeCourse?.completedLessons) ? activeCourse.completedLessons.length : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Load the course if it isn't already in context (or if it's a different course).
  // FIX: compare as strings to avoid Number vs String type mismatch from URL params.
  useEffect(() => {
    const load = async () => {
      if (!activeCourse || String(activeCourse.id) !== String(courseId)) {
        await fetchCourse(courseId);
      }
    };
    load();
  }, [courseId]);

  // Derive the active lesson directly from the course data already in context.
  // FIX: do NOT call api.getLesson() — lessons are already embedded in the course
  // response from /api/courses/{id}. Calling /api/lessons/{id} separately
  // hits a protected endpoint and fails for guests.
  useEffect(() => {
    if (activeCourse && String(activeCourse.id) === String(courseId)) {
      const lesson = activeCourse.modules?.[mIdx]?.lessons?.[lIdx];
      if (lesson) {
        setActiveLesson(lesson);
      }
    }
  }, [activeCourse, courseId, mIdx, lIdx]);



  const goToNext = async () => {
    if (activeLesson) {
      await updateProgress(courseId, activeLesson.id, true);
    }

    const currentModule = activeCourse?.modules?.[mIdx];
    if (!currentModule) return;

    const nextLIdx = lIdx + 1;
    if (nextLIdx < currentModule.lessons.length) {
      navigate(`/course/${courseId}/module/${mIdx}/lesson/${nextLIdx}`);
    } else {
      const nextMIdx = mIdx + 1;
      if (nextMIdx < activeCourse.modules.length) {
        navigate(`/course/${courseId}/module/${nextMIdx}/lesson/0`);
      } else {
        navigate(`/course/${courseId}`);
      }
    }
  };

  const goToPrev = () => {
    const prevLIdx = lIdx - 1;
    if (prevLIdx >= 0) {
      navigate(`/course/${courseId}/module/${mIdx}/lesson/${prevLIdx}`);
    } else {
      const prevMIdx = mIdx - 1;
      if (prevMIdx >= 0) {
        const prevModule = activeCourse?.modules?.[prevMIdx];
        if (prevModule) {
          navigate(`/course/${courseId}/module/${prevMIdx}/lesson/${prevModule.lessons.length - 1}`);
        }
      }
    }
  };

  // Show loading only when course is still being fetched and we have nothing yet
  if (isGenerating && !activeCourse) return <LoadingSpinner message="Loading lesson, please wait..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!activeLesson) return (
    <div className="p-10 text-center text-slate-400">
      {activeCourse ? 'Lesson not found in this course.' : 'Loading lesson…'}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 pb-32">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-10">
        <Link 
          to={`/course/${courseId}`}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Course</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400 tabular-nums">{progressPercent}%</span>
          </div>

          <LessonPDFExporter
            lesson={activeLesson}
            content={activeLesson.content || []}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="mb-10">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-widest mb-4">
            <span>Module {mIdx + 1}</span>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <span>Lesson {lIdx + 1}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
            {activeLesson.title}
          </h1>

          {/* Objectives */}
          {activeLesson.objectives && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl mb-12">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Target size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Learning Objectives</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeLesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                    <CheckCircle2 size={16} className="mt-0.5 text-slate-700" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* YouTube Video (if lesson has one) */}
          {activeLesson.youtubeUrl && (
            <div className="mb-10 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(activeLesson.youtubeUrl)}
                  title={activeLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </header>

        {/* Lesson body — renders structured content blocks or plain text */}
        <div className="lesson-body">
          {Array.isArray(activeLesson.content) && activeLesson.content.length > 0 ? (
            <LessonRenderer content={activeLesson.content} />
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {activeLesson.content || activeLesson.description || 'No content available for this lesson.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={goToPrev}
            className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider opacity-50">Previous</p>
              <p className="font-bold">Lesson</p>
            </div>
          </button>

          <button
            onClick={goToNext}
            className="flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-600/20 group"
          >
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider opacity-70">Up Next</p>
              <p className="font-bold">Continue</p>
            </div>
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LessonPage;
