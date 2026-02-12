
// utils/soundMapping.ts

/**
 * Peta untuk menormalisasi frasa yang diucapkan ke bentuk kanonik.
 * Berguna untuk menangani salah ucap, dialek, atau variasi pengucapan.
 * Kunci harus dalam lowercase.
 */
export const soundMapping: Map<string, string> = new Map([
  // Contoh untuk Al-Fatihah
  ['patihah', 'Al-Fatihah'],
  ['fatihah', 'Al-Fatihah'],
  ['fatehah', 'Al-Fatihah'],
  ['patehah', 'Al-Fatihah'],
  
  // Contoh untuk nomor Juz
  ['juz satu', 'juz 1'],
  ['juz dua', 'juz 2'],
  ['juz empat', 'juz 4'],
  // ... tambahkan untuk semua nomor yang mungkin disalahucapkan

  // Contoh untuk huruf Hijaiyah atau Iqro
  ['alif ba', 'alif ba ta'],
  ['alif bata', 'alif ba ta'],
  ['alip', 'alif'],
  ['jim', 'ja'], // jika "ja" adalah bentuk yang diharapkan
  ['ha', 'ḥa'], // jika ada perbedaan antara ح dan ه
  
  // Contoh untuk perintah navigasi
  ['lanjutkan', 'lanjut'],
  ['maju', 'lanjut'],
  ['mundur', 'kembali'],
  ['ulangi lagi', 'ulang'],
  ['tolong ulang', 'ulang'],
  ['putarkan', 'putar'],
  ['hentikan', 'berhenti'],
  ['berhenti putar', 'stop'],

  // Variasi bahasa Inggris
  ['next page', 'next'],
  ['previous page', 'prev'],
  ['go back', 'prev'],
  ['go to next', 'next'],
  ['go to previous', 'prev'],
  ['play sound', 'play'],
  ['stop sound', 'stop'],
  ['restart', 'repeat'],

  // Variasi bahasa Arab (contoh sederhana, bisa lebih kompleks)
  ['التالي', 'next'], // al-tali
  ['السابق', 'prev'], // al-sabik
  ['تكرار', 'repeat'], // takrar
  ['تشغيل', 'play'], // tashghil
  ['ايقاف', 'stop'], // iqaf
]);

export const getSurahFromVoice = (transcript: string): number | null => {
  const cleanText = transcript.toLowerCase().replace(/\s/g, '');
  
  // 1. Cek dari mapping alias
  for (const [alias, id] of Object.entries(surahAliasMap)) {
    if (cleanText.includes(alias)) return id;
  }
  
  return null;
};


// utils/soundMapping.ts (Pencocokan Dialek Lokal Indonesia)
export const surahSoundMap: Record<string, number> = {
  // Mapping dialek "Lidah Indonesia" ke ID Surah
 // utils/soundMapping.ts (Pencocokan Dialek Lokal Indonesia)
export const surahSoundMap: Record<string, number> = {
  // Mapping dialek "Lidah Indonesia" ke ID Surah
  "alpatikah": 1, "patihah": 1, "fatihah": 1,
  "bakoroh": 2, "sapi": 2, "baqarah": 2,
  "ali imron": 3, "imron": 3,
  "an-nisa": 4, "nisa": 4,
  "yasin": 36, "yasinan": 36,
  "tabarok": 67, "al-mulk": 67,
  "kulhu": 112, "ikhlas": 112, // Sangat penting untuk lansia
  "palaq": 113, "annas": 114
};

export const matchSurahVoice = (transcript: string): number | null => {
  const normalized = transcript.toLowerCase().trim();
  
  // Cari kecocokan parsial
  const found = Object.keys(surahSoundMap).find(key => normalized.includes(key));
  return found ? surahSoundMap[found] : null;
}; "alpatikah": 1, "patihah": 1, "fatihah": 1,
  "bakoroh": 2, "sapi": 2, "baqarah": 2,
  "ali imron": 3, "imron": 3,
  "an-nisa": 4, "nisa": 4,
  "yasin": 36, "yasinan": 36,
  "tabarok": 67, "al-mulk": 67,
  "kulhu": 112, "ikhlas": 112, // Sangat penting untuk lansia
  "palaq": 113, "annas": 114
};

export const matchSurahVoice = (transcript: string): number | null => {
  const normalized = transcript.toLowerCase().trim();
  
  // Cari kecocokan parsial
  const found = Object.keys(surahSoundMap).find(key => normalized.includes(key));
  return found ? surahSoundMap[found] : null;
};
