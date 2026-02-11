import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, StopCircle, Trash2, Download, Loader2, Play, AlertCircle, BookHeart } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { Surah, Ayah, Doa } from '../types';
import { fetchAllSurahs, fetchSurah } from '../services/quranService';
import { DOA_LIST } from '../constants';
import { getGeminiInstance, encodeAudio } from '../services/geminiService';
import { LiveSession, LiveServerMessage, Modality } from '@google/genai';

type Status = 'idle' | 'connecting' | 'recording' | 'processing' | 'finished' | 'error';

const Rekam: React.FC = () => {
  const { t } = useTranslation();

  // State for text selection
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surahAyahs, setSurahAyahs] = useState<Ayah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyahNum, setSelectedAyahNum] = useState<number>(1);
  const [selectedDoaId, setSelectedDoaId] = useState<string>('');
  const [textToRecite, setTextToRecite] = useState<{ arabic: string, source: string }>({ arabic: '', source: '' });
  const [isSelectionLoading, setIsSelectionLoading] = useState(true);

  // State for recording and AI analysis
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('Pilih ayat atau doa, lalu tekan tombol rekam.');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [userAudioURL, setUserAudioURL] = useState<string | null>(null);

  // Refs for audio and AI session management
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analysisResultRef = useRef('');
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Fetch initial list of Surahs
  useEffect(() => {
    fetchAllSurahs().then(data => {
      setSurahs(data);
    });
  }, []);

  // Fetch ayahs when a new surah is selected
  useEffect(() => {
    if (surahs.length > 0) {
      setIsSelectionLoading(true);
      fetchSurah(selectedSurah).then(data => {
        setSurahAyahs(data.ayahs);
        if (selectedDoaId === '') {
            const targetAyah = data.ayahs.find(a => a.numberInSurah === selectedAyahNum) || data.ayahs[0];
            if(targetAyah) {
                setTextToRecite({
                    arabic: targetAyah.text,
                    source: `QS. ${data.englishName}: ${targetAyah.numberInSurah}`
                });
                setSelectedAyahNum(targetAyah.numberInSurah);
            }
        }
        setIsSelectionLoading(false);
      }).catch(() => setIsSelectionLoading(false));
    }
  }, [selectedSurah, surahs]);
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSurahNum = Number(e.target.value);
    setSelectedSurah(newSurahNum);
    setSelectedDoaId(''); 
    setSelectedAyahNum(1);
  };

  const handleAyahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAyahNum = Number(e.target.value);
    setSelectedAyahNum(newAyahNum);
    const ayah = surahAyahs.find(a => a.numberInSurah === newAyahNum);
    if (ayah) {
        setTextToRecite({ 
            arabic: ayah.text, 
            source: `QS. ${surahs.find(s=>s.number === selectedSurah)?.englishName}: ${ayah.numberInSurah}`
        });
    }
    setSelectedDoaId('');
  };
  
  const handleDoaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDoaId = e.target.value;
    setSelectedDoaId(newDoaId);
    if(newDoaId) {
        const doa = DOA_LIST.find(d => d.id === newDoaId);
        if (doa) {
            setTextToRecite({ arabic: doa.arabic, source: doa.title });
            setSelectedAyahNum(0);
        }
    } else {
        const firstAyah = surahAyahs[0];
        if(firstAyah) {
             setTextToRecite({
                arabic: firstAyah.text,
                source: `QS. ${surahs.find(s=>s.number === selectedSurah)?.englishName}: ${firstAyah.numberInSurah}`
            });
            setSelectedAyahNum(1);
        }
    }
  };

  const cleanup = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(console.error);
          audioContextRef.current = null;
      }
       if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
      }
      if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
      }
  };

  const startRecording = async () => {
    if (!textToRecite.arabic) {
        alert("Silakan pilih ayat atau doa terlebih dahulu.");
        return;
    }

    cleanup();
    setAnalysisResult('');
    analysisResultRef.current = '';
    setUserAudioURL(null);
    audioChunksRef.current = [];
    setStatus('connecting');
    setStatusMessage('Menghubungkan ke AI untuk analisis...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: true, echoCancellation: true } });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setUserAudioURL(URL.createObjectURL(blob));
      };
      
      const ai = getGeminiInstance();
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: `You are an expert Quran tajwid and makhraj teacher. Listen to the user's recitation. The user is attempting to recite the following text: '${textToRecite.arabic}'. First, determine if the user's recitation is indeed the provided Quranic text. If it is not, politely inform them in Indonesian that you can only analyze recitations of the selected Quranic verse or prayer. If it IS the correct text, please provide a brief, positive, and constructive analysis of their recitation in Indonesian, focusing on tajwid and makhraj. Present your feedback in simple bullet points. Your entire response must be in Indonesian.`,
        },
        callbacks: {
          onopen: () => {
            setStatus('recording');
            setStatusMessage('Mendengarkan... Silakan mulai membaca.');
            mediaRecorderRef.current?.start();

            mediaStreamSourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (e) => {
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
              sessionPromiseRef.current?.then(session => {
                  if (session) session.sendRealtimeInput({ media: pcmBlob });
              }).catch(console.error);
            };

            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current!.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription?.text) {
              analysisResultRef.current += message.serverContent.outputTranscription.text + ' ';
              setAnalysisResult(analysisResultRef.current.trim());
            }
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setStatus('error');
            setStatusMessage('Terjadi kesalahan koneksi dengan AI.');
            cleanup();
          },
          onclose: () => {
            if (statusRef.current !== 'error') {
              setStatus('finished');
              setStatusMessage('Analisis selesai. Lihat hasilnya di bawah.');
            }
            cleanup();
          }
        }
      });
      await sessionPromiseRef.current;
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusMessage('Gagal mengakses mikrofon. Pastikan Anda memberikan izin.');
      cleanup();
    }
  };

  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  const stopRecording = () => {
    setStatus('processing');
    setStatusMessage('Menganalisis rekaman...');
    sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
  };

  const resetAll = () => {
    cleanup();
    setAnalysisResult('');
    setUserAudioURL(null);
    setStatus('idle');
    setStatusMessage('Pilih ayat atau doa, lalu tekan tombol rekam.');
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('recordYourReading')}</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{t('recordInstruction')}</p>
      
      <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-lg font-bold">Pilih Teks untuk Dilatih</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select 
                value={selectedSurah}
                onChange={handleSurahChange}
                className="p-3 bg-gray-100 dark:bg-dark-blue border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSelectionLoading || status === 'recording' || !!selectedDoaId}
            >
                {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
            </select>
            <select
                value={selectedAyahNum}
                onChange={handleAyahChange}
                className="p-3 bg-gray-100 dark:bg-dark-blue border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSelectionLoading || status === 'recording' || surahAyahs.length === 0 || !!selectedDoaId}
            >
                {surahAyahs.map(a => <option key={a.numberInSurah} value={a.numberInSurah}>Ayat {a.numberInSurah}</option>)}
            </select>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-dark-blue-card text-gray-500">atau</span></div>
        </div>
        <div>
           <select 
                value={selectedDoaId}
                onChange={handleDoaChange}
                className="p-3 bg-gray-100 dark:bg-dark-blue border border-gray-200 dark:border-gray-700 rounded-lg w-full"
                disabled={status === 'recording'}
            >
               <option value="">Pilih Doa Pilihan...</option>
               {DOA_LIST.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
        </div>
        {textToRecite.arabic && (
            <div className="p-4 bg-gray-50 dark:bg-dark-blue rounded-lg text-right">
                <p className="font-arabic text-2xl">{textToRecite.arabic}</p>
                <p className="text-xs text-left text-gray-400 mt-2 font-semibold">{textToRecite.source}</p>
            </div>
        )}
      </div>

      <div className="bg-white dark:bg-dark-blue-card p-8 rounded-2xl shadow-md flex flex-col items-center justify-center space-y-6 min-h-[250px]">
        <button
          onClick={status === 'recording' ? stopRecording : startRecording}
          className={`w-24 h-24 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
            ${status === 'recording' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-dark hover:bg-opacity-90'}
            ${status === 'connecting' || status === 'processing' ? 'animate-pulse' : ''}
          `}
          aria-label={status === 'recording' ? "Berhenti Merekam" : "Mulai Merekam"}
          disabled={status === 'connecting' || status === 'processing'}
        >
          {status === 'recording' ? <StopCircle size={48} /> : <Mic size={48} />}
        </button>

        <p className="font-semibold h-6">{statusMessage}</p>

        {userAudioURL && status === 'finished' && (
          <div className="w-full space-y-4 text-left pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="font-bold">Rekaman Anda</h3>
              <audio src={userAudioURL} controls className="w-full" />
              <div className="flex justify-center gap-4">
                <button onClick={resetAll} className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition" aria-label="Hapus Rekaman">
                    <Trash2 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md text-left">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-dark dark:text-emerald-light">
              <BookHeart size={20} />
              Analisis Bacaan (AI)
           </h3>
           <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {analysisResult.split('*').map((item, index) => item.trim() && <p key={index} className="my-1">- {item.trim()}</p>)}
           </div>
        </div>
      )}
    </div>
  );
};

export default Rekam;
