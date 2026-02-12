
// utils/browserSpeech.ts

let speechUtterance: SpeechSynthesisUtterance | null = null;
let currentVoice: SpeechSynthesisVoice | null = null;
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Memuat dan meng-cache daftar suara yang tersedia di Web Speech API.
 * Ini memastikan `getVoices` tidak mengembalikan array kosong jika dipanggil terlalu cepat.
 * @returns Promise yang akan resolve dengan array SpeechSynthesisVoice.
 */
const loadAndCacheVoices = (): Promise<SpeechSynthesisVoice[]> => {
  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }
  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise(resolve => {
    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      cachedVoices = currentVoices;
      resolve(cachedVoices);
      voicesLoadedPromise = null; // Reset promise setelah resolving
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        resolve(cachedVoices);
        window.speechSynthesis.onvoiceschanged = null; // Hapus listener setelah suara dimuat
        voicesLoadedPromise = null; // Reset promise setelah resolving
      };
    }
  });
  return voicesLoadedPromise;
};

// Segera coba muat suara saat skrip dieksekusi
if (window.speechSynthesis) {
    loadAndCacheVoices();
}


/**
 * Menghentikan proses pembacaan yang sedang berlangsung.
 */
export const stopSpeaking = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Mengucapkan teks menggunakan Web Speech API.
 * @param text Teks yang akan diucapkan.
 * @param lang Kode bahasa (contoh: 'id-ID', 'en-US', 'ar-SA').
 * @param voiceName Opsional: Nama suara yang spesifik (contoh: 'Google Bahasa Indonesia').
 * @param onEndCallback Opsional: Callback yang dipanggil saat ucapan selesai atau terjadi error.
 */
export const speak = async (text: string, lang: string = 'id-ID', voiceName?: string, onEndCallback?: () => void) => {
  stopSpeaking(); // Hentikan pembacaan sebelumnya

  if (!window.speechSynthesis) {
    console.warn('Speech Synthesis API not supported in this browser.');
    if (onEndCallback) onEndCallback(); // Panggil callback meskipun API tidak didukung
    return;
  }

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = lang;

  // Tunggu hingga suara dimuat
  const voices = await loadAndCacheVoices();

  // Prioritaskan voiceName yang diminta
  if (voiceName) {
    currentVoice = voices.find(voice => voice.name === voiceName && voice.lang.startsWith(lang.substring(0,2)));
  }

  // Jika tidak ditemukan, coba cari suara default untuk bahasa yang diminta
  if (!currentVoice) {
    currentVoice = voices.find(voice => voice.lang.startsWith(lang.substring(0, 2)) && voice.default);
  }

  // Jika masih belum ada, ambil suara pertama yang cocok dengan bahasa
  if (!currentVoice) {
    currentVoice = voices.find(voice => voice.lang.startsWith(lang.substring(0, 2)));
  }

  // Jika masih belum ada, gunakan suara default sistem (jika ada)
  if (!currentVoice && voices.length > 0) {
    currentVoice = voices[0];
  }
  
  if (currentVoice) {
    speechUtterance.voice = currentVoice;
  } else {
    console.warn("No suitable voice found, using browser default.");
  }

  // Pengaturan kecepatan dan pitch (opsional, bisa disesuaikan)
  speechUtterance.rate = 1; // Kecepatan (0.1 to 10, default 1)
  speechUtterance.pitch = 1; // Nada (0 to 2, default 1)

  // Lampirkan onEndCallback
  speechUtterance.onend = () => {
    if (onEndCallback) onEndCallback();
  };
  speechUtterance.onerror = (event) => {
    console.error("Browser TTS error:", event);
    if (onEndCallback) onEndCallback(); // Panggil onEndCallback bahkan saat error
  };

  window.speechSynthesis.speak(speechUtterance);
};

/**
 * Mengambil daftar suara yang tersedia di Web Speech API.
 * Mengembalikan Promise yang akan resolve dengan daftar suara.
 * @returns Promise<SpeechSynthesisVoice[]>.
 */
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return loadAndCacheVoices();
};
