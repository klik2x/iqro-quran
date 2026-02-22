
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
      } catch (e) { console.warn("Share failed", e); }
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
          {/* Capture Area - Hidden from UI but used for html2canvas */}
          <div className="fixed left-[-9999px] top-0">
            <div 
              ref={shareRef} 
              className={`w-[600px] min-h-[800px] p-12 flex flex-col items-center justify-center text-center relative ${themes[theme]}`}
              style={{ borderRadius: '0px' }} // No border radius for the raw image capture to avoid artifacts
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full gap-10">
                <p 
                  className="font-arabic leading-[1.8] w-full px-4" 
                  style={{ 
                    fontSize: `${imgFontSize * 1.5}px`, 
                    color: theme === 'amber' ? '#036666' : 'white',
                    wordWrap: 'break-word'
                  }} 
                  dir="rtl"
                >
                  {verse.arabic}
                </p>
                
                <div className="w-16 h-1 bg-current opacity-20 rounded-full"></div>
                
                <p 
                  className="text-2xl font-bold italic opacity-90 w-full px-8 leading-relaxed"
                  style={{ color: theme === 'amber' ? '#1e293b' : 'white' }}
                >
                  "{verse.translation}"
                </p>
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-lg font-black uppercase tracking-[0.2em] opacity-80">QS. {verse.surah}: {verse.ayah}</p>
                <div className="h-[2px] bg-current opacity-20 w-32"></div>
                <p className="text-sm font-bold opacity-60">Share via Iqro Quran Digital | by Te_eR™ Inovative</p>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className={`p-8 rounded-2xl mb-8 shadow-xl ${themes[theme]} text-center relative overflow-hidden aspect-[3/4] flex flex-col items-center justify-center`}>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-hidden">
              <p className="font-arabic leading-relaxed line-clamp-6" style={{ fontSize: `${imgFontSize}px`, color: theme === 'amber' ? '#036666' : 'white' }} dir="rtl">
                {verse.arabic}
              </p>
              <p className="text-sm font-bold italic opacity-90 line-clamp-4">"{verse.translation}"</p>
            </div>
            <div className="flex flex-col items-center gap-1 mt-4 shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest">QS. {verse.surah}: {verse.ayah}</p>
              <div className="h-[1px] bg-current opacity-20 w-20"></div>
              <p className="text-[8px] font-bold opacity-60">Share via Iqro Quran Digital</p>
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
