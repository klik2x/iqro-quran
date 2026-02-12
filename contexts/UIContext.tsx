
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UIContextType {
  zoom: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  isReadingMode: boolean;
  toggleReadingMode: () => void;
  setReadingMode: (active: boolean) => void;
  isHighContrast: boolean; // New state for high contrast mode
  toggleHighContrast: () => void; // New function to toggle high contrast mode
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('isHighContrast');
      return stored ? JSON.parse(stored) : false;
    } catch (e) {
      console.error("Failed to parse isHighContrast from localStorage", e);
      return false;
    }
  });

  // Effect to apply high-contrast class to document element
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    try {
      localStorage.setItem('isHighContrast', JSON.stringify(isHighContrast));
    } catch (e) {
      console.error("Failed to save isHighContrast to localStorage", e);
    }
  }, [isHighContrast]);

  const increaseZoom = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 0.1, 0.8));
  
  const toggleReadingMode = () => setIsReadingMode(prev => !prev);
  const setReadingMode = (active: boolean) => setIsReadingMode(active);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev); // New toggle function

  return (
    <UIContext.Provider value={{ 
      zoom, 
      increaseZoom, 
      decreaseZoom, 
      isReadingMode, 
      toggleReadingMode, 
      setReadingMode,
      isHighContrast, // Provide new state
      toggleHighContrast // Provide new function
    }}>
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