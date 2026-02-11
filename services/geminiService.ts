
import { GoogleGenAI, Modality } from "@google/genai";

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

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Added helper to get Gemini instance for Live API as used in RecordingModule
export const getGeminiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

export interface AudioPlayback {
    play: () => {
        sourceNode: AudioBufferSourceNode,
        controls: { onended: (() => void) | null }
    };
    sourceNode: AudioBufferSourceNode;
    controls: { onended: (() => void) | null };
}

// Updated generateSpeech to support voice selection
export const generateSpeech = async (
  text: string, 
  language: string = "Indonesian",
  voice: string = "Kore"
): Promise<AudioPlayback> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: ['AUDIO'],
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

    const controls = { onended: null as (() => void) | null };
    
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

    const { sourceNode } = play();
    return { play, sourceNode, controls };

  } catch (error) {
    console.error("Error in generateSpeech service:", error);
    throw error;
  }
};

// Added speakText as a wrapper for generateSpeech to fix error in IqroModule
export const speakText = async (text: string, voice: string = "Kore") => {
  try {
    const { play } = await generateSpeech(text, "Indonesian", voice);
    play();
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
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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