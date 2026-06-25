import React from 'react';
import { BookOpen, GraduationCap, Home } from 'lucide-react';

const Navbar = ({ courseTitle, progress, onExit }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b h-16 w-full flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary-400" />
        </div>
        <h1 className="font-semibold text-lg md:text-xl truncate max-w-[200px] md:max-w-md">
          {courseTitle || 'Course Generator'}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
          <BookOpen className="w-4 h-4" />
          <span>Progress</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 md:w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium w-9">{progress}%</span>
        </div>
        <button
          onClick={onExit}
          className="ml-2 md:ml-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Exit Course / Go to Homepage"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
