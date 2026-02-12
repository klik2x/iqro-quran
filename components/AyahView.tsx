
import React, { useState, useRef, useEffect } from 'react';
import { Surah, Ayah } from '../types';
import { Play, Copy, Bookmark, Share2, Volume2, Loader2, Pause, X, Download } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';
import { generateSpeech } from '../services/geminiService';
import html2canvas from 'html2canvas';
import { useQuran } from '../contexts/QuranContext';

// Helper to convert numbers to Arabic numerals
const toArabicNumber = (n: number) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(n).split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
};

interface AyahViewProps {
  ayah: Ayah;
  surah: Surah;
  showLatin: boolean;
  showTranslation: boolean;
  onAudioStart?: () => void;
}

const AyahView: React.FC<AyahViewProps> = ({ ayah, surah, showLatin, showTranslation, onAudioStart }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { selectedEdition, editions, playingAyah, setPlayingAyah } = useQuran();
  const [recitationAudio, setRecitationAudio] = useState<HTMLAudioElement | null>(null);
  
  // Highlight state derived from context
  const isPlayingNow = playingAyah?.surahNumber === surah.number && playingAyah?.ayahNumber === ayah.numberInSurah;
  const isPlayingRecitation = isPlayingNow;

  const [isPlayingTranslation, setIsPlayingTranslation] = useState(false);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const translationAudioController = useRef<AudioBufferSourceNode | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);

  const bookmarked = isBookmarked(ayah.number);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(ayah.number);
    } else {
      addBookmark(ayah, surah);
    }
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    const watermark = "Share via Iqro Quran Digital | by Te_eR™ Inovative | https://s.id/iqro-quran";
    const text = `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${surah.englishName}: ${ayah.numberInSurah})\n\n${watermark}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Ayat disalin!');
    });
  };

  const playRecitation = () => {
    if (recitationAudio && isPlayingRecitation) {
        recitationAudio.pause();
        setPlayingAyah(null);
        return;
    }

    if (onAudioStart) onAudioStart();

    const newAudio = new Audio(ayah.audio);
    setRecitationAudio(newAudio);
    newAudio.play().catch(e => {
        console.error(e);
        alert("Gagal memutar audio tilawah.");
    });
    
    setPlayingAyah({
        surahNumber: surah.number,
        ayahNumber: ayah.numberInSurah,
        audioUrl: ayah.audio
    });

    newAudio.onended = () => {
        setPlayingAyah(null);
    };
    newAudio.onpause = () => {
        setPlayingAyah(null);
    };
  };

  const playTranslation = async () => {
    if (isLoadingTranslation) return;
    if (isPlayingTranslation) {
        translationAudioController.current?.stop();
        setIsPlayingTranslation(false);
        return;
    }

    setIsLoadingTranslation(true);
    try {
        const edition = editions.find(e => e.identifier === selectedEdition);
        const languageName = edition ? edition.language : 'Indonesian';
        
        const { sourceNode, controls } = await generateSpeech(ayah.translation, languageName);
        translationAudioController.current = sourceNode;
        setIsPlayingTranslation(true);
        controls.onended = () => setIsPlayingTranslation(false);
    } catch (error) {
        alert("Gagal membacakan terjemahan.");
    } finally {
        setIsLoadingTranslation(false);
    }
  };

  return (
    <>
    <div className={`p-5 rounded-2xl shadow-sm border transition-all relative ${isPlayingNow ? 'bg-emerald-light/10 border-emerald-dark ring-2 ring-emerald-dark/20' : 'bg-white dark:bg-dark-blue-card border-gray-100 dark:border-gray-800 hover:shadow-md'}`}>
        <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider ${isPlayingNow ? 'bg-emerald-dark text-white' : 'bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white'}`}>
                {surah.englishName} {ayah.numberInSurah}
            </span>
            <div className="flex items-center space-x-1 bg-gray-50/50 dark:bg-black/20 p-1 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner">
                <button aria-label={isPlayingRecitation ? 'Jeda tilawah' : 'Putar tilawah'} onClick={playRecitation} className={`p-2 rounded-full transition ${isPlayingRecitation ? 'text-emerald-dark animate-pulse' : 'text-gray-400 hover:text-emerald-dark'}`}>
                    {isPlayingRecitation ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
                </button>
                <button aria-label="Salin ayat" onClick={copyToClipboard} className="p-2 text-gray-400 hover:text-emerald-dark rounded-full transition"><Copy size={18} /></button>
                <button aria-label="Bagikan ayat" onClick={handleShare} className="p-2 text-gray-400 hover:text-emerald-dark rounded-full transition"><Share2 size={18} /></button>
                <button aria-label={bookmarked ? 'Hapus dari bookmark' : 'Tambahkan ke bookmark'} onClick={handleBookmark} className={`p-2 rounded-full transition ${bookmarked ? 'text-gold-dark' : 'text-gray-400 hover:text-gold-dark'}`}>
                    <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
            </div>
        </div>

        <div className="space-y-6">
            <p className="text-right font-arabic text-3xl md:text-4xl text-gray-800 dark:text-white leading-[2.2]" dir="rtl">
                {ayah.text}
                <span className={`inline-flex items-center justify-center w-8 h-8 font-sans text-xs font-bold border-2 rounded-full mx-2 align-middle ${isPlayingNow ? 'border-emerald-dark text-emerald-dark' : 'border-emerald-dark/40 dark:border-emerald-light/40'}`}>{toArabicNumber(ayah.numberInSurah)}</span>
            </p>
            {showLatin && (
                <div className="p-3 bg-emerald-light/5 dark:bg-emerald-dark/10 rounded-xl border-l-4 border-emerald-dark">
                    <p className="text-sm text-emerald-dark dark:text-emerald-light italic font-medium">{ayah.textLatin}</p>
                </div>
            )}
            {showTranslation && (
                 <div className="flex items-start gap-3 pt-2">
                    <button 
                        onClick={playTranslation} 
                        disabled={isLoadingTranslation}
                        className="mt-0.5 flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-emerald-dark dark:hover:text-white rounded-full transition shadow-sm border border-gray-100 dark:border-gray-700"
                        aria-label="Dengarkan terjemahan"
                    >
                        {isLoadingTranslation ? <Loader2 className="animate-spin" size={16}/> : (isPlayingTranslation ? <Pause size={16}/> : <Volume2 size={16}/>)}
                    </button>
                    <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{ayah.translation}</p>
                 </div>
            )}
        </div>
    </div>
    {showShareModal && (
        <ShareModal 
            ayah={ayah} 
            surah={surah}
            onClose={() => setShowShareModal(false)} 
        />
      )}
    </>
  );
};

