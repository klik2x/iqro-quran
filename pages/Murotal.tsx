
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllSurahs } from '../services/quranApi';
import { Surah } from '../types';
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';
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
  const [autoplay, setAutoplay] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setSurahListLoading(true);
        setError(null);
        const data = await fetchAllSurahs();
        setSurahs(data);
        if (data.length > 0) {
            setSelectedSurah(data[0]);
        }
      } catch (err) {
        console.error("Failed to load surahs for Murotal", err);
        setError("Gagal memuat daftar surah.");
      } finally {
        setSurahListLoading(false);
      }
    };
    loadSurahs();
  }, []);
  
  const changeSurah = (direction: 'next' | 'prev') => {
      if (!selectedSurah || surahs.length === 0) return;
      const currentIndex = surahs.findIndex(s => s.number === selectedSurah.number);
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

      if (newIndex >= 0 && newIndex < surahs.length) {
          setSelectedSurah(surahs[newIndex]);
      }
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }

    if (selectedSurah && selectedQari) {
      setIsAudioLoading(true);
      setError(null);
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${selectedSurah.number}.mp3`;
      const newAudio = new Audio(audioUrl);
      
      const wasPlaying = isPlaying;

      newAudio.onplay = () => setIsPlaying(true);
      newAudio.onpause = () => setIsPlaying(false);
      newAudio.onended = () => {
          setIsPlaying(false);
          if (autoplay) {
              changeSurah('next');
          }
      };
      newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
      newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
      newAudio.oncanplaythrough = () => {
          setIsAudioLoading(false);
          if (wasPlaying || (autoplay && selectedSurah.number !== surahs[0].number)) {
              newAudio.play().catch(e => console.error("Error auto-playing audio:", e));
          }
      };
      newAudio.onerror = () => {
        setIsAudioLoading(false);
        setError("Gagal memuat audio. Coba ganti qari atau surah lain.");
      }

      audioRef.current = newAudio;
    }
    
    return () => {
        audioRef.current?.pause();
    }
  }, [selectedSurah, selectedQari]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e)
            setError("Gagal memutar audio. Coba muat ulang surah.");
        });
      }
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(audioRef.current) {
          const time = Number(e.target.value);
          audioRef.current.currentTime = time;
          setCurrentTime(time);
      }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentSurahIndex = selectedSurah ? surahs.findIndex(s => s.number === selectedSurah.number) : -1;

  if (isSurahListLoading) {
      return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('murotalPlayer')}</h1>
      <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md max-w-xl mx-auto space-y-4">
        <div>
          <label htmlFor="qari-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectQari')}</label>
          <select id="qari-select" value={selectedQari} onChange={e => setSelectedQari(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-dark-blue border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-dark">
            {qaris.map(qari => <option key={qari.id} value={qari.id}>{qari.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="surah-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectSurah')}</label>
          <select id="surah-select" value={selectedSurah?.number || ''} onChange={e => setSelectedSurah(surahs.find(s => s.number === parseInt(e.target.value)) || null)} className="w-full p-3 bg-gray-100 dark:bg-dark-blue border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-dark">
            {surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.englishName} ({surah.name})</option>)}
          </select>
        </div>
        
        {error && <ErrorMessage message={error} />}

        <div className="bg-emerald-light/20 dark:bg-emerald-dark/30 p-4 rounded-lg text-center mt-4">
            <h2 className="text-xl font-bold text-emerald-dark dark:text-white">{selectedSurah?.englishName || "Pilih surah"}</h2>
            <p className="font-arabic text-2xl text-emerald-dark dark:text-emerald-light">{selectedSurah?.name}</p>
        </div>
        
        <div className="pt-2">
            <input 
                type="range"
                value={currentTime}
                max={duration || 0}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                disabled={!audioRef.current || isAudioLoading || !!error}
            />
            <div className="flex justify-between text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex items-center justify-center space-x-6">
            <button onClick={() => changeSurah('prev')} disabled={currentSurahIndex <= 0} className="p-2 text-gray-500 hover:text-emerald-dark disabled:opacity-30 disabled:cursor-not-allowed transition">
                <SkipBack />
            </button>
            <button onClick={togglePlayPause} disabled={isAudioLoading || !!error} className="p-4 bg-emerald-dark text-white rounded-full shadow-lg hover:scale-110 active:scale-100 transition-transform disabled:bg-emerald-dark/50 disabled:cursor-wait">
                {isAudioLoading ? <Loader2 className="animate-spin" size={28}/> : (isPlaying ? <Pause size={28}/> : <Play size={28}/>)}
            </button>
            <button onClick={() => changeSurah('next')} disabled={currentSurahIndex === -1 || currentSurahIndex >= surahs.length - 1} className="p-2 text-gray-500 hover:text-emerald-dark disabled:opacity-30 disabled:cursor-not-allowed transition">
                <SkipForward />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Murotal;
