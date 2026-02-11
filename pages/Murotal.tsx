import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAllSurahs } from '../services/quranService';
import { Surah } from '../types';
import { Play, Pause, SkipBack, SkipForward, Loader2, Music, ListMusic } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

const qaris = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulsamad', name: 'Abdul Basit Abdus Samad' },
  { id: 'ar.sudais', name: 'Abdurrahman as-Sudais' },
];

const Murotal: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedQari, setSelectedQari] = useState(qaris[0].id);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isSurahListLoading, setSurahListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setSurahListLoading(true);
        setError(null);
        const data = await fetchAllSurahs();
        setSurahs(data);
        if (data.length > 0 && !selectedSurah) {
            setSelectedSurah(data[0]);
        }
      } catch (err) {
        console.error("Failed to load surahs for Murotal", err);
        setError("Gagal memuat daftar surah. Pastikan koneksi internet Anda aktif.");
      } finally {
        setSurahListLoading(false);
      }
    };
    loadSurahs();
  }, []);

  const changeSurah = useCallback((direction: 'next' | 'prev') => {
    if (!selectedSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.number === selectedSurah.number);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < surahs.length) {
        setSelectedSurah(surahs[newIndex]);
    }
  }, [selectedSurah, surahs]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (selectedSurah && selectedQari) {
      setIsAudioLoading(true);
      setError(null);
      // FIX: Corrected URL to use 'audio-surah' for playing full surahs instead of 'audio' for single ayahs.
      const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${selectedQari}/${selectedSurah.number}.mp3`;
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

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
      const handleError = () => {
        setIsAudioLoading(false);
        setError("Gagal memuat audio. Silakan coba qari atau surah lain.");
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
  }, [selectedSurah, selectedQari, changeSurah]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e);
            setError("Gagal memutar audio.");
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentSurahIndex = selectedSurah ? surahs.findIndex(s => s.number === selectedSurah.number) : -1;

  if (isSurahListLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 px-4 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-black text-emerald-dark dark:text-white tracking-tight uppercase">{t('murotalPlayer')}</h1>
        <p className="text-slate-500 mt-2 font-medium">Dengarkan lantunan ayat suci dari Qari terbaik dunia.</p>
      </div>

      <div className="bg-white dark:bg-dark-blue-card p-8 md:p-12 rounded-[3rem] shadow-xl border-2 border-slate-50 dark:border-slate-800 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label htmlFor="qari-select" className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('selectQari')}</label>
            <select 
              id="qari-select" 
              value={selectedQari} 
              onChange={e => setSelectedQari(e.target.value)} 
              className="w-full p-4 bg-slate-50 dark:bg-dark-blue border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              {qaris.map(qari => <option key={qari.id} value={qari.id}>{qari.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label htmlFor="surah-select" className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('selectSurah')}</label>
            <select 
              id="surah-select" 
              value={selectedSurah?.number || ''} 
              onChange={e => setSelectedSurah(surahs.find(s => s.number === parseInt(e.target.value)) || null)} 
              className="w-full p-4 bg-slate-50 dark:bg-dark-blue border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              {surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.englishName}</option>)}
            </select>
          </div>
        </div>
        
        {error && <div className="mt-6"><ErrorMessage message={error} /></div>}

        <div className="mt-12 text-center py-10 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-600/20">
              <Music size={40} />
            </div>
            <h2 className="text-3xl font-black text-emerald-dark dark:text-white uppercase tracking-tight">{selectedSurah?.englishName || "Pilih Surah"}</h2>
            <p className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light mt-2">{selectedSurah?.name}</p>
        </div>
        
        <div className="mt-10 px-4">
            <input 
                type="range"
                aria-label="Seek track"
                value={currentTime}
                max={duration || 0}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                disabled={!audioRef.current || isAudioLoading || !!error}
            />
            <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-10">
            <button 
              onClick={() => changeSurah('prev')} 
              disabled={currentSurahIndex <= 0} 
              className="p-4 text-slate-400 hover:text-emerald-dark disabled:opacity-20 transition-all hover:scale-110"
              aria-label="Sebelumnya"
            >
                <SkipBack size={32} />
            </button>
            <button 
              onClick={togglePlayPause} 
              disabled={isAudioLoading || !!error} 
              className="w-24 h-24 bg-emerald-600 text-white rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center disabled:bg-slate-200"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isAudioLoading ? <Loader2 className="animate-spin" size={32}/> : (isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-2" fill="currentColor" />)}
            </button>
            <button 
              onClick={() => changeSurah('next')} 
              disabled={currentSurahIndex === -1 || currentSurahIndex >= surahs.length - 1} 
              className="p-4 text-slate-400 hover:text-emerald-dark disabled:opacity-20 transition-all hover:scale-110"
              aria-label="Selanjutnya"
            >
                <SkipForward size={32} />
            </button>
        </div>
      </div>

      <div className="bg-slate-100/50 dark:bg-dark-blue-card p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-wider">
          <ListMusic className="text-emerald-600" /> Putar Cepat
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 18, 36, 67, 114].map(num => (
            <button 
              key={num}
              onClick={() => setSelectedSurah(surahs.find(s => s.number === num) || null)}
              className="p-4 bg-white dark:bg-dark-blue border-2 border-transparent hover:border-emerald-500 rounded-2xl text-left transition-all group"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surah {num}</p>
              <p className="font-bold text-slate-900 dark:text-white truncate">{surahs.find(s => s.number === num)?.englishName || '...'}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Murotal;