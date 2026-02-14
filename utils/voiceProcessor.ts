
import { voiceTriggers } from '../data/voiceTriggers';

// Extend the Window interface to include webkitSpeechRecognition for better type safety
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechGrammarList: typeof SpeechGrammarList;
    webkitSpeechGrammarList: typeof SpeechGrammarList;
  }
}

// Global declarations for Web Speech API types to resolve 'Cannot find name' errors
// These are typically provided by 'dom' lib in tsconfig, but added here for self-containment.
declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare var SpeechGrammarList: {
    prototype: SpeechGrammarList;
    new(): SpeechGrammarList;
};

declare var SpeechRecognitionErrorEvent: {
    prototype: SpeechRecognitionErrorEvent;
    new(type: string, eventInitDict?: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent;
};

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
        // FIX: Use SpeechRecognitionErrorEvent constructor with a valid error type
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