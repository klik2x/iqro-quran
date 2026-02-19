
import React, { useCallback, useRef, useState } from 'react';
import { useIqroBookmarks, IqroBookmark } from '../../hooks/useIqroBookmarks';
import { BookmarkX as NoBookmarkIcon, BookmarkMinus, Play, Pause, Loader2 } from 'lucide-react';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { speakText, AudioPlaybackControls } from '../../services/geminiService';

interface BookmarksViewProps {
    onNavigate: (level: number) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ onNavigate }) => {
    const { bookmarks, toggleBookmark } = useIqroBookmarks();
    const { t } = useTranslation();

    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const currentAudioPlaybackRef = useRef<AudioPlaybackControls | null>(null);

    const handlePlayAudio = useCallback(async (char: string, latin: string, id: string) => {
        if (loadingAudio) return;
        
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            if (playingAudio === id) {
                setPlayingAudio(null);
                currentAudioPlaybackRef.current = null;
                return;
            }
        }

        setLoadingAudio(id);
        try {
            // ALWAYS use Web Speech API for Iqro bookmark audio
            const playback = await speakText(char, 'Kore', 'Arabic', true, undefined, true); // isIqroContent: true
            
            const controls = playback.play();
            currentAudioPlaybackRef.current = controls;

            setPlayingAudio(id);
            controls.controls.onended = () => {
                setPlayingAudio(null); 
                currentAudioPlaybackRef.current = null;
            };
        } catch (error) {
            console.error("Error generating speech for bookmark:", error);
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio]);


    if (bookmarks.length === 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
                <NoBookmarkIcon size={48} className="mb-2"/>
                {/* FIX: Use TranslationKeys type for t() calls */}
                <h3 className="font-semibold text-lg">{t('noBookmarksIqro' as TranslationKeys)}</h3>
                {/* FIX: Use TranslationKeys type for t() calls */}
                <p className="text-sm">{t('bookmarkInstructionIqro' as TranslationKeys)}</p>
            </div>
        );
    }

    // Group bookmarks by level
    const groupedBookmarks = bookmarks.reduce((acc: Record<number, IqroBookmark[]>, item) => {
        (acc[item.level] = acc[item.level] || []).push(item);
        return acc;
    }, {} as Record<number, IqroBookmark[]>);


    return (
        <div className="space-y-4">
            {Object.entries(groupedBookmarks).sort(([a], [b]) => Number(a) - Number(b)).map(([level, items]) => (
                <div key={level}>
                    <h3 
                        className="font-bold text-lg mb-2 text-emerald-dark dark:text-white cursor-pointer"
                        onClick={() => onNavigate(Number(level))}
                    >
                       {/* FIX: Use TranslationKeys type for t() calls */}
                       {t('iqroLevel' as TranslationKeys)} {level}
                    </h3>
                    <div className="space-y-2">
                        {(items as IqroBookmark[]).map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-dark-blue p-3 rounded-lg flex justify-between items-center group">
                                <div onClick={() => onNavigate(item.level)} className="cursor-pointer flex-grow">
                                    <p className="font-semibold flex items-center gap-2">
                                        <span className="font-arabic text-2xl">{item.char}</span>
                                        <span>{item.latin}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.sectionTitle}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePlayAudio(item.char, item.latin, item.id)}
                                        className={`p-2 rounded-full transition-all min-h-[44px] min-w-[44px] ${
                                            playingAudio === item.id ? 'bg-emerald-600 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                        aria-label={`Bunyikan ${item.char} dibaca ${item.latin}`}
                                    >
                                        {loadingAudio === item.id ? <Loader2 size={18} className="animate-spin" /> : (playingAudio === item.id ? <Pause size={18} /> : <Play size={18} />)}
                                    </button>
                                    <button 
                                        onClick={() => toggleBookmark(item)} 
                                        className="p-2 text-gray-400 group-hover:text-red-500 transition-colors rounded-full"
                                        aria-label={t('Hapus bookmark untuk' as TranslationKeys) + ` ${item.latin}`}
                                    >
                                        <BookmarkMinus size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookmarksView;
