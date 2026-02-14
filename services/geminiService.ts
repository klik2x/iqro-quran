import { GoogleGenAI, Modality } from "@google/genai";

// Audio Decoding Functions (as per guidelines)
export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Ensure global 'ai' instance is only for static calls, getGeminiInstance for dynamic key/context
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

// NEW INTERFACE: AudioPlaybackControls represents the immediate result of starting playback
export interface AudioPlaybackControls {
    sourceNode: AudioBufferSourceNode | null; // Can be null for Web Speech API
    controls: { onended: (() => void) | null };
}

// NEW INTERFACE: AudioPlayback represents an object that can initiate playback
export interface AudioPlayback {
    play: () => AudioPlaybackControls;
}

// Web Speech API fallback function with voice selection
const webSpeechSpeak = (text: string, lang: string = 'id-ID'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Web Speech API not supported in this browser.");
      reject(new Error("Web Speech API not supported."));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; 
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1; // 0.1 to 10
    utterance.pitch = 1; // 0 to 2
    
    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(
      (voice) => voice.lang.startsWith(lang.substring(0, 2)) && voice.localService
    ) || voices.find((voice) => voice.lang.startsWith(lang.substring(0,2))); // Fallback to language prefix

    if (desiredVoice) {
      utterance.voice = desiredVoice;
    } else {
      console.warn(`No suitable Web Speech API voice found for ${lang}, using default.`);
    }

    utterance.onend = () => {
        resolve();
    };
    utterance.onerror = (event) => {
        console.error("Web Speech API error:", event);
        reject(event.error);
    };
    window.speechSynthesis.speak(utterance);
  });
};

// Updated generateSpeech to support voice selection and Web Speech API fallback
export const generateSpeech = async (
  text: string, 
  languageHint: string = "Indonesian",
  voice: string = "Kore", // Gemini voice
  latinText?: string // Optional for Iqro: to speak after Arabic
): Promise<AudioPlayback> => {
  const controls = { onended: null as (() => void) | null };
  const fallbackLangCode = languageHint.toLowerCase().includes('indonesian') ? 'id-ID' : 'en-US';

  try {
    // Try Gemini TTS first
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-native-audio-preview-12-2025",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received from API.");
    }

    const audioBytes = decodeAudio(base64Audio);
    const audioBuffer = await decodeAudioData(audioBytes, outputAudioContext, 24000, 1);

    // FIX: playFn now returns AudioPlaybackControls
    const playFn = (): AudioPlaybackControls => {
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.onended = async () => {
            if (latinText) {
                // If Latin text exists, play it after the Arabic/primary text
                try {
                    await webSpeechSpeak(latinText, fallbackLangCode);
                } catch (e) {
                    console.error("Failed to speak Latin text with Web Speech API:", e);
                }
            }
            if (controls.onended) controls.onended();
        };
        source.start();
        return { sourceNode: source, controls };
    };

    // FIX: Only return the play function
    return { play: playFn };

  } catch (error) {
    console.warn("Gemini TTS failed, falling back to Web Speech API:", error);
    // Fallback to Web Speech API
    // FIX: playFn now returns AudioPlaybackControls
    const playFn = (): AudioPlaybackControls => {
      webSpeechSpeak(text, fallbackLangCode)
        .then(async () => {
            if (latinText) {
                try {
                    await webSpeechSpeak(latinText, fallbackLangCode);
                } catch (e) {
                    console.error("Web Speech API Latin fallback failed:", e);
                }
            }
        })
        .then(() => { if (controls.onended) controls.onended(); })
        .catch(e => console.error("Web Speech API fallback failed:", e));
      return { sourceNode: null, controls };
    };
    // FIX: Only return the play function
    return { play: playFn };
  }
};

// Added speakText as a wrapper for generateSpeech
// FIX: speakText now directly returns the AudioPlayback object from generateSpeech
export const speakText = async (text: string, voice: string = "Kore", languageHint: string = "Indonesian", latinText?: string): Promise<AudioPlayback> => {
  return generateSpeech(text, languageHint, voice, latinText);
};

export const translateTexts = async (
  texts: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> => {
  try {
    const prompt = `Translate the JSON object values from Indonesian to ${targetLanguage}. Maintain the JSON structure and keys exactly. Only translate the string values. Here is the JSON object: ${JSON.stringify(texts)}`;
    
    // FIX: Initialize GoogleGenAI instance inside the function to ensure API key is fresh
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiInstance.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const translatedText = response.text;
    if (!translatedText) {
      throw new Error('No response text from translation API');
    }
    
    const cleanedJsonString = translatedText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    throw error;
  }
};