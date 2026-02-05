
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAllSurahs } from '../services/quranApi';
import { LoadingSpinner } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { Play } from 'lucide-react';
import MediaCarousel from '../components/ui/MediaCarousel';
import HadithCard from '../components/ui/HadithCard';
import PopupDisplay from '../components/ui/PopupDisplay';

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

      <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-emerald-dark dark:text-white">{t('quranStats')}</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="h-64">
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
                  <Tooltip />
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

const AyahOfTheDay: React.FC = () => {
    const { t } = useTranslation();
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const ayahInfo = { surah: 94, ayah: 5 };
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/6110.mp3`;

    const playAudio = () => {
        if (audio && isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            const newAudio = audio || new Audio(audioUrl);
            setAudio(newAudio);
            newAudio.play();
            setIsPlaying(true);
            newAudio.onended = () => setIsPlaying(false);
        }
    };
    
    useEffect(() => {
        return () => {
            audio?.pause();
        }
    }, [audio]);

    return (
        <div className="bg-gradient-to-br from-emerald-dark to-emerald-light dark:from-emerald-dark dark:to-gray-800 text-white p-5 rounded-2xl shadow-lg relative">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold mb-2">{t('ayahOfTheDay')}</h2>
              </div>
              <button onClick={playAudio} className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition">
                <Play size={20} className={`transform transition-transform ${isPlaying ? 'scale-125 text-gold-light' : ''}`} />
              </button>
            </div>
            <p className="font-arabic text-2xl text-right my-4">
            فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
            </p>
            <p className="text-sm">
                "Maka sesungguhnya beserta kesulitan ada kemudahan."
            </p>
            <p className="text-xs text-emerald-light/80 dark:text-gray-400 mt-1">
                (QS. Al-Insyirah: 5)
            </p>
            <div className="mt-4 text-right">
                <Link to={`/surah/${ayahInfo.surah}`} className="bg-white/30 hover:bg-white/50 text-white font-bold py-2 px-4 rounded-full transition text-sm">
                    {t('read')} Surah
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;
