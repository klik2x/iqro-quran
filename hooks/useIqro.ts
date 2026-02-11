import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'iqro_page_progress';
const LAST_READ_KEY = 'iqro_last_read';

interface LastRead {
  level: number;
  page: number;
}

export const useIqro = () => {
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    try {
      const saved = localStorage.getItem(LAST_READ_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);
  
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
    }
  }, [lastRead]);

  const updateLastRead = useCallback((level: number, page: number) => {
    setLastRead({ level, page });
  }, []);

  const togglePageCompletion = useCallback((level: number, page: number) => {
    const key = `${level}-${page}`;
    setProgress(prev => {
      const newProgress = { ...prev };
      if (newProgress[key]) {
        delete newProgress[key];
      } else {
        newProgress[key] = true;
      }
      return newProgress;
    });
  }, []);
  
  const getLevelProgress = useCallback((level: number, totalPages: number): number => {
      if (totalPages === 0) return 0;
      const completedPages = Object.keys(progress).filter(key => key.startsWith(`${level}-`)).length;
      return (completedPages / totalPages) * 100;
  }, [progress]);

  const isPageCompleted = useCallback((level: number, page: number): boolean => {
    return !!progress[`${level}-${page}`];
  }, [progress]);

  return { lastRead, updateLastRead, getLevelProgress, togglePageCompletion, isPageCompleted, progress };
};
