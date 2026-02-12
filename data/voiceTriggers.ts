
// data/voiceTriggers.ts

export const voiceTriggers = {
  // Navigasi Iqro dan Murotal
  'next': ['lanjut', 'berikutnya', 'next', 'selanjutnya', 'आगे', 'التالي'],
  'prev': ['kembali', 'sebelumnya', 'prev', 'balik', 'पीछे', 'السابق'],
  'repeat': ['ulang', 'ulangi', 'repeat', 'lagi', 'दोहराना', 'تكرار'],
  'play': ['putar', 'mainkan', 'play', 'शुरू', 'تشغيل'],
  'stop': ['berhenti', 'stop', 'pause', 'रोकना', 'ايقاف'],
  
  // Perintah Umum (contoh untuk ekstensi di masa depan)
  'home': ['beranda', 'home', 'घर', 'الرئيسية'],
  'mushaf': ['mushaf', 'quran', 'कुरान', 'مصحف'],
  'iqro': ['iqro', 'इक्रौ', 'اقرأ'],
  'bookmarks': ['bookmark', 'penanda', 'बुकमार्क', 'إشارات مرجعية'],
};

export const defaultVoiceLangMapping: Record<string, string> = {
  'id': 'id-ID',
  'en': 'en-US',
  'ar': 'ar-SA',
  // Tambahkan mapping bahasa lain sesuai kebutuhan
};

// Mapping dari kode bahasa ke nama suara yang disukai (preferensi)
export const preferredVoiceNames: Record<string, string> = {
  'id-ID': 'Google Bahasa Indonesia', // Contoh nama suara
  'en-US': 'Google US English', 
  'ar-SA': 'Google Arabic',
};

// data/voiceTriggers.ts (New File)

export const VOICE_TRIGGERS = {
  id: { // Indonesia
    next: ['lanjut', 'berikutnya', 'seterusnya'],
    prev: ['kembali', 'sebelumnya', 'balik'],
    repeat: ['ulang', 'sekali lagi', 'putar lagi'],
    highContrast: ['mode kontras', 'warna tajam', 'bantu penglihatan'],
    startRecord: ['mulai rekam', 'setoran', 'tes bacaan'],
  },
  en: { // English
    next: ['next', 'forward', 'continue'],
    prev: ['back', 'previous', 'return'],
    repeat: ['repeat', 'play again', 'once more'],
    highContrast: ['high contrast', 'vision aid', 'sharp color'],
    startRecord: ['start recording', 'test my reading', 'check tajwid'],
  },
  ar: { // Arabic
    next: ['التالي', 'استمر'],
    prev: ['السابق', 'عودة'],
    repeat: ['اعادة', 'مرة أخرى'],
    highContrast: ['تباين عال', 'وضع الرؤية'],
    startRecord: ['ابدأ التسجيل', 'اختبر قراءتي'],
  }
};
