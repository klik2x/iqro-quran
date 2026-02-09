import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Share2, Copy, Check, Eye, EyeOff, Languages, Play, Loader2 } from 'lucide-react';
import { DOA_LIST } from '../constants';
import { fetchTranslationEditions } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';
import { useTranslation as useAppTranslation } from '../contexts/LanguageContext';
import { translateTexts } from '../services/geminiService';
import { Doa as DoaType } from '../types';

const Doa: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLangName, setTranslationLangName] = useState('Indonesian');
  const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
  const [translatedDoas, setTranslatedDoas] = useState<DoaType[]>(DOA_LIST);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useAppTranslation();

  useEffect(() => {
    fetchTranslationEditions().then(setAvailableTranslations);
  }, []);

  const translateDoas = useCallback(async (langName: string) => {
    if (langName === 'Indonesian') {
      setTranslatedDoas(DOA_LIST);
      return;
    }
    setIsTranslating(true);
    try {
      const textsToTranslate = DOA_LIST.reduce((acc, doa) => {
        acc[doa.id] = doa.translation;
        return acc;
      }, {} as Record<string, string>);
      
      const translations = await translateTexts(textsToTranslate, langName);
      
      const newTranslatedDoas = DOA_LIST.map(doa => ({
        ...doa,
        translation: translations[doa.id] || doa.translation,
      }));
      setTranslatedDoas(newTranslatedDoas);
    } catch (error) {
      console.error("Failed to translate prayers", error);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    translateDoas(translationLangName);
  }, [translationLangName, translateDoas]);


  const filteredDoa = translatedDoas.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.translation.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (doa: DoaType) => {
    const text = `${doa.arabic}\n\n"${doa.translation}"\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNativeShare = async (doa: DoaType) => {
    const shareData = {
      title: 'Doa - Iqro Quran Digital',
      text: `${doa.arabic}\n\n"${doa.translation}"\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      handleCopy(doa);
    }
  };
  
  const handlePlayAyah = (ayahNum: number, doaId: string) => {
    if (playingId === doaId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    setPlayingId(doaId);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNum}.mp3`;
    const audio = audioRef.current || new Audio();
    audio.src = audioUrl;
    audio.play();
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('doaTitle')}</h1>
      
      <div className="sticky top-20 bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-md z-10 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari doa..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none w-full font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-700 flex-shrink min-w-0">
              <Languages size={14} className="text-emerald-500 flex-shrink-0" />
              <select 
                value={translationLangName}
                onChange={(e) => setTranslationLangName(e.target.value)}
                className="bg-transparent text-[11px] font-bold outline-none cursor-pointer w-full"
              >
                <option value="Indonesian">Indonesian</option>
                {availableTranslations.filter(e => e.language.toLowerCase() !== 'indonesian').map(et => (
                  <option key={et.identifier} value={et.language}>{et.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isTranslating ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin" size={32}/></div> : filteredDoa.map((doa) => (
          <div key={doa.id} className="bg-white dark:bg-dark-blue-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
            <h3 className="font-bold text-lg text-emerald-dark dark:text-emerald-light mb-4">{doa.title}</h3>
            <p className="font-arabic text-2xl text-right mb-6 leading-relaxed" dir="rtl">{doa.arabic}</p>
            <div className="space-y-3 mb-10">
               {showLatin && <p className="text-emerald-600 dark:text-emerald-400 text-sm italic font-medium">{doa.latin}</p>}
               {showTranslation && <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">"{formatHonorifics(doa.translation)}"</p>}
               <p className="text-[10px] font-bold uppercase text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800 inline-block">Sumber: {doa.source}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => handlePlayAyah(doa.ayahNumber, doa.id)}
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

export default Doa;
