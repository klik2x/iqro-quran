
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurah } from '../services/quranApi';
import { SurahDetail as SurahDetailType } from '../types';
import { ChevronLeft, ChevronRight, Languages, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { useQuran } from '../contexts/QuranContext';
import AyahView from '../components/AyahView';

const SurahDetail: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    selectedEdition, 
    setSelectedEdition, 
    editions, 
    showLatin, 
    setShowLatin, 
    showTranslation, 
    setShowTranslation 
  } = useQuran();

  const [surah, setSurah] = useState<SurahDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurahData = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchSurah(parseInt(number || '1', 10), selectedEdition);
          setSurah(data);
        } catch (err) {
          setError('Gagal memuat surah.');
        } finally {
          setLoading(false);
        }
    };
    if (number) loadSurahData();
  }, [number, selectedEdition]);

  const navigateSurah = (dir: 'prev' | 'next') => {
      const current = parseInt(number || '1');
      const target = dir === 'next' ? current + 1 : current - 1;
      if (target >= 1 && target <= 114) {
          navigate(`/surah/${target}`);
      }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!surah) return null;

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white dark:bg-dark-blue-card p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-dark/5 rounded-full -mr-20 -mt-20"></div>
        <div className="w-full flex justify-between items-center mb-6 relative z-10">
            <button onClick={() => navigateSurah('prev')} disabled={surah.number === 1} className="p-3 rounded-full bg-gray-50 dark:bg-dark-blue hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition shadow-sm"><ChevronLeft size={24}/></button>
            <div className="text-center">
                <h1 className="font-arabic text-5xl text-emerald-dark dark:text-emerald-light mb-1">{surah.name}</h1>
                <h2 className="text-2xl font-bold text-emerald-dark dark:text-white">{surah.englishName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">{surah.englishNameTranslation}</p>
            </div>
            <button onClick={() => navigateSurah('next')} disabled={surah.number === 114} className="p-3 rounded-full bg-gray-50 dark:bg-dark-blue hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition shadow-sm"><ChevronRight size={24}/></button>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold text-emerald-dark/60 dark:text-emerald-light/60 bg-emerald-light/10 px-4 py-2 rounded-full relative z-10">
            <span>{surah.revelationType.toUpperCase()}</span>
            <div className="w-1 h-1 bg-emerald-dark/20 rounded-full"></div>
            <span>{surah.numberOfAyahs} AYAT</span>
        </div>
        
        {surah.number !== 9 && (
            <div className="mt-10 text-center relative z-10">
                 <p className="font-arabic text-4xl text-emerald-dark/80 dark:text-emerald-light/80">بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            </div>
        )}
      </div>
      
      <div className="sticky top-[72px] z-20 bg-soft-white/95 dark:bg-dark-blue/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-4">
          <button 
              onClick={() => setShowTranslation(!showTranslation)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
              {showTranslation ? <EyeOff size={16}/> : <Eye size={16}/>} Terjemahan
          </button>
          <button 
              onClick={() => setShowLatin(!showLatin)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showLatin ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
              {showLatin ? <EyeOff size={16}/> : <Eye size={16}/>} Latin
          </button>
          
          {showTranslation && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-inner">
                  <Languages size={14} className="text-emerald-dark dark:text-emerald-light"/>
                  <select 
                      value={selectedEdition} 
                      onChange={(e) => setSelectedEdition(e.target.value)} 
                      className="bg-transparent text-[11px] font-bold outline-none uppercase max-w-[100px]"
                  >
                      {editions.map(ed => (
                          <option key={ed.identifier} value={ed.identifier}>{ed.language.toUpperCase()} - {ed.name}</option>
                      ))}
                  </select>
              </div>
          )}
      </div>

      <div className="space-y-8">
        {surah.ayahs.map((ayah) => (
          <AyahView 
            key={ayah.number} 
            ayah={ayah} 
            surah={surah}
            showLatin={showLatin}
            showTranslation={showTranslation}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
