
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader2, Info } from 'lucide-react';
import { fetchTafsir } from '../services/quranService';
import { formatHonorifics } from '../utils/honorifics';

const TafsirModule: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!number) return;
      try {
        setLoading(true);
        const res = await fetchTafsir(parseInt(number));
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [number]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-48 gap-8">
      <Loader2 className="animate-spin text-emerald-600" size={64} />
      <p className="text-slate-500 font-black text-xl animate-pulse">Memuat Tafsir Al-Jalalayn...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-48 px-4">
      <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 p-8 border-b-2 border-slate-100 dark:border-slate-800 flex items-center gap-6 mb-12 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-md group">
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="font-black text-3xl tracking-tight text-slate-950 dark:text-white">Tafsir {data.englishName}</h1>
          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em] mt-1">Kitab Tafsir Al-Jalalayn</p>
        </div>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 p-8 rounded-[2.5rem] mb-12 flex gap-5 text-blue-900 dark:text-blue-300 shadow-inner">
        <div className="w-12 h-12 bg-white dark:bg-blue-900/50 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-800">
          <Info size={24} className="text-blue-600" />
        </div>
        <p className="text-base font-bold leading-relaxed">Tafsir memberikan penjelasan mendalam tentang makna setiap ayat Al-Quran berdasarkan pemahaman para ulama ahli tafsir untuk mempermudah pemahaman kita.</p>
      </div>

      <div className="space-y-10">
        {data.ayahs.map((ayah: any) => (
          <div key={ayah.number} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-xl border-2 border-slate-50 dark:border-slate-800 group hover:border-emerald-500 transition-all duration-500">
             <div className="flex items-center gap-3 mb-8">
                <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 uppercase tracking-widest">AYAT {ayah.numberInSurah}</span>
             </div>
             {/* Rule 9: Honorifics applied here */}
             <p className="text-slate-900 dark:text-slate-100 leading-relaxed text-2xl font-bold tracking-tight">
                {formatHonorifics(ayah.text)}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TafsirModule;
