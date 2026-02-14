
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, StopCircle, Trash2, Download, Loader2, Award, X, BookOpen, AlertCircle, Play, Pause, ChevronDown } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { analyzeRecitation, RecitationAnalysisResponse } from '../services/vocalStudioService';
import { fetchAllSurahs, fetchSurahWithTranslation } from '../services/quranService';
import html2canvas from 'html2canvas';
// FIX: Import decodeAudio and decodeAudioData from geminiService
import { decodeAudio, decodeAudioData } from '../services/geminiService';

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
    const { t } = useTranslation();

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
                setFeedback("Gagal memuat daftar surah.");
            }
        };
        loadSurahs();

        // Initialize output audio context
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

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
    }, []);

    useEffect(() => {
        const loadAyahsForQuiz = async () => {
            if (selectedSurahNumber) {
                setAyahsForQuiz([]);
                setFeedback("Memuat ayat untuk kuis...");
                try {
                    const data = await fetchSurahWithTranslation(selectedSurahNumber, 'en.transliteration'); // Use transliteration for latin
                    const arabicEd = data[0];
                    const translationEd = data[1]; // Assuming this is actual translation
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
                } catch (err) {
                    console.error("Failed to load ayahs for quiz:", err);
                    setFeedback("Gagal memuat ayat untuk kuis.");
                }
            }
        };
        loadAyahsForQuiz();
    }, [selectedSurahNumber]);

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

            const audioBytes = decodeAudio(base64Audio); // Re-use from geminiService
            const audioBuffer = await decodeAudioData(audioBytes, outputAudioContext, 24000, 1); // Re-use from geminiService
            
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
            alert("Gagal memutar audio model.");
            setIsPlayingModelAudio(false);
        }
    };

    const startRecording = async () => {
        if (!ayahsForQuiz[selectedAyahIndex]) {
            setFeedback("Pilih surah dan ayat terlebih dahulu.");
            return;
        }
        resetRecordingState(); // Clear previous state
        startHapticFeedback([50]); // Vibrate on start

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                localAudioBlobRef.current = audioBlob;
                localAudioURLRef.current = URL.createObjectURL(audioBlob);
                
                setIsRecording(false);
                setIsProcessing(true);
                setFeedback("Mengirim rekaman untuk analisis...");
                startHapticFeedback([100, 30, 100]); // Vibrate on stop

                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        if (typeof reader.result === 'string') {
                            const base64Audio = reader.result.split(',')[1];
                            const currentAyah = ayahsForQuiz[selectedAyahIndex];
                            const analysis = await analyzeRecitation({
                                audioBase64: base64Audio,
                                mimeType: audioBlob.type,
                                textToAnalyze: currentAyah.text, // Send the Quranic text for comparison
                                languageHint: 'Arabic',
                            });
                            setAnalysisResult(analysis);
                            setFeedback(analysis.feedback);
                            setScore(analysis.score || null);
                            determineBadge(analysis.score);
                            startHapticFeedback([50, 50, 50]); // Vibrate on analysis result
                        }
                    };
                } catch (error) {
                    console.error("Error during analysis:", error);
                    setFeedback("Gagal menganalisis rekaman. Coba lagi.");
                } finally {
                    setIsProcessing(false);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setFeedback("Merekam bacaan Anda...");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setFeedback("Gagal mengakses mikrofon. Pastikan izin diberikan.");
            setIsRecording(false);
            startHapticFeedback([100, 30, 100]); // Vibrate on error
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const resetRecordingState = () => {
        stopRecording();
        if (localAudioURLRef.current) URL.revokeObjectURL(localAudioURLRef.current);
        localAudioURLRef.current = null;
        localAudioBlobRef.current = null;
        setAnalysisResult(null);
        setFeedback('');
        setScore(null);
        setBadge(null);
        setIsPlayingModelAudio(false);
        for (const source of sourcesRef.current.values()) {
            source.stop();
        }
        sourcesRef.current.clear();
    };

    const determineBadge = (s: number | undefined) => {
        if (s === undefined || s === null) {
            setBadge(null);
            return;
        }
        if (s >= 90) setBadge('gold');
        else if (s >= 70) setBadge('silver');
        else if (s >= 50) setBadge('bronze');
        else setBadge(null);
    };

    const currentAyah = ayahsForQuiz[selectedAyahIndex];

    const generateCertificate = async () => {
        if (!certificateRef.current || !currentAyah || score === null) return;

        setIsGeneratingCertificate(true);
        try {
            const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true, backgroundColor: '#fdfbf7' });
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `Sertifikat_Hafalan_${currentAyah.surahName}_Ayat_${currentAyah.numberInSurah}.png`;
            link.click();
        } catch (error) {
            console.error("Error generating certificate:", error);
            alert("Gagal membuat sertifikat.");
        } finally {
            setIsGeneratingCertificate(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel')}><X size={20}/> {t('cancel')}</button>
            
            <div className="text-center">
                <h1 className="text-3xl font-black mb-2 flex items-center justify-center gap-2">
                    <Award size={32} className="text-gold-dark" /> {t('setoranBerhadiahTitle')}
                </h1>
                <p className="text-slate-500">{t('setoranBerhadiahInstruction')}</p>
            </div>

            <div className="bg-white dark:bg-dark-blue-card rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 space-y-8">
                {/* Surah/Ayat Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="surah-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('selectSurah')}</label>
                        <select
                            id="surah-select"
                            value={selectedSurahNumber || ''}
                            onChange={(e) => setSelectedSurahNumber(parseInt(e.target.value))}
                            className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                            disabled={isRecording || isProcessing}
                        >
                            <option value="">{t('selectASurah')}</option>
                            {surahs.map(s => (
                                <option key={s.number} value={s.number}>{s.number}. {s.englishName} ({s.name})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="ayah-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('selectAyah')}</label>
                        <select
                            id="ayah-select"
                            value={selectedAyahIndex}
                            onChange={(e) => setSelectedAyahIndex(parseInt(e.target.value))}
                            className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                            disabled={ayahsForQuiz.length === 0 || isRecording || isProcessing}
                        >
                            {ayahsForQuiz.length === 0 ? (
                                <option>{t('loadingAyahs')}</option>
                            ) : (
                                ayahsForQuiz.map((ayah, index) => (
                                    <option key={ayah.number} value={index}>Ayat {ayah.numberInSurah}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {currentAyah ? (
                    <div className="p-6 bg-gray-50 dark:bg-dark-blue-card rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentAyah.surahName}: Ayat {currentAyah.numberInSurah}</p>
                        <p className="font-arabic text-4xl leading-relaxed text-slate-900 dark:text-white" dir="rtl">{currentAyah.text}</p>
                        <p className="text-gray-700 dark:text-gray-300 italic text-lg">"{currentAyah.translation}"</p>
                        <div className="flex justify-center mt-4">
                            {analysisResult?.modelAudio && (
                                <button
                                    onClick={() => playModelAudio(analysisResult.modelAudio!)}
                                    className={`p-3 rounded-full transition-all min-h-[44px] min-w-[44px] ${isPlayingModelAudio ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
                                    aria-label={isPlayingModelAudio ? t('pauseModelAudio') : t('playModelAudio')}
                                >
                                    {isPlayingModelAudio ? <Pause size={24} /> : <Play size={24} />}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-gray-50 dark:bg-dark-blue-card rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-4">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold">{t('selectAyahForQuiz')}</p>
                    </div>
                )}

                <div className="text-center">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                        {isProcessing ? <Loader2 size={48} className="animate-spin text-emerald-600" /> : <Mic size={48} className={isRecording ? 'text-white' : ''} />}
                    </div>
                    <p className={`text-xl font-bold ${isRecording ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                        {isRecording ? t('listening') : t('readyToRecord')}
                    </p>
                    <p className="text-slate-500 italic max-w-sm mx-auto">{feedback || t('pressToStartRecording')}</p>
                    
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-10 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg min-h-[44px] mt-8
                            ${isRecording ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                            ${!currentAyah || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!currentAyah || isProcessing}
                        aria-label={isRecording ? t('stopRecording') : t('startSetoran')}
                    >
                        {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (isRecording ? <><StopCircle size={24} fill="currentColor" /> {t('stopRecording')}</> : <><Mic size={24} /> {t('startSetoran')}</>)}
                    </button>
                </div>
            </div>

            {analysisResult && (
                <div className="bg-white dark:bg-dark-blue-card rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-6">
                    <h2 className="text-2xl font-black text-emerald-dark dark:text-white">{t('analysisResult')}</h2>
                    <div className="flex items-center justify-center gap-4">
                        {badge === 'gold' && <Award size={64} fill="#FFD700" className="text-gold-light" />}
                        {badge === 'silver' && <Award size={64} fill="#C0C0C0" className="text-slate-400" />}
                        {badge === 'bronze' && <Award size={64} fill="#CD7F32" className="text-amber-700" />}
                        {score !== null && (
                            <div className="text-5xl font-black text-gold-dark">
                                {score}%
                            </div>
                        )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{analysisResult.feedback}</p>

                    {score !== null && score >= 70 && currentAyah && (
                        <>
                            <button
                                onClick={generateCertificate}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mt-6 hover:bg-blue-700 transition"
                                disabled={isGeneratingCertificate}
                                aria-label={t('downloadCertificate')}
                            >
                                {isGeneratingCertificate ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} {t('downloadCertificate')}
                            </button>
                            <div ref={certificateRef} className="hidden certificate-template p-8 bg-white text-slate-900 text-center relative overflow-hidden" style={{ width: '800px', height: '600px', fontFamily: 'serif' }}>
                                <div className="border-4 border-gold-dark p-8 h-full flex flex-col justify-between">
                                    <h1 className="text-5xl font-bold text-gold-dark mb-4">Sertifikat Hafalan</h1>
                                    <p className="text-xl">Dengan ini diberikan kepada:</p>
                                    <p className="text-4xl font-bold mt-2 mb-4">Nama Anda</p>
                                    <p className="text-xl">atas keberhasilan dalam setoran hafalan:</p>
                                    <p className="font-arabic text-5xl mt-4 mb-4">{currentAyah.text}</p>
                                    <p className="text-2xl font-bold">{currentAyah.surahName} (Ayat {currentAyah.numberInSurah})</p>
                                    <p className="text-xl mt-4">Dengan nilai: <span className="text-gold-dark font-bold text-3xl">{score}%</span></p>
                                    <div className="mt-8 text-right">
                                        <p className="text-lg">Dikeluarkan oleh IQRO Quran Digital</p>
                                        <p className="text-lg">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SetoranBerhadiah;