
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAllSurahs, fetchSurah } from '../services/quranApi';
import { LoadingSpinner } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { Play, Pause, Loader2 } from 'lucide-react';
import MediaCarousel from '../components/ui/MediaCarousel';
import HadithCard from '../components/ui/HadithCard';
import PopupDisplay from '../components/ui/PopupDisplay';
import { Surah, Ayah } from '../types';

const COLORS = ['#036666', '#D4AF37']; // Emerald and Gold

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
                  >
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ zIndex: 10 }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold">Tipe Surah</h3>
              <p className="text-gray-600 dark:text-gray-300">Total 114 Surah</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-[#036666]"></div>
                  <span>Makkiyah: {stats.find(s => s.name === 'Makkiyah')?.value} Surah</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-[#D4AF37]"></div>
                  <span>Madaniyah: {stats.find(s => s.name === 'Madaniyah')?.value} Surah</span>
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

const AyahOfTheDay: React.FC = () => {
    const { t } = useTranslation();
    const [dailyAyah, setDailyAyah] = useState<DailyAyah | null>(null);
    const [loading, setLoading] = useState(true);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const getDailyAyah = async () => {
            try {
                const date = new Date();
                const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                
                const surahs = await fetchAllSurahs();
                const surahIndex = (dayOfYear + date.getFullYear()) % surahs.length;
                const selectedSurahInfo = surahs[surahIndex];
                
                const surahData = await fetchSurah(selectedSurahInfo.number);
                const ayahIndex = (dayOfYear) % surahData.ayahs.length;
                const selectedAyah = surahData.ayahs[ayahIndex];
                
                setDailyAyah({ ayah: selectedAyah, surah: surahData });

            } catch (error) {
                console.error("Failed to fetch Ayah of the Day:", error);
            } finally {
                setLoading(false);
            }
        };

        getDailyAyah();
    }, []);

    const playAudio = () => {
        if (!dailyAyah) return;

        if (audio && isPlaying) {
            audio.pause();
        } else if (audio && !isPlaying) {
             audio.play().catch(console.error);
        } else {
            const newAudio = new Audio(dailyAyah.ayah.audio);
            setAudio(newAudio);
            newAudio.play().catch(console.error);
            newAudio.onplay = () => setIsPlaying(true);
            newAudio.onpause = () => setIsPlaying(false);
            newAudio.onended = () => setIsPlaying(false);
        }
    };
    
    useEffect(() => {
        return () => audio?.pause();
    }, [audio]);

    return (
        <div className="bg-gradient-to-br from-emerald-dark to-emerald-light dark:from-emerald-dark dark:to-gray-800 text-white p-5 rounded-2xl shadow-lg relative min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold mb-2">{t('ayahOfTheDay')}</h2>
              </div>
              <button onClick={playAudio} className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition" disabled={!dailyAyah || loading}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="animate-spin" />
                </div>
            ) : dailyAyah ? (
                <>
                    <p className="font-arabic text-2xl text-right my-4">
                        {dailyAyah.ayah.text}
                    </p>
                    <p className="text-sm">
                        "{dailyAyah.ayah.translation}"
                    </p>
                    <p className="text-xs text-emerald-light/80 dark:text-gray-400 mt-1">
                        (QS. {dailyAyah.surah.englishName}: {dailyAyah.ayah.numberInSurah})
                    </p>
                    <div className="mt-4 text-right">
                        <Link to={`/surah/${dailyAyah.surah.number}`} className="bg-white/30 hover:bg-white/50 text-white font-bold py-2 px-4 rounded-full transition text-sm">
                            {t('read')} Surah
                        </Link>
                    </div>
                </>
            ) : (
                <p>Gagal memuat ayat hari ini.</p>
            )}
        </div>
    );
}

export default Dashboard;
