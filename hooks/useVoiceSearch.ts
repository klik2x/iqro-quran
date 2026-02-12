// hooks/useVoiceSearch.ts (Revisi - Ready to Use)
import { useState, useCallback } from 'react';

export const useVoiceSearch = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    // Mengecek dukungan browser (Chrome & Edge mendukung ini dengan sangat baik)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Browser tidak mendukung Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Sangat penting untuk lansia di Indonesia
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      if ('vibrate' in navigator) navigator.vibrate(50); // Haptic feedback mulai
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if ('vibrate' in navigator) navigator.vibrate([30, 30]); // Haptic feedback selesai
    };

    recognition.start();
  }, [onResult]);

  return { isListening, startListening };
};
