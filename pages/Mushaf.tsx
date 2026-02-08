
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllSurahs } from '../services/quranApi';
import { Surah } from '../types';
import { Search, BookOpen, Layers, Hash } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

const Mushaf: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'surah' | 'juz' | 'page'>('surah');
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4 pt-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold text-emerald-dark dark:text-emerald-light">Daftar Surah</h2>
      </div>

      <div className="sticky top-[72px] bg-soft-white dark:bg-dark-blue z-20 pb-4 shadow-sm px-1">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t('searchSurah')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-dark-blue-card border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-dark transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-dark-blue-card rounded-full p-1.5 shadow-inner">
            <button onClick={() => setViewType('surah')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${viewType === 'surah' ? 'bg-emerald-dark text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <BookOpen size={16} /> {t('surah')}
            </button>
            <button onClick={() => setViewType('juz')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${viewType === 'juz' ? 'bg-emerald-dark text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <Layers size={16} /> {t('juz')}
            </button>
            <button onClick={() => setViewType('page')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${viewType === 'page' ? 'bg-emerald-dark text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <Hash size={16} /> Page
            </button>
        </div>
      </div>

      <div className="pt-2">
        {viewType === 'surah' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map(surah => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        ) : viewType === 'juz' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 30 }, (_, i) => (
                <JuzCard key={i+1} juzNumber={i+1} onClick={() => navigate(`/juz/${i+1}`)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
             {Array.from({ length: 604 }, (_, i) => (
                <PageCard key={i+1} pageNumber={i+1} onClick={() => navigate(`/page/${i+1}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SurahCard: React.FC<{ surah: Surah }> = ({ surah }) => (
    <Link to={`/surah/${surah.number}`} className="block bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg active:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white rounded-lg flex items-center justify-center font-bold">
                    {surah.number}
                </div>
                <div>
                    <h3 className="font-bold text-emerald-dark dark:text-white">{surah.englishName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">{surah.revelationType} • {surah.numberOfAyahs} Ayat</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-arabic text-2xl text-emerald-dark dark:text-emerald-light">{surah.name}</p>
            </div>
        </div>
    </Link>
);

const JuzCard: React.FC<{juzNumber: number, onClick: () => void}> = ({juzNumber, onClick}) => {
    const { t } = useTranslation();
    return (
    <button onClick={onClick} className="block w-full bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-dark hover:shadow-md transition-all active:scale-95">
       <div className="flex flex-col items-center justify-center space-y-2">
           <div className="w-12 h-12 bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white rounded-full flex items-center justify-center font-bold text-lg">
              {juzNumber}
            </div>
            <h3 className="font-bold text-emerald-dark dark:text-white text-sm">{t('juz')} {juzNumber}</h3>
        </div>
    </button>
)};

const PageCard: React.FC<{pageNumber: number, onClick: () => void}> = ({pageNumber, onClick}) => (
    <button onClick={onClick} className="block w-full bg-white dark:bg-dark-blue-card p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-dark transition-all active:scale-90">
        <span className="block text-lg font-bold text-emerald-dark dark:text-white">{pageNumber}</span>
        <span className="text-[10px] text-gray-400 uppercase">Hal</span>
    </button>
);

export default Mushaf;
