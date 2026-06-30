import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register as apiRegister, login as apiLogin, loginWithGoogle as apiLoginWithGoogle } from '../utils/api';

const LoginPage = () => {
  const { isAuthenticated, loginUser, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'google', 'login', 'signup'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const extractErrorMessage = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return 'Something went wrong. Please try again.';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Please enter your full name');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      const user = await apiRegister(name, email, password);
      setSuccess('Account created! Logging you in…');
      setTimeout(() => {
        loginUser(user);
        setLoading(false);
      }, 700);
    } catch (err) {
      setError(extractErrorMessage(err));
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) return setError('Please enter your email address');
    if (!password) return setError('Please enter your password');

    setLoading(true);
    try {
      const user = await apiLogin(email, password);
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        loginUser(user);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(extractErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = await apiLoginWithGoogle(credentialResponse.credential);
      loginUser(user);
    } catch (err) {
      setError(extractErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please use Email/Password instead.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10"
      >
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-6">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>

            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <GraduationCap className="text-blue-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              Text-to-Learn <Sparkles size={16} className="text-indigo-400" />
            </h2>
            <p className="text-slate-400 text-sm mt-1">AI-Powered Personalized Course Generator</p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-2xl mb-6 border border-slate-800">
            <button
              onClick={() => { setActiveTab('google'); setError(''); setSuccess(''); }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'google'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs mb-4">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs mb-4">
              <Sparkles size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Tab Content */}
          <div className="min-h-[220px]">
            {/* ── Google OAuth Tab ── */}
            {activeTab === 'google' && (
              <div className="flex flex-col items-center gap-5 py-4">
                <p className="text-xs text-slate-400 text-center">
                  Sign in securely with your Google account.
                </p>

                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    shape="pill"
                    theme="filled_black"
                    size="large"
                    text="signin_with"
                    logo_alignment="left"
                  />
                </div>

                <div className="w-full flex items-center gap-3 mt-2">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Don't want to use Google?{' '}
                  <button
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign in with email
                  </button>
                </p>
              </div>
            )}

            {/* ── Email Sign-In Tab ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleSignin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : 'Sign In'}
                </button>

                <p className="text-center text-xs text-slate-500">
                  No account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setError(''); }}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* ── Sign-Up Tab ── */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : 'Create Account'}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
