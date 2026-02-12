// contexts/AudioFeedbackContext.tsx (New File)
import React, { createContext, useContext, useCallback } from 'react';

interface AudioFeedbackType {
  triggerSuccess: () => void;
  triggerTick: () => void;
}

const AudioFeedbackContext = createContext<AudioFeedbackType | undefined>(undefined);

export const AudioFeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const triggerTick = useCallback(() => {
    // 1. Haptic Feedback (Vibration API)
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Getaran halus 50ms
    }
    // 2. Audio Feedback (Optional: Suara klik pelan)
  }, []);

  const triggerSuccess = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // Pola sukses
    }
  }, []);

  return (
    <AudioFeedbackContext.Provider value={{ triggerSuccess, triggerTick }}>
      {children}
    </AudioFeedbackContext.Provider>
  );
};

export const useAudioFeedback = () => {
  const context = useContext(AudioFeedbackContext);
  if (!context) throw new Error('useAudioFeedback must be used within AudioFeedbackProvider');
  return context;
};
