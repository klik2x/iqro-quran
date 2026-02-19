
import React, { useState, useEffect, useRef } from 'react';
import { Search, Share2, Copy, Check, Eye, EyeOff, Languages, Play, Volume2, ChevronDown } from 'lucide-react';
import { DOA_LIST } from '../constants';
import { fetchTranslationEditions } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext'; // NEW: Import TranslationKeys
import { generateSpeech } from '../services/geminiService'; // Import generateSpeech

const DoaModule: React.FC = () => { // Removed t prop, will use useTranslation hook directly
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLang, setTranslationLang] = useState('id.indonesian');
  const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // For playing original audio if available

  useEffect(() => {
    fetchTranslationEditions().then(setAvailableTranslations);
  }, []);

  const filteredDoa = DOA_LIST.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.translation.toLowerCase().includes(search.toLowerCase()) ||
    d.arabic.includes(search) // Also search in Arabic
  );

  const handleCopy = (doa: any) => {
    const text = `${doa.arabic}\n\n${doa.translation}\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNativeShare = async (doa: any) => {
    const shareData = {
      title: t('doaTitle' as TranslationKeys) + ' - ' + doa.title,
      text: `${doa.arabic}\n\n${doa.translation}\n(${doa.source})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      handleCopy(doa);
    }
  };

  const handlePlayDoa = async (doa: any) => {
    if (playingId === doa.id) {
        // Stop current playback
        if (audioRef.current) audioRef.current.pause();
        setPlayingId(null);
        return;
    }

    setPlayingId(doa.id);

    try {
        // First, try playing Arabic text
        const arabicPlayback = await generateSpeech(doa.arabic, 'Arabic', 'Kore', true);
        const arabicControls = arabicPlayback.play();
        
        arabicControls.controls.onended = async () => {
            // After Arabic, if translation is shown, play translation
            if (showTranslation) {
                const langName = availableTranslations.find(et => et.identifier === translationLang)?.language || 'Indonesian';
                const translationPlayback = await generateSpeech(doa.translation, langName, 'Kore', false); // Translation is not Arabic
                const translationControls = translationPlayback.play();
                translationControls.controls.onended = () => setPlayingId(null);
            } else {
                setPlayingId(null);
            }
        };
    } catch (error) {
        console.error("Error playing doa audio:", error);
        alert(t('failedToPlayAudio' as TranslationKeys));
        setPlayingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-emerald-dark dark:text-white">{t('doaTitle' as TranslationKeys)}</h1>
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t('searchDoa' as TranslationKeys)}
                className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full focus:ring-4 focus:ring-emerald-500/10 outline-none w-full shadow-sm font-bold transition-all text-slate-900 dark:text-white min-h-[44px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('searchDoa' as TranslationKeys)}
              />
            </div>
            <button 
              onClick={() => setShowLatin(!showLatin)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase transition-all min-h-[44px] min-w-[44px] ${showLatin ? 'bg-gold-dark text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              aria-label={showLatin ? t('hideLatin' as TranslationKeys) : t('showLatin' as TranslationKeys)}
            >
              Latin: {showLatin ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase transition-all min-h-[44px] min-w-[44px] ${showTranslation ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              aria-label={showTranslation ? t('hideTranslation' as TranslationKeys) : t('showTranslation' as TranslationKeys)}
            >
              Terjemahan: {showTranslation ? 'ON' : 'OFF'}
            </button>
        </div>
      </div>

      {showTranslation && (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink min-w-0 mb-6">
          <Languages size={14} className="text-emerald-500 flex-shrink-0" />
          <select 
            value={translationLang}
            onChange={(e) => setTranslationLang(e.target.value)}
            className="bg-transparent text-[11px] font-bold outline-none cursor-pointer w-full min-h-[44px] px-2 py-1"
            aria-label={t('selectTranslationLanguage' as TranslationKeys)}
          >
            {availableTranslations.map(et => (
              <option key={et.identifier} value={et.identifier}>{et.name} ({et.language})</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-6">
        {filteredDoa.length > 0 ? (
          filteredDoa.map(doa => (
            <details 
              key={doa.id} 
              className="group bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-300 open:ring-2 open:ring-emerald-500/20"
            >
              <summary className="list-none cursor-pointer flex justify-between items-start font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors mb-4 min-h-[44px]">
                <h2 className="flex-grow text-left pr-4">{doa.title}</h2>
                <span className="text-xs font-black bg-emerald-light/20 text-emerald-dark dark:text-emerald-light px-3 py-1 rounded-full shrink-0">{doa.source}</span>
                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform ml-2 shrink-0" size={20} />
              </summary>
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-right font-arabic text-2xl text-slate-900 dark:text-white leading-relaxed mb-6" dir="rtl">{doa.arabic}</p>
                    <div className="space-y-3 mb-4">
                        {showLatin && <p className="text-emerald-600 dark:text-emerald-400 text-sm italic">{doa.latin}</p>}
                        {showTranslation && <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">"{formatHonorifics(doa.translation)}"</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => handlePlayDoa(doa)} 
                        className={`p-2.5 rounded-xl transition shadow-sm min-h-[44px] min-w-[44px] ${playingId === doa.id ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        aria-label={`${t('playDoa' as TranslationKeys)} ${doa.title}`}
                      >
                        <Play size={16} fill={playingId === doa.id ? "white" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleCopy(doa)}
                        className={`p-2.5 rounded-xl transition shadow-sm min-h-[44px] min-w-[44px] ${copiedId === doa.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
                        aria-label={`${t('copyDoa' as TranslationKeys)} ${doa.title}`}
                      >
                        {copiedId === doa.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button 
                        onClick={() => handleNativeShare(doa)} 
                        className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm min-h-[44px] min-w-[44px]"
                        aria-label={`${t('shareDoa' as TranslationKeys)} ${doa.title}`}
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                </div>
            </details>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p>Tidak ada doa yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoaModule;
    