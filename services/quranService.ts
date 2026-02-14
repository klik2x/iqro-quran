
import { Surah, Ayah, Qari, SurahDetail } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries: number = 3): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0 && response.status !== 404) {
      await sleep(1000);
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await sleep(1000);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const text = await response.text();
      errorMessage += ` - ${text}`;
    } catch (e) {}
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.data;
};

export const fetchAllSurahs = async (): Promise<Surah[]> => {
  const response = await fetchWithRetry(`${BASE_URL}/surah`);
  return handleResponse(response);
};

export const fetchSurahWithTranslation = async (surahNumber: number, lang: string = 'id.indonesian'): Promise<any> => {
  const editions = ['quran-uthmani', lang, 'en.transliteration'];
  const promises = editions.map(async (edition) => {
    const response = await fetchWithRetry(`${BASE_URL}/surah/${surahNumber}/${edition}`);
    return handleResponse(response);
  });
  return Promise.all(promises);
};

export const fetchTafsir = async (surahNumber: number, tafsirEdition: string = 'id.jalalayn'): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/surah/${surahNumber}/${tafsirEdition}`);
    return handleResponse(response);
};

export const fetchTranslationEditions = async (): Promise<any[]> => {
    const response = await fetchWithRetry(`${BASE_URL}/edition/type/translation`);
    return handleResponse(response);
};

export const fetchJuz = async (juzNumber: number, lang: string = 'id.indonesian') => {
  const editions = ['quran-uthmani', lang, 'en.transliteration'];
  const promises = editions.map(async (edition) => {
    const response = await fetchWithRetry(`${BASE_URL}/juz/${juzNumber}/${edition}`);
    return handleResponse(response);
  });
  return Promise.all(promises);
};

export const searchQuran = async (keyword: string, surah: number | 'all', language: string) => {
  const url = `${BASE_URL}/search/${keyword}/${surah}/${language}`;
  const response = await fetchWithRetry(url);
  return handleResponse(response);
};

export const fetchDailyAyah = async () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const ayahNumber = (dayOfYear % 6236) + 1;
  const response = await fetchWithRetry(`${BASE_URL}/ayah/${ayahNumber}/editions/quran-uthmani,id.indonesian`);
  return handleResponse(response);
};

// Merged from quranApi.tsx for use in Rekam and Dashboard
export const fetchSurah = async (surahNumber: number): Promise<SurahDetail> => {
    const response = await fetchWithRetry(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.sahih,en.transliteration,ar.alafasy`);
    const data = await response.json();
    const editions = data.data;

    if (!editions || editions.length < 4) {
        throw new Error('Could not fetch all required editions for the surah.');
    }

    const surahInfo = editions[0];

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
