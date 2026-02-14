
import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Share2, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, verse }) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'emerald' | 'dark' | 'amber'>('emerald');
  const [imgFontSize, setImgFontSize] = useState(32);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      setIsSaving(true);
      const canvas = await html2canvas(shareRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Iqro_Digital_${verse.surah}_${verse.ayah}.jpg`;
      link.click();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNativeShare = async () => {
    const text = `${verse.arabic}\n\n"${verse.translation}"\n(QS. ${verse.surah}: ${verse.ayah})\n\nShare via Iqro Quran Digital | by Te_eR™ Inovative`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Iqro Quran Digital',
          text: text,
          url: window.location.href
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Tautan disalin ke clipboard');
    }
  };

  const themes = {
    emerald: 'bg-[#036666] text-white',
    dark: 'bg-slate-950 text-white border-2 border-slate-800',
    amber: 'bg-[#FDFBF7] text-slate-900 border-2 border-amber-200'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-blue-card rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-xl text-emerald-dark dark:text-white">Bagikan Ayat</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl min-h-[44px] min-w-[44px]">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div ref={shareRef} className={`p-10 rounded-2xl mb-8 shadow-xl ${themes[theme]} text-center relative overflow-hidden`}>
            <p className="font-arabic mb-8 leading-[2.5]" style={{ fontSize: `${imgFontSize}px`, color: theme === 'amber' ? '#036666' : 'white' }} dir="rtl">
              {verse.arabic}
            </p>
            <p className="text-base font-bold italic mb-8 opacity-90">"{verse.translation}"</p>
            <div className="flex flex-col items-center gap-2 mt-auto">
              <p className="text-[10px] font-black uppercase tracking-widest">QS. {verse.surah}: {verse.ayah}</p>
              <div className="h-[1px] bg-current opacity-20 w-24"></div>
              <p className="text-[9px] font-bold opacity-60">Share via Iqro Quran Digital | by Te_eR™ Inovative</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
                  <button key={t} onClick={() => setTheme(t)} className={`w-8 h-8 rounded-full border-2 transition-all ${theme === t ? 'border-emerald-500 scale-110' : 'border-transparent'} ${themes[t].split(' ')[0]} min-h-[44px] min-w-[44px]`} aria-label={`Pilih tema ${t}`}/>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button onClick={() => setImgFontSize(Math.max(20, imgFontSize - 4))} className="p-1.5 rounded-lg min-h-[44px] min-w-[44px]" aria-label="Perkecil Font"><ZoomOut size={14}/></button>
                 <span className="w-6 text-center font-black text-xs">{imgFontSize}</span>
                 <button onClick={() => setImgFontSize(Math.min(60, imgFontSize + 4))} className="p-1.5 rounded-lg min-h-[44px] min-w-[44px]" aria-label="Perbesar Font"><ZoomIn size={14}/></button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownload} disabled={isSaving} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-sm min-h-[44px]">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} Simpan
              </button>
              <button onClick={handleNativeShare} className="flex-1 bg-gold-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md text-sm min-h-[44px]">
                <Share2 size={18} /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
