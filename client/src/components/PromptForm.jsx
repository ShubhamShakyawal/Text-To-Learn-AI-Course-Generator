import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Count alphabet letters only (a-z, A-Z)
const countAlphabets = (str) => (str.match(/[a-zA-Z]/g) || []).length;

// Check for special characters (allow letters, digits, spaces, hyphens, apostrophes, commas, dots)
const hasSpecialChars = (str) => /[^a-zA-Z0-9 \-',.]/.test(str);

const PromptForm = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = (value) => {
    if (!value.trim()) {
      return 'Please enter a topic to generate a course.';
    }
    if (hasSpecialChars(value)) {
      return 'Special characters are not allowed. Use only letters, numbers, spaces, hyphens, and basic punctuation.';
    }
    if (countAlphabets(value) < 4) {
      return 'Your topic must contain at least 4 alphabetical letters.';
    }
    return '';
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setPrompt(val);
    // Clear error while user is actively typing (re-validate on submit)
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate(prompt);
    if (error) {
      setValidationError(error);
      return;
    }
    if (!isGenerating) {
      onGenerate(prompt);
      setPrompt('');
      setValidationError('');
    }
  };

  const alphabetCount = countAlphabets(prompt);
  const isValid = !hasSpecialChars(prompt) && alphabetCount >= 4;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          What do you want to learn?
        </h1>
        <p className="text-slate-400 text-lg">
          Enter a topic and our AI will craft a personalized course for you in seconds.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className={`relative flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-900 rounded-2xl overflow-hidden border shadow-2xl transition-colors ${
          validationError ? 'border-red-500/60' : 'border-slate-800'
        }`}>
          <input
            type="text"
            value={prompt}
            onChange={handleChange}
            placeholder="e.g. Master React Hooks from scratch..."
            className="flex-1 bg-transparent px-4 sm:px-6 py-3 sm:py-5 text-sm sm:text-lg text-slate-100 placeholder-slate-500 focus:outline-none min-w-0"
            disabled={isGenerating}
            maxLength={200}
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm sm:text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-t sm:border-t-0 sm:border-l border-slate-800"
          >
            {isGenerating ? (
              'Generating...'
            ) : (
              <>Generate <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>

      {/* Validation feedback row */}
      <div className="mt-3 flex items-center justify-between px-1">
        {/* Error message */}
        <AnimatePresence>
          {validationError ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-xs text-red-400"
            >
              <AlertCircle size={13} className="flex-shrink-0" />
              {validationError}
            </motion.p>
          ) : (
            <span />
          )}
        </AnimatePresence>

        {/* Letter counter hint */}
        {prompt.length > 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs font-medium tabular-nums ${
              alphabetCount >= 4 ? 'text-emerald-500' : 'text-slate-500'
            }`}
          >
            {alphabetCount}/4 letters
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default PromptForm;
