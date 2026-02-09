import React from 'react';
import { HijaiyahLetter, Doa, IqroLevelData } from './types';

export const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
  { letter: 'ا', name: 'Alif', sound: 'Alif' },
  { letter: 'ب', name: 'Ba', sound: 'Ba' },
  { letter: 'ت', name: 'Ta', sound: 'Ta' },
  { letter: 'ث', name: 'Tsa', sound: 'Tsa' },
  { letter: 'ج', name: 'Jim', sound: 'Jim' },
  { letter: 'ح', name: 'Ha', sound: 'Ha' },
  { letter: 'خ', name: 'Kho', sound: 'Kho' },
  { letter: 'د', name: 'Dal', sound: 'Dal' },
  { letter: 'ذ', name: 'Dzal', sound: 'Dzal' },
  { letter: 'ر', name: 'Ro', sound: 'Ro' },
  { letter: 'ز', name: 'Zay', sound: 'Zay' },
  { letter: 'س', name: 'Sin', sound: 'Sin' },
  { letter: 'ش', name: 'Syin', sound: 'Syin' },
  { letter: 'ص', name: 'Shod', sound: 'Shod' },
  { letter: 'ض', name: 'Dhod', sound: 'Dhod' },
  { letter: 'ط', name: 'Tho', sound: 'Tho' },
  { letter: 'ظ', name: 'Zho', sound: 'Zho' },
  { letter: 'ع', name: 'Ain', sound: 'Ain' },
  { letter: 'غ', name: 'Gho', sound: 'Gho' },
  { letter: 'ف', name: 'Fa', sound: 'Fa' },
  { letter: 'ق', name: 'Qof', sound: 'Qof' },
  { letter: 'ك', name: 'Kaf', sound: 'Kaf' },
  { letter: 'ل', name: 'Lam', sound: 'Lam' },
  { letter: 'م', name: 'Mim', sound: 'Mim' },
  { letter: 'ن', name: 'Nun', sound: 'Nun' },
  { letter: 'و', name: 'Wau', sound: 'Wau' },
  { letter: 'ه', name: 'Ha', sound: 'Ha' },
  { letter: 'ي', name: 'Ya', sound: 'Ya' },
];

