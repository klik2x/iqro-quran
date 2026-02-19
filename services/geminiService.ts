
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

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

// NEW INTERFACE: AudioPlaybackControls represents the immediate result of starting playback
export interface AudioPlaybackControls {
    sourceNode: AudioBufferSourceNode | null; // Can be null for Web Speech API
    controls: { onended: (() => void) | null; onpaused: (() => void) | null }; // Added onpaused
    stop: () => void;
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
    utterance.volume = 1; // 0 to 1
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1; // 0 to 2
    
    // Attempt to find a suitable voice
    const voices = window.speechSynthesis.getVoices();

    // Prioritize specific Arabic voice if lang starts with 'ar'
    if (lang.startsWith('ar')) {
        utterance.lang = 'ar-SA'; // Explicitly set for Arabic
        const arabicVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Arabic') || v.name.includes('Amira') || v.name.includes('Tarab') || v.name.includes('Laila')));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        } else {
            console.warn(`No specific Arabic Web Speech API voice found for ${lang}, using default Arabic.`);
        }
    } else {
        utterance.lang = lang;
        // Find voice for the requested language or a generic local one
        const localVoice = voices.find((voice) => voice.lang.startsWith(lang.substring(0, 2)) && voice.localService) 
                           || voices.find((voice) => voice.lang.startsWith(lang.substring(0,2)));
        if (localVoice) {
            utterance.voice = localVoice;
        } else {
            console.warn(`No suitable Web Speech API voice found for ${lang}, using default.`);
        }
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
  isArabic: boolean = false, // Flag to indicate if text is Arabic
  latinText?: string, // Optional for Iqro: to speak after Arabic
  isIqroContent: boolean = false // NEW: Flag to force Web Speech API for Iqro
): Promise<AudioPlayback> => {
  const controls = { onended: null as (() => void) | null, onpaused: null as (() => void) | null };
  // Determine fallback language codes
  const arabicLangCode = 'ar-SA';
  const localLangCode = languageHint.toLowerCase().includes('indonesian') ? 'id-ID' : navigator.language || 'en-US';

  // Determine the primary language for Web Speech API
  const primaryWebSpeechLang = isArabic ? arabicLangCode : localLangCode;

  // --- FORCE WEB SPEECH API for Iqro content ---
  if (isIqroContent) {
    console.log("Using Web Speech API for Iqro content:", text, primaryWebSpeechLang);
    const playFn = (): AudioPlaybackControls => {
        let isStopped = false;
        const stopAllPlayback = () => {
            isStopped = true;
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            if (controls.onpaused) controls.onpaused();
        };

        const speakSequence = async () => {
            if (isStopped) return;
            try {
                // Play main text (Arabic or non-Arabic explanation)
                await webSpeechSpeak(text, primaryWebSpeechLang);
                if (isStopped) return;
                
                // Then, play Latin text if provided (always in local language)
                if (latinText) {
                    await webSpeechSpeak(latinText, localLangCode);
                }
            } catch (e) {
                console.error("Web Speech API failed for Iqro content:", e);
                // Fallback to alert if Web Speech API also fails
                alert("Gagal memutar audio Iqro. Periksa dukungan browser Anda.");
            } finally {
                if (!isStopped && controls.onended) controls.onended();
            }
        };
        speakSequence();
        return { sourceNode: null, controls, stop: stopAllPlayback };
    };
    return { play: playFn };
  }


  // --- Otherwise, proceed with Gemini API logic (for non-Iqro content like Murotal, Tafsir, Rekam, SetoranBerhadiah) ---
  try {
    // FIX: Initialize GoogleGenAI instance inside the function to ensure API key is fresh
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-native-audio-preview-12-2025", // Use native audio model for TTS
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voice as any } },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        const audioBytes = decodeAudio(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, outputAudioContext, 24000, 1);
        
        const geminiPlaybackControls: AudioPlaybackControls = {
            sourceNode: null, // Will be set on play
            controls: { onended: null, onpaused: null },
            stop: () => {
                if (geminiPlaybackControls.sourceNode) {
                    geminiPlaybackControls.sourceNode.stop();
                    geminiPlaybackControls.sourceNode = null; // Clear source node after stopping
                }
            }
        };

        // Store the buffer for playing later
        (geminiPlaybackControls as any).audioBuffer = audioBuffer;

        const playFn = (): AudioPlaybackControls => {
            let isStopped = false;

            const stopAllPlayback = () => {
                isStopped = true;
                if (geminiPlaybackControls.sourceNode) {
                    geminiPlaybackControls.sourceNode.stop();
                    geminiPlaybackControls.sourceNode = null;
                }
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
                if (controls.onpaused) controls.onpaused();
            };

            const playSequence = async () => {
                if (isStopped) return;

                try {
                    // Play Gemini audio
                    const source = outputAudioContext.createBufferSource();
                    source.buffer = (geminiPlaybackControls as any).audioBuffer;
                    source.connect(outputAudioContext.destination);
                    
                    geminiPlaybackControls.sourceNode = source; // Store reference
                    
                    await new Promise<void>((resolve) => {
                        source.onended = () => {
                            geminiPlaybackControls.sourceNode = null; // Clear reference
                            resolve();
                        };
                        source.start();
                    });
                } catch (e) {
                    console.error("Error during Gemini playback:", e);
                    // In case of error during playback, try to stop everything
                    stopAllPlayback();
                } finally {
                    if (!isStopped && controls.onended) controls.onended();
                }
            };
            
            playSequence();
            return { sourceNode: geminiPlaybackControls.sourceNode || null, controls, stop: stopAllPlayback };
        };

        return { play: playFn };

    } else {
        throw new Error("No audio data received from Gemini API.");
    }

  } catch (error) {
    console.warn("Gemini TTS failed, falling back to Web Speech API:", error);
    // --- Fallback to Web Speech API ---
    const playFn = (): AudioPlaybackControls => {
      let isStopped = false;

      const stopAllPlayback = () => {
          isStopped = true;
          if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
          }
          if (controls.onpaused) controls.onpaused();
      };

      const speakSequence = async () => {
        if (isStopped) return;
        try {
            // Speak primary text
            await webSpeechSpeak(text, primaryWebSpeechLang);
            if (isStopped) return;
            
            // Speak Latin text if provided (shouldn't happen for non-Iqro contexts, but for safety)
            if (latinText) {
                await webSpeechSpeak(latinText, localLangCode);
                if (isStopped) return;
            }
        } catch (e) {
            console.error("Web Speech API fallback failed:", e);
            alert("Gagal memutar audio. Periksa koneksi atau dukungan browser.");
        } finally {
            if (!isStopped && controls.onended) controls.onended();
        }
      };
      
      speakSequence();
      
      return { sourceNode: null, controls, stop: stopAllPlayback };
    };
    return { play: playFn };
  }
};

// Added speakText as a wrapper for generateSpeech
export const speakText = async (text: string, voice: string = "Kore", languageHint: string = "Indonesian", isArabic: boolean = false, latinText?: string, isIqroContent: boolean = false): Promise<AudioPlayback> => {
  return generateSpeech(text, languageHint, voice, isArabic, latinText, isIqroContent);
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
