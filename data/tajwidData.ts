// data/tajwidData.ts
import { TajwidRule } from '../types';

export const tajwidRules: TajwidRule[] = [
  {
    id: 'izhar-halqi',
    name: 'Izhar Halqi',
    color: '#16a34a', // Green-600
    description: "Izhar (إِظْهَار) berarti 'jelas'. Jika Nun Sukun (نْ) atau Tanwin bertemu salah satu dari enam huruf Halqi (ء هـ ع ح غ خ), maka dibaca jelas tanpa dengung.",
    exampleArabic: 'مِنْهُ',
    exampleAudioText: 'مِنْهُ' 
  },
  {
    id: 'idgham-bigunnah',
    name: 'Idgham Bi Ghunnah',
    color: '#3b82f6', // Blue-500
    description: 'Meleburkan dengan dengung jika Nun Sukun atau Tanwin bertemu salah satu huruf: ي ن م و.',
    exampleArabic: 'مَنْ يَقُولُ',
    exampleAudioText: 'مَنْ يَقُولُ'
  },
  {
    id: 'idgham-bilagunnah',
    name: 'Idgham Bila Ghunnah',
    color: '#1d4ed8', // Blue-700
    description: 'Meleburkan tanpa dengung jika Nun Sukun atau Tanwin bertemu huruf: ل ر.',
    exampleArabic: 'مِنْ لَدُنْهُ',
    exampleAudioText: 'مِنْ لَدُنْهُ'
  },
  {
    id: 'iqlab',
    name: 'Iqlab',
    color: '#9333ea', // Purple-600
    description: 'Jika Nun Sukun atau Tanwin bertemu huruf Ba (ب), maka suara Nun/Tanwin diubah menjadi suara Mim (م) yang didengungkan.',
    exampleArabic: 'مِنْ بَعْدِ',
    exampleAudioText: 'مِنْ بَعْدِ'
  },
  {
    id: 'ikhfa-haqiqi',
    name: 'Ikhfa Haqiqi',
    color: '#d97706', // Amber-600
    description: 'Membaca samar-samar antara Izhar dan Idgham sambil didengungkan jika bertemu 15 huruf sisa.',
    exampleArabic: 'أَنْفُسَكُمْ',
    exampleAudioText: 'أَنْفُسَكُمْ'
  }
];
