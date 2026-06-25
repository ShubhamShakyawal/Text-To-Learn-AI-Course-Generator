import React, { useState, useEffect } from 'react';
import { getYouTubeVideo } from '../../utils/api';
import { Play, Loader2 } from 'lucide-react';

const VideoBlock = ({ query }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getYouTubeVideo(query);
        // Assuming data is { videoId: '...' } or just the ID string
        setVideoId(data.videoId || data);
      } catch (err) {
        console.error('Failed to fetch video:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchVideo();
  }, [query]);

  if (loading) {
    return (
      <div className="aspect-video w-full bg-slate-900 rounded-2xl flex items-center justify-center my-8 border border-slate-800">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="aspect-video w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center my-8 border border-slate-800 text-slate-500">
        <Play size={40} className="mb-4 opacity-20" />
        <p>Could not load video for: "{query}"</p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="aspect-video relative">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoBlock;
