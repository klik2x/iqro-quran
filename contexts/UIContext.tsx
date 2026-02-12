// contexts/UIContext.tsx (Updated)
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UIContextType {
  zoom: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  isReadingMode: boolean;
  toggleReadingMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const increaseZoom = () => setZoom(prev => Math.min(prev + 0.1, 2.0)); // Zoom sampai 200%
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 0.1, 0.8));
  
  const toggleReadingMode = () => setIsReadingMode(prev => !prev);
  
  const toggleHighContrast = () => {
    setIsHighContrast(prev => {
      const newState = !prev;
      if (newState) document.documentElement.classList.add('high-contrast');
      else document.documentElement.classList.remove('high-contrast');
      return newState;
    });
  };

  return (
    <UIContext.Provider value={{ 
      zoom, increaseZoom, decreaseZoom, 
      isReadingMode, toggleReadingMode,
      isHighContrast, toggleHighContrast 
    }}>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        {children}
      </div>
    </UIContext.Provider>
  );
};
// ... useUI hook tetap sama
