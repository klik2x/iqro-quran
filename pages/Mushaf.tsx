
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, List, Layers, BookUp, Maximize, Minimize, ChevronLeft, ChevronRight, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Surah } from '../types';
import { fetchAllSurahs } from '../services/quranService';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { ErrorMessage } from '../components/ui/Feedback'; // Import ErrorMessage

const Mushaf: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // NEW: Error state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'page'>('surah');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (viewMode === 'page') {
      const loadPage = async () => {
        try {
          setPageLoading(true);
          const { fetchPage } = await import('../services/quranService');
          const data = await fetchPage(currentPage);
          setPageData(data);
        } catch (err) {
          console.error("Failed to fetch page:", err);
        } finally {
          setPageLoading(false);
        }
      };
      loadPage();
    }
  }, [viewMode, currentPage]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadSurahs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAllSurahs();
            setSurahs(data);
        } catch (err: any) {
            console.error("Failed to fetch surahs:", err);
            setError(err.message || t('failedToLoadSurahList' as TranslationKeys));
        } finally {
            setLoading(false);
        }
    };
    loadSurahs();
  }, [t]);

  const cleanSearch = debouncedSearch.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const filteredSurahs = surahs.filter(s => {
    const cleanEnglishName = s.englishName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    return cleanEnglishName.includes(cleanSearch) || 
           s.name.includes(debouncedSearch) || 
           s.number.toString().includes(debouncedSearch);
  });

  const juzPageMapping: Record<number, number> = {
    1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 122, 8: 142, 9: 162, 10: 182,
    11: 202, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
    21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582
  };

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
           <button 
             onClick={() => setViewMode('page')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-black transition-all min-h-[44px] ${viewMode === 'page' ? 'bg-emerald-dark text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             aria-label={t('displayPageList' as TranslationKeys)}
           >
              <Book size={18}/> {t('page' as TranslationKeys)}
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
        ) : viewMode === 'juz' ? (
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('page' as TranslationKeys)} {juzPageMapping[juzNum]}</p>
                        </div>
                    </button>
                ))}
            </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all min-h-[44px] min-w-[44px]"
                  aria-label={t('previousPage' as TranslationKeys)}
                >
                  <ChevronLeft size={20} />
                </button>
                <select 
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="bg-transparent font-bold px-4 py-2 outline-none min-h-[44px]"
                >
                  {Array.from({ length: 604 }, (_, i) => i + 1).map(p => (
                    <option key={p} value={p}>{t('page' as TranslationKeys)} {p}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(604, prev + 1))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all min-h-[44px] min-w-[44px]"
                  aria-label={t('nextPage' as TranslationKeys)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all min-h-[44px]"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                {isFullscreen ? t('exitFullscreen' as TranslationKeys) : t('fullscreen' as TranslationKeys)}
              </button>
            </div>

            <div className="relative min-h-[600px] bg-white dark:bg-dark-blue-card rounded-[2.5rem] border-8 border-emerald-900/10 dark:border-emerald-100/5 p-8 md:p-12 shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {pageLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 100) setCurrentPage(prev => Math.max(1, prev - 1));
                      else if (info.offset.x < -100) setCurrentPage(prev => Math.min(604, prev + 1));
                    }}
                    className="w-full h-full flex flex-col items-center cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-full max-w-2xl space-y-4">
                      {pageData?.ayahs.map((ayah: any, idx: number) => {
                        const isNewSurah = idx === 0 || ayah.surah.number !== pageData.ayahs[idx-1].surah.number;
                        const isBismillah = ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9;
                        
                        return (
                          <React.Fragment key={ayah.number}>
                            {isNewSurah && (
                              <div className="w-full py-4 mb-6 border-y-2 border-emerald-100 dark:border-emerald-900/30 text-center bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl">
                                <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-200 font-arabic">
                                  {ayah.surah.name}
                                </h3>
                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">
                                  {ayah.surah.englishName}
                                </p>
                              </div>
                            )}
                            {isBismillah && (
                              <div className="text-center py-4 font-arabic text-3xl text-emerald-700 dark:text-emerald-300">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                              </div>
                            )}
                            <div className="inline-block text-right w-full">
                              <span className="font-arabic text-3xl md:text-4xl leading-[2.5] dark:text-white tracking-wide">
                                {ayah.text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim()}
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-800 text-sm font-bold mx-2 text-emerald-600 dark:text-emerald-400 align-middle">
                                  {ayah.numberInSurah}
                                </span>
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 w-full text-center">
                      <p className="text-slate-400 font-black text-sm uppercase tracking-widest">
                        {t('page' as TranslationKeys)} {currentPage} / 604
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mushaf;
