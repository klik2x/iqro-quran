
// utils/voiceProcessor.ts

// Memastikan jalur impor adalah relatif agar dapat diselesaikan oleh browser.
// Impor ini sudah menggunakan jalur relatif yang benar.
import { voiceTriggers, defaultVoiceLangMapping, preferredVoiceNames } from '../data/voiceTriggers';
import { soundMapping } from './soundMapping';
import { speak, stopSpeaking } from './browserSpeech'; // FIX: Mengimpor speak dan stopSpeaking dari browserSpeech.ts

// Declare global types for Speech Recognition API if not implicitly available
// This is a workaround if 'dom' library is not included or is an older version in tsconfig.json
declare class SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechchend: ((this: SpeechRecognition, ev: Event) | null; // FIX: Typo corrected
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare class SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  constructor(type: string, eventInitDict: SpeechRecognitionEventInit);
}

interface SpeechRecognitionEventInit extends EventInit {
  resultIndex?: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

declare class SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
  constructor(type: string, eventInitDict: SpeechRecognitionErrorEventInit);
}

interface SpeechRecognitionErrorEventInit extends EventInit {
  error: SpeechRecognitionErrorCode;
  message?: string;
}

declare class SpeechGrammarList {
    readonly length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
}

declare class SpeechGrammar {
    readonly src: string;
    readonly weight: number;
}

type SpeechRecognitionErrorCode =
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported";

// Extend Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
    SpeechGrammarList?: typeof SpeechGrammarList;
  }
}

// Inisialisasi SpeechRecognition
const WebSpeechRecognition: typeof SpeechRecognition | undefined = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;
let isListeningStatus: boolean = false; // Status internal
let currentLanguage: string = 'id'; // Default language

const setupRecognition = (langCode: string) => {
  if (WebSpeechRecognition) {
    recognition = new WebSpeechRecognition();
    recognition.continuous = false; // Hanya satu kali pengenalan per start
    recognition.interimResults = false; // Hanya hasil final
    
    // Gunakan bahasa yang dipetakan untuk pengenalan suara
    const recognitionLang = defaultVoiceLangMapping[langCode] || 'id-ID';
    recognition.lang = recognitionLang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Recognized:', transcript);
      processSpeech(transcript, langCode);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech Recognition Error:', event.error);
      onRecognitionErrorCallbacks.forEach(cb => cb(event.error));
      // Jika ada error dan kita masih seharusnya mendengarkan, coba restart
      if (isListeningStatus) {
        console.log('Restarting recognition after error...');
        // Beri sedikit delay sebelum restart untuk menghindari loop cepat
        setTimeout(() => {
          recognition?.start();
        }, 500); 
      }
    };

    recognition.onend = () => {
      // Jika masih seharusnya mendengarkan, restart secara otomatis
      if (isListeningStatus) {
        console.log('Recognition ended, restarting...');
        recognition?.start();
      } else {
        // Jika sudah berhenti, reset status
        onListeningStatusChangeCallbacks.forEach(cb => cb(false));
      }
    };
  } else {
    console.warn('Speech Recognition API not supported in this browser.');
    onRecognitionErrorCallbacks.forEach(cb => cb('Speech Recognition API not supported.'));
  }
};

const onCommandCallbacks: Array<(command: string, recognizedText: string) => void> = [];
const onListeningStatusChangeCallbacks: Array<(isListening: boolean) => void> = [];
const onRecognitionErrorCallbacks: Array<(error: string) => void> = [];

/**
 * Memproses teks yang dikenali untuk mencari perintah dan memicu callback.
 * @param text Teks yang dikenali oleh Speech Recognition.
 * @param lang Kode bahasa aktif.
 */
const processSpeech = (text: string, lang: string) => {
  // 1. Normalisasi teks menggunakan soundMapping
  let normalizedText = text;
  for (const [mispronunciation, canonical] of soundMapping.entries()) {
    if (text.includes(mispronunciation)) {
      normalizedText = normalizedText.replace(mispronunciation, canonical);
      break; // Ambil yang pertama cocok
    }
  }

  // 2. Deteksi perintah dari voiceTriggers
  for (const commandType in voiceTriggers) {
    const triggers = voiceTriggers[commandType as keyof typeof voiceTriggers];
    for (const trigger of triggers) {
      if (normalizedText.includes(trigger.toLowerCase())) {
        onCommandCallbacks.forEach(cb => cb(commandType, normalizedText));
        return; // Hanya satu perintah per pengenalan
      }
    }
  }

  // Jika tidak ada perintah yang cocok, bisa memberikan feedback (opsional)
  console.log(`No command found for: "${normalizedText}"`);
  // FIX: Menggunakan fungsi speak dari browserSpeech.ts
  // speak("Perintah tidak dikenal.", defaultVoiceLangMapping[lang]); // Contoh feedback audio
};

/**
 * Memulai pendengar perintah suara.
 * @param lang Kode bahasa untuk pengenalan (misal: 'id', 'en', 'ar').
 * @param onCommand Callback ketika perintah dikenali.
 * @param onListeningStatusChange Callback untuk perubahan status mendengarkan.
 * @param onRecognitionError Callback untuk error pengenalan.
 */
export const startVoiceCommandListener = (
  lang: string,
  onCommand: (command: string, recognizedText: string) => void,
  onListeningStatusChange: (isListening: boolean) => void,
  onRecognitionError: (error: string) => void
) => {
  currentLanguage = lang; // Simpan bahasa aktif
  if (!recognition) {
    setupRecognition(lang);
  }

  onCommandCallbacks.push(onCommand);
  onListeningStatusChangeCallbacks.push(onListeningStatusChange);
  onRecognitionErrorCallbacks.push(onRecognitionError);

  if (recognition && !isListeningStatus) {
    try {
      recognition.start();
      isListeningStatus = true;
      onListeningStatusChangeCallbacks.forEach(cb => cb(true));
      console.log('Voice command listener started.');
    } catch (e) {
      console.error('Failed to start Speech Recognition:', e);
      onRecognitionErrorCallbacks.forEach(cb => cb('Failed to start microphone.'));
      isListeningStatus = false;
      onListeningStatusChangeCallbacks.forEach(cb => cb(false));
    }
  } else if (!recognition) {
     onRecognitionErrorCallbacks.forEach(cb => cb('Speech Recognition API not available.'));
  }
};

/**
 * Menghentikan pendengar perintah suara.
 */
export const stopVoiceCommandListener = () => {
  if (recognition && isListeningStatus) {
    recognition.stop();
    isListeningStatus = false;
    onListeningStatusChangeCallbacks.forEach(cb => cb(false));
    onCommandCallbacks.length = 0; // Bersihkan semua callback
    onListeningStatusChangeCallbacks.length = 0;
    onRecognitionErrorCallbacks.length = 0;
    console.log('Voice command listener stopped.');
  }
};

/**
 * Mendapatkan status mendengarkan saat ini.
 * @returns true jika sedang mendengarkan, false jika tidak.
 */
export const getIsListeningStatus = () => isListeningStatus;
