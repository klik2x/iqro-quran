import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, List, Layers, ChevronRight } from 'lucide-react';
import { Surah } from '../types';
// FIX: Corrected import from `fetchSurahs` to `fetchAllSurahs` as exported from quranService.
import { fetchAllSurahs } from '../services/quranService';

const SurahList: React.FC<{t: any}> = ({ t }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const navigate = useNavigate();

  useEffect(() => {
    // FIX: Used the correctly imported function `fetchAllSurahs`.
    fetchAllSurahs().then(setSurahs).finally(() => setLoading(false));
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.name.includes(search) ||
    s.number.toString().includes(search)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <Loader2 className="animate-spin text-emerald-600" size={60} />
        <p className="text-slate-500 font-black text-xl animate-pulse">Menghubungkan ke Mushaf...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4">
      {/* Header Title - Point 2 */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-emerald-dark dark:text-emerald-light">
          Daftar Surah
        </h2>
      </div>

      {/* Control Bar - Point 3 */}
      <div className="sticky top-[72px] bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-xl z-20 py-2 space-y-4 border-b border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t.searchSurah}
            className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full focus:ring-4 focus:ring-emerald-500/10 outline-none w-full shadow-sm font-bold transition-all text-slate-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setViewMode('surah')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-black transition-all ${viewMode === 'surah' ? 'bg-emerald-dark text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <List size={18}/> Surah
           </button>
           <button 
             onClick={() => setViewMode('juz')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-black transition-all ${viewMode === 'juz' ? 'bg-emerald-dark text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <Layers size={18}/> Juz
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
                className="flex items-center gap-4 p-4 bg-white dark:bg-dark-blue-card rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all text-left shadow-sm group"
              >
                <div className="w-10 h-10 bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white rounded-xl flex items-center justify-center font-bold shrink-0">
                  {surah.number}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-emerald-dark dark:text-white truncate">{surah.englishName}</h3>
                  <p className="text-xs text-slate-400 truncate">{surah.revelationType} • {surah.numberOfAyahs} Ayat</p>
                </div>
                <div className="text-right">
                  <span className="font-arabic text-2xl text-emerald-dark dark:text-emerald-light">{surah.name}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
             {Array.from({length: 30}, (_, i) => i + 1).map(juz => (
               <button 
                 key={juz}
                 className="p-6 bg-white dark:bg-dark-blue-card rounded-2xl border border-slate-100 dark:border-slate-800 text-center hover:border-emerald-500 transition-all shadow-sm active:scale-95"
               >
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Juz</p>
                  <span className="text-2xl font-bold text-emerald-dark dark:text-white">{juz}</span>
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;