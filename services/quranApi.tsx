
import { Surah, SurahDetail, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchAllSurahs = async (): Promise<Surah[]> => {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data;
};

export const fetchTranslationEditions = async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/edition/type/translation`);
    if (!response.ok) throw new Error('Failed to fetch translation editions');
    const data = await response.json();
    return data.data;
};

export const fetchTafsirEditions = async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/edition/type/tafsir`);
    if (!response.ok) throw new Error('Failed to fetch tafsir editions');
    const data = await response.json();
    return data.data;
};

export const fetchAudioEditions = async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/edition/format/audio`);
    if (!response.ok) throw new Error('Failed to fetch audio editions');
    const data = await response.json();
    return data.data;
};

const BISMILLAH_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const combineAyahData = (editions: any[]): Ayah[] => {
    const textEdition = editions.find(e => e.identifier === 'quran-uthmani' || e.format === 'text')?.ayahs || editions[0].ayahs;
    const translationEdition = editions.find(e => e.type === 'translation')?.ayahs || editions[1].ayahs;
    const transliterationEdition = editions.find(e => e.identifier === 'en.transliteration')?.ayahs || editions[2].ayahs;
    const audioEdition = editions.find(e => e.format === 'audio')?.ayahs || editions[3].ayahs;

    return textEdition.map((textAyah: any, index: number) => {
        let cleanText = textAyah.text;
        const currentSurahNum = textAyah.surah ? textAyah.surah.number : (editions[0].number || 0);
        
        // Remove Bismillah from Ayah 1 of all surahs except Fatihah (1) and Taubah (9)
        if (currentSurahNum !== 1 && currentSurahNum !== 9 && textAyah.numberInSurah === 1) {
            if (cleanText.startsWith(BISMILLAH_TEXT)) {
                cleanText = cleanText.replace(BISMILLAH_TEXT, '').trim();
            }
        }

        return {
            number: textAyah.number,
            text: cleanText,
            translation: translationEdition[index]?.text || "Terjemahan tidak tersedia",
            textLatin: transliterationEdition[index]?.text || "Latin tidak tersedia",
            audio: audioEdition[index]?.audio || "",
            numberInSurah: textAyah.numberInSurah,
            juz: textAyah.juz,
            manzil: textAyah.manzil,
            page: textAyah.page,
            ruku: textAyah.ruku,
            hizbQuarter: textAyah.hizbQuarter,
            sajda: typeof textAyah.sajda === 'boolean' ? textAyah.sajda : false,
            surah: textAyah.surah
        };
    });
};

export const fetchSurah = async (surahNumber: number, translationCode: string = 'id.indonesian'): Promise<SurahDetail> => {
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${translationCode},en.transliteration,ar.alafasy`);
    if (!response.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
    const data = await response.json();
    const editions = data.data;
    const surahInfo = editions[0];

    return {
        number: surahInfo.number,
        name: surahInfo.name,
        englishName: surahInfo.englishName,
        englishNameTranslation: surahInfo.englishNameTranslation,
        numberOfAyahs: surahInfo.numberOfAyahs,
        revelationType: surahInfo.revelationType,
        ayahs: combineAyahData(editions),
    };
};

export const fetchJuzDetail = async (juzNumber: number, translationCode: string = 'id.indonesian'): Promise<Ayah[]> => {
    const response = await fetch(`${BASE_URL}/juz/${juzNumber}/editions/quran-uthmani,${translationCode},en.transliteration,ar.alafasy`);
    if (!response.ok) throw new Error(`Failed to fetch Juz ${juzNumber}`);
    const data = await response.json();
    return combineAyahData(data.data);
};

export const fetchPageDetail = async (pageNumber: number, translationCode: string = 'id.indonesian'): Promise<Ayah[]> => {
    const response = await fetch(`${BASE_URL}/page/${pageNumber}/editions/quran-uthmani,${translationCode},en.transliteration,ar.alafasy`);
    if (!response.ok) throw new Error(`Failed to fetch Page ${pageNumber}`);
    const data = await response.json();
    return combineAyahData(data.data);
};

export const fetchTafsir = async (surahNumber: number, tafsirEdition: string = 'id.kemenag'): Promise<any> => {
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${tafsirEdition}`);
    if (!response.ok) throw new Error('Failed to fetch Tafsir');
    const data = await response.json();
    return data.data;
};
