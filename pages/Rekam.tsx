import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, Square, RefreshCcw, Send, ChevronLeft, Volume2 } from 'lucide-react';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';
import { sendToVocalStudio } from '../services/vocalStudioService';
import { useUI } from '../contexts/UIContext';
import { LoadingSpinner } from '../components/ui/Feedback';

const RekamAyat: React.FC = () => {
  const { surahId, ayahId } = useParams();
  const navigate = useNavigate();
  const { triggerTick, triggerSuccess } = useAudioFeedback();
  const { zoom } = useUI();
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>();

  // Visualizer Logic
  const startVisualizer = (stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const analyzer = audioContextRef.current.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!ctx || !canvas) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        // Warna cerah agar kontras bagi lansia
        ctx.fillStyle = `rgb(16, 185, 129)`; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
      cancelAnimationFrame(animationFrameRef.current!);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    triggerTick(); // Haptic feedback
    startVisualizer(stream);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    triggerTick();
  };

  const submitSetoran = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);
    try {
      const result = await sendToVocalStudio(audioBlob, "Target Ayat Text");
      if (result.success) triggerSuccess();
      // Navigasi ke hasil atau berikan feedback popup
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-center" style={{ transform: `scale(${zoom})` }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-700 font-bold mb-4">
        <ChevronLeft /> Kembali ke Mushaf
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-emerald-100">
        <h1 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">Setoran Hafalan</h1>
        <p className="text-slate-500 mb-8 font-medium italic">"Bacalah dengan tartil dan perlahan"</p>

        {/* Visualizer Area */}
        <div className="relative h-40 bg-slate-50 dark:bg-black rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100">
          {!isRecording && !audioURL && (
            <p className="text-slate-400 font-bold">Tekan Mic untuk Mulai</p>
          )}
          <canvas ref={canvasRef} className="w-full h-full" width={600} height={160} />
          {isRecording && <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-red-500 uppercase">Recording...</span>
          </div>}
        </div>

        {/* Action Buttons (Extra Large for Seniors) */}
        <div className="mt-10 flex flex-col items-center gap-6">
          {!isRecording && !audioURL ? (
            <button 
              onClick={startRecording}
              className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all"
              aria-label="Mulai Rekam Suara"
            >
              <Mic size={40} />
            </button>
          ) : isRecording ? (
            <button 
              onClick={stopRecording}
              className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all"
              aria-label="Berhenti Rekam"
            >
              <Square size={40} fill="currentColor" />
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => { setAudioURL(null); setAudioBlob(null); }}
                className="flex items-center gap-2 bg-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-colors"
              >
                <RefreshCcw size={24} /> Ulangi
              </button>
              <button 
                onClick={submitSetoran}
                disabled={analyzing}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
              >
                {analyzing ? <LoadingSpinner /> : <><Send size={24} /> Kirim ke AI</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {audioURL && (
        <div className="bg-emerald-50 p-6 rounded-2xl flex items-center gap-4 border-2 border-emerald-200">
          <Volume2 className="text-emerald-600" />
          <audio src={audioURL} controls className="flex-1" />
        </div>
      )}
    </div>
  );
};

export default RekamAyat;
