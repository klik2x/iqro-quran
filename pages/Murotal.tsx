import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAllSurahs } from '../services/quranService';
import { Surah } from '../types';
import { Play, Pause, SkipBack, SkipForward, Loader2, Music, ListMusic, Volume2, VolumeX, Download, RefreshCw, User } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import LiveTvMurotal from '../components/LiveTvMurotal';

interface Reciter {
  id: number;
  name: string;
  moshaf: {
    id: number;
    name: string;
    server: string;
    surah_total: number;
    surah_list: string;
  }[];
}

const Murotal: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [favoriteReciterIds, setFavoriteReciterIds] = useState<number[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteReciters');
    if (saved) {
      try {
        setFavoriteReciterIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorite reciters", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteReciters', JSON.stringify(favoriteReciterIds));
  }, [favoriteReciterIds]);

  const toggleFavoriteReciter = (id: number) => {
    setFavoriteReciterIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [surahData, reciterData] = await Promise.all([
        fetchAllSurahs(),
        fetch('https://mp3quran.net/api/v3/reciters?language=eng').then(res => res.json())
      ]);
      
      setSurahs(surahData);
      setReciters(reciterData.reciters);
      
      if (surahData.length > 0) setSelectedSurah(surahData[0]);
      if (reciterData.reciters.length > 0) {
        const defaultReciter = reciterData.reciters.find((r: Reciter) => r.name.includes('Mishary')) || reciterData.reciters[0];
        setSelectedReciter(defaultReciter);
      }
    } catch (err: any) {
      console.error("Failed to load Murotal data", err);
      setError(t('failedToLoadMurotal' as TranslationKeys));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [t]);

  const changeSurah = useCallback((direction: 'next' | 'prev') => {
    if (!selectedSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.number === selectedSurah.number);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < surahs.length) {
        setSelectedSurah(surahs[newIndex]);
    } else if (newIndex < 0) {
        setSelectedSurah(surahs[surahs.length - 1]);
    } else if (newIndex >= surahs.length) {
        setSelectedSurah(surahs[0]);
    }
  }, [selectedSurah, surahs]);

  const getAudioUrl = () => {
    if (!selectedSurah || !selectedReciter) return '';
    const moshaf = selectedReciter.moshaf[0];
    const surahNum = selectedSurah.number.toString().padStart(3, '0');
    return `${moshaf.server}${surahNum}.mp3`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audioUrl = getAudioUrl();
    if (audioUrl) {
      setIsAudioLoading(true);
      setError(null);
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.volume = volume;
      newAudio.muted = isMuted;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
          setIsPlaying(false);
          changeSurah('next');
      };
      const handleLoadedMetadata = () => setDuration(newAudio.duration);
      const handleTimeUpdate = () => setCurrentTime(newAudio.currentTime);
      const handleCanPlay = () => {
        setIsAudioLoading(false);
        if (isPlayingRef.current) {
          newAudio.play().catch(e => console.error("Error autoplay:", e));
        }
      };
      const handleError = (e: Event) => {
        setIsAudioLoading(false);
        console.error("Audio playback error:", e);
        setError(t('failedToLoadAudio' as TranslationKeys));
      };

      newAudio.addEventListener('play', handlePlay);
      newAudio.addEventListener('pause', handlePause);
      newAudio.addEventListener('ended', handleEnded);
      newAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
      newAudio.addEventListener('timeupdate', handleTimeUpdate);
      newAudio.addEventListener('canplaythrough', handleCanPlay);
      newAudio.addEventListener('error', handleError);

      return () => {
        newAudio.removeEventListener('play', handlePlay);
        newAudio.removeEventListener('pause', handlePause);
        newAudio.removeEventListener('ended', handleEnded);
        newAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        newAudio.removeEventListener('timeupdate', handleTimeUpdate);
        newAudio.removeEventListener('canplaythrough', handleCanPlay);
        newAudio.removeEventListener('error', handleError);
      };
    }
  }, [selectedSurah?.number, selectedReciter?.id, changeSurah, t]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e);
            setError(t('failedToPlayAudio' as TranslationKeys));
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(audioRef.current) {
          const time = Number(e.target.value);
          audioRef.current.currentTime = time;
          setCurrentTime(time);
      }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (audioRef.current) {
      audioRef.current.muted = newMute;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-emerald-dark dark:text-white tracking-tight uppercase">{t('murotalPlayer' as TranslationKeys)}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">{t('murotalPlayerIntro' as TranslationKeys)}</p>
      </div>

      <div className="bg-white dark:bg-dark-blue-card rounded-[3rem] shadow-2xl overflow-hidden border-2 border-slate-50 dark:border-slate-800 transition-all">
        <div className="grid lg:grid-cols-12">
          {/* Player Controls */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-dark-blue-card">
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Now Playing</span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedSurah?.englishName}
                  </h2>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-emerald-600" />
                      <span className="text-sm font-bold">{selectedReciter?.name}</span>
                    </div>
                    {selectedReciter && (
                      <button 
                        onClick={() => toggleFavoriteReciter(selectedReciter.id)}
                        className={`p-1.5 rounded-full transition-all ${
                          favoriteReciterIds.includes(selectedReciter.id)
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
                            : 'text-slate-300 hover:text-rose-400 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" height="16" 
                          viewBox="0 0 24 24" 
                          fill={favoriteReciterIds.includes(selectedReciter.id) ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30">
                  <Music size={40} />
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              {/* Progress Bar */}
              <div className="space-y-3">
                <input 
                  type="range"
                  aria-label={t('seekTrack' as TranslationKeys)}
                  value={currentTime}
                  max={duration || 0}
                  onChange={handleSeek}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  disabled={isAudioLoading || !!error}
                />
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-10">
                <button 
                  onClick={() => changeSurah('prev')} 
                  className="p-4 text-slate-400 hover:text-emerald-600 transition-all hover:scale-110"
                >
                  <SkipBack size={36} fill="currentColor" />
                </button>
                <button 
                  onClick={togglePlayPause}
                  disabled={isAudioLoading}
                  className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all disabled:bg-slate-200"
                >
                  {isAudioLoading ? <Loader2 className="animate-spin" size={40}/> : (isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-2" fill="currentColor" />)}
                </button>
                <button 
                  onClick={() => changeSurah('next')} 
                  className="p-4 text-slate-400 hover:text-emerald-600 transition-all hover:scale-110"
                >
                  <SkipForward size={36} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <button onClick={toggleMute} className="text-slate-400 hover:text-emerald-600 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchData}
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  title={t('retry' as TranslationKeys)}
                >
                  <RefreshCw size={20} />
                </button>
                <a 
                  href={getAudioUrl()} 
                  download={`${selectedSurah?.englishName}_${selectedReciter?.name}.mp3`}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-black text-sm shadow-lg shadow-emerald-600/20"
                >
                  <Download size={20} /> {t('download' as TranslationKeys)}
                </a>
              </div>
            </div>
          </div>

          {/* Selection Sidebar */}
          <div className="lg:col-span-5 border-l border-slate-50 dark:border-slate-800 flex flex-col h-[700px] bg-slate-50/30 dark:bg-dark-blue/30">
            <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
              {/* Reciter Select */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <User size={12} /> {t('selectQari' as TranslationKeys)}
                </label>
                <div className="relative">
                  <select 
                    value={selectedReciter?.id || ''}
                    onChange={(e) => {
                      const r = reciters.find(rec => rec.id === parseInt(e.target.value));
                      if (r) setSelectedReciter(r);
                    }}
                    className="w-full p-4 pr-12 bg-white dark:bg-dark-blue-card border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white shadow-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-900"
                  >
                    <optgroup label={t('favorites' as TranslationKeys)}>
                      {reciters.filter(r => favoriteReciterIds.includes(r.id)).map(r => (
                        <option key={`fav-${r.id}`} value={r.id}>⭐ {r.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label={t('reciters' as TranslationKeys)}>
                      {reciters.filter(r => !favoriteReciterIds.includes(r.id)).map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Surah List */}
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <ListMusic size={12} /> {t('surahList' as TranslationKeys)}
                </label>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {surahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => setSelectedSurah(surah)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left border-2 ${
                        selectedSurah?.number === surah.number 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                          : 'bg-white dark:bg-dark-blue-card border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${
                          selectedSurah?.number === surah.number ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {surah.number}
                        </span>
                        <div>
                          <p className="text-sm font-black">{surah.englishName}</p>
                          <p className={`text-[10px] font-medium uppercase tracking-wider ${selectedSurah?.number === surah.number ? 'text-white/70' : 'text-slate-400'}`}>
                            {surah.englishNameTranslation}
                          </p>
                        </div>
                      </div>
                      <p className="font-arabic text-xl">{surah.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Playlist Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-wider">
          <ListMusic className="text-emerald-600" /> {t('popularPlaylist' as TranslationKeys)}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 18, 36, 67, 114].map(num => {
            const surah = surahs.find(s => s.number === num);
            return (
              <button 
                key={num}
                onClick={() => setSelectedSurah(surah || null)}
                className={`p-5 rounded-[2rem] transition-all group active:scale-95 border-2 ${
                  selectedSurah?.number === num 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl' 
                    : 'bg-white dark:bg-dark-blue-card border-slate-50 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 shadow-lg'
                }`}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    selectedSurah?.number === num ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                  }`}>
                    <Play size={24} fill="currentColor" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${
                      selectedSurah?.number === num ? 'text-white/60' : 'text-slate-400'
                    }`}>Surah {num}</span>
                    <span className="text-lg font-black truncate w-full block">
                      {surah?.englishName || `Surah ${num}`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live TV Murotal Section */}
      <div className="pt-20 border-t-2 border-slate-100 dark:border-slate-800">
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('liveTvMurotal' as TranslationKeys)}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('liveTvMurotalDescription' as TranslationKeys)}</p>
        </div>
        <LiveTvMurotal t={t} />
      </div>
    </div>
  );
};

export default Murotal;
