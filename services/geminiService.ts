
import { GoogleGenAI, Modality } from "@google/genai";

// Audio Decoding Functions (as per guidelines)
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
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

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Gemini API key is not set. Please set GEMINI_API_KEY in your environment variables.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

interface AudioPlayback {
    play: () => {
        sourceNode: AudioBufferSourceNode,
        controls: { onended: (() => void) | null }
    };
    sourceNode: AudioBufferSourceNode;
    controls: { onended: (() => void) | null };
}

export const generateSpeech = async (text: string): Promise<AudioPlayback> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Baca dengan jelas: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, clear voice suitable for teaching
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received from API.");
    }

    const audioBytes = decode(base64Audio);
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

    // Initial play to return the source node
    const { sourceNode } = play();

    return { play, sourceNode, controls };

  } catch (error) {
    console.error("Error in generateSpeech service:", error);
    throw error;
  }
};


export const translateTexts = async (
  texts: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `Translate the JSON object values from Indonesian to ${targetLanguage}. Maintain the JSON structure and keys exactly. Only translate the string values. Here is the JSON object: ${JSON.stringify(texts)}`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const translatedText = response.text;
    if (!translatedText) {
      throw new Error('No response text from translation API');
    }
    
    // The response text might be wrapped in markdown ```json ... ```, let's clean it.
    const cleanedJsonString = translatedText.replace(/^```json\s*|```\s*$/g, '').trim();
    
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    throw error;
  }
};
