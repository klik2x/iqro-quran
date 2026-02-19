
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, StopCircle, Trash2, Download, Loader2, AlertCircle, Headphones, MessageSquareText, Play, Pause, X } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encodeAudio, decodeAudio, decodeAudioData } from '../services/geminiService';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { analyzeRecitation, RecitationAnalysisResponse } from '../services/vocalStudioService';
import { useApiHealth } from '../contexts/ApiHealthContext';

const Rekam: React.FC = () => { // Renamed from RecordingModule to Rekam for consistency with pages
  const { t } = useTranslation();
  const { isVocalStudioApiHealthy, setVocalStudioApiHealthy, triggerApiHealthCheck } = useApiHealth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [userTranscription, setUserTranscription] = useState<string>('');
  const [modelResponseAudio, setModelResponseAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);

  // Refs for Live API session
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;

  // Refs for local recording fallback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [localAudioURL, setLocalAudioURL] = useState<string | null>(null);
  const [localAudioBlob, setLocalAudioBlob] = useState<Blob | null>(null);
  const localAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingLocalAudio, setIsPlayingLocalAudio] = useState(false);
  const [isLocalRecordingFallback, setIsLocalRecordingFallback] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RecitationAnalysisResponse | null>(null);

  // Canvas for Audio Visualizer
  // FIX: Initialize canvasRef with null
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const startHapticFeedback = (pattern: VibratePattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Initialize AudioContext and cleanup on unmount
  useEffect(() => {
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    localAudioPlayerRef.current = new Audio();
    
    return () => {
      stopAllAudioPlayback();
      stopVisualizer();

      sessionPromiseRef.current?.then(session => {
        session.close();
      }).catch(console.error);

      streamRef.current?.getTracks().forEach(t => t.stop());
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
    };
  }, []);

  const stopAllAudioPlayback = useCallback(() => {
    if (modelResponseAudio) modelResponseAudio.pause();
    setModelResponseAudio(null);
    setIsPlayingModelAudio(false);

    if (localAudioPlayerRef.current) localAudioPlayerRef.current.pause();
    setIsPlayingLocalAudio(false);

    for (const source of sourcesRef.current.values()) {
        source.stop();
    }
    sourcesRef.current.clear();
    nextStartTime = 0;
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
  }, [modelResponseAudio]);

  const resetStateForNewSession = useCallback(() => {
    stopAllAudioPlayback();
    stopVisualizer();

    setIsRecording(false);
    setIsProcessing(false);
    setFeedback('');
    setUserTranscription('');
    setIsLocalRecordingFallback(false);
    setLocalAudioURL(null);
    setLocalAudioBlob(null);
    setAnalysisResult(null);

    sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    audioContextRef.current = null;
  }, [stopAllAudioPlayback]);


  // --- Audio Visualizer Logic ---
  const setupVisualizer = (audioStream: MediaStream) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure AudioContext is running for visualizer
    const audioCtx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(audioStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    audioAnalyserRef.current = analyser;

    source.connect(analyser);
    // Connect analyser to destination to hear audio, or not if only visualizing
    // analyser.connect(audioCtx.destination); 
    audioCtx.resume().catch(e => console.error("AudioContext resume failed:", e));

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(16, 185, 129)'; // Emerald color
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d');
      canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (audioAnalyserRef.current) {
      audioAnalyserRef.current.disconnect();
      audioAnalyserRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close().catch(e => console.error("AudioContext close failed:", e));
        audioContextRef.current = null;
    }
  };

  // --- Gemini Live API Logic ---
  // FIX: Removed targetText parameter from startLiveSession to match MouseEventHandler
  const startLiveSession = async () => {
    if (!isVocalStudioApiHealthy) {
        startLocalRecordingFallback();
        return;
    }
    
    resetStateForNewSession();
    startHapticFeedback([50]); // Haptic feedback on start recording

    try {
      setIsRecording(true);
      setIsProcessing(true);
      setFeedback(t('connectingToAI' as TranslationKeys));

      // FIX: Initialize GoogleGenAI directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setupVisualizer(stream); // Start visualizer

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: t('recordingSystemInstruction' as TranslationKeys),
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          // FIX: targetText is not relevant in Rekam for general recording. If it were specific, it would come from state.
          // For now, removing it as there's no UI to select target text here.
          // contents: targetText ? [{ parts: [{ text: `User is trying to read: "${targetText}". Provide real-time feedback on pronunciation and fluency.` }] }] : undefined,
        },
        callbacks: {
          onopen: () => {
            setFeedback(t('startReadingQuran' as TranslationKeys));
            setIsProcessing(false);
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
            if (message.serverContent?.inputTranscription?.text) {
              setUserTranscription(prev => prev + message.serverContent.inputTranscription.text);
            }
            
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              startHapticFeedback([50, 50, 50]); // Haptic feedback on AI audio response
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

                setFeedback(t('aiGeneratingFeedback' as TranslationKeys));
              } catch (audioError) {
                console.error("Error decoding or playing model audio:", audioError);
                setFeedback(t('failedToPlayAIAudio' as TranslationKeys));
              }
            } else if (message.serverContent?.turnComplete) {
                setFeedback(t('aiFeedbackComplete' as TranslationKeys));
                for (const source of sourcesRef.current.values()) {
                    source.stop();
                }
                sourcesRef.current.clear();
                nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error("Live API Error:", e);
            setFeedback(t('connectionError' as TranslationKeys));
            setVocalStudioApiHealthy(false); // Mark API as unhealthy
            stopLiveSession(); // Stop current session
            startHapticFeedback([100, 30, 100]); // Haptic feedback on error
            startLocalRecordingFallback(); // Start fallback
          },
          onclose: () => {
            console.log("Live API closed.");
            setIsRecording(false);
            setIsProcessing(false);
            setFeedback(t('recordingAnalysisComplete' as TranslationKeys));
            setUserTranscription('');
            stopVisualizer(); // Stop visualizer
            startHapticFeedback([100, 30, 100]); // Haptic feedback on close
          }
        }
      });

    } catch (err: any) {
      console.error(err);
      setIsRecording(false);
      setIsProcessing(false);
      setFeedback(t('failedToAccessMic' as TranslationKeys));
      stopVisualizer(); // Stop visualizer on mic access error
      startHapticFeedback([100, 30, 100]); // Haptic feedback on error
      setVocalStudioApiHealthy(false); // Mark API as unhealthy
      startLocalRecordingFallback(); // Start fallback
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
    setIsProcessing(false);
    stopVisualizer();
    startHapticFeedback([100, 30, 100]); // Haptic feedback on stop
  };


  // --- Local Recording Fallback Logic ---
  const startLocalRecordingFallback = async () => {
    resetStateForNewSession();
    setIsLocalRecordingFallback(true);
    setFeedback(t('usingLocalRecorder' as TranslationKeys));
    startHapticFeedback([50]); // Haptic feedback on start recording

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setupVisualizer(stream); // Start visualizer

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setLocalAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setLocalAudioURL(url);
        audioChunksRef.current = [];
        setFeedback(t('recordingCompleteLocal' as TranslationKeys));
        setIsRecording(false);
        stopVisualizer(); // Stop visualizer
        startHapticFeedback([100, 30, 100]); // Haptic feedback on stop

        setIsProcessing(true);
        setFeedback(t('aiGeneratingFeedback' as TranslationKeys));
        try {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                if (typeof reader.result === 'string') {
                    const base64Audio = reader.result.split(',')[1];
                    const analysis = await analyzeRecitation(
                        {
                            audioBase64: base64Audio,
                            mimeType: blob.type,
                            languageHint: 'Arabic',
                        }
                    );
                    setAnalysisResult(analysis);
                    setFeedback(analysis.feedback);
                    
                    // NEW: If analysis itself has an error, mark API as unhealthy
                    if (analysis.error) {
                      setVocalStudioApiHealthy(false);
                      setFeedback(`${t('failedToAnalyzeRecording' as TranslationKeys)}: ${analysis.error}`);
                    }

                    startHapticFeedback([50, 50, 50]); // Haptic feedback on AI analysis complete
                }
            };
        } catch (error) {
            console.error("Error sending local recording to Vocal Studio:", error);
            setFeedback(t('failedToAnalyzeRecording' as TranslationKeys));
            setVocalStudioApiHealthy(false); // Mark API as unhealthy on analysis failure
        } finally {
            setIsProcessing(false);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setLocalAudioURL(null);
      setLocalAudioBlob(null);
      setAnalysisResult(null);
      setFeedback(t('localRecordingStarted' as TranslationKeys));
    } catch (err) {
      console.error("Error starting local recording:", err);
      setFeedback(t('failedToAccessMic' as TranslationKeys));
      setIsRecording(false);
      setIsLocalRecordingFallback(false);
      stopVisualizer(); // Stop visualizer on mic access error
      startHapticFeedback([100, 30, 100]); // Haptic feedback on error
    }
  };

  const stopLocalRecordingFallback = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleResetLocalRecording = () => {
      stopAllAudioPlayback();
      setLocalAudioURL(null);
      setLocalAudioBlob(null);
      setFeedback('');
      setIsLocalRecordingFallback(false);
      setAnalysisResult(null);
      setVocalStudioApiHealthy(true); // Assume healthy on manual reset from local fallback
  };

  const handleDownloadLocalRecording = () => {
      if (localAudioURL && localAudioBlob) {
          const a = document.createElement('a');
          a.href = localAudioURL;
          a.download = `bacaan_quran_lokal_${new Date().toISOString()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  };

  const handleTogglePlayLocalAudio = () => {
    if (localAudioPlayerRef.current && localAudioURL) {
      if (isPlayingLocalAudio) {
        localAudioPlayerRef.current.pause();
      } else {
        localAudioPlayerRef.current.src = localAudioURL;
        localAudioPlayerRef.current.play().catch(e => console.error("Error playing local audio:", e));
      }
      setIsPlayingLocalAudio(!isPlayingLocalAudio);
    }
  };

  const playModelAudio = async (base64Audio: string) => {
    if (isPlayingModelAudio) {
      stopAllAudioPlayback();
      return;
    }

    try {
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const outputAudioContext = outputAudioContextRef.current;
      nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);

      const audioBuffer = await decodeAudioData(
        decodeAudio(base64Audio),
        outputAudioContext,
        24000,
  1,
      );
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAudioContext.destination);
      source.addEventListener('ended', () => {
        sourcesRef.current.delete(source);
        setIsPlayingModelAudio(false);
      });

      source.start(nextStartTime);
      nextStartTime = nextStartTime + audioBuffer.duration;
      sourcesRef.current.add(source);
      setIsPlayingModelAudio(true);
    } catch (e) {
      console.error("Error playing model audio:", e);
      alert(t('failedToPlayAIAudio' as TranslationKeys));
      setIsPlayingModelAudio(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-black mb-2">{t('recordingStudio' as TranslationKeys)}</h1>
        <p className="text-slate-500">{t('recordInstructionAI' as TranslationKeys)}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 text-center">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
           {isProcessing ? <Loader2 size={48} className="animate-spin text-emerald-600" /> : <Mic size={48} className={isRecording ? 'text-white' : ''} />}
        </div>

        {/* Audio Visualizer Canvas */}
        <canvas ref={canvasRef} width="300" height="80" className="mx-auto block mt-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700"></canvas>

        <div className="space-y-4 mb-8">
           <p className={`text-xl font-bold ${isRecording ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
             {isRecording ? t('listening' as TranslationKeys) : t('readyToRecord' as TranslationKeys)}
           </p>
           <p className="text-slate-500 italic max-w-sm mx-auto">{feedback || t('pressToStartRecording' as TranslationKeys)}</p>
        </div>

        {!isLocalRecordingFallback ? (
          // FIX: Call startLiveSession without arguments
          <button 
            onClick={isRecording ? stopLiveSession : startLiveSession}
            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] ${isRecording ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            disabled={isProcessing}
            aria-label={isRecording ? t('stopRecording' as TranslationKeys) : t('startRecording' as TranslationKeys)}
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording' as TranslationKeys)}</> : <><Mic size={24} /> {t('startRecording' as TranslationKeys)}</>)}
          </button>
        ) : ( // Fallback UI
          <button 
            onClick={isRecording ? stopLocalRecordingFallback : startLocalRecordingFallback}
            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] ${isRecording ? 'bg-slate-900 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
            aria-label={isRecording ? t('stopRecording' as TranslationKeys) : t('startRecordingLocal' as TranslationKeys)}
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording' as TranslationKeys)}</> : <><Mic size={24} /> {t('startRecordingLocal' as TranslationKeys)}</>)}
          </button>
        )}
        {!isVocalStudioApiHealthy && !isLocalRecordingFallback && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={20} />
                <p>{t('aiConnectionUnhealthy' as TranslationKeys)}. {t('automaticallyUsingLocalRecorder' as TranslationKeys)}.</p>
                <button 
                    onClick={triggerApiHealthCheck} 
                    className="ml-auto px-3 py-1 bg-red-200 dark:bg-red-800 rounded-md text-xs font-semibold hover:bg-red-300 dark:hover:bg-red-700"
                    aria-label={t('retryApiConnection' as TranslationKeys)}
                >
                    {t('retryApiConnection' as TranslationKeys)}
                </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquareText size={20} className="text-blue-500" />
              {isLocalRecordingFallback ? t('localRecording' as TranslationKeys) : t('yourTranscription' as TranslationKeys)}
           </h3>
           <div className="space-y-3">
              {isLocalRecordingFallback ? (
                localAudioURL ? (
                    <>
                        <audio 
                            ref={localAudioPlayerRef} 
                            src={localAudioURL} 
                            controls={false}
                            onPlay={() => setIsPlayingLocalAudio(true)}
                            onPause={() => setIsPlayingLocalAudio(false)}
                            onEnded={() => setIsPlayingLocalAudio(false)}
                            className="hidden"
                        />
                         <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                            {analysisResult?.feedback || t('noTranscriptionYet' as TranslationKeys)}
                         </p>
                    </>
                ) : (
                    <p className="text-center py-8 text-slate-400 text-sm">{t('noLocalRecording' as TranslationKeys)}</p>
                )
              ) : userTranscription ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{userTranscription}</p>
              ) : (
                <p className="text-center py-8 text-slate-400 text-sm">{t('noTranscriptionYet' as TranslationKeys)}</p>
              )}
              {isLocalRecordingFallback && localAudioURL && (
                <div className="flex justify-center gap-4 pt-4">
                  <button 
                    onClick={handleTogglePlayLocalAudio} 
                    className={`p-3 rounded-full transition-all min-h-[44px] min-w-[44px] ${isPlayingLocalAudio ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
                    aria-label={isPlayingLocalAudio ? t('pauseLocalRecording' as TranslationKeys) : t('playLocalRecording' as TranslationKeys)}
                  >
                    {isPlayingLocalAudio ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={handleDownloadLocalRecording} 
                    className="p-3 bg-emerald-dark rounded-full hover:bg-opacity-90 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('downloadLocalRecording' as TranslationKeys)}
                  >
                      <Download className="h-6 w-6 text-white" />
                  </button>
                  <button 
                    onClick={handleResetLocalRecording} 
                    className="p-3 bg-red-500/10 rounded-full hover:bg-red-500/20 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('resetLocalRecording' as TranslationKeys)}
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
              {t('aiAnalysis' as TranslationKeys)}
           </h3>
           <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t('aiAnalysisPoint1' as TranslationKeys)}</p>
              </div>
              <div className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shadow-lg shadow-amber-500/50"></div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t('aiAnalysisPoint2' as TranslationKeys)}</p>
              </div>
              {analysisResult?.modelAudio && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg mt-4">
                    <button 
                        onClick={() => playModelAudio(analysisResult.modelAudio!)}
                        className={`p-2 rounded-full transition-all min-h-[44px] min-w-[44px] ${isPlayingModelAudio ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
                        aria-label={isPlayingModelAudio ? t('pauseModelAudio' as TranslationKeys) : t('playModelAudio' as TranslationKeys)}
                    >
                        {isPlayingModelAudio ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{t('listenToCorrectPronunciation' as TranslationKeys)}</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Rekam;
    