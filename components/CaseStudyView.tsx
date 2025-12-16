import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Project } from '../types';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCcw,
  RotateCw,
  User,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CaseStudyViewProps {
  project: Project;
  onBack: () => void;
}

const CaseStudyView: React.FC<CaseStudyViewProps> = ({ project, onBack }) => {
  // Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Helper to extract YouTube ID
  const youtubeId = useMemo(() => {
    if (!project.heroVideo) return null;
    // Regex covers standard watch URLs, embed URLs, and short URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = project.heroVideo.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [project.heroVideo]);

  // Helper to send commands to YouTube Iframe
  const postIframeMessage = useCallback((func: string, args: any[] = []) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: func,
              args: args
          }), '*');
      }
  }, []);

  const togglePlay = useCallback(() => {
    if (youtubeId) {
        if (isPlaying) {
            postIframeMessage('pauseVideo');
            setIsPlaying(false); // Optimistic update
        } else {
            postIframeMessage('playVideo');
            setIsPlaying(true); // Optimistic update
        }
    } else if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [youtubeId, isPlaying, postIframeMessage]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
        playerRef.current?.requestFullscreen();
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  }, []);

  // Lightbox Navigation Handlers
  const nextImage = useCallback(() => {
    if (lightboxIndex !== null && project.gallery) {
        setLightboxIndex((prev) => (prev! + 1) % project.gallery!.length);
    }
  }, [lightboxIndex, project.gallery]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null && project.gallery) {
        setLightboxIndex((prev) => (prev! - 1 + project.gallery!.length) % project.gallery!.length);
    }
  }, [lightboxIndex, project.gallery]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Initial Setup & Keyboard Listeners
  useEffect(() => {
    if (videoRef.current && !youtubeId) {
        // Attempt autoplay for direct video files
        videoRef.current.play().catch(e => {
            console.log("Autoplay blocked", e);
            setIsPlaying(false);
        });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        // If Lightbox is open, hijack controls
        if (lightboxIndex !== null) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            return;
        }

        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
        if (e.code === 'KeyF') {
            e.preventDefault();
            toggleFullscreen();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [youtubeId, lightboxIndex, nextImage, prevImage, closeLightbox, togglePlay, toggleFullscreen]);

  // Sync YouTube State via PostMessage Listener
  useEffect(() => {
    if (!youtubeId) return;

    const handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            if (data.info && typeof data.info.playerState === 'number') {
                if (data.info.playerState === 1) setIsPlaying(true);
                if (data.info.playerState === 2) setIsPlaying(false);
            }
        } catch (e) {
            // Ignore parse errors from other sources
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [youtubeId]);


  // Events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const toggleMute = () => {
    if (youtubeId) {
        if (isMuted) {
            postIframeMessage('unMute');
        } else {
            postIframeMessage('mute');
        }
        setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current && !youtubeId) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && !youtubeId) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
        // Only auto-hide if playing
        if (isPlaying) {
            setShowControls(false);
        }
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#141414] overflow-y-auto no-scrollbar animate-in fade-in duration-300">
      
      {/* --- VIDEO PLAYER SECTION (Hero) --- */}
      <div 
        ref={playerRef}
        className={`relative w-full bg-black group ${isFullscreen ? 'h-screen' : 'h-[60vh] md:h-[75vh]'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => {
            // Clicking the container toggles play (standard Netflix behavior)
            // We ensure controls stopPropagation so clicking buttons doesn't double-fire
            togglePlay();
        }}
      >
        {project.heroVideo ? (
            youtubeId ? (
                <div className="w-full h-full relative pointer-events-none">
                     {/* 
                       pointer-events-none is used on the wrapper/iframe so clicks pass through 
                       to the parent div or custom controls.
                     */}
                    <iframe 
                        ref={iframeRef}
                        className="w-full h-full object-cover"
                        // Added origin and enablejsapi for reliable postMessage control
                        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${youtubeId}&showinfo=0&iv_load_policy=3&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                        title="YouTube video player"
                    />
                </div>
            ) : (
                <video 
                    ref={videoRef}
                    src={project.heroVideo} 
                    poster={project.imageUrl}
                    className="w-full h-full object-contain bg-black"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    // Video element handles its own clicks via parent prop now, but good to keep safe
                    playsInline
                    loop
                    muted={isMuted}
                />
            )
        ) : (
            <img src={project.imageUrl} className="w-full h-full object-cover" alt="Cover" />
        )}

        {/* Back Button (Always accessible) */}
        <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-20 pointer-events-none`}>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onBack();
                }}
                className="absolute top-6 left-6 text-white hover:scale-110 transition-transform pointer-events-auto"
            >
                <ArrowLeft size={32} />
            </button>
        </div>

        {/* Player Controls Overlay */}
        {project.heroVideo && (
            <div 
                className={`absolute bottom-0 left-0 w-full transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-20 pointer-events-none`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks on control bar from toggling play
            >
                
                {/* Gradient background for controls */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                <div className="relative px-4 md:px-8 pb-4 md:pb-8 flex flex-col gap-2 pointer-events-auto">
                    
                    {/* Timeline - Only show for direct video files where we can track progress easily */}
                    {!youtubeId && (
                        <div 
                            className={`relative w-full h-1.5 bg-gray-600 rounded-full cursor-pointer flex items-center group/timeline ${isHoveringTimeline ? 'h-2.5' : 'h-1.5'} transition-all`}
                            onClick={handleTimelineClick}
                            onMouseEnter={() => setIsHoveringTimeline(true)}
                            onMouseLeave={() => setIsHoveringTimeline(false)}
                        >
                            <div className="w-full h-full bg-gray-600/50 rounded-full absolute" />
                            <div 
                                className="h-full bg-[#E50914] rounded-full relative" 
                                style={{ width: `${progress}%` }}
                            >
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#E50914] rounded-full shadow-lg scale-0 group-hover/timeline:scale-100 transition-transform`} />
                            </div>
                        </div>
                    )}

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white mt-2">
                        
                        {/* Left Group */}
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="hover:text-gray-300 transition hover:scale-110">
                                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                            </button>

                            {/* Seek Buttons - Only for direct video */}
                            {!youtubeId && (
                                <>
                                    <button onClick={() => seek(-10)} className="hover:text-gray-300 transition group relative">
                                        <RotateCcw size={24} />
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">-10s</span>
                                    </button>

                                    <button onClick={() => seek(10)} className="hover:text-gray-300 transition group relative">
                                        <RotateCw size={24} />
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">+10s</span>
                                    </button>
                                </>
                            )}

                            {/* Volume */}
                            <div className="flex items-center gap-2 group/vol">
                                <button onClick={toggleMute} className="hover:text-gray-300 transition hover:scale-110">
                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                </button>
                            </div>
                            
                            <div className="hidden md:block text-lg font-bold ml-4 text-gray-200">
                                {project.title}
                            </div>
                        </div>

                        {/* Right Group */}
                        <div className="flex items-center gap-4 font-medium text-sm">
                            {!youtubeId && (
                                <span className="text-gray-300">
                                    {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration || 0)}
                                </span>
                            )}
                            <button onClick={toggleFullscreen} className="hover:text-gray-300 transition hover:scale-110">
                                {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Project Header (Now below video) */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12 animate-in slide-in-from-bottom-4 duration-500 delay-100">
             
             {/* Left: Title & Quick Stats */}
             <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#E50914] w-1 h-8 rounded-full" />
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Case Study</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    {project.title}
                 </h1>
                 
                 <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 font-bold">98% Match</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="border border-gray-500 px-1 rounded text-xs">HD</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{project.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <User size={16} /> <span>{project.role}</span>
                    </div>
                 </div>
             </div>

             {/* Right: Tags & Links */}
             <div className="flex flex-col items-start md:items-end gap-3">
                 <div className="flex flex-wrap gap-2 md:justify-end">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#2a2a2a] border border-white/10 rounded text-xs text-gray-300">
                            {tag}
                        </span>
                    ))}
                 </div>
                 {project.link && project.link !== '#' && (
                     <a href={project.link} target="_blank" rel="noreferrer" className="mt-2 text-white hover:underline text-sm font-semibold">
                         Visit Live Project &rarr;
                     </a>
                 )}
             </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12" />

        {/* Description & Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Text */}
            <div className="lg:col-span-2 space-y-8">
                 <h3 className="text-2xl font-bold text-white mb-4">Synopsis</h3>
                 <div 
                    className="text-gray-300 leading-relaxed space-y-6 text-lg"
                    dangerouslySetInnerHTML={{ __html: project.fullDescription || `<p>${project.description}</p>` }} 
                 />
            </div>

            {/* Sidebar / Gallery */}
            <div className="space-y-8">
                 <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
                     <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Project Details</h4>
                     <ul className="space-y-4 text-sm">
                        <li className="flex justify-between">
                            <span className="text-gray-500">Platform</span>
                            <span className="text-white font-medium">{project.platform}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500">Role</span>
                            <span className="text-white font-medium">{project.role}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500">Year</span>
                            <span className="text-white font-medium">{project.year}</span>
                        </li>
                     </ul>
                 </div>

                 {project.gallery && project.gallery.length > 0 && (
                     <div className="space-y-4">
                        <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Gallery</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {project.gallery.slice(0, 3).map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img} 
                                    alt="Gallery" 
                                    onClick={() => setLightboxIndex(idx)}
                                    className="w-full rounded-md border border-gray-800 hover:border-gray-500 transition cursor-zoom-in"
                                />
                            ))}
                        </div>
                     </div>
                 )}
            </div>

        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
             <p>Designed by Nirmal Justin • {new Date().getFullYear()}</p>
        </div>

      </div>

      {/* --- LIGHTBOX OVERLAY --- */}
      {lightboxIndex !== null && project.gallery && (
            <div 
                className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm"
                onClick={closeLightbox}
            >
                {/* Close Button */}
                <button 
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-50 rounded-full hover:bg-white/10"
                    onClick={closeLightbox}
                    title="Close (Esc)"
                >
                    <X size={40} />
                </button>

                {/* Prev Button */}
                <button 
                    className="absolute left-4 md:left-8 text-white/50 hover:text-white transition p-3 z-50 rounded-full hover:bg-white/10"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    title="Previous (Arrow Left)"
                >
                    <ChevronLeft size={48} />
                </button>

                {/* Main Image */}
                <div 
                    className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <img 
                        src={project.gallery[lightboxIndex]} 
                        alt={`Gallery ${lightboxIndex + 1}`}
                        className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
                    />
                    
                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-white/70 text-sm font-medium backdrop-blur-md border border-white/10">
                        {lightboxIndex + 1} / {project.gallery.length}
                    </div>
                </div>

                {/* Next Button */}
                <button 
                    className="absolute right-4 md:right-8 text-white/50 hover:text-white transition p-3 z-50 rounded-full hover:bg-white/10"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    title="Next (Arrow Right)"
                >
                    <ChevronRight size={48} />
                </button>
            </div>
      )}

    </div>
  );
};

export default CaseStudyView;