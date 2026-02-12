import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAllSurahs, fetchAudioEditions } from '../services/quranService';
import { Surah } from '../types';
import { Play, Pause, SkipBack, SkipForward, Loader2, Music, ListMusic, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

const Murotal: React.FC = () => {
  const { t } = useTranslation();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [qaris, setQaris] = useState<any[]>([]); // To store fetched qaris
  
  // UI selection state
  const [uiSelectedQari, setUiSelectedQari] = useState(''); // Initialized empty, will be set from fetched data
  const [uiSelectedSurah, setUiSelectedSurah] = useState<Surah | null>(null);

  // Active playing state
  const [activeQariName, setActiveQariName] = useState('Reciter');
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    };
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsListLoading(true);
        const [surahData, audioData] = await Promise.all([
          fetchAllSurahs(),
          fetchAudioEditions() // Fetch qari list from API
        ]);
        setSurahs(surahData);
        
        const filteredQaris = audioData.filter(ed => ed.format === 'audio');

        // Prioritize specific qaris
        const prioritizedIdentifiers = [
          'ar.husary', // Al-Hussary (often known for slower recitation)
          'ar.alafasy', // Al-Afasy
          'ar.abdulsamad', // Abdul Basit Abdus Samad
          // Add other preferred identifiers here if needed
        ];

        // Sort qaris: prioritized ones first, then alphabetical by name
        const sortedQaris = [...filteredQaris].sort((a, b) => {
          const aPriority = prioritizedIdentifiers.indexOf(a.identifier);
          const bPriority = prioritizedIdentifiers.indexOf(b.identifier);

          if (aPriority !== -1 && bPriority === -1) return -1; // a is prioritized, b is not
          if (aPriority === -1 && bPriority !== -1) return 1;  // b is prioritized, a is not
          if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority; // both are prioritized, sort by order
          return a.name.localeCompare(b.name); // neither are prioritized, sort alphabetically
        });

        setQaris(sortedQaris);

        if (sortedQaris.length > 0) {
            setUiSelectedQari(sortedQaris[0].identifier);
        }
        if (surahData.length > 0) {
            setUiSelectedSurah(surahData[0]);
        }
      } catch (err) {
        setError("Gagal memuat data pemutar Murotal.");
      } finally {
        setIsListLoading(false);
      }
    };
    loadData();
  }, []);

  const cleanupAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('play', onPlay);
        audioRef.current.removeEventListener('pause', onPause);
        audioRef.current.removeEventListener('loadedmetadata', onMetadata);
        audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
        audioRef.current.removeEventListener('canplaythrough', onCanPlay);
        audioRef.current.removeEventListener('ended', onEnded);
        audioRef.current.removeEventListener('error', onError);
        audioRef.current.src = '';
        audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const onTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const onCanPlay = () => {
    setIsAudioLoading(false);
    if (isPlayingRef.current) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }
  };
  const onEnded = () => {
    setIsPlaying(false);
    // Auto-play next Surah
    if (activeSurah && surahs.length > 0) {
        const currentIndex = surahs.findIndex(s => s.number === activeSurah.number);
        if (currentIndex !== -1 && currentIndex < surahs.length - 1) {
            const nextSurah = surahs[currentIndex + 1];
            if (nextSurah) {
                setUiSelectedSurah(nextSurah); // Update UI select
                startPlayback(uiSelectedQari, nextSurah);
            }
        }
    }
  };
  const onError = () => {
    setIsAudioLoading(false);
    setError("Audio tidak tersedia atau gagal dimuat. Silakan coba qari atau surah lain.");
    setIsPlaying(false);
  };

  const startPlayback = (qariId: string, surah: Surah) => {
    cleanupAudio();
    setIsAudioLoading(true);
    setError(null);
    
    setActiveSurah(surah);
    const qariObj = qaris.find(q => q.identifier === qariId);
    setActiveQariName(typeof qariObj?.name === 'string' ? qariObj.name : 'Reciter');

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${qariId}/${surah.number}.mp3`;
    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;

    newAudio.addEventListener('play', onPlay);
    newAudio.addEventListener('pause', onPause);
    newAudio.addEventListener('loadedmetadata', onMetadata);
    newAudio.addEventListener('timeupdate', onTimeUpdate);
    newAudio.addEventListener('canplaythrough', onCanPlay);
    newAudio.addEventListener('ended', onEnded);
    newAudio.addEventListener('error', onError);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => setError("Gagal melanjutkan pemutaran."));
        }
    } else if (uiSelectedSurah) {
        startPlayback(uiSelectedQari, uiSelectedSurah);
    }
  };

  const changeSurah = (direction: 'next' | 'prev') => {
    const currentNum = uiSelectedSurah?.number || 1;
    const targetNum = direction === 'next' ? currentNum + 1 : currentNum - 1;
    if (targetNum >= 1 && targetNum <= 114) {
        const next = surahs.find(s => s.number === targetNum);
        if (next) {
            setUiSelectedSurah(next);
            if (audioRef.current || isPlaying) {
                startPlayback(uiSelectedQari, next);
            }
        }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      if (audioRef.current) {
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
  
  const currentSurahIndex = uiSelectedSurah ? surahs.findIndex(s => s.number === uiSelectedSurah.number) : -1;

  if (isListLoading) return <LoadingSpinner />;

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
              aria-label="Pilih Qari"
              value={uiSelectedQari} 
              onChange={e => setUiSelectedQari(e.target.value)} 
              className="w-full p-4 bg-slate-50 dark:bg-dark-blue border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              {qaris.map(qari => <option key={qari.identifier} value={qari.identifier}>{qari.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label htmlFor="surah-select" className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('selectSurah')}</label>
            <select 
              id="surah-select" 
              aria-label="Pilih Surah"
              value={uiSelectedSurah?.number || ''} 
              onChange={e => setUiSelectedSurah(surahs.find(s => s.number === parseInt(e.target.value)) || null)} 
              className="w-full p-4 bg-slate-50 dark:bg-dark-blue border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              {surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.englishName}</option>)}
            </select>
          </div>
        </div>
        
        {error && (
            <div className="mt-6 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl mb-6 border border-red-100 dark:border-red-900/30">
                <AlertCircle size={20} />
                <p className="text-sm font-semibold">{error}</p>
            </div>
        )}

        <div className="mt-12 text-center py-10 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-600/20">
              <Music size={40} />
            </div>
            <h2 className="text-3xl font-black text-emerald-dark dark:text-white uppercase tracking-tight">{activeSurah ? `${activeSurah.number}. ${activeSurah.englishName}` : (uiSelectedSurah ? `${uiSelectedSurah.number}. ${uiSelectedSurah.englishName}` : 'Pilih Surah')}</h2>
            <p className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light mt-2">{activeSurah?.name || uiSelectedSurah?.name}</p>
        </div>
        
        <div className="mt-10 px-4">
            <input 
                type="range"
                aria-label="Seek track"
                value={currentTime}
                max={duration || 0}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                disabled={isAudioLoading || !!error || !audioRef.current}
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
              aria-label="Surah Sebelumnya"
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
              aria-label="Surah Selanjutnya"
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
              onClick={() => {
                const surahToPlay = surahs.find(s => s.number === num);
                if (surahToPlay) {
                  setUiSelectedSurah(surahToPlay);
                  startPlayback(uiSelectedQari, surahToPlay);
                }
              }}
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
