
import { GoogleGenAI } from "@google/genai";
import { encodeAudio, decodeAudioData, decodeAudio } from './geminiService'; // Reusing audio utils

const TTSPRO_API_URL = 'https://ttspro.vercel.app/api/analyze-recitation';

export interface RecitationAnalysisRequest {
    audioBase64: string; // Base64 encoded audio from user
    mimeType: string;    // e.g., 'audio/webm', 'audio/wav', 'audio/pcm;rate=16000'
    textToAnalyze?: string; // Optional: The target text (e.g., Quranic verse) for AI to compare
    languageHint?: string; // e.g., 'Arabic', 'Indonesian'
}

export interface RecitationAnalysisResponse {
    feedback: string;       // AI's textual feedback
    score?: number;         // Optional: A numerical score (e.g., 0-100)
    modelAudio?: string;    // Optional: Base64 encoded audio from AI (e.g., correct pronunciation)
    error?: string;         // Error message if analysis failed
}

/**
 * Mengirim rekaman audio pengguna ke Vocal Studio TTSPro API untuk analisis.
 * Menggunakan Gemini API secara internal di sisi server TTSPro untuk memberikan feedback.
 *
 * @param request Objek yang berisi audioBase64, mimeType, dan opsi lainnya.
 * @returns Promise yang resolve dengan RecitationAnalysisResponse atau reject dengan Error.
 */
export const analyzeRecitation = async (
    request: RecitationAnalysisRequest
): Promise<RecitationAnalysisResponse> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY is not configured for Vocal Studio Service.");
        }

        const response = await fetch(TTSPRO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`, // API Key dari environment variable
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText };
            }
            throw new Error(`TTSPro API Error: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
        }

        const data: RecitationAnalysisResponse = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error calling Vocal Studio Service:", error);
        return {
            feedback: `Gagal menganalisis bacaan: ${error.message}. Silakan coba lagi atau gunakan perekam lokal.`,
            error: error.message,
        };
    }
};

// Function for client-side audio processing (if needed for direct Gemini integration later)
export const processAudioForGemini = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to read audio blob as base64."));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(audioBlob);
    });
};
