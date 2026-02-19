
import React, { useState } from 'react';
import { Loader2, Bookmark, CheckCircle2, Info, X } from 'lucide-react';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useIqroBookmarks, IqroBookmark } from '../../hooks/useIqroBookmarks';
import { IqroItem } from '../../types';

interface HijaiyahCardProps {
    id: string;
    item: IqroItem;
    level: number;
    sectionTitle: string;
    isLoading: boolean;
    isPlaying: boolean;
    onPlay: (char: string, latin: string, id: string) => void;
    isLarge?: boolean;
    showLatinText: boolean;
    isQuizMode?: boolean; // New prop for Quiz specific layout
}

export const HijaiyahCard: React.FC<HijaiyahCardProps> = ({
    id,
    item,
    level,
    sectionTitle,
    isLoading,
    isPlaying,
    onPlay,
    isLarge = false,
    showLatinText,
    isQuizMode = false
}) => {
    const { progress } = useIqroProgress();
    const { isBookmarked, toggleBookmark } = useIqroBookmarks();
    const [showTooltip, setShowTooltip] = useState(false);

    const bookmarked = isBookmarked(id);
    const isCompleted = progress[id];

    const handleToggleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        const bookmarkItem: IqroBookmark = {
            id,
            level,
            sectionTitle,
            char: item.char,
            latin: item.latin
        };
        toggleBookmark(bookmarkItem);
    };

    const toggleTooltip = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
    };

    // Responsive font size logic to prevent overflow
    const getArabicFontSize = () => {
        const length = item.char.length;
        if (isLarge || isQuizMode) {
            if (length > 12) return "text-2xl sm:text-3xl";
            if (length > 6) return "text-4xl sm:text-5xl";
            return "text-6xl sm:text-7xl";
        } else {
            if (length > 15) return "text-lg sm:text-xl";
            if (length > 8) return "text-2xl sm:text-3xl";
            if (length > 4) return "text-3xl sm:text-4xl";
            return "text-5xl sm:text-6xl";
        }
    };

    const cardBaseClasses = `w-full flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark overflow-hidden relative`;
    
    const stateClasses = isCompleted && !isQuizMode ? 'border-gold-dark/40 bg-gold-light/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-blue';
    const playingClasses = isPlaying ? 'border-emerald-dark dark:border-emerald-light ring-4 ring-emerald-dark/20 animate-pulse' : 'shadow-sm';
    const loadingClasses = isLoading ? 'cursor-wait' : 'hover:border-emerald-dark dark:hover:border-emerald-light active:scale-95';
    const sizeClasses = isLarge ? "p-6 min-h-[200px]" : "aspect-square p-2 sm:p-4";

    return (
        <div className="relative group h-full">
            <button
                onClick={() => onPlay(item.char, item.latin, id)}
                disabled={isLoading}
                aria-label={`Bunyikan ${item.char}`}
                className={`${cardBaseClasses} ${stateClasses} ${playingClasses} ${loadingClasses} ${sizeClasses}`}
            >
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-dark-blue/60 backdrop-blur-[1px]">
                        <Loader2 className="animate-spin h-8 w-8 text-emerald-dark dark:text-emerald-light" />
                    </div>
                )}
                
                <div className={`w-full flex flex-col items-center justify-center transition-opacity ${isLoading ? 'opacity-20' : 'opacity-100'}`}>
                    <span 
                        className={`font-arabic text-slate-900 dark:text-slate-100 leading-normal block w-full px-1 break-words ${getArabicFontSize()}`} 
                        dir="rtl"
                    >
                        {item.char}
                    </span>
                    
                    {/* Show Latin only if requested or in Quiz Mode */}
                    {(showLatinText || isQuizMode) && (
                        <span className={`text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider ${isQuizMode || isLarge ? 'text-lg mt-3' : 'text-[10px] mt-1'}`}>
                            {item.latin}
                        </span>
                    )}
                </div>

                {isCompleted && !isPlaying && !isLoading && !isQuizMode && (
                    <div className="absolute top-2 left-2 bg-white dark:bg-dark-blue rounded-full shadow-sm border border-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                )}
            </button>

            {/* Tooltip Button - Always Top Right for Study/Practice (not Quiz Mode) */}
            {item.keterangan && !isQuizMode && (
                <div className="absolute top-1.5 right-1.5 z-10">
                    <button 
                        onClick={toggleTooltip}
                        className={`p-1.5 rounded-xl transition-all shadow-sm ${showTooltip ? 'bg-emerald-600 text-white' : 'bg-white/90 dark:bg-slate-700/90 text-slate-400 hover:text-emerald-600'}`}
                        aria-label="Tampilkan keterangan cara baca"
                    >
                        {showTooltip ? <X size={14} /> : <Info size={14} />}
                    </button>
                    
                    {showTooltip && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-slate-900 text-white text-[10px] sm:text-xs p-3 rounded-xl shadow-2xl z-30 animate-in fade-in zoom-in duration-200 origin-top-right border border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="font-bold mb-1 text-emerald-light border-b border-slate-700 pb-1 flex items-center gap-1 uppercase tracking-tighter">
                                <Info size={12} /> Keterangan
                            </p>
                            <p className="leading-relaxed opacity-90 italic">{item.keterangan}</p>
                            <div className="absolute bottom-full right-3 -mb-1 border-8 border-transparent border-b-slate-900"></div>
                        </div>
                    )}
                </div>
            )}

            {!isQuizMode && (
                <button 
                    onClick={handleToggleBookmark}
                    className="absolute bottom-1.5 right-1.5 p-1 text-gray-300 hover:text-gold-dark transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={bookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
                >
                    <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} className={bookmarked ? 'text-gold-dark' : ''}/>
                </button>
            )}
        </div>
    );
};
