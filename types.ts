export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  audio: string;
  text: string;
  textLatin: string;
  translation: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  surah?: Surah; // Optional: To carry parent surah info
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

// Added Edition interface for dynamic edition selection
export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

// Interfaces for Iqro learning content
export interface IqroItem {
  char: string;
  latin: string;
  keterangan?: string; // NEW: Added for tooltip content
}

export interface IqroSection {
  title: string;
  info: string;
  items: IqroItem[];
  guide?: string;
}

export interface TajwidRule {
    rule: string;
    explanation: string;
    letters?: string;
    examples?: { arabic: string; latin: string; highlight?: string; }[];
    subRules?: {
        name: string;
        explanation: string;
        examples: { arabic: string; latin: string; highlight?: string; }[];
    }[];
}

export interface QuizQuestion {
    char: string; // The Arabic character/word for the question
    latin: string; // The correct Latin pronunciation
    options: string[]; // Multiple choice options
    correctAnswer: string; // The correct Latin answer
}

export interface IqroLevelData {
  level: number;
  title: string;
  description: string;
  cover: string;
  sections: IqroSection[];
  tajwid?: TajwidRule[]; // Optional for Iqro levels
  quiz?: QuizQuestion[]; // Optional for Iqro levels
}

export interface Doa {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  ayahNumber: number;
}

// NEW INTERFACE: HijaiyahLetter
export interface HijaiyahLetter {
  letter: string;
  name: string;
  sound: string;
}

// NEW INTERFACE: Qari
export interface Qari {
  identifier: string;
  name: string;
}

// NEW INTERFACE: CertificateData
export interface CertificateData {
  userName: string;
  levelTitle: string;
  score: number; // For Setoran Berhadiah, or could be level completion for Iqro
  badge?: 'gold' | 'silver' | 'bronze' | null;
  date: string;
  appLanguage: 'id' | 'en' | 'ar'; // For localization of certificate text
}

// NEW INTERFACE: VoiceTrigger
export interface VoiceTrigger {
  keyword: string;
  languages: { [key: string]: string[] }; // { 'id': ['lanjut', 'terus'], 'en': ['next', 'continue'] }
  action: 'next' | 'previous' | 'repeat' | 'stop' | 'start' | 'help';
}
