
import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'iqro_bookmarks';

export interface IqroBookmark {
    id: string;
    level: number;
    sectionTitle: string;
    char: string;
    latin: string;
}

export const useIqroBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<IqroBookmark[]>(() => {
        try {
            const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
            return savedBookmarks ? JSON.parse(savedBookmarks) : [];
        } catch (error) {
            console.error("Failed to parse Iqro bookmarks from localStorage", error);
            return [];
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        } catch (error) {
            console.error("Failed to save Iqro bookmarks to localStorage", error);
        }
    }, [bookmarks]);

    const isBookmarked = useCallback((id: string) => {
        return bookmarks.some(b => b.id === id);
    }, [bookmarks]);

    const toggleBookmark = useCallback((item: IqroBookmark) => {
        setBookmarks(prev => {
            if (isBookmarked(item.id)) {
                return prev.filter(b => b.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    }, [isBookmarked]);

    return { bookmarks, toggleBookmark, isBookmarked };
};
