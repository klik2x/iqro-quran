export interface IqroItem {
  arabic: string;
  latin: string;
}

export interface IqroPage extends Array<IqroItem[]> {}

export interface IqroLevel {
  id: number;
  title: string;
  description: string;
  cover: string;
  pages: IqroPage[];
  totalItems: number;
}

// --- Data Generation for Iqro 1 (35 pages) ---
const iqro1Letters = [
  { arabic: "اَ", latin: "a" }, { arabic: "بَ", latin: "ba" }, { arabic: "تَ", latin: "ta" }, 
  { arabic: "ثَ", latin: "tsa" }, { arabic: "جَ", latin: "ja" }, { arabic: "حَ", latin: "ḥa" }, 
  { arabic: "خَ", latin: "kha" }, { arabic: "دَ", latin: "da" }, { arabic: "ذَ", latin: "dza" },
  { arabic: "رَ", latin: "ra" }, { arabic: "زَ", latin: "za" }, { arabic: "سَ", latin: "sa" },
  { arabic: "شَ", latin: "sya" }, { arabic: "صَ", latin: "ṣa" }, { arabic: "ضَ", latin: "ḍa" }
];

function generateIqro1Page(): IqroPage {
  const page: IqroPage = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < 6; i++) { // 6 rows
    const row: IqroItem[] = [];
    for (let j = 0; j < 2; j++) { // 2 columns
      let arabicStr = '';
      let latinStr = '';
      const numLetters = Math.random() > 0.3 ? 3 : 2; // 2 or 3 letters

      let combinationKey = '';
      do {
        const arabicParts: string[] = [];
        const latinParts: string[] = [];
        for (let k = 0; k < numLetters; k++) {
          const letter = iqro1Letters[Math.floor(Math.random() * iqro1Letters.length)];
          arabicParts.push(letter.arabic);
          latinParts.push(letter.latin);
        }
        arabicStr = arabicParts.join('');
        latinStr = latinParts.join(' ');
        combinationKey = arabicStr;
      } while (usedCombinations.has(combinationKey));
      
      usedCombinations.add(combinationKey);
      row.push({ arabic: arabicStr, latin: latinStr });
    }
    page.push(row);
  }
  return page;
}

const iqro1Pages = Array.from({ length: 35 }, generateIqro1Page);


export const iqroPageData: IqroLevel[] = [
  {
    id: 1,
    title: "IQRO 1",
    description: "Mengenal huruf hijaiyah satu per satu tanpa harakat.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_1.png",
    pages: iqro1Pages,
    totalItems: 35,
  },
  {
    id: 2,
    title: "IQRO 2",
    description: "Membaca huruf dengan harakat fathah dan menyambung dua huruf.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_2.png",
    pages: Array.from({ length: 30 }, generateIqro1Page), // Placeholder
    totalItems: 30,
  },
  {
    id: 3,
    title: "IQRO 3",
    description: "Mengenal harakat kasrah dan dhammah.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_3.png",
    pages: Array.from({ length: 30 }, generateIqro1Page), // Placeholder
    totalItems: 30,
  },
  {
    id: 4,
    title: "IQRO 4",
    description: "Mempelajari tanwin, sukun, dan syaddah.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_4.png",
    pages: Array.from({ length: 30 }, generateIqro1Page), // Placeholder
    totalItems: 30,
  },
  {
    id: 5,
    title: "IQRO 5",
    description: "Latihan membaca dengan bacaan panjang (madd) dan hukum tajwid dasar.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_5.png",
    pages: Array.from({ length: 30 }, generateIqro1Page), // Placeholder
    totalItems: 30,
  },
  {
    id: 6,
    title: "IQRO 6",
    description: "Lanjutan hukum tajwid, waqaf, dan persiapan membaca Al-Quran.",
    cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_6.png",
    pages: [], // Placeholder
    totalItems: 30,
  },
];
