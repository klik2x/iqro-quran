
export const tajwidData = [
  {
    rule: "Izhar Halqi",
    explanation: "Izhar means clear pronunciation. If Noon Sukun (نْ) or Tanwin (ـًـٍـٌ) is followed by any of the six throat letters (ء هـ ع ح غ خ), it must be pronounced clearly without nasalization (ghunnah).",
    letters: "ء هـ ع ح غ خ",
    colorClass: "text-green-600 dark:text-green-400", // New: Color for Izhar
    examples: [
      { arabic: "مِنْهُ", latin: "min-hu", highlight: "نْه" },
      { arabic: "عَذَابٌ أَلِيمٌ", latin: "ʿadhābun alīm", highlight: "بٌ أ" },
      { arabic: "فَرِيقًا هَدَىٰ", latin: "farīqan hadā", highlight: "قًا ه" }
    ]
  },
  {
    rule: "Idgham",
    explanation: "Idgham (إِدْغَام) berarti 'meleburkan'. Terbagi menjadi dua jenis:",
    colorClass: "text-blue-600 dark:text-blue-400", // New: Color for Idgham
    subRules: [
        {
            name: "Idgham Bi Ghunnah (dengan dengung)",
            explanation: "Meleburkan dengan dengung jika Nun Sukun atau Tanwin bertemu salah satu huruf: ي ن م و.",
            colorClass: "text-blue-500 dark:text-blue-300", // New: Specific color for sub-rule
            examples: [
              { arabic: "مَنْ يَقُولُ", latin: "may yaqūlu", highlight: "نْ ي" },
              { arabic: "مِنْ وَلِيٍّ", latin: "miw waliyyin", highlight: "نْ و" }
            ]
        },
        {
            name: "Idgham Bila Ghunnah (tanpa dengung)",
            explanation: "Meleburkan tanpa dengung jika Nun Sukun atau Tanwin bertemu huruf: ل ر.",
            colorClass: "text-blue-700 dark:text-blue-500", // New: Specific color for sub-rule
            examples: [
              { arabic: "مِنْ لَدُنْهُ", latin: "mil ladunhu", highlight: "نْ ل" },
              { arabic: "غَفُورٌ رَحِيمٌ", latin: "ghafūrur raḥīm", highlight: "رٌ ر" }
            ]
        }
    ]
  },
  {
    rule: "Iqlab",
    explanation: "Iqlab (إِقْلَاب) berarti 'mengganti'. Jika Nun Sukun atau Tanwin bertemu dengan huruf Ba (ب), maka suara Nun/Tanwin diubah menjadi suara Mim (م) yang didengungkan.",
    letters: "ب",
    colorClass: "text-purple-600 dark:text-purple-400", // New: Color for Iqlab
    examples: [
      { arabic: "مِنْ بَعْدِ", latin: "mim baʿdi", highlight: "نْ ب" },
      { arabic: "سَمِيعٌ بَصِيرٌ", latin: "samīʿum baṣīr", highlight: "عٌ ب" }
    ]
  },
  {
    rule: "Ikhfa' Haqiqi",
    explanation: "Ikhfa' (إِخْفَاء) berarti 'samar'. Jika Nun Sukun atau Tanwin bertemu dengan 15 huruf sisa, maka dibaca samar-samar antara Izhar dan Idgham, sambil didengungkan.",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    colorClass: "text-amber-600 dark:text-amber-400", // New: Color for Ikhfa
    examples: [
      { arabic: "أَنْفُسَكُمْ", latin: "anfusakum", highlight: "نْف" },
      { arabic: "مِنْ شَرِّ", latin: "min syarrin", highlight: "نْ ش" },
      { arabic: "رَجُلًا سَلَمًا", latin: "rajulan salaman", highlight: "لًا س" }
    ]
  },
  {
    rule: "Mad Thobi'i (Asli)",
    explanation: "Mad (مَدّ) berarti 'panjang'. Mad Thobi'i adalah bacaan panjang 2 harakat. Terjadi jika huruf berharakat Fathah diikuti Alif (ا), Kasrah diikuti Ya Sukun (يْ), atau Dhammah diikuti Wau Sukun (وْ).",
    colorClass: "text-red-600 dark:text-red-400", // New: Color for Mad Thobi'i
    examples: [
        { arabic: "قَالَ", latin: "qāla", highlight: "قَا" },
        { arabic: "قِيْلَ", latin: "qīla", highlight: "قِي" },
        { arabic: "يَقُوْلُ", latin: "yaqūlu", highlight: "قُو" }
    ]
  }
];