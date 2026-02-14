import React, { useState, useEffect, useRef } from 'react';
import { useBookmarks, BookmarkedAyah } from '../contexts/BookmarkContext';
import { BookOpenCheck, Play, Copy, Share2, Eye, EyeOff, Languages, Check, Loader2 } from 'lucide-react';
import { useTranslation as useAppTranslation } from '../contexts/LanguageContext';
import { fetchTranslationEditions, fetchSurahWithTranslation } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';

const Bookmarks: React.FC = () => {
    const { bookmarks } = useBookmarks();
    const { t } = useAppTranslation();
    const [showLatin, setShowLatin] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [translationLang, setTranslationLang] = useState('id.indonesian');
    const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [translatedBookmarks, setTranslatedBookmarks] = useState<BookmarkedAyah[]>(bookmarks);
    const [isTranslating, setIsTranslating] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchTranslationEditions().then(setAvailableTranslations);
    }, []);

    useEffect(() => {
        const translateBookmarks = async () => {
            if (translationLang === 'id.indonesian') {
                const originalBookmarks = bookmarks.map(bm => {
                    const original = bookmarks.find(orig => orig.number === bm.number);
                    return { ...bm, translation: original?.translation || bm.translation };
                });
                setTranslatedBookmarks(originalBookmarks);
                return;
            }
            if (bookmarks.length === 0) return;

            setIsTranslating(true);
            try {
                const updatedBookmarks = await Promise.all(bookmarks.map(async (bookmark) => {
                    const surahData = await fetchSurahWithTranslation(bookmark.surahNumber, translationLang);
                    const newTranslationAyah = surahData[1].ayahs.find((a: any) => a.numberInSurah === bookmark.numberInSurah);
                    return { ...bookmark, translation: newTranslationAyah?.text || bookmark.translation };
                }));
                setTranslatedBookmarks(updatedBookmarks);
            } catch (error) {
                console.error("Error translating bookmarks:", error);
                setTranslatedBookmarks(bookmarks);
            } finally {
                setIsTranslating(false);
            }
        };

        translateBookmarks();
    }, [translationLang, bookmarks]);

    const handleNativeShare = async (ayah: BookmarkedAyah) => {
      const shareData = {
        title: 'Iqro Quran Digital - Bookmark',
        text: `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${ayah.surahName}: ${ayah.numberInSurah})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        navigator.clipboard.writeText(shareData.text);
        setCopiedId(ayah.number);
        setTimeout(() => setCopiedId(null), 2000);
      }
    };

    const handleCopy = (ayah: BookmarkedAyah) => {
        const text = `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${ayah.surahName}: ${ayah.numberInSurah})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
        navigator.clipboard.writeText(text);
        setCopiedId(ayah.number);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handlePlay = (ayah: BookmarkedAyah) => {
        if (playingId === ayah.number) {
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }
        setPlayingId(ayah.number);
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
        const audio = audioRef.current || new Audio();
        audio.src = audioUrl;
        audio.play();
        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-emerald-dark dark:text-white">Bookmark Ayat</h1>

            <div className="sticky top-20 bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-md z-10 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
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
                    value={translationLang}
                    onChange={(e) => setTranslationLang(e.target.value)}
                    className="bg-transparent text-[11px] font-bold outline-none cursor-pointer w-full"
                    disabled={isTranslating}
                  >
                    {availableTranslations.map(et => (
                      <option key={et.identifier} value={et.identifier}>{et.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {isTranslating ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin" size={32}/></div> :
            bookmarks.length > 0 ? (
                <div className="space-y-6">
                    {translatedBookmarks.map(ayah => (
                        <div key={ayah.number} className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <a href={`#/surah/${ayah.surahNumber}`} className="text-xs font-black bg-emerald-light/20 text-emerald-dark dark:text-emerald-light px-3 py-1 rounded-full hover:bg-emerald-600 hover:text-white transition">
                                    {ayah.surahName} ({ayah.surahNumber}:{ayah.numberInSurah})
                                </a>
                            </div>
                            <p className="text-right font-arabic text-2xl text-slate-900 dark:text-white leading-relaxed mb-6">{ayah.text}</p>
                            <div className="space-y-3 mb-10">
                                {showLatin && <p className="text-emerald-600 dark:text-emerald-400 text-sm italic">{ayah.textLatin}</p>}
                                {showTranslation && <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">"{formatHonorifics(ayah.translation)}"</p>}
                            </div>
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                              <button onClick={() => handlePlay(ayah)} className={`p-2.5 rounded-xl transition shadow-sm ${playingId === ayah.number ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                <Play size={16} fill={playingId === ayah.number ? "white" : "none"} />
                              </button>
                              <button 
                                onClick={() => handleCopy(ayah)}
                                className={`p-2.5 rounded-xl transition shadow-sm ${copiedId === ayah.number ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
                              >
                                {copiedId === ayah.number ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                              <button onClick={() => handleNativeShare(ayah)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm">
                                <Share2 size={16} />
                              </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-dark-blue-card rounded-2xl border border-slate-100 dark:border-slate-800">
                    <BookOpenCheck className="h-12 w-12 text-slate-300 mb-4" />
                    <h2 className="text-lg font-bold text-slate-700 dark:text-gray-300">{t('noBookmarks')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('noBookmarksMessage')}</p>
                </div>
            )}
        </div>
    );
};

export default Bookmarks;