import React from 'react';
import { useBookmarks, BookmarkedAyah } from '../contexts/BookmarkContext';
import { BookOpenCheck } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const Bookmarks: React.FC = () => {
    const { bookmarks } = useBookmarks();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('bookmarkedAyahs')}</h1>

            {bookmarks.length > 0 ? (
                <div className="space-y-4">
                    {bookmarks.map(ayah => (
                        <BookmarkCard key={ayah.number} ayah={ayah} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-dark-blue-card rounded-2xl">
                    <BookOpenCheck className="h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('noBookmarks')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('noBookmarksMessage')}</p>
                </div>
            )}
        </div>
    );
};

const BookmarkCard: React.FC<{ ayah: BookmarkedAyah }> = ({ ayah }) => (
     <div className="bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <a href={`#/surah/${ayah.surahNumber}`} className="text-sm font-bold bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white px-3 py-1 rounded-full hover:bg-emerald-light/50 dark:hover:bg-emerald-dark/70 transition">
                {ayah.surahName} ({ayah.surahNumber}:{ayah.numberInSurah})
            </a>
        </div>
        <p className="text-right font-arabic text-3xl text-gray-800 dark:text-white leading-relaxed mb-4">{ayah.text}</p>
        <p className="text-gray-700 dark:text-gray-300">{ayah.translation}</p>
    </div>
);


export default Bookmarks;
