import React, { useState, useEffect } from 'react';
import { Search, Share2, Copy, Check, Eye, EyeOff, Languages, Play, Volume2 } from 'lucide-react';
import { DOA_LIST } from '../constants';
import { fetchTranslationEditions } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';

const DoaModule: React.FC<{t: any}> = ({ t }) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLang, setTranslationLang] = useState('id.indonesian');
  const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTranslationEditions().then(setAvailableTranslations);
  }, []);

  const filteredDoa = DOA_LIST.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.translation.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (doa: any) => {
    const text = `${doa.arabic}\n\n${doa.translation}\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNativeShare = async (doa: any) => {
    const shareData = {
      title: 'Doa - Iqro Quran Digital',
      text: `${doa.arabic}\n\n${doa.translation}\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      handleCopy(doa);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-emerald-dark dark:text-white">Kumpulan Doa dalam Al-Qur'an</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari doa..."
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 font-bold text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-dark-blue-card rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${showTranslation ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
        >
          {showTranslation ? <Eye size={14}/> : <EyeOff size={14}/>} Terjemahan
        </button>
        <button 
          onClick={() => setShowLatin(!showLatin)}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${showLatin ? 'bg-gold-dark text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
        >
          {showLatin ? <Eye size={14}/> : <EyeOff size={14}/>} Latin
        </button>
        
        {showTranslation && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <Languages size={14} className="text-emerald-500" />
            <select 
              value={translationLang}
              onChange={(e) => setTranslationLang(e.target.value)}
              className="bg-transparent text-[11px] font-bold outline-none cursor-pointer"
            >
              {availableTranslations.map(et => (
                <option key={et.identifier} value={et.identifier}>{et.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredDoa.map((doa) => (
          <div key={doa.id} className="bg-white dark:bg-dark-blue-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
            <h3 className="font-bold text-lg text-emerald-dark dark:text-emerald-light mb-4">{doa.title}</h3>
            <p className="font-arabic text-2xl text-right mb-6 leading-relaxed" dir="rtl">{doa.arabic}</p>
            <div className="space-y-3 mb-10">
               {showLatin && <p className="text-gold-dark text-sm italic font-medium">{doa.latin}</p>}
               {showTranslation && <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">"{formatHonorifics(doa.translation)}"</p>}
               <p className="text-[10px] font-bold uppercase text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800 inline-block">Sumber: {doa.source}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => { setPlayingId(doa.id); setTimeout(() => setPlayingId(null), 3000); }}
                className={`p-2.5 rounded-xl transition-all shadow-sm ${playingId === doa.id ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500'}`}
              >
                <Play size={16} fill={playingId === doa.id ? "white" : "none"} />
              </button>
              <button 
                onClick={() => handleCopy(doa)}
                className={`p-2.5 rounded-xl transition-all shadow-sm ${copiedId === doa.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
              >
                {copiedId === doa.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button onClick={() => handleNativeShare(doa)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoaModule;