import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, List, Layers, BookUp } from 'lucide-react';
import { Surah } from '../types';
import { fetchAllSurahs } from '../services/quranService';
import { useTranslation } from '../contexts/LanguageContext';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { analyzeVoiceWithAI } from '../services/vocalStudioService';

const Mushaf: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { triggerTick, triggerSuccess } = useAudioFeedback();
  const { isListening, startListening } = useVoiceSearch((transcript) => {
    // Navigasi Otomatis berdasarkan transkripsi
    const foundSurah = surahs.find(s => 

 transcript.toLowerCase().includes(s.englishName.toLowerCase())
    );
    
    if (foundSurah) {
      triggerSuccess();
      navigate(`/surah/${foundSurah.number}`);
    }
  });

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          placeholder="Cari Surah..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:border-emerald-500 outline-none"
        />
      </div>
      
      {/* Tombol Mikrofon dengan Haptic Feedback */}
      <button 
        onClick={() => { triggerTick(); startListening(); }}
        className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-lg 
          ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
      >
        <Mic size={24} />
      </button>
    </div>
  );
};
      
     
  useEffect(() => {
    fetchAllSurahs().then(setSurahs).finally(() => setLoading(false));
  }, []);

  const cleanSearch = search.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const filteredSurahs = surahs.filter(s => {
    const cleanEnglishName = s.englishName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    return cleanEnglishName.includes(cleanSearch) || 
           s.name.includes(search) || // Direct match for Arabic
           s.number.toString().includes(search);
  });

  const handleJump = () => {
    const surahNum = prompt('Masukkan nomor surah (1-114):');
    if (surahNum) {
        const num = parseInt(surahNum, 10);
        if (!isNaN(num) && num >= 1 && num <= 114) {
            navigate(`/surah/${num}`);
        } else {
            alert('Nomor surah tidak valid.');
        }
    }
  };

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
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-emerald-dark dark:text-emerald-light">
          Daftar Surah
        </h2>
      </div>

      <div className="sticky top-[72px] bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-xl z-20 py-2 space-y-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t('searchSurah')}
                className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full focus:ring-4 focus:ring-emerald-500/10 outline-none w-full shadow-sm font-bold transition-all text-slate-900 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={handleJump} className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full shadow-sm text-emerald-dark dark:text-emerald-light" aria-label="Lompat ke Surah">
                <BookUp size={20} />
            </button>
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
                 onClick={() => navigate(`/juz/${juz}`)}
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

export default Mushaf;
