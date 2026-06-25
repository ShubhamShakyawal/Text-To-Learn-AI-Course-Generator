import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../hooks/useAuth';
import PromptForm from '../components/PromptForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Horizontal course slider ──────────────────────────────────────────── */
const CourseSlider = ({ courses }) => {
  const trackRef  = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const CARD_W = 280; // approximate card width + gap

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
  }, [courses]);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * CARD_W * 2, behavior: 'smooth' });
    setTimeout(updateArrows, 320);
  };

  return (
    <div className="relative group/slider">
      {/* Left arrow */}
      <motion.button
        initial={false}
        animate={{ opacity: canPrev ? 1 : 0, pointerEvents: canPrev ? 'auto' : 'none' }}
        transition={{ duration: 0.15 }}
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 shadow-xl transition-colors"
      >
        <ChevronLeft size={18} />
      </motion.button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="flex-shrink-0 w-64"
          >
            <Link
              to={`/course/${course.id}`}
              className="block group h-full bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Icon + title */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 flex-shrink-0 bg-slate-800 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                  <BookOpen size={17} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {course.description || 'AI-generated course'}
              </p>

              {/* Footer meta */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Tag size={11} />
                  <span className="truncate max-w-[90px]">{course.tags?.[0] || 'AI Generated'}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Clock size={11} />
                  <span>Recently</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Right arrow */}
      <motion.button
        initial={false}
        animate={{ opacity: canNext ? 1 : 0, pointerEvents: canNext ? 'auto' : 'none' }}
        transition={{ duration: 0.15 }}
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 shadow-xl transition-colors"
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
};

/* ── Page ───────────────────────────────────────────────────────────────── */
const HomePage = () => {
  const {
    courses,
    generateCourse,
    fetchUserCourses,
    isGenerating,
    error,
  } = useCourse();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchUserCourses();
  }, [isAuthenticated]);

  const handleGenerate = async (prompt) => {
    try {
      const newCourse = await generateCourse(prompt);
      if (newCourse?.id && !isAuthenticated) {
        navigate(`/course/${newCourse.id}`);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <div className="min-h-full">
      {/* ── Hero / Prompt ── */}
      <section className={`pt-20 pb-24 ${!isAuthenticated ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-slate-900/50'} border-b border-slate-800`}>
        <div className="max-w-7xl mx-auto px-6">
          <PromptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          <ErrorMessage message={error} />

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-col items-center"
            >
              <p className="text-slate-500 mb-6 font-medium">Or sign in to track your progress</p>
              <Link
                to="/login"
                className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-6 mt-12 mb-12">
        {isAuthenticated ? (
          <>
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Courses</h2>
              <span className="text-slate-500 text-sm font-medium">
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} generated
              </span>
            </div>

            {courses.length === 0 && !isGenerating ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                <BookOpen size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-slate-500 text-lg">No courses yet. Start by generating one above!</p>
              </div>
            ) : (
              /* Horizontal slider — one row, arrow navigation */
              <CourseSlider courses={[...courses].reverse()} />
            )}
          </>
        ) : (
          /* Marketing features for unauthenticated users */
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Join 10,000+ Learners</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10">
              Create a free account to save your generated courses, track your learning progress, and get personalized recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Save Progress', desc: 'Pick up exactly where you left off in any course.', icon: Clock },
                { title: 'Personalized AI', desc: 'Our AI learns your style and adapts courses to you.', icon: BookOpen },
                { title: 'Certificates',  desc: 'Earn verified certificates of completion for your skills.', icon: Tag },
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <feature.icon size={32} className="text-blue-500 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {isGenerating && <LoadingSpinner />}
      <Footer />
    </div>
  );
};

export default HomePage;
