import React from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';
import { LogIn, GraduationCap } from 'lucide-react';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login') return null;
  // When authenticated the sidebar handles user info — no header needed
  if (isAuthenticated) return null;

  return (
    <header className="fixed top-0 right-0 left-0 h-16 z-[60] flex items-center justify-between px-6 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto md:hidden">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="text-white w-5 h-5" />
        </div>
      </div>
      <div className="ml-auto pointer-events-auto">
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
        >
          <LogIn size={16} />
          Sign In
        </Link>
      </div>
    </header>
  );
};


const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner message="Checking authentication, please wait..." />;

  const showSidebar = isAuthenticated && location.pathname !== '/login';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden relative">
      <Header />
      {showSidebar && <Sidebar />}
      <main className={`flex-1 overflow-y-auto relative ${showSidebar ? '' : 'w-full'}`}>
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