
import React, { useState, useEffect } from 'react';
import { useBookmarks, BookmarkedAyah } from '../contexts/BookmarkContext';
import { useQuran } from '../contexts/QuranContext';
import { fetchSurah } from '../services/quranApi';
import { BookOpenCheck, Eye, EyeOff, Languages } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import AyahView from '../components/AyahView';
import { LoadingSpinner } from '../components/ui/Feedback';

const Bookmarks: React.FC = () => {
    const { bookmarks } = useBookmarks();
    const { t } = useTranslation();
    const { 
        selectedEdition, 
        setSelectedEdition, 
        editions, 
        showLatin, 
        setShowLatin, 
        showTranslation, 
        setShowTranslation 
    } = useQuran();

    const [enrichedBookmarks, setEnrichedBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (bookmarks.length === 0) {
                setEnrichedBookmarks([]);
                return;
            }
            setLoading(true);
            try {
                // Refresh content with selected translation
                const results = await Promise.all(
                    bookmarks.map(async (bm) => {
                        const surahData = await fetchSurah(bm.surahNumber, selectedEdition);
                        const ayahData = surahData.ayahs.find(a => a.numberInSurah === bm.numberInSurah);
                        return { ayah: ayahData!, surah: surahData };
                    })
                );
                setEnrichedBookmarks(results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [bookmarks, selectedEdition]);

    return (
        <div className="space-y-6 pb-12">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('bookmarkedAyahs')}</h1>

            {bookmarks.length > 0 && (
                <div className="sticky top-[72px] z-20 bg-soft-white/95 dark:bg-dark-blue/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-4">
                    <button 
                        onClick={() => setShowTranslation(!showTranslation)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showTranslation ? <EyeOff size={16}/> : <Eye size={16}/>} Terjemahan
                    </button>
                    <button 
                        onClick={() => setShowLatin(!showLatin)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showLatin ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showLatin ? <EyeOff size={16}/> : <Eye size={16}/>} Latin
                    </button>
                    
                    {showTranslation && (
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-inner">
                            <Languages size={14} className="text-emerald-dark dark:text-emerald-light"/>
                            <select 
                                value={selectedEdition} 
                                onChange={(e) => setSelectedEdition(e.target.value)} 
                                className="bg-transparent text-[11px] font-bold outline-none uppercase max-w-[80px]"
                            >
                                {editions.map(ed => (
                                    <option key={ed.identifier} value={ed.identifier}>{ed.language.toUpperCase()} - {ed.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <LoadingSpinner />
            ) : bookmarks.length > 0 ? (
                <div className="space-y-6">
                    {enrichedBookmarks.map((item, index) => (
                        <AyahView 
                            key={index} 
                            ayah={item.ayah} 
                            surah={item.surah} 
                            showLatin={showLatin} 
                            showTranslation={showTranslation} 
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-24 bg-white dark:bg-dark-blue-card rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-6">
                        <BookOpenCheck className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">{t('noBookmarks')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">{t('noBookmarksMessage')}</p>
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
