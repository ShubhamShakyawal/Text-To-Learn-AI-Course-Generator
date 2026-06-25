import React from 'react';
import { Search, PlayCircle, CheckCircle2 } from 'lucide-react';

const LessonViewer = ({ 
  lesson, 
  onComplete, 
  isCompleted 
}) => {
  if (!lesson) return null;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    
    // Handle youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    
    // Handle youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    
    return url;
  };

  const embedUrl = getEmbedUrl(lesson.youtubeUrl);

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">
          {lesson.title}
        </h1>
      </header>

      {/* Media Content */}
      <div className="rounded-2xl overflow-hidden glass border-border/50 shadow-2xl relative aspect-video bg-black flex items-center justify-center">
        {embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-lg text-slate-300 mb-2">No video available</p>
              <p className="text-slate-500 mb-6">You can enhance your learning by searching for:</p>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.youtubeQuery || lesson.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                <PlayCircle className="w-5 h-5" />
                Search YouTube
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="max-w-none text-slate-300 text-lg leading-relaxed space-y-4 bg-card/20 p-6 md:p-8 rounded-3xl border border-border/30">
        <p>{lesson.content}</p>
      </div>

      {/* Completion Action */}
      <div className="pt-8 pb-16 flex justify-end">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
            isCompleted 
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default' 
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:-translate-y-0.5'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-primary-500' : ''}`} />
          {isCompleted ? 'Completed' : 'Complete & Continue'}
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;
