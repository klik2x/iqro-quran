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
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio: string;
  translation: string;
  textLatin: string;
  surah?: Surah;
}

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
  char: string;
  latin: string;
}

export interface IqroSection {
  title: string;
  info: string;
  items: IqroItem[];
  guide?: string;
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

// New types for Murotal page
export interface Mp3Reciter {
  id: string;
  name: string;
  rewaya: string;
  Server: string;
  suras: string;
}

export interface QuranTvChannel {
  id: string;
  name: string;
  url: string;
  language: string;
}

export interface QuranVideo {
  id: string;
  title: string;
  url: string;
}

export interface RadioStation {
  id: string;
  name:string;
  radio_url: string;
}