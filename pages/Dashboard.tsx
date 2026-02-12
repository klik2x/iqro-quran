
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAllSurahs, fetchSurah } from '../services/quranService';
import { LoadingSpinner } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { Play, Pause, Loader2 } from 'lucide-react';
import MediaCarousel from '../components/ui/MediaCarousel';
import HadithCard from '../components/ui/HadithCard';
import PopupDisplay from '../components/ui/PopupDisplay';
import { Surah, Ayah } from '../types';
import { useUI } from '../contexts/UIContext'; // Import useUI
import { speak } from '../utils/browserSpeech'; // FIX: Import speak for HadithCard audio

const COLORS = ['#036666', '#D4AF37']; // Emerald and Gold

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { isHighContrast } = useUI(); // Get high contrast state

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const surahs = await fetchAllSurahs();
        const makkiyah = surahs.filter(s => s.revelationType === 'Meccan').length;
        const madaniyah = surahs.filter(s => s.revelationType === 'Medinan').length;
        setStats([
          { name: 'Makkiyah', value: makkiyah },
          { name: 'Madaniyah', value: madaniyah },
        ]);
      } catch (error) {
        console.error("Failed to fetch surah stats", error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const pieChartColors = isHighContrast ? ['#FFFF00', '#0000FF'] : COLORS; // High contrast colors for pie chart

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      </div>

      <AyahOfTheDay />

      <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md overflow-hidden">
        <h2 className="text-xl font-bold mb-4 text-emerald-dark dark:text-white">{t('quranStats')}</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="h-64 -mx-4 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    aria-label="Statistik jumlah Surah Makkiyah dan Madaniyah"
                  >
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ zIndex: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tipe Surah</h3>
              <p className="text-gray-600 dark:text-gray-300">Total 114 Surah</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className={`w-4 h-4 rounded-full ${isHighContrast ? 'bg-hc-accent' : 'bg-[#036666]'}`}></div>
                  <span className="text-gray-700 dark:text-gray-200">Makkiyah: {stats.find(s => s.name === 'Makkiyah')?.value} Surah</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className={`w-4 h-4 rounded-full ${isHighContrast ? 'bg-blue-500' : 'bg-[#D4AF37]'}`}></div>
                  <span className="text-gray-700 dark:text-gray-200">Madaniyah: {stats.find(s => s.name === 'Madaniyah')?.value} Surah</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaCarousel />
      <HadithCard />
      <PopupDisplay />
    </div>
  );
};

interface DailyAyah {
    ayah: Ayah;
    surah: Surah;
}

const defaultAyah: DailyAyah = {
    ayah: {
        number: 1, audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3", text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        textLatin: "Bismillāhir-raḥmānir-raḥīm", translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.", numberInSurah: 1, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false
    },
    surah: {
        number: 1, name: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: 'Meccan'
    }
};

const AyahOfTheDay: React.FC = () => {
    const { t } = useTranslation();
    const [dailyAyah, setDailyAyah] = useState<DailyAyah | null>(null);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { isHighContrast } = useUI(); // Get high contrast state

    useEffect(() => {
        const getDailyAyah = async () => {
            setLoading(true);
            try {
                const date = new Date();
                const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                
                const surahs = await fetchAllSurahs();
                if (!surahs || surahs.length === 0) throw new Error("Surah list is empty.");

                const surahIndex = (dayOfYear + date.getFullYear()) % surahs.length;
                const selectedSurahInfo = surahs[surahIndex];
                
                const surahData = await fetchSurah(selectedSurahInfo.number);

                if (!surahData || !surahData.ayahs || surahData.ayahs.length === 0) {
                    throw new Error("Daily ayah data is empty or invalid.");
                }
                
                const ayahIndex = (dayOfYear) % surahData.ayahs.length;
                const selectedAyah = surahData.ayahs[ayahIndex];
                
                if (!selectedAyah) {
                    throw new Error("Could not select a valid ayah from surah data.");
                }

                setDailyAyah({ ayah: selectedAyah, surah: surahData });

            } catch (error) {
                console.error("Failed to fetch Ayah of the Day, using fallback:", error);
                setDailyAyah(defaultAyah);
            } finally {
                setLoading(false);
            }
        };

        getDailyAyah();
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlayAudio = () => {
        if (!dailyAyah) return;

        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            return;
        }
        
        if (!audioRef.current || audioRef.current.src !== dailyAyah.ayah.audio) {
            const newAudio = new Audio(dailyAyah.ayah.audio);
            audioRef.current = newAudio;
            newAudio.onplay = () => setIsPlaying(true);
            newAudio.onpause = () => setIsPlaying(false);
            newAudio.onended = () => setIsPlaying(false);
            newAudio.onerror = () => {
                setIsPlaying(false);
                console.error("Error playing audio.");
                alert("Gagal memutar audio tilawah.");
            };
        }
        
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
            setIsPlaying(false);
            alert("Gagal memutar audio tilawah.");
        });
    };

    return (
        <div 
            className={`p-5 rounded-2xl shadow-lg relative min-h-[220px] 
                       ${isHighContrast 
                          ? 'bg-hc-bg text-hc-text border-2 border-hc-accent' 
                          : 'bg-gradient-to-br from-emerald-dark to-emerald-light dark:from-emerald-dark dark:to-gray-800 text-white'}`}
        >
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-lg font-bold mb-2 ${isHighContrast ? 'text-hc-accent' : ''}`}>{t('ayahOfTheDay')}</h2>
              </div>
              <button 
                onClick={togglePlayAudio} 
                className={`p-3 rounded-full transition-all duration-300 w-11 h-11 flex items-center justify-center 
                            ${isHighContrast 
                               ? 'bg-hc-button-bg text-hc-button-text hover:brightness-125 border-2 border-hc-accent' 
                               : 'bg-white/20 hover:bg-white/40'}`} 
                disabled={!dailyAyah || loading}
                aria-label={isPlaying ? 'Jeda tilawah ayat hari ini' : 'Putar tilawah ayat hari ini'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className={`animate-spin ${isHighContrast ? 'text-hc-accent' : 'text-white'}`} />
                </div>
            ) : dailyAyah ? (
                <>
                    <p className={`font-arabic text-2xl text-right my-4 ${isHighContrast ? 'text-hc-text' : ''}`}>
                        {dailyAyah.ayah.text}
                    </p>
                    <p className={`text-sm ${isHighContrast ? 'text-hc-text' : ''}`}>
                        "{dailyAyah.ayah.translation}"
                    </p>
                    <p className={`text-xs mt-1 ${isHighContrast ? 'text-hc-accent' : 'text-emerald-light/80 dark:text-gray-400'}`}>
                        (QS. {dailyAyah.surah.englishName}: {dailyAyah.ayah.numberInSurah})
                    </p>
                    <div className="mt-4 text-right">
                        <Link 
                            to={`/surah/${dailyAyah.surah.number}`} 
                            className={`inline-flex items-center justify-center font-bold py-2 px-5 rounded-full transition-all duration-300 min-w-[120px] h-11 
                                        ${isHighContrast 
                                           ? 'bg-hc-button-bg text-hc-button-text hover:brightness-125 border-2 border-hc-accent' 
                                           : 'bg-white/30 hover:bg-white/50 text-white'}`}
                            aria-label={`Baca Surah ${dailyAyah.surah.englishName}`}
                        >
                            {t('read')} Surah
                        </Link>
                    </div>
                </>
            ) : (
                <p className={`${isHighContrast ? 'text-hc-text' : ''}`}>Gagal memuat ayat hari ini.</p>
            )}
        </div>
    );
}

export default Dashboard;
