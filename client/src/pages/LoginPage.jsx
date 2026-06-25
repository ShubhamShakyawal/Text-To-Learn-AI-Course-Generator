import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, loginWithGoogle, loginWithEmail, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Continue your learning journey with AI</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-lg active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={loginWithEmail}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
          >
            <Mail className="w-5 h-5" />
            Email & Password
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            By continuing, you agree to our <br />
            <span className="text-slate-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
