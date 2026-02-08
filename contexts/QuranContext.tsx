
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
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
        const data = await fetchTranslationEditions();
        setEditions(data);
      } catch (e) {
        console.error(e);
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
  if (!context) throw new Error('useQuran must be used within QuranProvider');
  return context;
};
