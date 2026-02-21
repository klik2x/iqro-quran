import React, { useState, useEffect, useRef } from 'react';
import { Tv, Loader2, WifiOff, Search, Play, Pause, Volume2, VolumeX, AlertCircle, RefreshCw, SkipBack, SkipForward } from 'lucide-react';
import Hls from 'hls.js';

interface LiveTvMurotalProps {
  t: (key: string) => string;
}

interface LiveTvData {
  id: number;
  name: string;
  url: string;
}

const LiveTvMurotal: React.FC<LiveTvMurotalProps> = ({ t }) => {
  const [channels, setChannels] = useState<LiveTvData[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<LiveTvData[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<LiveTvData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Video state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://mp3quran.net/api/v3/live-tv?language=eng');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.livetv && data.livetv.length > 0) {
        setChannels(data.livetv);
        setFilteredChannels(data.livetv);
        // Default to Quran channel if available
        const quranChannel = data.livetv.find((c: LiveTvData) => c.name.toLowerCase().includes('quran')) || data.livetv[0];
        setSelectedChannel(quranChannel);
      } else {
        setError(t('failedToLoadLiveTv'));
      }
    } catch (err) {
      console.error("Failed to fetch live TV data:", err);
      setError(t('failedToLoadLiveTv'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [t]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredChannels(
      channels.filter(channel => 
        channel.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, channels]);

  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return;

    const video = videoRef.current;
    setVideoError(null);
    setIsBuffering(true);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(selectedChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Autoplay prevented", e));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setVideoError("Network error encountered, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setVideoError("Media error encountered, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              setVideoError("Fatal error, cannot recover.");
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari native support
      video.src = selectedChannel.url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log("Autoplay prevented", e));
      });
    } else {
      setVideoError("Your browser does not support HLS playback.");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedChannel]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => setVideoError("Failed to play stream."));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
    if (!newMute && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleRetry = () => {
    if (selectedChannel) {
      const current = selectedChannel;
      setSelectedChannel(null);
      setTimeout(() => setSelectedChannel(current), 100);
    }
  };

  const goToNextChannel = () => {
    if (!selectedChannel || channels.length === 0) return;
    const currentIndex = channels.findIndex(c => c.id === selectedChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    setSelectedChannel(channels[nextIndex]);
  };

  const goToPrevChannel = () => {
    if (!selectedChannel || channels.length === 0) return;
    const currentIndex = channels.findIndex(c => c.id === selectedChannel.id);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    setSelectedChannel(channels[prevIndex]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-dark-blue rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 min-h-[400px]">
        <Loader2 className="w-12 h-12 text-emerald-dark animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-200 min-h-[400px]">
        <WifiOff className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-bold mb-2">{t('error')}</p>
        <p className="text-center mb-6 opacity-80">{error}</p>
        <button 
          onClick={fetchChannels}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
        >
          <RefreshCw size={20} /> {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white dark:bg-dark-blue rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-md">
                <Tv size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white leading-none">
                  {selectedChannel?.name || t('liveTvMurotal')}
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                  {t('liveTvMurotalDescription')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white rounded-full shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                LIVE
              </span>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video bg-black group/video">
            <video
              ref={videoRef}
              className="w-full h-full"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onVolumeChange={(e) => {
                const v = (e.target as HTMLVideoElement).volume;
                setVolume(v);
                setIsMuted((e.target as HTMLVideoElement).muted || v === 0);
              }}
            />

            {/* Buffering Overlay */}
            {isBuffering && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}

            {/* Error Overlay */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-6 text-center z-20">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-white font-bold text-lg mb-2">Playback Error</p>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">{videoError}</p>
                <button 
                  onClick={handleRetry}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
                >
                  <RefreshCw size={18} /> {t('retry')}
                </button>
              </div>
            )}

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex flex-col gap-3 z-30">
              {/* Progress Bar (Fake Live Progress) */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-emerald-500 w-full animate-[shimmer_2s_infinite]"></div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToPrevChannel}
                    className="p-2 text-white hover:text-emerald-400 transition-colors"
                    aria-label="Previous Channel"
                  >
                    <SkipBack size={20} fill="currentColor" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="p-2 text-white hover:text-emerald-400 transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                  </button>
                  <button 
                    onClick={goToNextChannel}
                    className="p-2 text-white hover:text-emerald-400 transition-colors"
                    aria-label="Next Channel"
                  >
                    <SkipForward size={20} fill="currentColor" />
                  </button>
                </div>

                <div className="flex items-center gap-2 group/volume">
                  <button 
                    onClick={toggleMute}
                    className="p-2 text-white hover:text-emerald-400 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex-1"></div>

                <div className="text-white/70 text-[10px] font-mono tracking-tighter uppercase">
                  {selectedChannel?.name} • 1080p
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Channel List & Search */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white dark:bg-dark-blue rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col h-full max-h-[500px] lg:max-h-none">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-blue-card border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredChannels.length > 0 ? (
              filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${
                    selectedChannel?.id === channel.id 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedChannel?.id === channel.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}>
                    <Tv size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${
                      selectedChannel?.id === channel.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {channel.name}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                      Live Stream
                    </p>
                  </div>
                  {selectedChannel?.id === channel.id && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Search size={32} className="mb-2 opacity-20" />
                <p className="text-xs">No channels found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTvMurotal;
