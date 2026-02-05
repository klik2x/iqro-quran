
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllSurahs } from '../services/quranApi';
import { Surah } from '../types';
import { Search } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

const Mushaf: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'surah' | 'juz'>('surah');
  const { t } = useTranslation();

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const cachedSurahs = localStorage.getItem('allSurahs');
        if (cachedSurahs) {
          setSurahs(JSON.parse(cachedSurahs));
        }
        const data = await fetchAllSurahs();
        setSurahs(data);
        localStorage.setItem('allSurahs', JSON.stringify(data));
      } catch (err) {
        setError('Gagal memuat daftar surah. Silakan coba lagi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSurahs();
  }, []);

  const filteredSurahs = useMemo(() => 
    surahs.filter(surah => 
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.includes(searchTerm) ||
      String(surah.number).includes(searchTerm)
    ), [surahs, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-16 bg-soft-white/80 dark:bg-dark-blue/80 backdrop-blur-sm z-10 py-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t('searchSurah')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-dark-blue-card border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-dark"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-dark-blue-card rounded-full p-1">
            <button onClick={() => setViewType('surah')} className={`w-full py-2 rounded-full text-sm font-semibold transition ${viewType === 'surah' ? 'bg-emerald-dark text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {t('surah')}
            </button>
            <button onClick={() => setViewType('juz')} className={`w-full py-2 rounded-full text-sm font-semibold transition ${viewType === 'juz' ? 'bg-emerald-dark text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {t('juz')}
            </button>
        </div>
      </div>

      {viewType === 'surah' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 30 }, (_, i) => (
              <JuzCard key={i+1} juzNumber={i+1} />
          ))}
        </div>
      )}
    </div>
  );
};

const SurahCard: React.FC<{ surah: Surah }> = ({ surah }) => (
    <Link to={`/surah/${surah.number}`} className="block bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm hover:shadow-lg active:shadow-md hover:scale-105 active:scale-[0.98] transition-all duration-200">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white rounded-lg flex items-center justify-center font-bold">
                    {surah.number}
                </div>
                <div>
                    <h3 className="font-bold text-emerald-dark dark:text-white">{surah.englishName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{surah.revelationType} - {surah.numberOfAyahs} Ayat</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-arabic text-2xl text-emerald-dark dark:text-emerald-light">{surah.name}</p>
            </div>
        </div>
    </Link>
);

const JuzCard: React.FC<{juzNumber: number}> = ({juzNumber}) => {
    const { t } = useTranslation();
    return (
    <div className="block bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm opacity-70 cursor-not-allowed">
       <div className="flex items-center space-x-4">
           <div className="flex-shrink-0 w-10 h-10 bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white rounded-lg flex items-center justify-center font-bold">
              {juzNumber}
            </div>
            <div>
                <h3 className="font-bold text-emerald-dark dark:text-white text-lg">{t('juz')} {juzNumber}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Fitur segera hadir</p>
            </div>
        </div>
    </div>
)};

export default Mushaf;
