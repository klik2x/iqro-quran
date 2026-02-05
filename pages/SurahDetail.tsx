
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSurah } from '../services/quranApi';
import { SurahDetail as SurahDetailType, Ayah, Surah } from '../types';
import { Play, Copy, Bookmark, Share2 } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useTranslation } from '../contexts/LanguageContext';
import html2canvas from 'html2canvas';

const SurahDetail: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const [surah, setSurah] = useState<SurahDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ayahToShare, setAyahToShare] = useState<Ayah | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSurah = async () => {
      if (!number) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSurah(parseInt(number, 10));
        setSurah(data);
      } catch (err) {
        setError('Gagal memuat surah.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSurah();

    return () => {
        if (audio) {
            audio.pause();
        }
    }
  }, [number]);

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  const playAudio = (ayahKey: string, audioUrl: string) => {
    if (audio && playingAyah === ayahKey) {
      audio.pause();
      setPlayingAyah(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      setPlayingAyah(ayahKey);
      newAudio.play();
      newAudio.onended = () => setPlayingAyah(null);
      newAudio.onerror = () => {
        setPlayingAyah(null);
        alert("Gagal memutar audio.");
      }
    }
  };

  const handleShare = (ayah: Ayah) => {
    setAyahToShare(ayah);
    setShowShareModal(true);
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!surah) return null;

  const showBismillah = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md text-center">
        <h1 className="font-arabic text-4xl text-emerald-dark dark:text-emerald-light">{surah.name}</h1>
        <h2 className="text-2xl font-bold text-emerald-dark dark:text-white">{surah.englishName}</h2>
        <p className="text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {surah.revelationType} - {surah.numberOfAyahs} Ayat
        </p>
      </div>
      
      <div className="sticky top-[80px] z-10 flex justify-center py-2 px-4">
        <div className="bg-white/80 dark:bg-dark-blue-card/80 backdrop-blur-md rounded-full shadow-md">
            <button
                onClick={() => setShowLatin(!showLatin)}
                aria-pressed={showLatin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-dark dark:text-emerald-light rounded-full hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition"
            >
                <span className="font-bold text-lg leading-none">A</span>
                <span>{showLatin ? t('hideLatin') : t('showLatin')}</span>
            </button>
        </div>
      </div>


      {showBismillah && (
        <div className="text-center py-4">
            <p className="font-arabic text-3xl text-emerald-dark dark:text-emerald-light">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        </div>
      )}

      <div className="space-y-8">
        {surah.ayahs.map(ayah => (
          <AyahView 
            key={ayah.number} 
            ayah={ayah} 
            surah={surah}
            onPlay={() => playAudio(`${surah.number}:${ayah.numberInSurah}`, ayah.audio)} 
            isPlaying={playingAyah === `${surah.number}:${ayah.numberInSurah}`}
            showLatin={showLatin}
            onShare={() => handleShare(ayah)}
          />
        ))}
      </div>
       {showShareModal && ayahToShare && (
        <ShareModal 
            ayah={ayahToShare} 
            surah={surah}
            onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

interface AyahViewProps {
  ayah: Ayah;
  surah: Surah;
  onPlay: () => void;
  isPlaying: boolean;
  showLatin: boolean;
  onShare: () => void;
}

const AyahView: React.FC<AyahViewProps> = ({ ayah, surah, onPlay, isPlaying, showLatin, onShare }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(ayah.number);

  const handleBookmark = () => {
      if (bookmarked) {
          removeBookmark(ayah.number);
      } else {
          addBookmark(ayah, surah);
      }
  };

  const copyToClipboard = () => {
      const text = `${ayah.text}\n\n${ayah.translation}\n(QS. ${surah.number}:${ayah.numberInSurah})`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Ayat disalin!');
      });
  };

  return (
    <div className="bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white px-3 py-1 rounded-full">{surah.number}:{ayah.numberInSurah}</span>
            <div className="flex items-center space-x-1 sm:space-x-2">
                <button aria-label="Bagikan ayat" onClick={onShare} className="p-2.5 text-gray-500 hover:text-emerald-dark dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Share2 size={20} /></button>
                <button aria-label="Salin ayat" onClick={copyToClipboard} className="p-2.5 text-gray-500 hover:text-emerald-dark dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Copy size={20} /></button>
                <button aria-label={bookmarked ? 'Hapus dari bookmark' : 'Tambahkan ke bookmark'} onClick={handleBookmark} className={`p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${bookmarked ? 'text-gold-dark' : 'text-gray-500 hover:text-emerald-dark dark:hover:text-white'}`}>
                    <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
                <button aria-label={isPlaying ? 'Jeda audio' : 'Putar audio'} onClick={onPlay} className={`p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isPlaying ? 'text-gold-dark' : 'text-gray-500 hover:text-emerald-dark dark:hover:text-white'}`}><Play size={20} /></button>
            </div>
        </div>
        <p className="text-right font-arabic text-3xl md:text-4xl text-gray-800 dark:text-white leading-relaxed mb-4">{ayah.text}</p>
        {showLatin && <p className="text-sm text-emerald-dark dark:text-emerald-light italic mb-2">{ayah.textLatin}</p>}
        <p className="text-gray-700 dark:text-gray-300">{ayah.translation}</p>
    </div>
  );
};

interface ShareModalProps {
    ayah: Ayah;
    surah: SurahDetailType;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ ayah, surah, onClose }) => {
    const [fontSize, setFontSize] = useState(32);
    const shareCardRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const downloadImage = () => {
        if (shareCardRef.current) {
            html2canvas(shareCardRef.current, { scale: 2, backgroundColor: 'transparent' }).then(canvas => {
                const link = document.createElement('a');
                link.download = `IQRO_${surah.englishName}_${ayah.numberInSurah}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-soft-white dark:bg-dark-blue w-full max-w-md rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-center">{t('shareAyah')}</h3>
                <div ref={shareCardRef} className="p-6 bg-gradient-to-br from-emerald-dark to-emerald-light dark:from-dark-blue dark:to-black text-white rounded-xl">
                    <p className="text-right" style={{ fontFamily: 'Amiri, serif', fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
                        {ayah.text}
                    </p>
                    <p className="mt-4 text-sm text-center">"{ayah.translation}"</p>
                    <p className="text-xs text-center mt-2 opacity-70">(QS. {surah.englishName}: {ayah.numberInSurah})</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="font-size-slider" className="text-sm font-medium">{t('arabicFontSize')}</label>
                    <input 
                        id="font-size-slider"
                        type="range" 
                        min="20" 
                        max="60" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>
                <button 
                    onClick={downloadImage}
                    className="w-full bg-emerald-dark hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    {t('downloadImage')}
                </button>
                 <button 
                    onClick={onClose}
                    className="w-full bg-gray-200 dark:bg-dark-blue-card hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg transition"
                >
                    {t('close')}
                </button>
            </div>
        </div>
    );
};


export default SurahDetail;
