
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, List, Layers, BookUp } from 'lucide-react';
import { Surah } from '../types';
import { fetchAllSurahs } from '../services/quranService';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { ErrorMessage } from '../components/ui/Feedback'; // Import ErrorMessage

const Mushaf: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // NEW: Error state
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loadSurahs = async () => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const data = await fetchAllSurahs();
            setSurahs(data);
        } catch (err: any) {
            console.error("Failed to fetch surahs:", err);
            setError(err.message || t('failedToLoadSurahList' as TranslationKeys)); // Set specific error message
        } finally {
            setLoading(false);
        }
    };
    loadSurahs();
  }, [t]);

  const cleanSearch = search.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const filteredSurahs = surahs.filter(s => {
    const cleanEnglishName = s.englishName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    return cleanEnglishName.includes(cleanSearch) || 
           s.name.includes(search) || // Direct match for Arabic
           s.number.toString().includes(search);
  });

  const handleJump = () => {
    const surahNum = prompt(t('enterSurahNumber' as TranslationKeys));
    if (surahNum) {
        const num = parseInt(surahNum, 10);
        if (!isNaN(num) && num >= 1 && num <= 114) {
            navigate(`/surah/${num}`);
        } else {
            alert(t('invalidSurahNumber' as TranslationKeys));
        }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <Loader2 className="animate-spin text-emerald-600" size={60} />
        <p className="text-slate-500 font-black text-xl animate-pulse">{t('connectingToMushaf' as TranslationKeys)}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 pb-20">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-emerald-dark dark:text-emerald-light">
          {t('surahList' as TranslationKeys)}
        </h2>
      </div>

      <div className="sticky top-[72px] bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-xl z-20 py-2 space-y-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t('searchSurah' as TranslationKeys)}
                className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full focus:ring-4 focus:ring-emerald-500/10 outline-none w-full shadow-sm font-bold transition-all text-slate-900 dark:text-white min-h-[44px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('searchSurah' as TranslationKeys)}
              />
            </div>
            <button onClick={handleJump} className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full shadow-sm text-emerald-dark dark:text-emerald-light min-h-[44px] min-w-[44px]" aria-label={t('jumpToSurah' as TranslationKeys)}>
                <BookUp size={20} />
            </button>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setViewMode('surah')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-black transition-all min-h-[44px] ${viewMode === 'surah' ? 'bg-emerald-dark text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             aria-label={t('displaySurahList' as TranslationKeys)}
           >
              <List size={18}/> {t('surah' as TranslationKeys)}
           </button>
           <button 
             onClick={() => setViewMode('juz')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-black transition-all min-h-[44px] ${viewMode === 'juz' ? 'bg-emerald-dark text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             aria-label={t('displayJuzList' as TranslationKeys)}
           >
              <Layers size={18}/> {t('juz' as TranslationKeys)}
           </button>
        </div>
      </div>

      <div className="pt-4">
        {viewMode === 'surah' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <button 
                key={surah.number}
                onClick={() => navigate(`/surah/${surah.number}`)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-dark-blue-card rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all text-left shadow-sm group min-h-[88px]"
                aria-label={`${t('read' as TranslationKeys)} ${t('surah' as TranslationKeys)} ${surah.englishName} (${surah.name})`}
              >
                <div className="text-2xl font-bold text-emerald-dark dark:text-emerald-light">
                  {surah.number}.
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{surah.englishName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
                </div>
                <div className="text-right">
                  <p className="font-arabic text-2xl text-emerald-dark dark:text-emerald-light">{surah.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{surah.numberOfAyahs} {t('ayahSuffix' as TranslationKeys)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
            // Placeholder for Juz list view, implement as needed
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <button 
                        key={juzNum}
                        onClick={() => navigate(`/juz/${juzNum}`)}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-dark-blue-card rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all text-left shadow-sm group min-h-[88px]"
                        aria-label={`${t('read' as TranslationKeys)} ${t('juz' as TranslationKeys)} ${juzNum}`}
                    >
                        <div className="text-2xl font-bold text-emerald-dark dark:text-emerald-light">
                        {juzNum}.
                        </div>
                        <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Juz {juzNum}</h3>
                        </div>
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Mushaf;
