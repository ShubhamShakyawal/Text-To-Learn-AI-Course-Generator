import React, { useState } from 'react';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '../utils/cn';

const PromptInput = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    await onGenerate(prompt);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-foreground">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-10 space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">learn</span> today?
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
            Describe a topic, and AI will generate a comprehensive course instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-2 md:p-4 rounded-3xl shadow-2xl space-y-4 shadow-black/50">
          <div className="relative">
             <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A beginner's guide to quantum computing with real-world examples..."
              className="w-full bg-transparent border-0 focus:ring-0 p-4 min-h-[120px] text-lg resize-none placeholder:text-slate-500 focus:outline-none"
              disabled={isGenerating}
            />
          </div>
          <div className="flex justify-end p-2">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300",
                "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25",
                isGenerating ? "animate-pulse" : ""
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;

