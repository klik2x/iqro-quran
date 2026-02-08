import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Pastikan file quranApi.ts benar-benar mengekspor fungsi ini
import { fetchTranslationEditions } from '../services/quranApi';

interface QuranContextType {
  selectedEdition: string;
  setSelectedEdition: (id: string) => void;
  editions: any[];
  showLatin: boolean;
  setShowLatin: (val: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (val: boolean) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEdition, setSelectedEdition] = useState('id.indonesian');
  const [editions, setEditions] = useState<any[]>([]);
  const [showLatin, setShowLatin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Tambahkan pengecekan apakah fungsi tersedia sebelum dipanggil
        if (typeof fetchTranslationEditions === 'function') {
          const data = await fetchTranslationEditions();
          setEditions(Array.isArray(data) ? data : []);
        } else {
          console.warn('fetchTranslationEditions is not a function. Check your quranApi.ts');
        }
      } catch (e) {
        console.error('Failed to load editions:', e);
      }
    };
    load();
  }, []);

  return (
    <QuranContext.Provider value={{ 
      selectedEdition, 
      setSelectedEdition, 
      editions, 
      showLatin, 
      setShowLatin, 
      showTranslation, 
      setShowTranslation 
    }}>
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
