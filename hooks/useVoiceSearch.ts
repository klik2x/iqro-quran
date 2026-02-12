// hooks/useVoiceSearch.ts (New File)
import { useState, useCallback } from 'react';

export const useVoiceSearch = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung pencarian suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Set ke Bahasa Indonesia agar akurat untuk lansia
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  }, [onResult]);

  return { isListening, startListening };
};
