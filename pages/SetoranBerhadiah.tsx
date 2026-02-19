
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, StopCircle, Trash2, Download, Loader2, Award, X, BookOpen, AlertCircle, Play, Pause, ChevronDown, User } from 'lucide-react';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { analyzeRecitation, RecitationAnalysisResponse } from '../services/vocalStudioService';
import { fetchAllSurahs, fetchSurahWithTranslation } from '../services/quranService';
import html2canvas from 'html2canvas';
// FIX: Import decodeAudio and decodeAudioData from geminiService
import { decodeAudio, decodeAudioData } from '../services/geminiService';
import CertificateGenerator from '../components/certificate/CertificateGenerator'; // NEW IMPORT
import { CertificateData } from '../types'; // NEW IMPORT

interface AyahForQuiz {
    number: number;
    surahNumber: number;
    surahName: string;
    numberInSurah: number;
    text: string;
    translation: string;
    latin: string;
}

const SetoranBerhadiah: React.FC = () => {
    const navigate = useNavigate();
    const { t, currentLanguage } = useTranslation();

    const [surahs, setSurahs] = useState<any[]>([]);
    const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
    const [ayahsForQuiz, setAyahsForQuiz] = useState<AyahForQuiz[]>([]);
    const [selectedAyahIndex, setSelectedAyahIndex] = useState<number>(0);

    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<RecitationAnalysisResponse | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [badge, setBadge] = useState<'gold' | 'silver' | 'bronze' | null>(null);
    const [userName, setUserName] = useState<string>(''); // NEW: User name for certificate

    // Audio recording states
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const localAudioURLRef = useRef<string | null>(null);
    const localAudioBlobRef = useRef<Blob | null>(null);

    // AI Audio Playback
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);
    let nextStartTime = 0; // For continuous model audio playback scheduling

    // Certification Ref
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

    // Haptic Feedback
    const startHapticFeedback = (pattern: VibratePattern) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    // Resets all recording-related state and stops audio
    const resetRecordingState = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (localAudioURLRef.current) {
            URL.revokeObjectURL(localAudioURLRef.current);
            localAudioURLRef.current = null;
        }
        localAudioBlobRef.current = null;
        setIsRecording(false);
        setIsProcessing(false);
        setFeedback('');
        setAnalysisResult(null);
        setScore(null);
        setBadge(null);
        // Stop model audio playback
        for (const source of sourcesRef.current.values()) {
            source.stop();
        }
        sourcesRef.current.clear();
        setIsPlayingModelAudio(false);
        nextStartTime = 0;
    }, []);

    useEffect(() => {
        const loadSurahs = async () => {
            try {
                const allSurahs = await fetchAllSurahs();
                setSurahs(allSurahs);
                if (allSurahs.length > 0) {
                    setSelectedSurahNumber(allSurahs[0].number);
                }
            } catch (err) {
                console.error("Failed to load surah list:", err);
                setFeedback(t('failedToLoadSurahList' as TranslationKeys)); // FIX: Use translation key
            }
        };
        loadSurahs();

        // Initialize output audio context
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        // Load user name from localStorage if exists
        const savedUserName = localStorage.getItem('user_name_for_certificate');
        if (savedUserName) {
            setUserName(savedUserName);
        }

        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            if (localAudioURLRef.current) {
                URL.revokeObjectURL(localAudioURLRef.current);
            }
            // Stop model audio playback
            for (const source of sourcesRef.current.values()) {
                source.stop();
            }
            sourcesRef.current.clear();
            outputAudioContextRef.current?.close();
        };
    }, [t]);

    useEffect(() => {
        const loadAyahsForQuiz = async () => {
            if (selectedSurahNumber) {
                setAyahsForQuiz([]);
                setFeedback(t('loadingAyahs' as TranslationKeys)); 
                try {
                    const data = await fetchSurahWithTranslation(selectedSurahNumber, 'en.transliteration'); 
                    const arabicEd = data[0];
                    const translationEd = data[1]; 
                    const transliterationEd = data[2];

                    const formattedAyahs: AyahForQuiz[] = arabicEd.ayahs.map((ayah: any, index: number) => ({
                        number: ayah.number,
                        surahNumber: arabicEd.number,
                        surahName: arabicEd.englishName,
                        numberInSurah: ayah.numberInSurah,
                        text: ayah.text,
                        translation: translationEd.ayahs[index]?.text || '',
                        latin: transliterationEd.ayahs[index]?.text || '',
                    }));
                    setAyahsForQuiz(formattedAyahs);
                    setSelectedAyahIndex(0);
                    setFeedback("");
                    resetRecordingState(); // Reset recording state when surah changes
                } catch (err) {
                    console.error("Failed to load ayahs for quiz:", err);
                    setFeedback(t('failedToLoadAyahsForQuiz' as TranslationKeys)); 
                }
            }
        };
        loadAyahsForQuiz();
    }, [selectedSurahNumber, t, resetRecordingState]); // Added resetRecordingState to dependencies

    // Play model audio (reusing geminiService decode functions)
    const playModelAudio = async (base64Audio: string) => {
        if (isPlayingModelAudio) {
            for (const source of sourcesRef.current.values()) {
                source.stop();
            }
            sourcesRef.current.clear();
            setIsPlayingModelAudio(false);
            return;
        }

        try {
            if (!outputAudioContextRef.current) {
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const outputAudioContext = outputAudioContextRef.current;
            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);

            const audioBytes = decodeAudio(base64Audio); 
            const audioBuffer = await decodeAudioData(audioBytes, outputAudioContext, 24000, 1); 
            
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

    const startRecording = async () => {
        if (!ayahsForQuiz[selectedAyahIndex]) {
            setFeedback(t('selectSurahAndAyahFirst' as TranslationKeys)); 
            return;
        }
        resetRecordingState(); 
        startHapticFeedback([50]); 

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                localAudioBlobRef.current = blob;
                localAudioURLRef.current = URL.createObjectURL(blob);
                audioChunksRef.current = [];
                setIsRecording(false);
                
                setIsProcessing(true);
                setFeedback(t('sendingRecordingForAnalysis' as TranslationKeys));
                
                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = async () => {
                        if (typeof reader.result === 'string') {
                            const base64Audio = reader.result.split(',')[1];
                            const targetText = ayahsForQuiz[selectedAyahIndex].text;
                            const analysis = await analyzeRecitation({
                                audioBase64: base64Audio,
                                mimeType: blob.type,
                                textToAnalyze: targetText,
                                languageHint: 'Arabic',
                            });
                            setAnalysisResult(analysis);
                            setFeedback(analysis.feedback);
                            // Assign score and badge based on analysis
                            if (analysis.score !== undefined) {
                                setScore(analysis.score);
                                if (analysis.score >= 90) setBadge('gold');
                                else if (analysis.score >= 70) setBadge('silver');
                                else if (analysis.score >= 50) setBadge('bronze');
                                else setBadge(null);
                            }
                            startHapticFeedback([50, 50, 50]);
                        }
                    };
                } catch (error) {
                    console.error("Error sending local recording to Vocal Studio:", error);
                    setFeedback(t('failedToAnalyzeRecording' as TranslationKeys));
                } finally {
                    setIsProcessing(false);
                }
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setFeedback(t('recordingYourRecitation' as TranslationKeys));

        } catch (err) {
            console.error("Error starting recording:", err);
            setFeedback(t('failedToAccessMic' as TranslationKeys)); 
            setIsRecording(false);
            startHapticFeedback([100, 30, 100]); 
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleNextAyah = useCallback(() => {
        resetRecordingState();
        setSelectedAyahIndex(prev => Math.min(prev + 1, ayahsForQuiz.length - 1));
    }, [ayahsForQuiz.length, resetRecordingState]);

    const handlePrevAyah = useCallback(() => {
        resetRecordingState();
        setSelectedAyahIndex(prev => Math.max(prev - 1, 0));
    }, [resetRecordingState]);

    const currentAyah = ayahsForQuiz[selectedAyahIndex];

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
        localStorage.setItem('user_name_for_certificate', e.target.value); // Save to local storage
    };

    // Certificate data for CertificateGenerator component
    const certificateData: CertificateData = {
        userName: userName || 'Pengguna Iqro',
        levelTitle: currentAyah ? `${currentAyah.surahName} (${currentAyah.numberInSurah})` : 'Setoran Hafalan',
        score: score !== null ? score : 0,
        badge: badge,
        date: new Date().toISOString(),
        appLanguage: currentLanguage as 'id' | 'en' | 'ar',
    };

    const handleDownloadCertificate = async () => {
        if (!certificateRef.current) return;
        if (!userName) {
            alert(t('enterYourNameForCertificate' as TranslationKeys));
            return;
        }

        setIsGeneratingCertificate(true);
        try {
            // Temporarily show the hidden certificate div to render it correctly for html2canvas
            certificateRef.current.style.display = 'block';
            const canvas = await html2canvas(certificateRef.current, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#fdfbf7', // Ensure background is set for consistent rendering
            });
            certificateRef.current.style.display = 'none'; // Hide it again

            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${t('sertifikatKelulusanIqro' as TranslationKeys)}_Setoran_${currentAyah?.surahName}_Ayah_${currentAyah?.numberInSurah}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating certificate:", error);
            alert(t('failedToGenerateCertificate' as TranslationKeys));
        } finally {
            setIsGeneratingCertificate(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-emerald-dark dark:text-white">{t('setoranBerhadiahTitle' as TranslationKeys)}</h1>
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px]" aria-label={t('cancel' as TranslationKeys)}>
                    <X size={24} />
                </button>
            </div>
            <p className="text-slate-500 text-center">{t('setoranBerhadiahInstruction' as TranslationKeys)}</p>

            <div className="bg-white dark:bg-dark-blue-card p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="surah-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <BookOpen size={16} /> {t('selectASurah' as TranslationKeys)}
                    </label>
                    <select
                        id="surah-select"
                        value={selectedSurahNumber || ''}
                        onChange={(e) => setSelectedSurahNumber(parseInt(e.target.value))}
                        className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                        aria-label={t('selectASurah' as TranslationKeys)}
                    >
                        {surahs.map(surah => (
                            <option key={surah.number} value={surah.number}>
                                {surah.number}. {surah.englishName} ({surah.name})
                            </option>
                        ))}
                    </select>
                </div>

                {ayahsForQuiz.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                        <p>{feedback}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="ayah-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
                                <ChevronDown size={16} /> {t('selectAyah' as TranslationKeys)} ({selectedAyahIndex + 1}/{ayahsForQuiz.length})
                            </label>
                            <select
                                id="ayah-select"
                                value={selectedAyahIndex}
                                onChange={(e) => {
                                    setSelectedAyahIndex(parseInt(e.target.value));
                                    resetRecordingState();
                                }}
                                className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                                aria-label={t('selectAyahForQuiz' as TranslationKeys)}
                            >
                                {ayahsForQuiz.map((ayah, index) => (
                                    <option key={ayah.number} value={index}>
                                        Ayat {ayah.numberInSurah} - {ayah.text.substring(0, 50)}...
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-center bg-gray-50 dark:bg-dark-blue p-6 rounded-lg font-arabic text-3xl md:text-4xl leading-relaxed">
                            {currentAyah.text}
                        </div>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
                            "{currentAyah.translation}"
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <button
                                onClick={handlePrevAyah}
                                disabled={selectedAyahIndex === 0}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label={t('previous' as TranslationKeys)}
                            >
                                {t('previous' as TranslationKeys)}
                            </button>
                            <span>QS. {currentAyah.surahName}: {currentAyah.numberInSurah}</span>
                            <button
                                onClick={handleNextAyah}
                                disabled={selectedAyahIndex === ayahsForQuiz.length - 1}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label={t('next' as TranslationKeys)}
                            >
                                {t('next' as TranslationKeys)}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-dark-blue-card p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 text-center">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                    {isProcessing ? <Loader2 size={48} className="animate-spin text-emerald-600" /> : <Mic size={48} className={isRecording ? 'text-white' : ''} />}
                </div>

                <div className="space-y-4 mb-8">
                    <p className={`text-xl font-bold ${isRecording ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                        {isRecording ? t('listening' as TranslationKeys) : t('readyToRecord' as TranslationKeys)}
                    </p>
                    <p className="text-slate-500 italic max-w-sm mx-auto">{feedback || t('pressToStartRecording' as TranslationKeys)}</p>
                </div>

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] ${isRecording ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    disabled={isProcessing || !currentAyah}
                    aria-label={isRecording ? t('stopRecording' as TranslationKeys) : t('startSetoran' as TranslationKeys)}
                >
                    {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording' as TranslationKeys)}</> : <><Mic size={24} /> {t('startSetoran' as TranslationKeys)}</>)}
                </button>
            </div>

            {analysisResult && (
                <div className="bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <AlertCircle size={20} /> {t('analysisResult' as TranslationKeys)}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{analysisResult.feedback}</p>
                    {score !== null && (
                        <div className="flex items-center gap-2 text-xl font-bold text-emerald-dark dark:text-emerald-light">
                            {t('yourScore' as TranslationKeys)}: {score}% {badge && (
                                <span className="ml-2">
                                    {badge === 'gold' && <Award size={24} fill="#FFD700" className="text-gold-light" />}
                                    {badge === 'silver' && <Award size={24} fill="#C0C0C0" className="text-slate-400" />}
                                    {badge === 'bronze' && <Award size={24} fill="#CD7F32" className="text-amber-700" />}
                                </span>
                            )}
                        </div>
                    )}
                    {analysisResult.modelAudio && (
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
            )}
            
            {score !== null && score >= 50 && (
                <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4">
                    <h3 className="text-lg font-bold text-emerald-dark dark:text-white flex items-center gap-2">
                        <Award size={20} /> {t('sertifikatKelulusanIqro' as TranslationKeys)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('certificateInstruction' as TranslationKeys)}</p>
                    
                    <div className="space-y-2">
                        <label htmlFor="user-name-input-cert" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <User size={16} /> {t('enterYourNameForCertificate' as TranslationKeys)}
                        </label>
                        <input
                            id="user-name-input-cert"
                            type="text"
                            value={userName}
                            onChange={handleUserNameChange}
                            placeholder={t('yourName' as TranslationKeys)}
                            className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                            aria-label={t('enterYourNameForCertificate' as TranslationKeys)}
                        />
                    </div>
                    
                    <button
                        onClick={handleDownloadCertificate}
                        className="w-full bg-gold-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition"
                        disabled={isGeneratingCertificate || !userName}
                        aria-label={t('downloadCertificate' as TranslationKeys)}
                    >
                        {isGeneratingCertificate ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} {t('downloadCertificate' as TranslationKeys)}
                    </button>
                </div>
            )}
            {/* Render the CertificateGenerator component off-screen for html2canvas to capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
                <CertificateGenerator certificateRef={certificateRef} data={certificateData} userNameInput={userName} />
            </div>
        </div>
    );
};

export default SetoranBerhadiah;
    