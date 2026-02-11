import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    fetchAllSurahs,
    fetchMp3QuranReciters,
    fetchQuranTvChannels,
    fetchQuranVideos,
    fetchRadioId,
    fetchRadioEn 
} from '../services/quranService';
import { Surah, Mp3Reciter, QuranTvChannel, QuranVideo, RadioStation } from '../types';
import { Play, Pause, SkipBack, SkipForward, Loader2, Music, Tv, Video, Radio } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

const internalQaris = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulsamad', name: 'Abdul Basit Abdus Samad' },
  { id: 'ar.sudais', name: 'Abdurrahman as-Sudais' },
];

const Murotal: React.FC = () => {
    // Data state
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [mp3Reciters, setMp3Reciters] = useState<Mp3Reciter[]>([]);
    const [quranTv, setQuranTv] = useState<QuranTvChannel[]>([]);
    const [quranVideos, setQuranVideos] = useState<QuranVideo[]>([]);
    const [radioId, setRadioId] = useState<RadioStation[]>([]);
    const [radioEn, setRadioEn] = useState<RadioStation[]>([]);
    
    // Selection state for main player
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [selectedInternalQari, setSelectedInternalQari] = useState<string>(internalQaris[0].id);

    // Player State
    const [activeMedia, setActiveMedia] = useState<{ url: string; type: 'audio' | 'video'; title: string; isStream: boolean; }>({ url: '', type: 'audio', title: '', isStream: false });
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // UI State
    const [isLoadingMedia, setIsLoadingMedia] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const isPlayingRef = useRef(isPlaying);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

    // Data Fetching
    useEffect(() => {
        const loadAllData = async () => {
            try {
                setIsLoadingData(true);
                const [surahsData, mp3Data, tvData, videoData, radioIdData, radioEnData] = await Promise.all([
                    fetchAllSurahs(),
                    fetchMp3QuranReciters(),
                    fetchQuranTvChannels(),
                    fetchQuranVideos(),
                    fetchRadioId(),
                    fetchRadioEn(),
                ]);
                setSurahs(surahsData);
                setMp3Reciters(mp3Data.reciters || []);
                setQuranTv(tvData.quran_tv || []);
                setQuranVideos(videoData.quran_reflections_EN || []);
                setRadioId(radioIdData.radios || []);
                setRadioEn(radioEnData.radios || []);
            } catch (err) {
                console.error("Failed to load Murotal data", err);
                setError("Gagal memuat data. Periksa koneksi internet Anda.");
            } finally {
                setIsLoadingData(false);
            }
        };
        loadAllData();
    }, []);

    // Update active media for internal player
    useEffect(() => {
        if (surahs.length === 0) return;
        const qari = internalQaris.find(q => q.id === selectedInternalQari);
        const surah = surahs.find(s => s.number === selectedSurah);
        if (qari && surah) {
            setActiveMedia({
                url: `https://cdn.islamic.network/quran/audio-surah/128/${qari.id}/${surah.number}.mp3`,
                type: 'audio',
                title: `${qari.name} - ${surah.englishName}`,
                isStream: false
            });
            // Don't auto-play on selection change, wait for user action.
            if (isPlayingRef.current) {
                setIsPlaying(true); 
            } else {
                setIsPlaying(false);
            }
        }
    }, [selectedSurah, selectedInternalQari, surahs]);

    // Player Core Logic
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        
        const shouldPlay = isPlayingRef.current;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        if (activeMedia.type === 'audio' && activeMedia.url) {
            setIsLoadingMedia(true);
            const newAudio = new Audio(activeMedia.url);
            audioRef.current = newAudio;
            
            const onCanPlay = () => { setIsLoadingMedia(false); if (shouldPlay) newAudio.play().catch(console.error); };
            const onPlay = () => setIsPlaying(true);
            const onPause = () => setIsPlaying(false);
            const onEnded = () => setIsPlaying(false);
            const onTimeUpdate = () => setCurrentTime(newAudio.currentTime);
            const onLoadedMetadata = () => setDuration(newAudio.duration);
            
            newAudio.addEventListener('canplaythrough', onCanPlay);
            newAudio.addEventListener('play', onPlay);
            newAudio.addEventListener('pause', onPause);
            newAudio.addEventListener('ended', onEnded);
            newAudio.addEventListener('timeupdate', onTimeUpdate);
            newAudio.addEventListener('loadedmetadata', onLoadedMetadata);
            
            newAudio.load();

            return () => {
                newAudio.removeEventListener('canplaythrough', onCanPlay);
                newAudio.removeEventListener('play', onPlay);
                newAudio.removeEventListener('pause', onPause);
                newAudio.removeEventListener('ended', onEnded);
                newAudio.removeEventListener('timeupdate', onTimeUpdate);
                newAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
                newAudio.pause();
            };
        } else {
            setIsLoadingMedia(false);
        }
    }, [activeMedia.url, activeMedia.type]);

    const togglePlayPause = () => {
        if (audioRef.current && activeMedia.type === 'audio') {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            }
        }
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(audioRef.current && !activeMedia.isStream) {
          const time = Number(e.target.value);
          audioRef.current.currentTime = time;
          setCurrentTime(time);
      }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMp3ReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const reciterId = e.target.value;
        if (!reciterId) return;
        const reciter = mp3Reciters.find(r => r.id === reciterId);
        if (reciter) {
            const surahNumPadded = String(selectedSurah).padStart(3, '0');
            setActiveMedia({
                url: `${reciter.Server}/${surahNumPadded}.mp3`,
                type: 'audio',
                title: `${reciter.name} - Surah ${surahs.find(s => s.number === selectedSurah)?.englishName || ''}`,
                isStream: false,
            });
            setIsPlaying(true);
        }
    };

    const handleMediaChange = (type: 'video' | 'audio', isStream: boolean) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const url = e.target.value;
        const title = e.target.options[e.target.selectedIndex].text;
        if (!url) return;

        let finalUrl = url;
        if (type === 'video' && finalUrl.includes('youtube.com/watch?v=')) {
            finalUrl = finalUrl.replace('watch?v=', 'embed/');
        }

        setActiveMedia({ url: finalUrl, type, title, isStream });
        if (type === 'audio') {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    if (isLoadingData) return <div className="py-20"><LoadingSpinner /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
            <div className="text-center">
                <h1 className="text-4xl font-black text-emerald-dark dark:text-white tracking-tight uppercase">{t('murotalPlayer')}</h1>
                <p className="text-slate-500 mt-2 font-medium">Dengarkan lantunan ayat suci dari Qari terbaik dunia.</p>
            </div>

            {error && <ErrorMessage message={error} />}

            {/* Main Player Component */}
            <div className="bg-white dark:bg-dark-blue-card p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                {activeMedia.type === 'video' && activeMedia.url ? (
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                        <iframe
                            key={activeMedia.url}
                            src={activeMedia.url}
                            title={activeMedia.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="mt-4 mb-8 text-center py-6 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30">
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-600/20">
                            <Music size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-emerald-dark dark:text-white truncate px-4">{activeMedia.title || "Pilih Audio"}</h2>
                        <p className="font-arabic text-2xl text-emerald-dark/80 dark:text-emerald-light/80 mt-1">{surahs.find(s=> s.number === selectedSurah)?.name}</p>
                    </div>
                )}

                {activeMedia.type === 'audio' && (
                    <>
                        <div className="px-4">
                            <input type="range" value={currentTime} max={duration || 1} onChange={handleSeek} disabled={isLoadingMedia || activeMedia.isStream} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed" />
                            <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>{activeMedia.isStream ? "STREAM" : formatTime(duration)}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-6">
                            <button onClick={() => setSelectedSurah(s => Math.max(1, s - 1))} className="p-3 text-slate-400 hover:text-emerald-dark dark:hover:text-white transition"><SkipBack size={28} /></button>
                            <button onClick={togglePlayPause} disabled={isLoadingMedia || !activeMedia.url} className="w-20 h-20 bg-emerald-dark text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:bg-slate-200">
                                {isLoadingMedia ? <Loader2 className="animate-spin" size={28} /> : (isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} className="ml-1" fill="currentColor" />)}
                            </button>
                            <button onClick={() => setSelectedSurah(s => Math.min(114, s + 1))} className="p-3 text-slate-400 hover:text-emerald-dark dark:hover:text-white transition"><SkipForward size={28} /></button>
                        </div>
                    </>
                )}
            </div>
            
            {/* Selectors */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-4 text-emerald-dark dark:text-white">Pemutar Utama (Audio Per Surah)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={selectedInternalQari} onChange={e => setSelectedInternalQari(e.target.value)} className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            {internalQaris.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                        </select>
                        <select value={selectedSurah} onChange={e => setSelectedSurah(Number(e.target.value))} className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-4 text-emerald-dark dark:text-white">Sumber Lainnya (dari mp3quran.net)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select onChange={handleMp3ReciterChange} defaultValue="" className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            <option value="">Pilih Qari (MP3 Lainnya)</option>
                            {mp3Reciters.map(r => <option key={r.id} value={r.id}>{r.name} ({r.rewaya})</option>)}
                        </select>
                        <select onChange={handleMediaChange('video', true)} defaultValue="" className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            <option value="">Pilih Channel TV</option>
                            {quranTv.map(c => <option key={c.id} value={c.url}>{c.name}</option>)}
                        </select>
                        <select onChange={handleMediaChange('video', false)} defaultValue="" className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            <option value="">Pilih Video Tadabbur (EN)</option>
                            {quranVideos.map(v => <option key={v.id} value={v.url}>{v.title}</option>)}
                        </select>
                        <select onChange={handleMediaChange('audio', true)} defaultValue="" className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            <option value="">Pilih Radio (ID)</option>
                            {radioId.map(r => <option key={r.id} value={r.radio_url}>{r.name}</option>)}
                        </select>
                        <select onChange={handleMediaChange('audio', true)} defaultValue="" className="p-3 bg-slate-100 dark:bg-dark-blue rounded-lg border border-transparent focus:ring-2 focus:ring-emerald-dark outline-none">
                            <option value="">Pilih Radio (EN)</option>
                            {radioEn.map(r => <option key={r.id} value={r.radio_url}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Murotal;