export const IQRO_DATA: IqroLevelData[] = [
  {
    id: 1,
    title: 'Iqro 1',
    desc: 'Pengenalan Huruf Hijaiyah Alif - Ya dengan Fathah (a).',
    longDesc: 'Fokus pada pengenalan bentuk tunggal huruf hijaiyah dengan tanda baca fathah yang dibaca pendek dan tegas.',
    color: 'emerald',
    items: [
      { arabic: 'اَ بَ', latin: 'A Ba' },
      { arabic: 'بَ تَ', latin: 'Ba Ta' },
      { arabic: 'تَ ثَ', latin: 'Ta Tsa' },
      { arabic: 'جَ حَ خَ', latin: 'Ja Ha Kho' },
      { arabic: 'دَ ذَ رَ', latin: 'Da Dza Ro' },
      { arabic: 'زَ سَ شَ', latin: 'Za Sa Sya' },
      { arabic: 'صَ ضَ طَ', latin: 'Sho Dho Tho' },
      { arabic: 'ظَ عَ غَ', latin: 'Zho \'A Gho' },
      { arabic: 'فَ قَ كَ', latin: 'Fa Qo Ka' },
      { arabic: 'لَ مَ نَ', latin: 'La Ma Na' },
      { arabic: 'وَ هَ يَ', latin: 'Wa Ha Ya' },
    ],
    tajwid: [
      { id: '1-1', name: 'Fathah', explanation: 'Tanda baca garis di atas huruf, dibaca "A".', example: 'اَ بَ', exampleLatin: 'A Ba' },
      { id: '1-2', name: 'Makhroj Alif', explanation: 'Bunyi keluar dari rongga mulut (Jauf).', example: 'اَ اَ اَ', exampleLatin: 'A A A' }
    ],
    quiz: [
      { id: 'q1-1', question: 'Manakah huruf "Ba" dengan fathah?', arabic: 'بَ', options: ['اَ', 'بَ', 'تَ', 'ثَ'], correctAnswer: 1 },
      { id: 'q1-2', question: 'Bagaimana cara membaca: جَ حَ خَ?', options: ['Ja Ha Kho', 'Ba Ta Tsa', 'Da Dza Ro'], correctAnswer: 0 }
    ]
  },
  {
    id: 2,
    title: 'Iqro 2',
    desc: 'Huruf Sambung & Bacaan Panjang (Mad Ashli).',
    longDesc: 'Belajar bagaimana huruf berubah bentuk saat disambung dan mengenal bacaan panjang dua harakat (Mad Ashli).',
    color: 'blue',
    items: [
      { arabic: 'بَـبَـبَ', latin: 'Ba-ba-ba' },
      { arabic: 'تَـتَـتَ', latin: 'Ta-ta-ta' },
      { arabic: 'بَا تَا ثَا', latin: 'Baa Taa Tsaa' },
      { arabic: 'جَا حَا خَا', latin: 'Jaa Haa Khaa' },
      { arabic: 'دَانَ كَانَ', latin: 'Daana Kaana' },
      { arabic: 'سَامَا رَامَا', latin: 'Saamaa Raamaa' },
      { arabic: 'تَـبَـارَكَ', latin: 'Tabaaroka' },
      { arabic: 'فَـسَـقَـطَ', latin: 'Fasaqotho' },
    ],
    tajwid: [
      { id: '2-1', name: 'Mad Ashli (Alif)', explanation: 'Huruf berharakat fathah bertemu Alif, dibaca panjang 2 harakat.', example: 'بَا تَا', exampleLatin: 'Baa Taa' },
      { id: '2-2', name: 'Huruf Sambung', explanation: 'Bentuk huruf berubah ketika berada di awal, tengah, atau akhir kata.', example: 'بَـبَـبَ', exampleLatin: 'Ba-ba-ba' }
    ],
    quiz: [
      { id: 'q2-1', question: 'Huruf yang dibaca panjang adalah...', arabic: 'بَا', options: ['بَ', 'بَا', 'بِ'], correctAnswer: 1 }
    ]
  },
  {
    id: 3,
    title: 'Iqro 3',
    desc: 'Kasroh (i), Dhommah (u), & Variasi Panjang.',
    longDesc: 'Memperkenalkan harakat Kasroh (i) dan Dhommah (u) serta latihan membedakan bunyi pendek dan panjang.',
    color: 'amber',
    items: [
      { arabic: 'اِيـبِي تِي', latin: 'Ii Bii Tii' },
      { arabic: 'اُو بُو تُو', latin: 'Uu Buu Tuu' },
      { arabic: 'عَلِيْمٌ', latin: '\'Aliimun' },
      { arabic: 'قَدِيْرٌ', latin: 'Qodiirun' },
      { arabic: 'يَـقُـوْلُ', latin: 'Yaquulu' },
      { arabic: 'صِدِيْقِي', latin: 'Shidiiqii' },
      { arabic: 'وَرَسُوْلُهُ', latin: 'Wa Rosuuluhu' },
      { arabic: 'بِصِيْرًا', latin: 'Bashiiron' },
    ],
    tajwid: [
      { id: '3-1', name: 'Kasroh', explanation: 'Garis di bawah huruf, dibaca "I". Jika bertemu Ya sukun, dibaca panjang.', example: 'بِي تِي', exampleLatin: 'Bii Tii' },
      { id: '3-2', name: 'Dhommah', explanation: 'Tanda seperti angka 9 kecil di atas, dibaca "U". Jika bertemu Wau sukun, dibaca panjang.', example: 'بُو تُو', exampleLatin: 'Buu Tuu' }
    ],
    quiz: [
      { id: 'q3-1', question: 'Tanda baca "u" disebut...', options: ['Fathah', 'Kasroh', 'Dhommah'], correctAnswer: 2 }
    ]
  },
  {
    id: 4,
    title: 'Iqro 4',
    desc: 'Tanwin & Bacaan Mati (Sukun).',
    longDesc: 'Mempelajari bunyi Tanwin (An, In, Un) dan huruf mati (Sukun), termasuk dasar-dasar Qolqolah.',
    color: 'indigo',
    items: [
      { arabic: 'اَنْ اِنْ اُنْ', latin: 'An In Un' },
      { arabic: 'بَنْ bِنْ بُنْ', latin: 'Ban Bin Bun' },
      { arabic: 'اَلْحَمْدُ', latin: 'Alhamdu' },
      { arabic: 'اَبْ اَتْ اَثْ', latin: 'Ab At Ats' },
      { arabic: 'مُسْلِمِيْنَ', latin: 'Muslimiina' },
      { arabic: 'تَبَّتْ يَدَا', latin: 'Tabbat Yadaa' },
      { arabic: 'وَلَمْ يَكُنْ', latin: 'Wa Lam Yakun' },
      { arabic: 'فَلْيَعْبُدُوْا', latin: 'Falya\'buduu' },
    ],
    tajwid: [
      { id: '4-1', name: 'Tanwin', explanation: 'Tanda harakat ganda, bunyinya diakhiri huruf "N".', example: 'اَنْ اِنْ اُنْ', exampleLatin: 'An In Un' },
      { id: '4-2', name: 'Sukun', explanation: 'Tanda lingkaran kecil, menunjukkan huruf mati/tidak berharakat.', example: 'اَلْحَمْدُ', exampleLatin: 'Al-hamdu' }
    ],
    quiz: [
      { id: 'q4-1', question: 'Bagaimana bunyi harakat Tanwin Dhommah?', options: ['An', 'In', 'Un'], correctAnswer: 2 }
    ]
  },
  {
    id: 5,
    title: 'Iqro 5',
    desc: 'Waqof, Tasydid, & Hukum Tajwid Dasar.',
    longDesc: 'Latihan membaca huruf bertasydid, mengenal cara berhenti (waqof), dan hukum Mim/Nun mati.',
    color: 'purple',
    items: [
      { arabic: 'اِنَّ لَمَّا', latin: 'Inna Lammaa' },
      { arabic: 'رَبِّ الْعَالَمِيْنَ', latin: 'Robbil \'Aalamiin' },
      { arabic: 'اِيَّاكَ نَعْبُdُ', latin: 'Iyyaaka Na\'budu' },
      { arabic: 'وَالصَّيْفِ', latin: 'Wash-shoif' },
      { arabic: 'قُلْ هُوَ اللّٰهُ', latin: 'Qul Huwallahu' },
      { arabic: 'مِنْ شَرِّ', latin: 'Min Syarri' },
      { arabic: 'بِمُؤْمِنِيْنَ', latin: 'Bimu-miniina' },
    ],
    tajwid: [
      { id: '5-1', name: 'Tasydid', explanation: 'Tanda seperti huruf "w" kecil, huruf dibaca rangkap/ditekan.', example: 'رَبِّ اِنَّ', exampleLatin: 'Robbi Inna' },
      { id: '5-2', name: 'Idgham Bighunnah', explanation: 'Nun mati/tanwin bertemu huruf tertentu, dibaca melebur dengan dengung.', example: 'مَنْ يَقُوْلُ', exampleLatin: 'May yaquulu' }
    ],
    quiz: [
      { id: 'q5-1', question: 'Tanda baca yang membuat huruf dibaca rangkap adalah...', options: ['Sukun', 'Tasydid', 'Tanwin'], correctAnswer: 1 }
    ]
  },
  {
    id: 6,
    title: 'Iqro 6',
    desc: 'Iqlab, Ikhfa, & Fawatihush Suwar.',
    longDesc: 'Tahap akhir sebelum Mushaf: Mempelajari Iqlab, Ikhfa, tanda waqof kompleks, dan huruf pembuka surat.',
    color: 'rose',
    items: [
      { arabic: 'مِنْ بَعْدِ', latin: 'Mim ba\'di (Iqlab)' },
      { arabic: 'اَنْفُسَكُمْ', latin: 'Anfusakum (Ikhfa)' },
      { arabic: 'الم', latin: 'Alif Laam Miim' },
      { arabic: 'كهيعص', latin: 'Kaaf Haa Yaa \'Aiin Shood' },
      { arabic: 'طٰسٰمٰ', latin: 'Thoo Siin Miim' },
      { arabic: 'بِغَيْبِهِ اَحَدًا', latin: 'Bighoibihii Ahadaa' },
      { arabic: 'وَالسَّمَاۤءِ', latin: 'Was-samaaa-i' },
    ],
    tajwid: [
      { id: '6-1', name: 'Ikhfa', explanation: 'Menyamarkan bunyi Nun mati/tanwin jika bertemu 15 huruf hijaiyah.', example: 'اَنْفُسَكُمْ', exampleLatin: 'Anfusakum' },
      { id: '6-2', name: 'Iqlab', explanation: 'Mengganti bunyi Nun mati/tanwin menjadi "M" jika bertemu huruf Ba.', example: 'مِنْ بَعْدِ', exampleLatin: 'Mim ba\'di' }
    ],
    quiz: [
      { id: 'q6-1', question: 'Jika Nun mati bertemu huruf Ba, hukumnya adalah...', options: ['Ikhfa', 'Iqlab', 'Izhar'], correctAnswer: 1 }
    ]
  }
];

export const DOA_LIST: Doa[] = [
  {
    id: '1',
    title: 'Doa Memohon Ampunan dan Kasih Sayang',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    latin: 'Rabbana zhalamna anfusana wa-in lam taghfir lana watarhamna lanakunanna minal-khasirin.',
    translation: 'Ya Tuhan kami, kami telah menzalimi diri sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi.',
    source: 'QS. Al-Araf: 23',
    ayahNumber: 977
  },
  {
    id: '2',
    title: 'Doa Kebaikan Dunia dan Akhirat',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbana atina fid-dunya hasanatan wafil-akhirati hasanatan waqina adzaban-nar.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    source: 'QS. Al-Baqarah: 201',
    ayahNumber: 208
  }
];

export const QARIS = [
  { identifier: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { identifier: 'ar.abdulsamad', name: 'Abdul Basit Abdus Samad' },
  { identifier: 'ar.huzayfi', name: 'Ali Hudhaifi' },
  { identifier: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
];