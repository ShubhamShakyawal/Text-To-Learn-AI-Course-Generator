import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as api from '../utils/api';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Target, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const navigate = useNavigate();
  const { activeCourse, fetchCourse, activeLesson, setActiveLesson, updateProgress, isGenerating, error } = useCourse();
  const pdfRef = useRef();
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(new Audio());

  const mIdx = parseInt(moduleIndex);
  const lIdx = parseInt(lessonIndex);

  useEffect(() => {
    const loadData = async () => {
      if (!activeCourse || activeCourse.id !== courseId) {
        await fetchCourse(courseId);
      }
    };
    loadData();
  }, [courseId]);

  useEffect(() => {
    if (activeCourse) {
      const lesson = activeCourse.modules?.[mIdx]?.lessons?.[lIdx];
      if (lesson) {
        // In a real app, we might fetch full lesson content here if it's not pre-loaded
        // For this spec, we'll assume the lesson object in the course has the content array or we fetch it
        const fetchFullLesson = async () => {
          try {
            const data = await api.getLesson(lesson.id);
            setActiveLesson(data);
          } catch (err) {
            console.error('Failed to fetch lesson content:', err);
            // Fallback if the activeCourse already has content
            setActiveLesson(lesson);
          }
        };
        fetchFullLesson();
      }
    }
    
    // Cleanup audio on lesson change
    return () => {
      audioRef.current.pause();
      setAudioUrl(null);
    };
  }, [activeCourse, mIdx, lIdx]);

  const handleHinglishAudio = async () => {
    if (audioUrl) {
      audioRef.current.play();
      return;
    }

    setAudioLoading(true);
    try {
      const data = await api.getHinglishAudio(activeLesson.id);
      // Assuming data.audioUrl or similar
      const url = data.audioUrl || data;
      setAudioUrl(url);
      audioRef.current.src = url;
      audioRef.current.play();
    } catch (err) {
      console.error('Failed to get Hinglish audio:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  const goToNext = async () => {
    // Mark current lesson as completed
    await updateProgress(courseId, activeLesson.id, true);

    const nextLIdx = lIdx + 1;
    const currentModule = activeCourse.modules[mIdx];
    
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
        const prevModule = activeCourse.modules[prevMIdx];
        navigate(`/course/${courseId}/module/${prevMIdx}/lesson/${prevModule.lessons.length - 1}`);
      }
    }
  };

  if (isGenerating && !activeLesson) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!activeLesson) return <div className="p-10 text-center">Lesson not found.</div>;

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
          <button
            onClick={handleHinglishAudio}
            disabled={audioLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/20 transition-all"
          >
            {audioLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
            <span>Hear in Hinglish</span>
          </button>
          
          <LessonPDFExporter 
            ref={pdfRef} 
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
        </header>

        <div className="lesson-body">
          <LessonRenderer content={activeLesson.content || []} />
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
