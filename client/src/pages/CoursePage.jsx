import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CertificateModal from '../components/CertificateModal';
import { motion } from 'framer-motion';
import { ChevronRight, Play, BookOpen, Clock, Layers, CheckCircle2, Award } from 'lucide-react';

const CoursePage = () => {
  const { courseId } = useParams();
  const { activeCourse, fetchCourse, isGenerating, error } = useCourse();
  const { user } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        if (!activeCourse || String(activeCourse.id) !== String(courseId)) {
          await fetchCourse(courseId);
        }
      } catch (err) {
        navigate('/#my-courses', { state: { error: 'Invalid course ID or you do not have permission to access it.' } });
      }
    };
    load();
  }, [courseId]);

  if (isGenerating && !activeCourse) return <LoadingSpinner message="Loading your course, please wait..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!activeCourse) return <div className="p-10 text-center">Course not found.</div>;

  const isCompleted = (lessonId) => activeCourse.completedLessons?.includes(lessonId);

  const modulesList = Array.isArray(activeCourse.modules) ? activeCourse.modules : [];
  const totalLessons = modulesList.reduce((acc, m) => {
    if (!m) return acc;
    const lessonsList = Array.isArray(m.lessons) ? m.lessons : [];
    return acc + lessonsList.length;
  }, 0);
  const completedCount = Array.isArray(activeCourse.completedLessons) ? activeCourse.completedLessons.length : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 text-blue-400 mb-6">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <ChevronRight size={16} className="text-slate-600" />
          <span className="text-slate-400">Course Overview</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          {activeCourse.title}
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-3xl">
          {activeCourse.description}
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300">
            <Layers size={16} className="text-blue-500" />
            <span>{activeCourse.modules?.length} Modules</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300">
            <BookOpen size={16} className="text-purple-500" />
            <span>{totalLessons} Lessons</span>
          </div>
          {activeCourse.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Progress display card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700/30 transition-all"
      >
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-400">Course Completion Progress</span>
            <span className="text-sm font-bold text-blue-400">{progressPercent}% ({completedCount}/{totalLessons} Lessons)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {progressPercent === 100 && (
          <button
            onClick={() => setShowCertificate(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap self-start md:self-center"
          >
            <Award size={18} />
            View Certificate
          </button>
        )}
      </motion.div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Course Curriculum</h2>
        
        {activeCourse.modules?.map((module, mIdx) => (
          <motion.div 
            key={module.id || mIdx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mIdx * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-lg text-sm font-bold">
                  {mIdx + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-100">{module.title}</h3>
              </div>
            </div>
            
            <div className="p-2">
              {module.lessons?.map((lesson, lIdx) => (
                <Link
                  key={lesson.id || lIdx}
                  to={`/course/${courseId}/module/${mIdx}/lesson/${lIdx}`}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                      {isCompleted(lesson.id) ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Play size={16} />
                      )}
                    </div>
                    <span className={`font-medium transition-colors ${isCompleted(lesson.id) ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                      {lesson.title}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificate Modal Overlay */}
      {showCertificate && (
        <CertificateModal
          course={activeCourse}
          userName={user?.name}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default CoursePage;
