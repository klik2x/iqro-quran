
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Bookmark, Share2, BookOpen, Loader2, Eye, EyeOff, ZoomIn, ZoomOut, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchJuz } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';

const JuzReader: React.FC<{t: any}> = ({ t }) => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(42);
  const [showLatin, setShowLatin] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = async () => {
    if (!number) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchJuz(parseInt(number));
      setData(res);
    } catch (err: any) {
      console.error("Failed to load juz:", err);
      setError(err.message || "Failed to load Juz data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [number]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-48 gap-8">
      <Loader2 className="animate-spin text-emerald-600" size={64} />
      <p className="text-slate-500 font-black text-xl animate-pulse">Loading Juz {number}...</p>
    </div>
  );

  if (error || !data || !Array.isArray(data) || data.length < 2) return (
    <div className="flex flex-col items-center justify-center h-full py-48 gap-8 px-6 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600">
        <AlertCircle size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Failed to Load Juz {number}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">{error || "Internet connection issue."}</p>
      </div>
      <button onClick={() => navigate('/mushaf')} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">Back</button>
    </div>
  );

  const arabicAyahs = data[0].ayahs;
  const translationAyahs = data[1].ayahs;
  const transliterationAyahs = data[2]?.ayahs || [];

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

  return (
    <div className="max-w-4xl mx-auto pb-48 px-4 sm:px-6">
      <div className="sticky top-0 bg-white/95 dark:bg-[#0b1121]/95 backdrop-blur-md z-40 py-8 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-8 mb-16 shadow-2xl rounded-b-[2.5rem]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('/mushaf')} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-md group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="font-black text-3xl text-slate-950 dark:text-white tracking-tight">Juz {number}</h1>
              <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mt-1">Digital Mushaf</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mr-24 md:mr-32">
             <button 
              onClick={() => setShowLatin(!showLatin)} 
              className={`p-4 rounded-2xl transition-all shadow-md ${showLatin ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
            >
               {showLatin ? <Eye size={22}/> : <EyeOff size={22}/>}
            </button>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 shadow-inner">
              <button onClick={() => setFontSize(Math.max(20, fontSize - 4))} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:bg-emerald-500 hover:text-white transition-all"><ZoomOut size={16}/></button>
              <button onClick={() => setFontSize(Math.min(80, fontSize + 4))} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:bg-emerald-500 hover:text-white transition-all"><ZoomIn size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-32">
        {arabicAyahs.map((ayah: any, index: number) => (
          <div key={ayah.number} className="group animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col gap-10">
              <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      {ayah.numberInSurah}
                    </div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                       Surah {ayah.surah.englishName}
                    </div>
                    <button 
                      onClick={() => handlePlayAyah(ayah.number)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${playingAyah === ayah.number ? 'bg-amber-500 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'}`}
                    >
                       <Play size={20} fill="currentColor" />
                    </button>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const translationText = translationAyahs[index] ? translationAyahs[index].text : "";
                        const text = `${ayah.text}\n\n"${formatHonorifics(translationText)}"\n(QS. ${ayah.surah.englishName}: ${ayah.numberInSurah})`;
                        navigator.clipboard.writeText(text);
                        setCopiedId(ayah.number);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className={`p-3 rounded-xl transition-all ${copiedId === ayah.number ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
                    >
                      {copiedId === ayah.number ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                 </div>
              </div>

              <div className="text-right">
                <p 
                  className="font-quran leading-[2.8] font-bold"
                  style={{ fontSize: `${fontSize}px` }}
                  dir="rtl"
                >
                  {ayah.text}
                </p>
              </div>

              {showLatin && transliterationAyahs[index] && (
                 <div className="text-right border-r-4 border-emerald-500/30 pr-6 mr-2">
                   <p className="latin-reading text-lg leading-relaxed">
                      {transliterationAyahs[index].text}
                   </p>
                 </div>
              )}

              <div className="border-l-8 border-emerald-500/10 pl-10 py-6 rounded-r-3xl bg-emerald-50/10 dark:bg-transparent">
                 <p className="text-slate-900 dark:text-slate-200 text-xl font-bold leading-relaxed">
                    {translationAyahs[index] ? formatHonorifics(translationAyahs[index].text) : ""}
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JuzReader;