interface ShareModalProps {
    ayah: Ayah;
    surah: Surah;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ ayah, surah, onClose }) => {
    const [fontSize, setFontSize] = useState(28);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const downloadImage = () => {
        if (shareCardRef.current) {
            html2canvas(shareCardRef.current, { scale: 3, backgroundColor: null, windowWidth: 450 }).then(canvas => {
                const link = document.createElement('a');
                link.download = `IQRO_${surah.englishName}_${ayah.numberInSurah}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    const handleNativeShare = async () => {
        const watermark = "Share via Iqro Quran Digital | by Te_eR™ Inovative | https://s.id/iqro-quran";
        const shareText = `${ayah.text}\n\n"${ayah.translation}"\n(QS. ${surah.englishName}: ${ayah.numberInSurah})\n\n${watermark}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `QS. ${surah.englishName}: ${ayah.numberInSurah}`,
                    text: shareText,
                });
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    navigator.clipboard.writeText(shareText);
                    alert('Gagal membagikan. Teks disalin ke clipboard.');
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Fitur bagi tidak didukung di browser ini. Teks disalin ke clipboard!');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-soft-white dark:bg-dark-blue w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">Pratinjau Gambar</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"><X size={20}/></button>
                </div>
                
                <div ref={shareCardRef} className="p-6 bg-emerald-dark text-white rounded-2xl shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10 space-y-6">
                        <p className="text-right" style={{ fontFamily: 'Amiri, serif', fontSize: `${fontSize}px`, lineHeight: 1.6 }} dir="rtl">
                            {ayah.text}
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-center leading-relaxed">"{ayah.translation}"</p>
                            <p className="text-[10px] text-center font-bold tracking-widest opacity-80">(QS. {surah.englishName}: {ayah.numberInSurah})</p>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-1 items-center">
                            <p className="text-[8px] opacity-60">Share via Iqro Quran Digital | by Te_eR™ Inovative</p>
                            <p className="text-[8px] opacity-60">https://s.id/iqro-quran</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                        <span>Ukuran Font Arab</span>
                        <span>{fontSize}px</span>
                    </div>
                    <input 
                        type="range" 
                        min="18" 
                        max="48" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-dark"
                    />
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                    <button 
                        onClick={downloadImage}
                        className="w-full bg-emerald-dark hover:bg-emerald-dark/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <Download size={18} /> Unduh Gambar
                    </button>
                    <button 
                        onClick={handleNativeShare}
                        className="w-full bg-gray-100 dark:bg-dark-blue-card hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3.5 rounded-xl transition"
                    >
                        Bagikan Teks
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AyahView;
