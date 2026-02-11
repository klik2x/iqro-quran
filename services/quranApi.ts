import { Surah, SurahDetail, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

interface ApiSurah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: 'Meccan' | 'Medinan';
}

export const fetchAllSurahs = async (): Promise<Surah[]> => {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) {
        throw new Error('Network response was not ok for fetching all surahs');
    }
    const data = await response.json();
    return data.data;
};

const combineAyahData = (editions: any[]): Ayah[] => {
    const textEdition = editions[0].ayahs;
    const translationEdition = editions[1].ayahs;
    const transliterationEdition = editions[2].ayahs;
    const audioEdition = editions[3].ayahs;

    return textEdition.map((textAyah: any, index: number) => {
        return {
            number: textAyah.number,
            text: textAyah.text,
            translation: translationEdition[index].text,
            textLatin: transliterationEdition[index].text,
            audio: audioEdition[index].audio,
            numberInSurah: textAyah.numberInSurah,
            juz: textAyah.juz,
            manzil: textAyah.manzil,
            page: textAyah.page,
            ruku: textAyah.ruku,
            hizbQuarter: textAyah.hizbQuarter,
            sajda: typeof textAyah.sajda === 'boolean' ? textAyah.sajda : false,
        };
    });
};

export const fetchSurah = async (surahNumber: number): Promise<SurahDetail> => {
    // Fetching multiple editions: Arabic text, English translation, transliteration, and audio
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.sahih,en.transliteration,ar.alafasy`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for fetching surah ${surahNumber}`);
    }
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