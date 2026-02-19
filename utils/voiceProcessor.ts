

// Minimal declaration for Window augmentation if 'dom' lib is not fully recognized or if augmenting is explicitly desired
// This ensures that properties like SpeechRecognition exist on `window` type.

// FIX: Add comprehensive global type declarations for Web Speech API
import { voiceTriggers } from '../data/voiceTriggers';

interface SpeechRecognitionEventMap {
  "audiostart": Event;
  "audioend": Event;
  "end": Event;
  "error": SpeechRecognitionErrorEvent;
  "nomatch": SpeechRecognitionEvent;
  "result": SpeechRecognitionEvent;
  "soundstart": Event;
  "soundend": Event;
  "speechstart": Event;
  "speechend": Event;
  "start": Event;
}

interface SpeechRecognition extends EventTarget {
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
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  
  start(): void;
  stop(): void;
  abort(): void;
  
  addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOrEventListenerObject): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};


interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation: any; // Placeholder for SpeechRecognitionAlternative or SpeechRecognitionResult
  readonly emma: Document | null; // Obsolete, kept for compatibility
}

declare var SpeechRecognitionEvent: {
  prototype: SpeechRecognitionEvent;
  // FIX: Changed SpeechRecognitionEventInit to EventInit
  new(type: string, eventInitDict: EventInit): SpeechRecognitionEvent;
};

// FIX: Define SpeechRecognitionErrorEventInit
interface SpeechRecognitionErrorEventInit extends EventInit {
    error: SpeechRecognitionErrorCode;
    message?: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

declare var SpeechRecognitionErrorEvent: {
  prototype: SpeechRecognitionErrorEvent;
  // FIX: Changed SpeechRecognitionErrorEventInit to EventInit
  new(type: string, eventInitDict: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent; // Use SpeechRecognitionErrorEventInit here
};

type SpeechRecognitionErrorCode =
    "no-speech" | "aborted" | "audio-capture" | "network" | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";


interface SpeechGrammar {
  src: string;
  weight: number;
}

interface SpeechGrammarList {
  readonly length: number;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
}

declare var SpeechGrammarList: {
  prototype: SpeechGrammarList;
  new(): SpeechGrammarList;
};


declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
    SpeechGrammarList: typeof SpeechGrammarList;
    webkitSpeechGrammarList: typeof SpeechGrammarList; // FIX: Added declaration for webkitSpeechGrammarList
  }
}

export type VoiceCommandAction = 'next' | 'previous' | 'repeat' | 'stop' | 'start' | 'help' | null;

interface VoiceProcessorOptions {
  onCommand: (action: VoiceCommandAction, keyword: string) => void;
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onNoMatch?: (transcript: string) => void;
  onError?: (event: SpeechRecognitionErrorEvent) => void;
  lang?: string; // e.g., 'id-ID', 'en-US', 'ar-SA'
}

export class VoiceProcessor {
  private recognition: SpeechRecognition | null = null;
  private onCommand: (action: VoiceCommandAction, keyword: string) => void;
  private onListeningStart?: () => void;
  private onListeningEnd?: () => void;
  private onNoMatch?: (transcript: string) => void;
  private onError?: (event: SpeechRecognitionErrorEvent) => void;
  private lang: string;
  private isListening: boolean = false;

  constructor(options: VoiceProcessorOptions) {
    this.onCommand = options.onCommand;
    this.onListeningStart = options.onListeningStart;
    this.onListeningEnd = options.onListeningEnd;
    this.onNoMatch = options.onNoMatch;
    this.onError = options.onError;
    this.lang = options.lang || 'id-ID'; // Default to Indonesian

    // FIX: Directly use window.SpeechRecognition and window.SpeechGrammarList for runtime check
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    if (!SpeechRecognition) {
      console.warn("Web Speech API SpeechRecognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false; // Only get one result per recognition instance
    this.recognition.interimResults = false; // Only return final results
    this.recognition.lang = this.lang;

    // Optional: Add grammar for better recognition of specific keywords
    if (SpeechGrammarList) {
      const grammar = `#JSGF V1.0; grammar commands; public <command> = ${this.getGrammarList()};`;
      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      this.recognition.grammars = speechRecognitionList;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onListeningStart?.();
    };

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();
      console.log('Voice recognized:', transcript);
      
      const matchedTrigger = this.findMatchingTrigger(transcript);
      if (matchedTrigger) {
        this.onCommand(matchedTrigger.action, transcript);
      } else {
        this.onNoMatch?.(transcript);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onListeningEnd?.();
      // If we want continuous listening, we could restart here, but for commands,
      // it's often better to stop and re-enable manually.
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      this.isListening = false;
      this.onError?.(event);
    };
  }

  private getGrammarList(): string {
    const keywords: string[] = [];
    voiceTriggers.forEach(trigger => {
      const currentLangKeywords = trigger.languages[this.lang.split('-')[0]]; // Get keywords for current short lang code
      if (currentLangKeywords) {
        keywords.push(...currentLangKeywords);
      }
    });
    return keywords.join(' | ');
  }

  private findMatchingTrigger(transcript: string) {
    const currentLangCode = this.lang.split('-')[0];
    for (const trigger of voiceTriggers) {
      const langKeywords = trigger.languages[currentLangCode];
      if (langKeywords && langKeywords.some(keyword => transcript.includes(keyword.toLowerCase()))) {
        return trigger;
      }
    }
    return null;
  }

  public startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        console.log("VoiceProcessor started listening...");
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        // FIX: Construct a basic SpeechRecognitionErrorEvent object to conform to the interface
        this.onError?.(new SpeechRecognitionErrorEvent('error', { error: 'aborted', message: e instanceof Error ? e.message : String(e) }));
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      console.log("VoiceProcessor stopped listening.");
    }
  }

  public setLang(newLang: string): void {
    if (this.lang !== newLang) {
      this.lang = newLang;
      if (this.recognition) {
        this.recognition.lang = newLang;
        // Reinitialize grammar if necessary
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        if (SpeechGrammarList) {
          const grammar = `#JSGF V1.0; grammar commands; public <command> = ${this.getGrammarList()};`;
          const speechRecognitionList = new SpeechGrammarList();
          speechRecognitionList.addFromString(grammar, 1);
          this.recognition.grammars = speechRecognitionList;
        }
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}