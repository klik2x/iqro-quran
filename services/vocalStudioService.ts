// project: iqroquran.vercel.app
// file: services/vocalStudioService.ts

export const sendToVocalStudio = async (blob: Blob, targetText: string) => {
  const formData = new FormData();
  formData.append('audio', blob);
  formData.append('target_text', targetText);

  const response = await fetch('https://ttspro.vercel.app/api/analyze-recitation', {
    method: 'POST',
    body: formData,
    // Jangan set Content-Type header secara manual saat mengirim FormData
  });

  return await response.json();
};


// services/vocalStudioService.ts (New File)

const ENGINE_URL = "https://ttspro.vercel.app/api/analyze-recitation";

export const analyzeRecitation = async (audioBlob: Blob, targetText: string, lang: string) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('target_text', targetText);
  formData.append('language', lang);

  try {
    const response = await fetch(ENGINE_URL, {
      method: 'POST',
      body: formData,
      // API Key disematkan di ttspro server (.env), bukan di sini (frontend).
      // Jadi user IQRO otomatis bisa pakai GRATIS & AMAN.
    });

    if (!response.ok) throw new Error("AI Engine Offline");
    return await response.json();
  } catch (error) {
    console.error("Vocal Studio Integration Error:", error);
    return { success: false, message: "Gagal menganalisis suara." };
  }
};

// Di services/vocalStudioService.ts
export const sendToVocalStudio = async (blob: Blob, targetText: string, preferences: any) => {
  const formData = new FormData();
  formData.append('audio', blob);
  formData.append('target_text', targetText);
  
  // Kirim preferensi user (bahasa, emosi, model) yang didapat dari Voice Command
  formData.append('config', JSON.stringify({
    language: preferences.lang || 'id',
    emotion: preferences.emotion || 'calm',
    voice_model: preferences.model || 'standard-hijaiyah'
  }));

  const response = await fetch('https://ttspro.vercel.app/api/analyze-recitation', {
    method: 'POST',
    body: formData
  });
  return await response.json();
};
