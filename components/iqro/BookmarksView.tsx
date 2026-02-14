import React from 'react';
import { useIqroBookmarks, IqroBookmark } from '../../hooks/useIqroBookmarks';
import { BookmarkX as NoBookmarkIcon, BookmarkMinus } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

interface BookmarksViewProps {
    onNavigate: (level: number) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ onNavigate }) => {
    const { bookmarks, toggleBookmark } = useIqroBookmarks();
    const { t } = useTranslation();

    if (bookmarks.length === 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
                <NoBookmarkIcon size={48} className="mb-2"/>
                <h3 className="font-semibold text-lg">{t('noBookmarksIqro')}</h3>
                <p className="text-sm">{t('bookmarkInstructionIqro')}</p>
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
                       {t('iqroLevel')} {level}
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
                                <button 
                                    onClick={() => toggleBookmark(item)} 
                                    className="p-2 text-gray-400 group-hover:text-red-500 transition-colors rounded-full"
                                    aria-label={t('Hapus bookmark untuk') + ` ${item.latin}`}
                                >
                                    <BookmarkMinus size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookmarksView;