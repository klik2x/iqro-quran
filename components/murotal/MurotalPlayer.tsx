// components/murotal/MurotalPlayer.tsx
import React, { useState, useRef } from 'react';
import { Ayah, Qari } from '../../types';
import { getAudioUrl } from '../../services/quranService';

interface MurotalPlayerProps {
  ayah: Ayah;
  selectedQari: Qari;
}

const MurotalPlayer: React.FC<MurotalPlayerProps> = ({ ayah, selectedQari }) => {
  const [tikrar, setTikrar] = useState<number>(1);
  const [currentPlay, setCurrentPlay] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnded = () => {
    if (currentPlay < tikrar) {
      setCurrentPlay(prev => prev + 1);
      audioRef.current?.play();
    } else {
      setCurrentPlay(1);
    }
  };

  return (
    <div className="p-6 border-l-4 border-blue-600 bg-slate-50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Info Qari & Ayah (A11y: Contrast & Large Text) */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-800">{selectedQari.englishName}</h3>
          <p className="text-lg text-slate-600">Ayat ke-{ayah.numberInSurah}</p>
        </div>

        {/* Kontrol Tikrar (Metode Pengulangan) */}
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="tikrar-select" className="font-semibold text-slate-700">Ulangi (Tikrar):</label>
          <select 
            id="tikrar-select"
            value={tikrar}
            onChange={(e) => setTikrar(Number(e.target.value))}
            className="w-32 p-3 text-xl font-bold border-2 border-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200"
            aria-label="Pilih jumlah pengulangan untuk hafalan"
          >
            {[1, 3, 5, 10, 40].map(val => (
              <option key={val} value={val}>{val}x</option>
            ))}
          </select>
        </div>

        {/* Audio Element */}
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <audio 
            ref={audioRef}
            src={getAudioUrl(ayah, selectedQari.identifier)}
            onEnded={handleEnded}
            controls
            className="w-full md:w-80 h-14"
            aria-label={`Audio murotal oleh ${selectedQari.englishName}`}
          />
          {tikrar > 1 && (
            <span className="text-blue-700 font-bold animate-pulse">
              Memutar ke-{currentPlay} dari {tikrar}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
