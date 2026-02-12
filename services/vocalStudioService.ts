// services/vocalStudioService.ts (New File)
import { Surah } from '../types';

const VOCAL_STUDIO_API_URL = "https://api.vocalstudio.teer.id/v1/analyze";

export interface VoiceAnalysisResult {
  confidenceScore: number;
  matchedText: string;
  isCorrectTajwid: boolean;
  suggestedSurahId?: number;
}

export const analyzeVoiceWithAI = async (audioBlob: Blob): Promise<VoiceAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', audioBlob);

  try {
    const response = await fetch(VOCAL_STUDIO_API_URL, {
      method: 'POST',
      body: formData,
      // Jika butuh API Key: headers: { 'Authorization': 'Bearer YOUR_TEER_TOKEN' }
    });
    return await response.json();
  } catch (error) {
    console.error("AI Analysis failed, falling back to local transcription", error);
    throw error;
  }
};
