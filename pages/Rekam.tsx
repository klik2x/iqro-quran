
import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Play, Trash2, Download } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const Rekam: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { t } = useTranslation();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioURL(null);
      setAudioBlob(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Tidak dapat memulai rekaman. Pastikan Anda telah memberikan izin mikrofon.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleReset = () => {
      setAudioURL(null);
      setAudioBlob(null);
  }

  const handleDownload = () => {
      if (audioURL && audioBlob) {
          const a = document.createElement('a');
          a.href = audioURL;
          a.download = `bacaan_quran_${new Date().toISOString()}.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  }

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('recordYourReading')}</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{t('recordInstruction')}</p>
      
      <div className="bg-white dark:bg-dark-blue-card p-8 rounded-2xl shadow-md max-w-md mx-auto flex flex-col items-center justify-center space-y-6 min-h-[250px]">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="w-24 h-24 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-transform transform hover:scale-110 active:scale-100"
            aria-label="Mulai Merekam"
          >
            <Mic size={48} />
          </button>
        )}
        
        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-24 h-24 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-transform transform hover:scale-110 active:scale-100"
            aria-label="Berhenti Merekam"
          >
            <StopCircle size={48} />
          </button>
        )}

        {audioURL && (
          <div className="w-full space-y-4">
              <audio src={audioURL} controls className="w-full" />
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleReset} className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition" aria-label="Hapus Rekaman">
                    <Trash2 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={handleDownload} className="p-3 bg-emerald-dark rounded-full hover:bg-opacity-90 transition" aria-label="Unduh Rekaman">
                    <Download className="h-6 w-6 text-white" />
                </button>
              </div>
          </div>
        )}

        <div className="h-8">
            {isRecording && <p className="text-red-500 animate-pulse">Merekam...</p>}
        </div>
      </div>
    </div>
  );
};

export default Rekam;
