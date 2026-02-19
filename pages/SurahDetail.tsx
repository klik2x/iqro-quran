import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Share2, Loader2, 
  ZoomIn, ZoomOut, Copy, Check, Languages, Volume2, 
  ChevronLeft, ChevronRight, Bookmark, Download, Eye, EyeOff
} from 'lucide-react';
import { fetchSurahWithTranslation, fetchTranslationEditions } from '../services/quranService';
// FIX: Corrected import statement for generateSpeech
import { generateSpeech } from '../services/geminiService';
import ShareModal from '../components/ShareModal';
import { formatHonorifics } from '../utils/honorifics';
import { toArabicNumerals } from '../utils/arabicNumbers';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { ErrorMessage } from '../components/ui/Feedback'; // Import ErrorMessage

const SurahDetail: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(38);
  
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLang, setTranslationLang] = useState('id.indonesian');
  const [availableTranslations, setAvailableTranslations] = useState<any[]>([]);
  
  const [shareVerse, setShareVerse] = useState<any>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingTTS, setPlayingTTS] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { t } = useTranslation();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = async () => {
    if (!number) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSurahWithTranslation(parseInt(number), translationLang); 
      setData(res);
      if (availableTranslations.length === 0) {
        const editions = await fetchTranslationEditions();
        setAvailableTranslations(editions);
      }
    } catch (err: any) {
      console.error("Failed to load surah:", err);
      setError(err.message || t('failedToLoadSurahData' as TranslationKeys));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [number, translationLang, t]);

  const handlePlayAyah = (ayahNum: number) => {
    if (playingAyah === ayahNum) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    setPlayingAyah(ayahNum);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNum}.mp3`;
    const audio = audioRef.current || new Audio();
    audio.src = audioUrl;
    audio.play();
    audio.onended = () => setPlayingAyah(null);
    audioRef.current = audio;
  };

  const handleTTS = async (text: string, ayahNum: number) => {
    if (playingTTS === ayahNum) return;
    setPlayingTTS(ayahNum);
    try {
      const langName = availableTranslations.find(et => et.identifier === translationLang)?.language || 'Indonesian';
      const playback = await generateSpeech(text, langName, 'Kore', false); // Assuming translation is not Arabic
      const { controls } = playback.play();
      controls.onended = () => setPlayingTTS(null);
    } catch (e) {
      console.error("TTS failed:", e);
      setPlayingTTS(null);
    }
  };

  const copyAyah = (ayah: any, trans: string) => {
    const text = `${ayah.text}\n\n"${trans}"\n(QS. ${data[0].englishName}: ${ayah.numberInSurah})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
    navigator.clipboard.writeText(text);
    setCopiedId(ayah.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNativeShare = async (ayah: any, trans: string) => {
    const shareData = {
      title: t('iqroQuranDigital' as TranslationKeys),
      text: `${ayah.text}\n\n"${trans}"\n(QS. ${data[0].englishName}: ${ayah.numberInSurah})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      setShareVerse({ arabic: ayah.text, translation: trans, surah: data[0].englishName, ayah: ayah.numberInSurah });
    }
  };
  
  const handleDownload = () => {
    if (!data) return;

    const arabicEd = data[0];
    const translationEd = data[1];
    const transliterationEd = data[2];
    
    let content = `Surah ${arabicEd.englishName} (${arabicEd.name})\n`;
    content += `========================================\n\n`;

    arabicEd.ayahs.forEach((ayah: any, index: number) => {
        content += `[${ayah.numberInSurah}] ${ayah.text}\n`;
        if (transliterationEd?.ayahs[index]?.text) {
            content += `${transliterationEd.ayahs[index].text}\n`;
        }
        if (translationEd?.ayahs[index]?.text) {
            content += `"${translationEd.ayahs[index].text}"\n`;
        }
        content += `\n`;
    });
    
    content += `\n${t('downloadedFromIqroQuranDigital' as TranslationKeys)}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Surah_${arabicEd.number}_${arabicEd.englishName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-48 gap-8">
      <Loader2 className="animate-spin text-emerald-600" size={64} />
      <p className="text-slate-500 font-bold text-lg animate-pulse">{t('connectingToMushaf' as TranslationKeys)}...</p>
    </div>
  );

  if (error) return <div className="p-20 text-center"><ErrorMessage message={error} /></div>;

  const arabicEd = data[0];
  const translationEd = data[1];
  const transliterationEd = data[2];
  const surahNum = parseInt(number || '1');

  return (
    <div className="max-w-4xl mx-auto pb-48 px-4 sm:px-6">
      <div className="bg-white dark:bg-dark-blue-card rounded-3xl p-6 mb-8 shadow-md border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          {surahNum > 1 && (
            <button onClick={() => navigate(`/surah/${surahNum - 1}`)} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:scale-110 transition shadow-sm min-h-[44px] min-w-[44px]" aria-label={t('Previous Item' as TranslationKeys)}>
              <ChevronLeft size={28} />
            </button>
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          {surahNum < 114 && (
            <button onClick={() => navigate(`/surah/${surahNum + 1}`)} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:scale-110 transition shadow-sm min-h-[44px] min-w-[44px]" aria-label={t('Next Item' as TranslationKeys)}>
              <ChevronRight size={28} />
            </button>
          )}
        </div>
        
        <h1 className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light mb-1">{arabicEd.name}</h1>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{arabicEd.englishName}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
          {arabicEd.revelationType} • {arabicEd.numberOfAyahs} {t('ayahSuffix' as TranslationKeys)}
        </p>
      </div>

      <div className="sticky top-20 bg-white/90 dark:bg-dark-blue-card/90 backdrop-blur-md z-30 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-center gap-3 mb-10">
        <button 
          onClick={() => setShowLatin(!showLatin)}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase transition-all min-h-[44px] flex items-center gap-2 ${showLatin ? 'bg-gold-dark text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          aria-label={showLatin ? t('hideLatin' as TranslationKeys) : t('showLatin' as TranslationKeys)}
        >
          {showLatin ? <EyeOff size={14}/> : <Eye size={14}/>} {showLatin ? t('hideLatin' as TranslationKeys) : t('showLatin' as TranslationKeys)}
        </button>
        <button 
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase transition-all min-h-[44px] flex items-center gap-2 ${showTranslation ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          aria-label={showTranslation ? t('hideTranslation' as TranslationKeys) : t('showTranslation' as TranslationKeys)}
        >
          {showTranslation ? <EyeOff size={14}/> : <Eye size={14}/>} {showTranslation ? t('hideTranslation' as TranslationKeys) : t('showTranslation' as TranslationKeys)}
        </button>
        
        {showTranslation && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
             <Languages size={14} className="text-emerald-500" />
             <select 
                value={translationLang}
                onChange={(e) => setTranslationLang(e.target.value)}
                className="bg-transparent text-[11px] font-bold outline-none cursor-pointer max-w-[120px] min-h-[44px] px-2 py-1"
                aria-label={t('selectTranslationLanguage' as TranslationKeys)}
              >
                {availableTranslations.map(et => (
                  <option key={et.identifier} value={et.identifier}>{et.name} ({et.language})</option>
                ))}
              </select>
          </div>
        )}

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button onClick={() => setFontSize(Math.max(20, fontSize - 4))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px]" aria-label={t('decreaseFontSize' as TranslationKeys)}><ZoomOut size={14}/></button>
          <span className="text-[10px] font-black w-6 text-center">{fontSize}</span>
          <button onClick={() => setFontSize(Math.min(100, fontSize + 4))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px]" aria-label={t('increaseFontSize' as TranslationKeys)}><ZoomIn size={14}/></button>
          <button onClick={handleDownload} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px]" aria-label={t('downloadSurahContent' as TranslationKeys)}><Download size={14}/></button>
        </div>
      </div>

      {arabicEd.number !== 1 && arabicEd.number !== 9 && (
        <div className="text-center py-10 mb-12 border-y border-emerald-100 dark:border-emerald-900/30">
          <p className="font-arabic text-3xl text-slate-900 dark:text-white">بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      )}

      <div className="space-y-16">
        {arabicEd.ayahs.map((ayah: any, index: number) => {
          let verseText = ayah.text;
          if (index === 0 && arabicEd.number !== 1 && arabicEd.number !== 9) {
            const bismillahPrefix = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
            if (verseText.startsWith(bismillahPrefix)) {
              verseText = verseText.substring(bismillahPrefix.length).trim();
            }
          }

          const translationText = translationEd.ayahs[index]?.text || "";
          const formattedTranslation = formatHonorifics(translationText);
          const latinText = transliterationEd?.ayahs[index]?.text || "";
          const isBookmarkedAyah = isBookmarked(ayah.number);

          return (
            <div key={ayah.number} className={`group animate-fade-in p-2 rounded-xl transition-colors ${playingAyah === ayah.number ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
              <div className="flex flex-col gap-6">
                <div className="text-right">
                  <p 
                    className="font-arabic leading-[2.8]"
                    style={{ fontSize: `${fontSize}px` }}
                    dir="rtl"
                  >
                    {verseText}
                    <span className="ayah-circle" aria-label={`${t('ayahCircleLabel' as TranslationKeys)} ${ayah.numberInSurah}`}>
                      {toArabicNumerals(ayah.numberInSurah)}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  {showLatin && latinText && (
                    <div className="border-r-4 border-emerald-600/30 pr-4 mr-2 text-right">
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium italic text-lg leading-relaxed">{latinText}</p>
                    </div>
                  )}
                  {showTranslation && formattedTranslation && (
                    <div className="border-l-4 border-emerald-500/30 pl-4 ml-2">
                      <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed">
                        {formattedTranslation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-2">
                   <button
                        onClick={() => isBookmarkedAyah ? removeBookmark(ayah.number) : addBookmark(ayah, arabicEd)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${isBookmarkedAyah ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
                        aria-label={isBookmarkedAyah ? t('removeBookmark' as TranslationKeys) : t('addBookmark' as TranslationKeys)}
                    >
                        <Bookmark size={18} fill={isBookmarkedAyah ? 'currentColor' : 'none'} />
                    </button>
                  {showTranslation && (
                    <button 
                      onClick={() => handleTTS(translationText, ayah.number)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${playingTTS === ayah.number ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-purple-500'}`}
                      title={t('listenTranslation' as TranslationKeys)}
                      aria-label={t('listenTranslation' as TranslationKeys)}
                    >
                      <Volume2 size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handlePlayAyah(ayah.number)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${playingAyah === ayah.number ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500'}`}
                    aria-label={t('playAyahMurottal' as TranslationKeys)}
                  >
                    <Play size={18} fill={playingAyah === ayah.number ? "white" : "none"} />
                  </button>
                  <button 
                    onClick={() => copyAyah(ayah, formattedTranslation)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${copiedId === ayah.number ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
                    aria-label={t('copyAyah' as TranslationKeys)}
                  >
                    {copiedId === ayah.number ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={() => handleNativeShare(ayah, formattedTranslation)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm min-h-[44px] min-w-[44px]"
                    aria-label={t('shareAyah' as TranslationKeys)}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {shareVerse && (
        <ShareModal 
          isOpen={!!shareVerse} 
          onClose={() => setShareVerse(null)} 
          verse={shareVerse} 
        />
      )}
    </div>
  );
};

export default SurahDetail;