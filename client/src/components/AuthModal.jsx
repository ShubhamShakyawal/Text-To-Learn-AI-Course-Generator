import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { 
  X, Mail, Lock, User, Eye, EyeOff, 
  AlertCircle, Sparkles, GraduationCap 
} from 'lucide-react';

const AuthModal = ({ type, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState(type === 'google' ? 'google' : 'login');
  
  // Email/Password Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Get local user database
  const getLocalDB = () => {
    try {
      const db = localStorage.getItem('texttolearn_users_db');
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  // Save to local user database
  const saveToLocalDB = (users) => {
    localStorage.setItem('texttolearn_users_db', JSON.stringify(users));
  };

  // Handle local signup
  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Please enter your full name');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address');
    if (password.length < 6) return setError('Password must be at least 6 characters long');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);

    setTimeout(() => {
      const users = getLocalDB();
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      const newUser = {
        name,
        email,
        password,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        sub: `local|${Date.now()}`
      };

      users.push(newUser);
      saveToLocalDB(users);

      setSuccess('Account created successfully! Logging in...');
      
      setTimeout(() => {
        onLoginSuccess(newUser);
        setLoading(false);
      }, 1000);
    }, 800);
  };

  // Handle local signin
  const handleSignin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Please enter your email address');
    if (!password) return setError('Please enter your password');

    setLoading(true);

    setTimeout(() => {
      const users = getLocalDB();
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      setSuccess('Logged in successfully!');
      
      setTimeout(() => {
        onLoginSuccess(user);
        setLoading(false);
      }, 800);
    }, 600);
  };

  // Handle real Google OAuth success — decode JWT credential
  const handleGoogleSuccess = (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const base64Payload = credentialResponse.credential.split('.')[1];
      const payload = JSON.parse(atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/')));

      const googleUser = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: `google-oauth2|${payload.sub}`,
      };

      onLoginSuccess(googleUser);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google credential decode error:', err);
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please use Email/Password instead.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/40 hover:bg-slate-800 transition-all border border-slate-800/40"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
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

                {/* Real Google Sign-In button */}
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
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
