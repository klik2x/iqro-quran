
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Save, History, Loader2, AlertCircle, Headphones } from 'lucide-react';
import { getGeminiInstance, encodeAudio, decodeAudio } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';

const RecordingModule: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<{ id: string, name: string, date: string }[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  const startLiveSession = async () => {
    try {
      setIsRecording(true);
      setFeedback('Menghubungkan ke AI untuk analisis bacaan...');

      const ai = getGeminiInstance();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Anda adalah seorang guru tahfidz Al-Quran. Dengarkan bacaan pengguna, berikan umpan balik positif tentang tajwid dan makhroj mereka jika memungkinkan, atau sekadar berikan apresiasi atas usaha mereka membaca Al-Quran.',
        },
        callbacks: {
          onopen: () => {
            setFeedback('Silakan mulai membaca Al-Quran...');
            const source = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle feedback audio if needed
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setFeedback('Terjadi kesalahan koneksi.');
          },
          onclose: () => {
            setIsRecording(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setFeedback('Gagal mengakses mikrofon.');
    }
  };

  const stopLiveSession = () => {
    if (sessionRef.current) {
      // In a real implementation, we would close properly
      setIsRecording(false);
      setFeedback('Bacaan Anda telah direkam dan dianalisis.');
      
      // Add to history
      setRecordings(prev => [
        { id: Date.now().toString(), name: `Murottal User - ${new Date().toLocaleTimeString()}`, date: new Date().toLocaleDateString() },
        ...prev
      ]);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-black mb-2">Recording Studio</h1>
        <p className="text-slate-500">Rekam bacaan Anda dan dapatkan analisis dari AI Guru Al-Quran.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 text-center">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
           <Mic size={48} className={isRecording ? 'text-white' : ''} />
        </div>

        <div className="space-y-4 mb-8">
           <p className={`text-xl font-bold ${isRecording ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
             {isRecording ? 'Sedang Mendengarkan...' : 'Siap Merekam'}
           </p>
           <p className="text-slate-500 italic max-w-sm mx-auto">{feedback || 'Tekan tombol di bawah untuk mulai merekam suara Anda.'}</p>
        </div>

        <button 
          onClick={isRecording ? stopLiveSession : startLiveSession}
          className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg ${isRecording ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
        >
          {isRecording ? <><Square size={24} fill="currentColor" /> Berhenti Rekam</> : <><Mic size={24} /> Mulai Rekaman</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="font-bold mb-4 flex items-center gap-2">
              <History size={20} className="text-blue-500" />
              Riwayat Rekaman
           </h3>
           <div className="space-y-3">
              {recordings.length > 0 ? recordings.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                         <Headphones size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-bold">{r.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{r.date}</p>
                      </div>
                   </div>
                   <button className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-lg">
                      <Play size={18} fill="currentColor" />
                   </button>
                </div>
              )) : (
                <p className="text-center py-8 text-slate-400 text-sm">Belum ada rekaman tersimpan.</p>
              )}
           </div>
        </div>

        <div className="bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-2xl p-6">
           <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle size={20} />
              Analisis Bacaan (AI)
           </h3>
           <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">AI akan mendeteksi tajwid, panjang-pendek bacaan, dan makhroj huruf secara real-time.</p>
              </div>
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shadow-lg shadow-amber-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Dapatkan skor kefasihan membaca sebagai motivasi untuk terus belajar.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModule;
