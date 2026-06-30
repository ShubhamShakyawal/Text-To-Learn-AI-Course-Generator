import React, { useState } from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';
import { LogIn, GraduationCap, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <header className="fixed top-0 right-0 left-0 h-16 z-[60] flex items-center justify-between px-4 md:px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 lg:hidden">
      {/* Brand logo & mobile hamburger toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-sm text-white">Text-to-Learn</span>
      </div>

      {/* Auth button */}
      <div className="ml-auto">
        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
          >
            <LogIn size={14} />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};


const Layout = () => {
  const { isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const location = useLocation();

  if (isLoading) return <LoadingSpinner message="Checking authentication, please wait..." />;

  const showSidebar = location.pathname !== '/login';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden relative">
      <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
      {showSidebar && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
      <main className="flex-1 overflow-y-auto relative pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="course/:courseId" element={<CoursePage />} />
        <Route path="course/:courseId/module/:moduleIndex/lesson/:lessonIndex" element={<LessonPage />} />
      </Route>
    </Routes>
  );
};

export default App;