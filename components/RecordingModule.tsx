import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, StopCircle, Trash2, Download, Loader2, AlertCircle, Headphones, MessageSquareText, Play, Pause } from 'lucide-react';
import { getGeminiInstance, encodeAudio, decodeAudio, decodeAudioData } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';
import { useTranslation } from '../contexts/LanguageContext';

const RecordingModule: React.FC = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For initial AI connection and fallback
  const [feedback, setFeedback] = useState<string>('');
  const [userTranscription, setUserTranscription] = useState<string>('');
  const [modelResponseAudio, setModelResponseAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false); // Not fully implemented playback for model audio stream

  // Refs for Live API session
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set()); // For continuous model audio playback
  let nextStartTime = 0; // For continuous model audio playback scheduling

  // Refs for local recording fallback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [localAudioURL, setLocalAudioURL] = useState<string | null>(null);
  const [localAudioBlob, setLocalAudioBlob] = useState<Blob | null>(null);
  const localAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingLocalAudio, setIsPlayingLocalAudio] = useState(false);
  const [isLocalRecordingFallback, setIsLocalRecordingFallback] = useState(false);


  // Initialize AudioContext and cleanup on unmount
  useEffect(() => {
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    return () => {
      // Close Gemini Live session if active
      sessionPromiseRef.current?.then(session => {
        session.close();
      }).catch(console.error);

      // Stop any active media streams
      streamRef.current?.getTracks().forEach(t => t.stop());
      
      // Close audio contexts
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();

      // Pause local audio
      localAudioPlayerRef.current?.pause();

      // Clear model audio sources
      for (const source of sourcesRef.current.values()) {
          source.stop();
      }
      sourcesRef.current.clear();
    };
  }, []);

  const resetStateForNewSession = useCallback(() => {
    setIsRecording(false);
    setIsProcessing(false);
    setFeedback('');
    setUserTranscription('');
    setIsLocalRecordingFallback(false);
    setLocalAudioURL(null);
    setLocalAudioBlob(null);

    if (modelResponseAudio) modelResponseAudio.pause();
    setModelResponseAudio(null);
    setIsPlayingModelAudio(false);

    if (localAudioPlayerRef.current) localAudioPlayerRef.current.pause();
    setIsPlayingLocalAudio(false);

    // Stop and clear previous Live API resources
    sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    for (const source of sourcesRef.current.values()) {
        source.stop();
    }
    sourcesRef.current.clear();
    nextStartTime = 0;
  }, [modelResponseAudio]);


  // --- Gemini Live API Logic ---
  const startLiveSession = async () => {
    resetStateForNewSession(); // Ensure a clean slate

    try {
      setIsRecording(true);
      setIsProcessing(true); // Indicate connecting
      setFeedback(t('connectingToAI'));

      const ai = getGeminiInstance();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}, // Enable user input transcription
          systemInstruction: t('recordingSystemInstruction'),
          speechConfig: { // Specify voice for model's response
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: () => {
            setFeedback(t('startReadingQuran'));
            setIsProcessing(false); // Connection established, ready to record
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
              
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(sendError => console.error("Error sending realtime input:", sendError));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process user transcription
            if (message.serverContent?.inputTranscription?.text) {
              setUserTranscription(prev => prev + message.serverContent.inputTranscription.text);
            }
            
            // Process model's audio feedback
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              const outputAudioContext = outputAudioContextRef.current;
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              try {
                const audioBuffer = await decodeAudioData(
                  decodeAudio(base64EncodedAudioString),
                  outputAudioContext,
                  24000,
                  1,
                );
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTime);
                nextStartTime = nextStartTime + audioBuffer.duration;
                sourcesRef.current.add(source);

                setFeedback(t('aiGeneratingFeedback')); 
              } catch (audioError) {
                console.error("Error decoding or playing model audio:", audioError);
                setFeedback(t('failedToPlayAIAudio'));
              }
            } else if (message.serverContent?.turnComplete) {
                setFeedback(t('aiFeedbackComplete'));
                // Stop all playing model audio if turn is complete and new one is about to start
                for (const source of sourcesRef.current.values()) {
                    source.stop();
                }
                sourcesRef.current.clear();
                nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error("Live API Error:", e);
            setFeedback(t('connectionError'));
            stopLiveSession(); // Automatically stop on error
            // Fallback to local recording on API error
            startLocalRecordingFallback();
          },
          onclose: () => {
            console.log("Live API closed.");
            setIsRecording(false);
            setIsProcessing(false);
            setFeedback(t('recordingAnalysisComplete'));
            // Clear transcription after session ends or is fully processed
            setUserTranscription(''); 
            for (const source of sourcesRef.current.values()) {
                source.stop();
            }
            sourcesRef.current.clear();
            nextStartTime = 0;
          }
        }
      });

    } catch (err: any) {
      console.error(err);
      setIsRecording(false);
      setIsProcessing(false);
      setFeedback(t('failedToAccessMic'));
      startLocalRecordingFallback(); // Fallback to local recording if initial setup fails
    }
  };

  const stopLiveSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close()).catch(console.error);
      sessionPromiseRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setIsProcessing(false); // Ensure processing is off
    // Feedback and transcription are handled by onclose callback.
  };


  // --- Local Recording Fallback Logic ---
  const startLocalRecordingFallback = async () => {
    resetStateForNewSession(); // Ensure a clean slate
    setIsLocalRecordingFallback(true);
    setFeedback(t('usingLocalRecorder'));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setLocalAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setLocalAudioURL(url);
        audioChunksRef.current = [];
        setFeedback(t('recordingCompleteLocal'));
        setIsRecording(false);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setLocalAudioURL(null);
      setLocalAudioBlob(null);
      setFeedback(t('localRecordingStarted'));
    } catch (err) {
      console.error("Error starting local recording:", err);
      setFeedback(t('failedToAccessMic'));
      setIsRecording(false);
      setIsLocalRecordingFallback(false);
    }
  };

  const stopLocalRecordingFallback = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleResetLocalRecording = () => {
      setLocalAudioURL(null);
      setLocalAudioBlob(null);
      setIsPlayingLocalAudio(false);
      setFeedback('');
      setIsLocalRecordingFallback(false);
  };

  const handleDownloadLocalRecording = () => {
      if (localAudioURL && localAudioBlob) {
          const a = document.createElement('a');
          a.href = localAudioURL;
          a.download = `bacaan_quran_lokal_${new Date().toISOString()}.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  };

  const handleTogglePlayLocalAudio = () => {
    if (localAudioPlayerRef.current) {
      if (isPlayingLocalAudio) {
        localAudioPlayerRef.current.pause();
      } else {
        localAudioPlayerRef.current.play().catch(e => console.error("Error playing local audio:", e));
      }
      setIsPlayingLocalAudio(!isPlayingLocalAudio);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-black mb-2">{t('recordingStudio')}</h1>
        <p className="text-slate-500">{t('recordInstructionAI')}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 text-center">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
           {isProcessing ? <Loader2 size={48} className="animate-spin text-emerald-600" /> : <Mic size={48} className={isRecording ? 'text-white' : ''} />}
        </div>

        <div className="space-y-4 mb-8">
           <p className={`text-xl font-bold ${isRecording ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
             {isRecording ? t('listening') : t('readyToRecord')}
           </p>
           <p className="text-slate-500 italic max-w-sm mx-auto">{feedback || t('pressToStartRecording')}</p>
        </div>

        {!isLocalRecordingFallback ? (
          <button 
            onClick={isRecording ? stopLiveSession : startLiveSession}
            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] ${isRecording ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording')}</> : <><Mic size={24} /> {t('startRecording')}</>)}
          </button>
        ) : ( // Fallback UI
          <button 
            onClick={isRecording ? stopLocalRecordingFallback : startLocalRecordingFallback}
            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] ${isRecording ? 'bg-slate-900 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording')}</> : <><Mic size={24} /> {t('startRecordingLocal')}</>}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquareText size={20} className="text-blue-500" />
              {isLocalRecordingFallback ? t('localRecording') : t('yourTranscription')}
           </h3>
           <div className="space-y-3">
              {isLocalRecordingFallback ? (
                localAudioURL ? (
                    <audio 
                        ref={localAudioPlayerRef} 
                        src={localAudioURL} 
                        controls={false}
                        onPlay={() => setIsPlayingLocalAudio(true)}
                        onPause={() => setIsPlayingLocalAudio(false)}
                        onEnded={() => setIsPlayingLocalAudio(false)}
                        className="hidden"
                    />
                ) : (
                    <p className="text-center py-8 text-slate-400 text-sm">{t('noLocalRecording')}</p>
                )
              ) : userTranscription ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{userTranscription}</p>
              ) : (
                <p className="text-center py-8 text-slate-400 text-sm">{t('noTranscriptionYet')}</p>
              )}
              {isLocalRecordingFallback && localAudioURL && (
                <div className="flex justify-center gap-4 pt-4">
                  <button 
                    onClick={handleTogglePlayLocalAudio} 
                    className={`p-3 rounded-full transition-all min-h-[44px] min-w-[44px] ${isPlayingLocalAudio ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
                    aria-label={isPlayingLocalAudio ? t('pauseLocalRecording') : t('playLocalRecording')}
                  >
                    {isPlayingLocalAudio ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={handleDownloadLocalRecording} 
                    className="p-3 bg-emerald-dark rounded-full hover:bg-opacity-90 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('downloadLocalRecording')}
                  >
                      <Download className="h-6 w-6 text-white" />
                  </button>
                  <button 
                    onClick={handleResetLocalRecording} 
                    className="p-3 bg-red-500/10 rounded-full hover:bg-red-500/20 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('resetLocalRecording')}
                  >
                      <Trash2 className="h-6 w-6 text-red-500" />
                  </button>
                </div>
              )}
           </div>
        </div>

        <div className="bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-2xl p-6">
           <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle size={20} />
              {t('aiAnalysis')}
           </h3>
           <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t('aiAnalysisPoint1')}</p>
              </div>
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shadow-lg shadow-amber-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t('aiAnalysisPoint2')}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModule;