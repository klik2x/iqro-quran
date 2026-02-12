// components/murotal/AudioController.tsx (New File)
import React, { useState, useRef, useEffect } from 'react';
import { Ayah, Qari } from '../../types';
import { QARI_LIST } from '../../data/qariData';
import { Play, RotateCcw, Volume2, Users } from 'lucide-react';

interface AudioControllerProps {
  ayah: Ayah;
}

const AudioController: React.FC<AudioControllerProps> = ({ ayah }) => {
  const [selectedQari, setSelectedQari] = useState<Qari>(QARI_LIST[1]); // Default Al-Hussary
  const [loopCount, setLoopCount] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => audioRef.current?.play();

  const onEnded = () => {
    if (currentLoop < loopCount) {
      setCurrentLoop(prev => prev + 1);
      audioRef.current?.play();
    } else {
      setCurrentLoop(1);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-gold shadow-inner mt-4">
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Pilih Qari */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm">
          <Users className="text-emerald-600" />
          <select 
            className="bg-transparent font-bold text-sm outline-none"
            value={selectedQari.identifier}
            onChange={(e) => {
              const qari = QARI_LIST.find(q => q.identifier === e.target.value);
              if (qari) setSelectedQari(qari);
            }}
          >
            {QARI_LIST.map(q => <option key={q.identifier} value={q.identifier}>{q.englishName}</option>)}
          </select>
        </div>

        {/* Pilih Tikrar */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm">
          <RotateCcw className="text-orange-500" />
          <span className="text-sm font-bold">Ulang:</span>
          <select 
            className="bg-transparent font-bold outline-none"
            value={loopCount}
            onChange={(e) => setLoopCount(Number(e.target.value))}
          >
            {[1, 3, 7, 10, 40].map(n => <option key={n} value={n}>{n}x</option>)}
          </select>
        </div>

        {/* Audio Player Core */}
        <div className="flex-1 min-w-[200px]">
          <audio 
            ref={audioRef}
            onEnded={onEnded}
            src={`https://cdn.islamic.network/quran/audio/128/${selectedQari.identifier}/${ayah.number}.mp3`}
            className="w-full"
            controls
          />
        </div>

        {currentLoop > 1 && (
          <div className="bg-gold/20 text-gold-dark px-4 py-1 rounded-full font-bold animate-pulse">
            Loop: {currentLoop} / {loopCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioController;
