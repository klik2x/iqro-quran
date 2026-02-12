
import { GoogleGenAI, Modality } from "@google/genai";
import { speak, stopSpeaking, getVoices } from '../utils/browserSpeech'; // Import browser speech utilities
import { preferredVoiceNames, defaultVoiceLangMapping } from '../data/voiceTriggers';
// FIX: Import 'languages' array from LanguageContext
import { languages } from '../contexts/LanguageContext';

// Audio Decoding Functions (as per guidelines)
// Renamed to decodeAudio and exported to fix missing export in RecordingModule
export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Added and exported encode function as per guidelines for Live API/RecordingModule
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
  // Check for empty data before attempting to decode.
  if (data.byteLength === 0) {
    throw new Error("Cannot decode empty audio data.");
  }
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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Added helper to get Gemini instance for Live API as used in RecordingModule
export const getGeminiInstance = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

export interface AudioPlayback {
    // play function now returns an object with sourceNode (optional) and controls
    play: () => {
        sourceNode: AudioBufferSourceNode | undefined; // sourceNode is undefined for browser speech fallback
        controls: { onended: (() => void) | null }
    };
    sourceNode?: AudioBufferSourceNode; // Can be undefined for browser speech
    controls: { onended: (() => void) | null };
}

// Updated generateSpeech to support voice selection and fallback to browser TTS
export const generateSpeech = async (
  text: string, 
  languageName: string = "Indonesian",
  voice: string = "Kore" // This is a Gemini voice name
): Promise<AudioPlayback> => {
  stopSpeaking(); // Ensure browser speech is stopped before starting new playback

  const controls = { onended: null as (() => void) | null };
  
  const fallbackToBrowserSpeech = async (error: any) => {
    console.warn(`Gemini TTS failed (${error?.message || 'unknown error'}), falling back to browser speech for: "${text}"`);
    // Ensure language code mapping is correct
    const langCode = languages.find(l => l.name === languageName)?.code || 'id';
    const browserLang = defaultVoiceLangMapping[langCode] || 'id-ID';

    const playBrowserSpeech = () => {
        // Calls the updated speak function from browserSpeech.ts with the onEndCallback
        speak(text, browserLang, undefined, () => {
            if (controls.onended) controls.onended();
        });
        return { sourceNode: undefined, controls };
    };

    return { 
        play: playBrowserSpeech,
        controls 
    };
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
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
      throw new Error("No audio data received from Gemini API.");
    }
    // Check if base64Audio is empty or malformed
    if (typeof base64Audio !== 'string' || base64Audio.length === 0) {
        throw new Error("Received empty or invalid base64 audio data from Gemini API.");
    }

    const audioBytes = decodeAudio(base64Audio);
    
    // Check if audioBytes is empty
    if (audioBytes.byteLength === 0) {
        throw new Error("Decoded audio bytes are empty. Malformed base64?");
    }

    const audioBuffer = await decodeAudioData(audioBytes, outputAudioContext, 24000, 1);
    
    const play = () => {
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.onended = () => {
            if (controls.onended) controls.onended();
        };
        source.start();
        return { sourceNode: source, controls };
    };

    // ONLY return the play function, DO NOT auto-play here.
    return { play, controls };

  } catch (error: any) {
    console.error("Error in generateSpeech service with Gemini:", error);
    // Fallback to browser speech on error
    return fallbackToBrowserSpeech(error);
  }
};

// Added speakText as a wrapper for generateSpeech to fix error in IqroModule
// This function will also benefit from the fallback logic in generateSpeech
export const speakText = async (text: string, voice: string = "Kore") => {
  try {
    const { play } = await generateSpeech(text, "Indonesian", voice);
    play(); // Explicitly call play() here
  } catch (error) {
    console.error("speakText error:", error);
  }
};

export const translateTexts = async (
  texts: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> => {
  try {
    const prompt = `Translate the JSON object values from Indonesian to ${targetLanguage}. Maintain the JSON structure and keys exactly. Only translate the string values. Here is the JSON object: ${JSON.stringify(texts)}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // FIX: Use {text: prompt} for contents as per guidelines
      contents: [{text: prompt}],
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
