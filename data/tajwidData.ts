
export const tajwidData = [
  {
    rule: "Izhar Halqi",
    explanation: "Izhar (إِظْهَار) berarti 'jelas'. Jika Nun Sukun (نْ) atau Tanwin (ـًـــٍـــٌ) bertemu dengan salah satu dari enam huruf Halqi (tenggorokan), maka dibaca dengan jelas tanpa dengung.",
    letters: "ء هـ ع ح غ خ",
    examples: [
      { arabic: "مِنْهُ", latin: "min-hu" },
      { arabic: "عَذَابٌ أَلِيمٌ", latin: "ʿadhābun alīm" },
      { arabic: "فَرِيقًا هَدَىٰ", latin: "farīqan hadā" }
    ]
  },
  {
    rule: "Idgham",
    explanation: "Idgham (إِدْغَام) berarti 'meleburkan'. Terbagi menjadi dua jenis:",
    subRules: [
        {
            name: "Idgham Bi Ghunnah (dengan dengung)",
            explanation: "Meleburkan dengan dengung jika Nun Sukun atau Tanwin bertemu salah satu huruf: ي ن م و.",
            examples: [
              { arabic: "مَنْ يَقُولُ", latin: "may yaqūlu" },
              { arabic: "مِنْ وَلِيٍّ", latin: "miw waliyyin" }
            ]
        },
        {
            name: "Idgham Bila Ghunnah (tanpa dengung)",
            explanation: "Meleburkan tanpa dengung jika Nun Sukun atau Tanwin bertemu huruf: ل ر.",
            examples: [
              { arabic: "مِنْ لَدُنْهُ", latin: "mil ladunhu" },
              { arabic: "غَفُورٌ رَحِيمٌ", latin: "ghafūrur raḥīm" }
            ]
        }
    ]
  },
  {
    rule: "Iqlab",
    explanation: "Iqlab (إِقْلَاب) berarti 'mengganti'. Jika Nun Sukun atau Tanwin bertemu dengan huruf Ba (ب), maka suara Nun/Tanwin diubah menjadi suara Mim (م) yang didengungkan.",
    letters: "ب",
    examples: [
      { arabic: "مِنْ بَعْدِ", latin: "mim baʿdi" },
      { arabic: "سَمِيعٌ بَصِيرٌ", latin: "samīʿum baṣīr" }
    ]
  },
  {
    rule: "Ikhfa' Haqiqi",
    explanation: "Ikhfa' (إِخْفَاء) berarti 'samar'. Jika Nun Sukun atau Tanwin bertemu dengan 15 huruf sisa, maka dibaca samar-samar antara Izhar dan Idgham, sambil didengungkan.",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    examples: [
      { arabic: "أَنْفُسَكُمْ", latin: "anfusakum" },
      { arabic: "مِنْ شَرِّ", latin: "min syarrin" },
      { arabic: "رَجُلًا سَلَمًا", latin: "rajulan salaman" }
    ]
  },
  {
    rule: "Mad Thobi'i (Asli)",
    explanation: "Mad (مَدّ) berarti 'panjang'. Mad Thobi'i adalah bacaan panjang 2 harakat. Terjadi jika huruf berharakat Fathah diikuti Alif (ا), Kasrah diikuti Ya Sukun (يْ), atau Dhammah diikuti Wau Sukun (وْ).",
    examples: [
        { arabic: "قَالَ", latin: "qāla" },
        { arabic: "قِيْلَ", latin: "qīla" },
        { arabic: "يَقُوْلُ", latin: "yaqūlu" }
    ]
  }
];
