
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Play, Bookmark, Share2, Loader2, 
  Eye, EyeOff, ZoomIn, ZoomOut, Copy, Check, Languages, Volume2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { fetchSurahWithTranslation, fetchTranslationEditions } from '../services/quranService';
import { generateSpeech } from '../services/geminiService';
import ShareModal from './ShareModal';
import { formatHonorifics } from '../utils/honorifics';
import { toArabicNumerals } from '../utils/arabicNumbers';

interface ReaderProps {
  appLang: string;
  t: any;
}

const SurahReader: React.FC<ReaderProps> = ({ appLang, t }) => {
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = async () => {
    if (!number) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSurahWithTranslation(parseInt(number), translationLang); 
      setData(res);
      const editions = await fetchTranslationEditions();
      setAvailableTranslations(editions);
    } catch (err: any) {
      console.error("Failed to load surah:", err);
      setError(err.message || "Gagal memuat data surah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [number, translationLang]);

  const handlePlayAyah = (ayahNum: number) => {
    if (playingAyah === ayahNum) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    setPlayingAyah(ayahNum);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNum}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAyah(null);
      audio.play();
      audioRef.current = audio;
    }
  };

  const handleTTS = async (text: string, ayahNum: number) => {
    if (playingTTS === ayahNum) {
      setPlayingTTS(null);
      return;
    }
    setPlayingTTS(ayahNum);
    try {
      const langHint = availableTranslations.find(et => et.identifier === translationLang)?.language || 'Indonesian';
      // FIX: Call .play() on the AudioPlayback object to get controls
      const playback = await generateSpeech(text, langHint, 'Kore');
      const { controls } = playback.play();
      controls.onended = () => setPlayingTTS(null);
    } catch (e) {
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
      title: 'Iqro Quran Digital',
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-48 gap-8">
      <Loader2 className="animate-spin text-emerald-600" size={64} />
      <p className="text-slate-500 font-bold text-lg animate-pulse">Menghubungkan ke Mushaf...</p>
    </div>
  );

  if (error || !data) return <div className="p-20 text-center text-red-500">{error}</div>;

  const arabicEd = data[0];
  const translationEd = data[1];
  const transliterationEd = data[2];
  const surahNum = parseInt(number || '1');

  // Logic to determine if Bismillah header should be shown
  const showBismillahHeader = arabicEd.number !== 9;

  return (
    <div className="max-w-4xl mx-auto pb-48 px-4 sm:px-6">
      {/* Surah Title Card */}
      <div className="bg-white dark:bg-dark-blue-card rounded-3xl p-6 mb-8 shadow-md border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          {surahNum > 1 && (
            <button onClick={() => navigate(`/surah/${surahNum - 1}`)} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:scale-110 transition shadow-sm min-h-[44px] min-w-[44px]" aria-label="Surah Sebelumnya">
              <ChevronLeft size={28} />
            </button>
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          {surahNum < 114 && (
            <button onClick={() => navigate(`/surah/${surahNum + 1}`)} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:scale-110 transition shadow-sm min-h-[44px] min-w-[44px]" aria-label="Surah Berikutnya">
              <ChevronRight size={28} />
            </button>
          )}
        </div>
        
        <h1 className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light mb-1">{arabicEd.name}</h1>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{arabicEd.englishName}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
          {arabicEd.revelationType} • {arabicEd.numberOfAyahs} Ayat
        </p>
      </div>

      {/* Control Bar */}
      <div className="sticky top-20 bg-white/90 dark:bg-dark-blue-card/90 backdrop-blur-md z-30 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-center gap-3 mb-10">
        <button 
          onClick={() => setShowLatin(!showLatin)}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all min-h-[44px] ${showLatin ? 'bg-gold-dark text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          aria-label={showLatin ? "Sembunyikan Latin" : "Tampilkan Latin"}
        >
          Latin: {showLatin ? 'ON' : 'OFF'}
        </button>
        <button 
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition-all min-h-[44px] ${showTranslation ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          aria-label={showTranslation ? "Sembunyikan Terjemahan" : "Tampilkan Terjemahan"}
        >
          Terjemahan: {showTranslation ? 'ON' : 'OFF'}
        </button>
        
        {showTranslation && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
             <Languages size={14} className="text-emerald-500" />
             <select 
                value={translationLang}
                onChange={(e) => setTranslationLang(e.target.value)}
                className="bg-transparent text-[11px] font-bold outline-none cursor-pointer max-w-[120px] min-h-[44px] px-2 py-1"
                aria-label="Pilih Bahasa Terjemahan"
              >
                {availableTranslations.map(et => (
                  <option key={et.identifier} value={et.identifier}>{et.name} ({et.language})</option>
                ))}
              </select>
          </div>
        )}

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button onClick={() => setFontSize(Math.max(20, fontSize - 4))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px]" aria-label="Perkecil Font"><ZoomOut size={14}/></button>
          <span className="text-[10px] font-black w-6 text-center">{fontSize}</span>
          <button onClick={() => setFontSize(Math.min(100, fontSize + 4))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px]" aria-label="Perbesar Font"><ZoomIn size={14}/></button>
        </div>
      </div>

      {/* Header Bismillah - Display only here */}
      {showBismillahHeader && (
        <div className="text-center py-10 mb-12 border-y border-emerald-100 dark:border-emerald-900/30">
          <p className="font-arabic text-3xl text-slate-900 dark:text-white">بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-16">
        {arabicEd.ayahs.map((ayah: any, index: number) => {
          let verseText = ayah.text;
          
          // logic to strip Bismillah prefix from Ayah 1 (except Fatihah)
          if (index === 0 && arabicEd.number !== 1) {
            const bismillahPrefix = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
            if (verseText.startsWith(bismillahPrefix)) {
              verseText = verseText.substring(bismillahPrefix.length).trim();
            }
          }

          const translationText = translationEd.ayahs[index]?.text || "";
          const formattedTranslation = formatHonorifics(translationText);
          const latinText = transliterationEd?.ayahs[index]?.text || "";

          return (
            <div key={ayah.number} className="group animate-fade-in">
              <div className="flex flex-col gap-6">
                <div className="text-right">
                  <p 
                    className="font-arabic leading-[2.8]"
                    style={{ fontSize: `${fontSize}px` }}
                    dir="rtl"
                  >
                    {verseText}
                    <span className="ayah-circle">
                      {toArabicNumerals(ayah.numberInSurah)}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  {showLatin && latinText && (
                    <div className="border-r-4 border-gold-dark/30 pr-4 mr-2 text-right">
                      <p className="text-gold-dark font-medium italic text-lg leading-relaxed">{latinText}</p>
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
                    onClick={() => handleTTS(translationText, ayah.number)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${playingTTS === ayah.number ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-purple-500'}`}
                    title="Dengarkan Terjemahan (AI TTS)"
                    aria-label="Dengarkan Terjemahan"
                  >
                    <Volume2 size={18} />
                  </button>
                  <button 
                    onClick={() => handlePlayAyah(ayah.number)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${playingAyah === ayah.number ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500'}`}
                    aria-label="Putar Murottal Ayat"
                  >
                    <Play size={18} fill={playingAyah === ayah.number ? "white" : "none"} />
                  </button>
                  <button 
                    onClick={() => copyAyah(ayah, formattedTranslation)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm min-h-[44px] min-w-[44px] ${copiedId === ayah.number ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500'}`}
                    aria-label="Salin Ayat"
                  >
                    {copiedId === ayah.number ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={() => handleNativeShare(ayah, formattedTranslation)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm min-h-[44px] min-w-[44px]"
                    aria-label="Bagikan Ayat"
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

export default SurahReader;
