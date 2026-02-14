
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UIContextType {
  zoom: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  isReadingMode: boolean;
  toggleReadingMode: () => void;
  setReadingMode: (active: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isReadingMode, setIsReadingMode] = useState(false);

  const increaseZoom = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 0.1, 0.8));
  
  const toggleReadingMode = () => setIsReadingMode(prev => !prev);
  const setReadingMode = (active: boolean) => setIsReadingMode(active);

  return (
    <UIContext.Provider value={{ zoom, increaseZoom, decreaseZoom, isReadingMode, toggleReadingMode, setReadingMode }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
