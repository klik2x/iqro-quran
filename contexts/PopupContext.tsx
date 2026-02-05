
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface PopupContextType {
  names: string[];
  saveNames: (nameString: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const POPUP_NAMES_KEY = 'popup_names';

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedNames = localStorage.getItem(POPUP_NAMES_KEY);
      if (storedNames) {
        setNames(JSON.parse(storedNames));
      }
    } catch (error) {
      console.error("Failed to parse names from localStorage", error);
      setNames([]);
    }
  }, []);

  const saveNames = (nameString: string) => {
    const nameArray = nameString.split(',').map(name => name.trim()).filter(name => name.length > 0);
    setNames(nameArray);
    localStorage.setItem(POPUP_NAMES_KEY, JSON.stringify(nameArray));
  };

  return (
    <PopupContext.Provider value={{ names, saveNames }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};
