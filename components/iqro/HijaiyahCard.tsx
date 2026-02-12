
import React from 'react';
import { Loader2, Bookmark, CheckCircle2 } from 'lucide-react';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useIqroBookmarks, IqroBookmark } from '../../hooks/useIqroBookmarks';

interface HijaiyahCardProps {
    id: string;
    item: { char: string; latin: string };
    level: number;
    sectionTitle: string;
    isLoading: boolean;
    isPlaying: boolean;
    onPlay: () => void; // Ini adalah prop onPlay asli
    isLarge?: boolean;
}

export const HijaiyahCard: React.FC<HijaiyahCardProps> = ({
    id,
    item,
    level,
    sectionTitle,
    isLoading,
    isPlaying,
    onPlay, // Gunakan prop onPlay asli
    isLarge = false
}) => {
    const { progress } = useIqroProgress();
    const { isBookmarked, toggleBookmark } = useIqroBookmarks();

    const bookmarked = isBookmarked(id);
    const isCompleted = progress[id];

    const handleToggleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah onPlay dari kartu terpicu
        const bookmarkItem: IqroBookmark = {
            id,
            level,
            sectionTitle,
            char: item.char,
            latin: item.latin
        };
        toggleBookmark(bookmarkItem);
    };

    const cardSizeClasses = isLarge
        ? "p-4 min-h-[200px]"
        : "aspect-square";
    const arabicTextSize = isLarge ? "text-7xl sm:text-8xl" : "text-4xl";
    const latinTextSize = isLarge ? "text-md mt-2" : "text-xs mt-2";


    return (
        <div className="relative group">
            <button
                onClick={onPlay} // Panggil prop onPlay asli secara langsung
                disabled={isLoading}
                aria-label={`Bunyikan ${item.latin}`}
                className={`w-full flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-blue-card
                    ${isCompleted ? 'border-gold-dark/50 bg-gold-light/10' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-dark-blue'}
                    ${isPlaying ? 'border-emerald-dark dark:border-emerald-light ring-2 ring-emerald-dark animate-pulse' : ''}
                    ${isLoading ? 'cursor-wait' : 'hover:border-emerald-dark dark:hover:border-emerald-light active:scale-95'}
                    ${cardSizeClasses}`}
            >
                {isLoading && <Loader2 className="absolute animate-spin h-8 w-8 text-emerald-dark dark:text-emerald-light" />}
                <div className={`flex flex-col items-center justify-center transition-opacity ${isLoading ? 'opacity-20' : 'opacity-100'}`}>
                  <span className={`font-arabic text-slate-900 dark:text-slate-100 leading-none ${arabicTextSize}`} dir="rtl">{item.char}</span>
                  <span className={`text-slate-500 dark:text-slate-400 ${latinTextSize}`}>{item.latin}</span>
                </div>
                {isCompleted && !isPlaying && !isLoading && (
                    <CheckCircle2 aria-hidden="true" className="absolute top-1.5 right-1.5 h-4 w-4 text-gold-dark" />
                )}
                 {bookmarked && (
                     <Bookmark size={14} fill="currentColor" className="absolute top-1.5 left-1.5 text-blue-500" />
                 )}
            </button>
             <button
                onClick={handleToggleBookmark}
                className="absolute bottom-1 right-1 p-1 text-gray-400 hover:text-gold-dark transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={bookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
            >
                <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} className={bookmarked ? 'text-gold-dark' : 'text-gray-400'}/>
            </button>
        </div>
    );
};
