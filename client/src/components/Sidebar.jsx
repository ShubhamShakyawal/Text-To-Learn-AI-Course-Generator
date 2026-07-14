import React, { useState, useMemo, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  LogOut,
  LogIn,
  Menu,
  X,
  GraduationCap,
  Search,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCourse } from '../context/CourseContext';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from './Tooltip';

// ── How many courses to show before paginating ──
const PAGE_SIZE = 5;

const Sidebar = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  const [localIsOpen, setLocalIsOpen] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);

  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isAuthenticated, user, login, logout } = useAuth();
  const { courses, isLoadingCourses } = useCourse();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) setSearch(''); // clear search on collapse
  };

  // Collapse sidebar and clear search on logout
  useEffect(() => {
    const onLogout = () => {
      setIsOpen(false);
      setSearch('');
      setPage(0);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [setIsOpen]);

  // Calculate course completion progress %
  const calculateProgress = (course) => {
    if (!course) return 0;
    const modulesList = Array.isArray(course.modules) ? course.modules : [];
    const total = modulesList.reduce((acc, m) => {
      if (!m) return acc;
      const lessonsList = Array.isArray(m.lessons) ? m.lessons : [];
      return acc + lessonsList.length;
    }, 0);
    const completed = Array.isArray(course.completedLessons) ? course.completedLessons.length : 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Sort newest first (by id or index — assumes later items are newer)
  const sortedCourses = useMemo(() => (Array.isArray(courses) ? [...courses].reverse() : []), [courses]);

  // Filter by search keywords
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedCourses;
    return sortedCourses.filter((c) =>
      q.split(/\s+/).every((word) => c.title.toLowerCase().includes(word))
    );
  }, [sortedCourses, search]);

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const goNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));
  const goPrev = () => setPage((p) => Math.max(p - 1, 0));

  // Reset to page 0 whenever search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? 280 : 300,
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      width: isMobile ? 0 : 72,
      x: isMobile ? -280 : 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={isMobile ? 'closed' : 'open'}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed lg:relative z-50 h-full bg-slate-900 flex flex-col shadow-2xl overflow-hidden ${
          isOpen ? 'border-r border-slate-800' : 'lg:border-r lg:border-slate-800'
        }`}
      >
        {/* ── Header ── */}
        <div className="h-14 flex items-center border-b border-slate-800/50 px-3 gap-2">
          {isOpen ? (
            /* ── Expanded: logo + title (flex-1) + toggle pinned right ── */
            <>
              <Link to="/" onClick={() => isMobile && setIsOpen(false)} className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
                  <GraduationCap className="text-white w-4 h-4" />
                </div>
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-bold text-base tracking-tight text-white whitespace-nowrap"
                >
                  Text-to-Learn
                </motion.span>
              </Link>

              {/* Toggle right of title — flex-shrink-0 so it never covers the title */}
              <Tooltip label="Collapse sidebar" className="relative flex-shrink-0">
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X size={18} />
                </button>
              </Tooltip>
            </>
          ) : (
            /* ── Collapsed: just the expand toggle, centred ── */
            <div className="flex-1 flex justify-center">
              <Tooltip label="Expand sidebar" className="relative">
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <Menu size={18} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-hidden">

          {/* Dashboard */}
          <Tooltip label="Dashboard" disabled={isOpen}>
            <NavLink
              to="/"
              end
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 w-full
                ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <Home size={22} className="flex-shrink-0" />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </Tooltip>

          {/* ── Courses Section ── */}
          <div className="pt-4 flex flex-col min-h-0 flex-1">
            {/* Section header */}
            <p className={`text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 mb-2 ${!isOpen ? 'text-center' : ''}`}>
              {isOpen ? 'My Courses' : '•••'}
            </p>

            {/* Search — only when sidebar is open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 overflow-hidden"
                >
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={search}
                      onChange={handleSearch}
                      placeholder="Search courses..."
                      className="w-full bg-slate-800/60 border border-slate-700/50 focus:border-blue-500/50 rounded-lg py-2 pl-8 pr-3 text-xs text-slate-300 placeholder-slate-500 focus:outline-none transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => { setSearch(''); setPage(0); }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Course list — scrollable, fixed height */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
              {isLoadingCourses ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse ${
                      !isOpen ? 'justify-center' : ''
                    }`}
                  >
                    <div className="w-[17px] h-[17px] bg-slate-800/60 rounded-md flex-shrink-0 animate-pulse" />
                    {isOpen && <div className="h-2.5 bg-slate-850 rounded w-2/3 animate-pulse" />}
                  </div>
                ))
              ) : paginated.length === 0 ? (
                isOpen && (
                  <p className="text-xs text-slate-600 text-center py-4 px-2">
                    {search ? 'No courses match your search.' : 'No courses yet.'}
                  </p>
                )
              ) : (
                paginated.map((course) => (
                  <Tooltip key={course.id} label={course.title} disabled={isOpen}>
                    <NavLink
                      to={`/course/${course.id}`}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all w-full
                        ${isActive ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                        ${!isOpen ? 'justify-center' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <BookOpen size={17} className="flex-shrink-0" />
                          {isOpen && (
                            <div className="flex-1 flex items-center justify-between min-w-0">
                              <span className="truncate text-xs mr-2">{course.title}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800/60 text-slate-500'
                              }`}>
                                {calculateProgress(course)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  </Tooltip>
                ))
              )}
            </div>

            {/* Pagination — only when sidebar is open and there's more than one page */}
            {isOpen && totalPages > 1 && (
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  onClick={goPrev}
                  disabled={page === 0}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Previous page"
                >
                  <ChevronUp size={15} />
                </button>
                <span className="text-[10px] text-slate-600 tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={goNext}
                  disabled={page === totalPages - 1}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Next page"
                >
                  <ChevronDown size={15} />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* ── Footer / Auth ── */}
        <div className="p-3 border-t border-slate-800">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1.5">
              {/* User card */}
              <Tooltip label={`${user?.name || 'User'} · ${user?.email || ''}`} disabled={isOpen}>
                <div className={`flex items-center gap-3 rounded-xl bg-slate-800/50 cursor-default w-full ${
                  isOpen ? 'px-3 py-2' : 'justify-center p-2'
                }`}>
                  <div className="w-8 h-8 rounded-full border border-slate-700 flex-shrink-0 overflow-hidden bg-slate-700">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-bold uppercase">
                        {(user?.name || 'U').charAt(0)}
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    </div>
                  )}
                </div>
              </Tooltip>

              {/* Logout */}
              <Tooltip label="Logout" disabled={isOpen}>
                <button
                  onClick={() => { logout(); if (isMobile) setIsOpen(false); }}
                  className={`flex items-center gap-4 px-3 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors ${
                    !isOpen ? 'justify-center' : ''
                  }`}
                >
                  <LogOut size={20} className="flex-shrink-0" />
                  {isOpen && <span>Logout</span>}
                </button>
              </Tooltip>
            </div>
          ) : (
            /* Login */
            <Tooltip label="Sign in to save your courses" disabled={isOpen}>
              <button
                onClick={() => { login(); if (isMobile) setIsOpen(false); }}
                className={`flex items-center gap-4 px-3 py-3 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors ${
                  !isOpen ? 'justify-center' : ''
                }`}
              >
                <LogIn size={20} className="flex-shrink-0" />
                {isOpen && <span>Login</span>}
              </button>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
