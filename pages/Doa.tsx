import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Share2, Copy, Check, Eye, EyeOff, Languages, Play, Loader2, Bookmark, ChevronDown } from 'lucide-react';
import { DOA_LIST } from '../constants';
import { fetchTranslationEditions } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';
import { useTranslation as useAppTranslation } from '../contexts/LanguageContext';
import { translateTexts } from '../services/geminiService';
import { Doa as DoaType } from '../types';

const DOA_BOOKMARKS_KEY = 'doa_bookmarks';

const Doa: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationLangName, setTranslationLangName] = useState('Indonesian');
  const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
  const [translatedDoas, setTranslatedDoas] = useState<DoaType[]>(DOA_LIST);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useAppTranslation();
  
  const [doaBookmarks, setDoaBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem(DOA_BOOKMARKS_KEY);
    if (savedBookmarks) {
      setDoaBookmarks(JSON.parse(savedBookmarks));
    }
    fetchTranslationEditions().then(setAvailableTranslations);
  }, []);

  const toggleBookmark = (doaId: string) => {
    const newBookmarks = doaBookmarks.includes(doaId)
      ? doaBookmarks.filter(id => id !== doaId)
      : [...doaBookmarks, doaId];
    setDoaBookmarks(newBookmarks);
    localStorage.setItem(DOA_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

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
    const text = `${doa.arabic}\n\n"${doa.translation}"\n(${doa.source})\n\nDibagikan via IQRO Quran Digital`;
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNativeShare = async (doa: DoaType) => {
    const shareData = {
      title: 'Doa - IQRO Quran Digital',
      text: `${doa.arabic}\n\n"${doa.translation}"\n(${doa.source})\n\nDibagikan via IQRO Quran Digital`,
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
      
      <div className="sticky top-[72px] bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-md z-10 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari doa..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-dark-blue border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-emerald-dark outline-none w-full font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-slate-50 dark:bg-dark-blue text-slate-500'}`}
          >
            {showTranslation ? <Eye size={14}/> : <EyeOff size={14}/>} Terjemahan
          </button>
          <button 
            onClick={() => setShowLatin(!showLatin)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${showLatin ? 'bg-gold-dark text-white' : 'bg-slate-50 dark:bg-dark-blue text-slate-500'}`}
          >
            {showLatin ? <Eye size={14}/> : <EyeOff size={14}/>} Latin
          </button>
           {showTranslation && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-dark-blue border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
             <Languages size={14} className="text-emerald-500" />
             <select 
                value={availableTranslations.find(t => t.language === translationLangName)?.identifier || ''}
                onChange={(e) => {
                    const selectedEdition = availableTranslations.find(t => t.identifier === e.target.value);
                    if (selectedEdition) {
                        setTranslationLangName(selectedEdition.language);
                    }
                }}
                className="bg-transparent text-[11px] font-bold outline-none cursor-pointer max-w-[120px]"
                aria-label="Pilih Bahasa Terjemahan"
              >
                 <option value="id.indonesian">Indonesia</option>
                {availableTranslations.map(et => (
                  <option key={et.identifier} value={et.identifier}>{et.name} ({et.language})</option>
                ))}
              </select>
          </div>
        )}
        </div>
      </div>

      <div className="space-y-3">
        {isTranslating ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin" size={32}/></div> : filteredDoa.map((doa) => (
          <details key={doa.id} className="group bg-white dark:bg-dark-blue-card rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 open:shadow-lg">
            <summary className="font-bold text-md cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-emerald-light p-5 hover:bg-slate-50 dark:hover:bg-dark-blue transition-colors">
              <span className="pr-4">{doa.title}</span>
              <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800">
                <p className="font-arabic text-2xl text-right my-6 leading-relaxed" dir="rtl">{doa.arabic}</p>
                <div className="space-y-3 mb-6">
                   {showLatin && <p className="text-emerald-600 dark:text-emerald-400 text-sm italic font-medium">{doa.latin}</p>}
                   {showTranslation && <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">"{formatHonorifics(doa.translation)}"</p>}
                   <p className="text-[10px] font-bold uppercase text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/50 inline-block">Sumber: {doa.source}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handlePlayAyah(doa.ayahNumber, doa.id)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm ${playingId === doa.id ? 'bg-emerald-dark text-white animate-pulse' : 'bg-slate-50 dark:bg-dark-blue text-slate-400 hover:text-emerald-dark'}`}
                  >
                    <Play size={16} fill={playingId === doa.id ? "white" : "none"} />
                  </button>
                   <button 
                    onClick={() => toggleBookmark(doa.id)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm ${doaBookmarks.includes(doa.id) ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-dark-blue text-slate-400 hover:text-blue-500'}`}
                  >
                    <Bookmark size={16} fill={doaBookmarks.includes(doa.id) ? "currentColor" : "none"}/>
                  </button>
                  <button 
                    onClick={() => handleCopy(doa)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm ${copiedId === doa.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-dark-blue text-slate-400 hover:text-blue-500'}`}
                  >
                    {copiedId === doa.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => handleNativeShare(doa)} className="p-2.5 bg-slate-50 dark:bg-dark-blue text-slate-400 rounded-xl hover:bg-emerald-dark hover:text-white transition shadow-sm">
                    <Share2 size={16} />
                  </button>
                </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Doa;
