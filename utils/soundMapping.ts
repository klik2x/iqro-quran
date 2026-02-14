
// This utility can be used to map common mispronunciations or local dialect spellings
// to their correct Arabic/Latin equivalents, primarily for improving voice command
// recognition or providing more forgiving input processing.

interface SoundMapping {
  [key: string]: string; // Maps a detected keyword/phrase to a normalized one
}

export const soundMappings: SoundMapping = {
  // Common mispronunciations or local variants
  "patihah": "al-fatihah",
  "fatihah": "al-fatihah",
  "baqarah": "al-baqarah",
  "iklas": "al-ikhlas",
  "an-nas": "an nas",
  "alif lam mim": "alif laam miim",

  // Commands mapping (if not handled by voiceTriggers directly)
  "lanjut": "next",
  "terus": "next",
  "berikutnya": "next",
  "ulang": "repeat",
  "ulangi": "repeat",
  "balik": "previous",
  "sebelumnya": "previous",
  "stop": "stop",
  "berhenti": "stop",
  "mulai": "start",
  "rekor": "start",
  "bantuan": "help",
  "tolong": "help",
};

/**
 * Normalizes a given input string based on predefined sound mappings.
 * It converts the input to lowercase and replaces known variants.
 * @param input The string to normalize.
 * @returns The normalized string.
 */
export const normalizeSoundInput = (input: string): string => {
  let normalized = input.toLowerCase();
  for (const key in soundMappings) {
    if (normalized.includes(key)) {
      normalized = normalized.replace(new RegExp(key, 'g'), soundMappings[key]);
    }
  }
  return normalized.trim();
};
