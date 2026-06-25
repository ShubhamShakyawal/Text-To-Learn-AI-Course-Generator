import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Sparkles, Target, Users, Zap,
  BookOpen, Heart, ArrowRight, Globe, Shield, Cpu
} from 'lucide-react';
import Footer from '../components/Footer';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

/* ── Small reusable card ── */
const Card = ({ icon: Icon, title, desc, color = 'blue' }) => {
  const colors = {
    blue:   'bg-blue-600/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
    pink:   'bg-pink-600/10 border-pink-500/20 text-pink-400',
    green:  'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
    amber:  'bg-amber-600/10 border-amber-500/20 text-amber-400',
    cyan:   'bg-cyan-600/10 border-cyan-500/20 text-cyan-400',
  };
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

/* ── Team member ── */
const TeamMember = ({ name, role, avatar, delay }) => (
  <motion.div {...fadeUp(delay)} className="flex flex-col items-center text-center">
    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-700 mb-4 bg-slate-800">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <p className="font-bold text-white text-sm">{name}</p>
    <p className="text-xs text-slate-500 mt-0.5">{role}</p>
  </motion.div>
);

/* ── Stat bubble ── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl font-black text-white mb-1">{value}</p>
    <p className="text-slate-500 text-sm">{label}</p>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════ */
const AboutPage = () => {
  const values = [
    { icon: Zap,    title: 'Speed',       desc: 'Generate a full structured course in seconds — not hours of manual curation.', color: 'amber'  },
    { icon: Target, title: 'Relevance',   desc: 'AI tailors every course to your exact topic, skill level, and learning goal.',  color: 'blue'   },
    { icon: Shield, title: 'Quality',     desc: 'Curated prompts and structured output ensure consistent, trustworthy content.',  color: 'green'  },
    { icon: Globe,  title: 'Accessibility', desc: 'Learning should have no barriers — free to generate, free to explore.',     color: 'cyan'   },
    { icon: Cpu,    title: 'Innovation',  desc: 'We keep pace with the latest AI models to continuously improve course quality.', color: 'purple' },
    { icon: Heart,  title: 'Community',   desc: 'Built by learners, for learners. Your feedback shapes every feature we ship.', color: 'pink'   },
  ];

  const team = [
    { name: 'Shubham', role: 'Founder & Developer',  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Shubham&backgroundColor=1e40af' },
    { name: 'AI Core',  role: 'Course Generation Engine', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AICore&backgroundColor=0f172a' },
    { name: 'Community', role: 'Beta Testers & Users', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Community&backgroundColor=7c3aed' },
  ];

  return (
    <div className="min-h-full bg-slate-950">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-28 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">About Us</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Learning, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">reimagined</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Text-to-Learn is an AI-powered course generator that turns any topic into a structured, 
            personalized learning experience — in seconds.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition-all"
            >
              <BookOpen size={16} /> Try a Course
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-800 bg-slate-900/40 py-16">
        <motion.div {...fadeUp(0)} className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="10K+"   label="Learners worldwide"   />
          <Stat value="50K+"   label="Courses generated"    />
          <Stat value="200+"   label="Topics covered"       />
          <Stat value="< 30s"  label="Avg. generation time" />
        </motion.div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp(0)}>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Our Mission</p>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                Make knowledge <br /> accessible to everyone
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Traditional course platforms take months to create content and charge high prices. 
                We believe anyone should be able to learn anything instantly — without barriers.
              </p>
              <p className="text-slate-400 leading-relaxed">
                By combining cutting-edge language models with thoughtful UX, Text-to-Learn 
                generates structured, readable, and actionable courses on demand. No fluff, 
                just knowledge.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-4">
              {[
                { icon: GraduationCap, label: 'Structured Learning' },
                { icon: Zap,           label: 'Instant Generation'  },
                { icon: Users,         label: 'For Everyone'        },
                { icon: Sparkles,      label: 'AI-Powered'          },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-colors text-center">
                  <Icon size={28} className="text-blue-400" />
                  <span className="text-sm font-semibold text-slate-300">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">What we stand for</p>
            <h2 className="text-4xl font-black text-white">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.07)}>
                <Card {...v} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">The people behind it</p>
            <h2 className="text-4xl font-black text-white">Meet the Team</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-16">
            {team.map((m, i) => (
              <TeamMember key={m.name} {...m} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/30">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-white mb-5">Ready to start learning?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join thousands of learners already using Text-to-Learn to master new skills every day.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20"
          >
            Generate Your First Course <Sparkles size={16} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
