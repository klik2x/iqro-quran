export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  // Added properties to fix property access errors in Dashboard, SurahDetail and Bookmarks
  audio: string;
  translation: string;
  textLatin: string;
  surah?: Surah;
}

// Added SurahDetail interface to fix missing member error in SurahDetail and quranApi
export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface Translation {
  number: number;
  text: string;
}

export interface Tafsir {
  number: number;
  text: string;
}

export interface Qari {
  identifier: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface HijaiyahLetter {
  letter: string;
  name: string;
  sound: string;
}

export interface IqroItem {
  arabic: string;
  latin: string;
}

export interface TajwidRule {
  id: string;
  name: string;
  explanation: string;
  example: string;
  exampleLatin: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabic?: string;
  options: string[];
  correctAnswer: number;
}

export interface IqroLevelData {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  color: string;
  items: IqroItem[];
  tajwid?: TajwidRule[];
  quiz?: QuizQuestion[];
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

export interface AppState {
  darkMode: boolean;
  selectedSurah: number | null;
  qari: string;
}