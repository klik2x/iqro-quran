import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// FIX: Corrected import path for types to resolve property 'number' not found error.
import { Ayah, Surah } from '../../types';

export interface BookmarkedAyah extends Ayah {
  surahNumber: number;
  surahName: string;
}

interface BookmarkContextType {
  bookmarks: BookmarkedAyah[];
  addBookmark: (ayah: Ayah, surah: Surah) => void;
  removeBookmark: (ayahNumberInQuran: number) => void;
  isBookmarked: (ayahNumberInQuran: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('quran_bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to parse bookmarks from localStorage", error);
      setBookmarks([]);
    }
  }, []);

  const saveBookmarks = (updatedBookmarks: BookmarkedAyah[]) => {
    setBookmarks(updatedBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
  };

  const addBookmark = (ayah: Ayah, surah: Surah) => {
    if (isBookmarked(ayah.number)) return;
    const newBookmark: BookmarkedAyah = {
      ...ayah,
      surahNumber: surah.number,
      surahName: surah.englishName
    };
    const updatedBookmarks = [...bookmarks, newBookmark].sort((a,b) => a.number - b.number);
    saveBookmarks(updatedBookmarks);
  };

  const removeBookmark = (ayahNumberInQuran: number) => {
    const updatedBookmarks = bookmarks.filter(bm => bm.number !== ayahNumberInQuran);
    saveBookmarks(updatedBookmarks);
  };

  const isBookmarked = (ayahNumberInQuran: number): boolean => {
    return bookmarks.some(bm => bm.number === ayahNumberInQuran);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
