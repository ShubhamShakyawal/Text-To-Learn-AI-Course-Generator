import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, Brain, Video, ListChecks, CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Analyzing learning topic...", icon: Brain, color: "text-blue-500" },
  { text: "Structuring course curriculum...", icon: Sparkles, color: "text-indigo-500" },
  { text: "Drafting modules & core concepts...", icon: Coffee, color: "text-purple-500" },
  { text: "Sourcing high-quality YouTube videos...", icon: Video, color: "text-pink-500" },
  { text: "Generating interactive MCQs...", icon: ListChecks, color: "text-emerald-500" },
  { text: "Adding final polish...", icon: CheckCircle2, color: "text-cyan-500" }
];

const CourseGenerationLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through loading steps to show progress
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = LOADING_STEPS[stepIndex].icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden">
      
      {/* ── Background Skeleton UI of Course Page ── */}
      <div className="absolute inset-0 max-w-5xl mx-auto px-6 py-12 pointer-events-none opacity-20 filter blur-[1px]">
        {/* Navigation Breadcrumb Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-4 bg-slate-800 rounded-md animate-pulse" />
          <div className="w-4 h-4 bg-slate-800 rounded-full animate-pulse" />
          <div className="w-28 h-4 bg-slate-800 rounded-md animate-pulse" />
        </div>

        {/* Title & Description Skeleton */}
        <div className="w-3/4 h-12 bg-slate-800 rounded-2xl mb-6 animate-pulse" />
        <div className="space-y-3 mb-8">
          <div className="w-full h-4 bg-slate-800 rounded-md animate-pulse" />
          <div className="w-5/6 h-4 bg-slate-800 rounded-md animate-pulse" />
          <div className="w-2/3 h-4 bg-slate-800 rounded-md animate-pulse" />
        </div>

        {/* Badges Skeleton */}
        <div className="flex gap-4 items-center mb-12">
          <div className="w-28 h-8 bg-slate-800 rounded-full animate-pulse" />
          <div className="w-28 h-8 bg-slate-800 rounded-full animate-pulse" />
          <div className="w-20 h-8 bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Curriculum Header Skeleton */}
        <div className="w-48 h-8 bg-slate-800 rounded-md mb-8 animate-pulse" />

        {/* Module Cards Skeleton */}
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
                <div className="w-1/3 h-6 bg-slate-800 rounded-md animate-pulse" />
              </div>
              <hr className="border-slate-800/60" />
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-5 h-5 bg-slate-800 rounded-full animate-pulse" />
                      <div className="w-1/2 h-4 bg-slate-800 rounded-md animate-pulse" />
                    </div>
                    <div className="w-5 h-5 bg-slate-800 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Foreground Steaming Coffee Loader Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative max-w-md w-full mx-4 p-8 bg-slate-900/80 border border-slate-850 backdrop-blur-xl rounded-3xl shadow-2xl text-center overflow-hidden"
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Coffee Cup Steaming Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-slate-950/60 border border-slate-800 rounded-2xl shadow-inner">
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10">
            <defs>
              <linearGradient id="steam-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgb(148, 163, 184)" stopOpacity="0.45" />
                <stop offset="50%" stopColor="rgb(203, 213, 225)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(241, 245, 249)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Steam trails: Wavy curves simulating natural rising smoke */}
            {[0, 1, 2].map((i) => {
              const paths = [
                "M 32 60 C 37 45, 27 32, 32 18 C 37 5, 27 -8, 32 -22",
                "M 48 60 C 43 45, 53 32, 48 18 C 43 5, 53 -8, 48 -22",
                "M 64 60 C 69 45, 59 32, 64 18 C 69 5, 59 -8, 64 -22"
              ];
              const delay = i * 0.9;
              return (
                <motion.path
                  key={i}
                  d={paths[i]}
                  fill="none"
                  stroke="url(#steam-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="blur(1px)"
                  initial={{ opacity: 0, y: 15, scaleY: 0.8 }}
                  animate={{
                    opacity: [0, 0.8, 0.4, 0],
                    y: [-5, -28, -50, -72],
                    x: i === 0 ? [0, -4, 3, -2, 0] : i === 1 ? [0, 3, -3, 2, 0] : [0, -3, 4, -1, 0],
                    scaleY: [0.8, 1.1, 1.2, 0.9],
                  }}
                  transition={{
                    duration: 3.0,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </svg>
          <Coffee className="w-10 h-10 text-slate-300 mt-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] z-10" />
        </div>

        {/* Main Loading Texts */}
        <h3 className="text-xl font-bold text-white mb-2">
          Grab a coffee!
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 px-4">
          While you take a sip, our AI is building your personalized course from scratch.
        </p>

        {/* Dynamic Status Progress Indicator */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex items-center gap-3.5 mb-6 text-left">
          <div className="w-10 h-10 flex-shrink-0 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ rotate: -15, scale: 0.85, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 15, scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveIcon className={`w-5 h-5 ${LOADING_STEPS[stepIndex].color}`} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Current Phase</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-semibold text-slate-200 truncate"
              >
                {LOADING_STEPS[stepIndex].text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900/50">
          <motion.div
            initial={{ width: "2%" }}
            animate={{ width: `${((stepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Est. 20-30s</span>
          <span>{Math.round(((stepIndex + 1) / LOADING_STEPS.length) * 100)}% Complete</span>
        </div>
      </motion.div>

    </div>
  );
};

export default CourseGenerationLoader;
