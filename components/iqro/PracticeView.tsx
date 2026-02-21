
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, SkipForward, BookText, Mic, StopCircle, Trash2, AlertCircle, Loader2, Play, Pause } from 'lucide-react';
import { HijaiyahCard } from './HijaiyahCard';
import { speakText, AudioPlaybackControls } from '../../services/geminiService';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { IqroLevelData } from '../../types';
import { analyzeRecitation } from '../../services/vocalStudioService';

interface PracticeViewProps {
    levelData: IqroLevelData;
}

const PracticeView: React.FC<PracticeViewProps> = ({ levelData }) => {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { markAsCompleted } = useIqroProgress();
    const { t } = useTranslation();

    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const currentAudioPlaybackRef = useRef<AudioPlaybackControls | null>(null);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);
    const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);

    useEffect(() => {
        audioPlayerRef.current = new Audio();
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        setRecordingFeedback(null);
        setRecordedAudioURL(null);
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setRecordedAudioURL(url);
                
                // Process with AI
                setIsProcessing(true);
                setRecordingFeedback("Menganalisis bacaan Anda...");
                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        if (typeof reader.result === 'string') {
                            const base64Audio = reader.result.split(',')[1];
                            const result = await analyzeRecitation({
                                audioBase64: base64Audio,
                                mimeType: audioBlob.type,
                                textToAnalyze: currentItem.char,
                                languageHint: 'Arabic'
                            });
                            setRecordingFeedback(result.feedback);
                        }
                    };
                } catch (err) {
                    console.error("Error analyzing recitation:", err);
                    setRecordingFeedback("Gagal menganalisis bacaan. Coba lagi.");
                } finally {
                    setIsProcessing(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Gagal mengakses mikrofon. Pastikan izin diberikan.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const togglePlayRecorded = () => {
        if (!audioPlayerRef.current || !recordedAudioURL) return;
        if (isPlayingRecorded) {
            audioPlayerRef.current.pause();
            setIsPlayingRecorded(false);
        } else {
            audioPlayerRef.current.src = recordedAudioURL;
            audioPlayerRef.current.play();
            setIsPlayingRecorded(true);
            audioPlayerRef.current.onended = () => setIsPlayingRecorded(false);
        }
    };

    useEffect(() => {
        const flattenedItems = levelData.sections.flatMap((section, sectionIndex) => 
            section.items.map((item, itemIndex) => ({
                ...item, 
                id: `${levelData.level}-${sectionIndex}-${itemIndex}`,
                sectionTitle: section.title,
                sectionInfo: section.info // Include section info for display
            }))
        );
        setAllItems(flattenedItems);
        setCurrentIndex(0);
    }, [levelData]);

    const goToNext = useCallback(() => {
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            setPlayingAudio(null);
        }
        setRecordingFeedback(null);
        setRecordedAudioURL(null);
        setCurrentIndex(prev => Math.min(prev + 1, allItems.length - 1));
    }, [allItems.length]);

    const goToPrev = () => {
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            setPlayingAudio(null);
        }
        setRecordingFeedback(null);
        setRecordedAudioURL(null);
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const handlePlayAudio = useCallback(async (char: string, latin: string, id: string) => {
        if (loadingAudio) return;
        
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            if (playingAudio === id) {
                setPlayingAudio(null);
                currentAudioPlaybackRef.current = null;
                return;
            }
        }

        setLoadingAudio(id);
        try {
            // Requirement: Middle Eastern Arabic accent, ALWAYS use Web Speech API for Iqro practice
            const playback = await speakText(char, 'Kore', 'Arabic', true, undefined, true); // isIqroContent: true
            const controls = playback.play();
            currentAudioPlaybackRef.current = controls;
            setPlayingAudio(id);
            controls.controls.onended = () => setPlayingAudio(null);
        } catch (error) {
            console.error("Error speech:", error);
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio]);

    const currentItem = allItems[currentIndex];
    const currentSectionTitle = currentItem?.sectionTitle ? t(currentItem.sectionTitle as TranslationKeys) : '';
    const currentSectionInfo = currentItem?.sectionInfo ? t(currentItem.sectionInfo as TranslationKeys) : '';

    if (!currentItem) return <div className="text-center p-8">Memuat materi latihan...</div>;

    return (
        <div className="flex flex-col space-y-6 max-w-lg mx-auto">
            {/* Header: Section Title and Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-emerald-100 dark:border-emerald-900 pb-3">
                    <div className="bg-emerald-600 text-white p-2 rounded-xl">
                        <BookText size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-emerald-dark dark:text-white">
                        {currentSectionTitle}
                    </h3>
                </div>
                
                {currentSectionInfo && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {currentSectionInfo}
                        </p>
                    </div>
                )}
            </div>

            {/* Practice Card - Arabic ONLY */}
            <div className="w-full space-y-4">
                <HijaiyahCard 
                    id={currentItem.id}
                    item={currentItem}
                    level={levelData.level}
                    sectionTitle={currentItem.sectionTitle}
                    isLoading={loadingAudio === currentItem.id}
                    isPlaying={playingAudio === currentItem.id}
                    onPlay={(char, latin) => handlePlayAudio(char, latin, currentItem.id)}
                    isLarge={true}
                    showLatinText={false} // Requirement for Iqro 1 Practice tab
                />

                {/* AI Recitation Checker */}
                <div className="bg-white dark:bg-dark-blue-card rounded-2xl p-6 shadow-lg border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                            <Mic size={18} />
                            Cek Bacaan Saya (AI)
                        </h4>
                        {isRecording && (
                            <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                RECORDING
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                                isRecording 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : (isRecording ? <StopCircle fill="currentColor" /> : <Mic />)}
                        </button>

                        {recordingFeedback && (
                            <div className="w-full p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-sm">
                                <div className="flex gap-2 text-emerald-800 dark:text-emerald-300">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>{recordingFeedback}</p>
                                </div>
                                {recordedAudioURL && (
                                    <div className="mt-3 flex justify-center">
                                        <button 
                                            onClick={togglePlayRecorded}
                                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-blue rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 transition"
                                        >
                                            {isPlayingRecorded ? <Pause size={14} /> : <Play size={14} />}
                                            {isPlayingRecorded ? 'Berhenti' : 'Putar Rekaman Saya'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button 
                    onClick={goToPrev} 
                    disabled={currentIndex === 0} 
                    className="p-4 bg-gray-100 dark:bg-dark-blue rounded-full text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('Sebelumnya')}
                >
                    <ArrowLeft />
                </button>
                <button 
                    onClick={() => { markAsCompleted(currentItem.id); goToNext(); }} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="flex-grow bg-emerald-dark text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <span>Lanjut Pelajaran</span>
                    <SkipForward size={20} />
                </button>
                <button 
                    onClick={goToNext} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="p-4 bg-gray-100 dark:bg-dark-blue rounded-full text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition min-h-[44px] min-w-[44px]"
                    aria-label={t('Berikutnya')}
                >
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
};

export default PracticeView;
