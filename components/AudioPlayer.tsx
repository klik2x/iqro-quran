
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Loader2, ListMusic } from 'lucide-react';
import { QARIS } from '../constants';
import { fetchSurahs } from '../services/quranService';
import { Surah } from '../types';

const AudioPlayer: React.FC<{t: any}> = ({ t }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedQari, setSelectedQari] = useState(QARIS[0].identifier);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs().then(setSurahs).finally(() => setLoading(false));
  }, []);

  const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${selectedQari}/${selectedSurah}.mp3`;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-6">
      <Loader2 className="animate-spin text-emerald-600" size={50} />
      <p className="text-slate-500 font-black text-xl animate-pulse">Preparing Audio...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 px-4">
      <div className="text-center md:text-left">
        <h1 className="text-5xl font-black mb-3 tracking-tighter text-slate-950 dark:text-white">Quran Murottal</h1>
        <p className="text-slate-500 text-lg font-medium">Listen to holy verses from the world's best Qaris in crystal clear quality.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-16 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border-4 border-slate-50 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-56 h-56 bg-emerald-700 rounded-[3rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden group border-4 border-white/20">
            <Music size={100} className="opacity-10 absolute scale-150" />
            <div className="relative z-10 text-center">
              <span className="block text-5xl font-black mb-2">QS</span>
              <div className="h-1.5 w-16 bg-white/40 rounded-full mx-auto mb-3"></div>
              <span className="text-4xl font-black">{selectedSurah}</span>
            </div>
          </div>

          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2 block">Select Qari</label>
                <select 
                  value={selectedQari}
                  onChange={(e) => setSelectedQari(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-slate-950 dark:text-white shadow-inner transition-all"
                >
                  {QARIS.map(q => <option key={q.identifier} value={q.identifier}>{q.name}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2 block">Select Surah</label>
                <select 
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(parseInt(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-slate-950 dark:text-white shadow-inner transition-all"
                >
                  {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-8">
               <div className="flex items-center justify-center gap-10">
                  <button className="p-4 text-slate-400 dark:text-slate-600 hover:text-emerald-600 transition-all hover:scale-110 active:scale-90">
                    <SkipBack size={32} />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-24 h-24 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.4)] transition-all hover:scale-110 active:scale-90 group"
                  >
                    {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2 group-hover:scale-110 transition-transform" />}
                  </button>
                  <button className="p-4 text-slate-400 dark:text-slate-600 hover:text-emerald-600 transition-all hover:scale-110 active:scale-90">
                    <SkipForward size={32} />
                  </button>
               </div>

               {isPlaying && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
                  <div className="flex gap-1.5 h-6 items-end">
                    {[0.6, 0.4, 0.8, 0.3, 0.9, 0.5, 0.7, 0.4].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-2 bg-emerald-500 rounded-full animate-bounce" 
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-widest">Playing Audio...</p>
                  <audio 
                    autoPlay 
                    src={audioUrl} 
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[3rem] p-10 border-2 border-emerald-100 dark:border-emerald-800 shadow-xl">
         <h3 className="text-2xl font-black flex items-center gap-3 text-emerald-900 dark:text-emerald-400 mb-8 tracking-tight">
            <ListMusic size={28} />
            Popular Playlist
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 18, 36, 67, 114, 55].map(num => (
               <button 
                 key={num}
                 onClick={() => setSelectedSurah(num)}
                 className={`flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl transition-all group active:scale-95 border-2 ${selectedSurah === num ? 'border-emerald-500 shadow-xl' : 'border-transparent shadow-md hover:border-emerald-200 dark:hover:border-emerald-900'}`}
               >
                 <div className="flex flex-col items-start">
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Surah {num}</span>
                    <span className="text-lg font-black text-slate-950 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {surahs.find(s => s.number === num)?.englishName || `Surah ${num}`}
                    </span>
                 </div>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedSurah === num ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-emerald-600 group-hover:bg-emerald-100'}`}>
                    <Play size={20} fill={selectedSurah === num ? "white" : "none"} />
                 </div>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
