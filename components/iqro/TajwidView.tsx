
import React, { useState, useCallback } from 'react';
import { tajwidData } from '../../data/tajwidData'; // Assuming tajwidData structure includes rule and explanation
import { Volume2, Loader2, ChevronDown } from 'lucide-react';
import { speak, stopSpeaking } from '../../utils/browserSpeech'; // Import browser speech directly
import { defaultVoiceLangMapping } from '../../data/voiceTriggers';
import { useTranslation } from '../../contexts/LanguageContext'; // Untuk mendapatkan bahasa saat ini untuk speech browser

// Definisi palet warna untuk aturan Tajwid
const tajwidColors: { [key: string]: string } = {
    "Izhar Halqi": "text-green-600 dark:text-green-400",
    "Idgham": "text-blue-600 dark:text-blue-400",
    "Idgham Bi Ghunnah": "text-blue-500 dark:text-blue-300",
    "Idgham Bila Ghunnah": "text-indigo-600 dark:text-indigo-400",
    "Iqlab": "text-red-600 dark:text-red-400",
    "Ikhfa' Haqiqi": "text-purple-600 dark:text-purple-400",
    "Mad Thobi'i (Asli)": "text-orange-600 dark:text-orange-400",
    // Tambahkan lebih banyak aturan dan warna sesuai kebutuhan
};

const TajwidView: React.FC = () => {
    const { t, currentLanguage } = useTranslation();
    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    // audioController tidak digunakan secara langsung untuk speech browser
    // Kita mengandalkan `stopSpeaking` dan status lokal untuk `playingAudio`

    // Helper untuk merender teks dengan highlight
    const renderHighlighted = (text: string, highlight?: string) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <>{parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase()
            ? <span key={i} className="bg-emerald-200 dark:bg-emerald-700/50 rounded px-1">{part}</span> 
            : part
        )}</>;
    };

    // Fungsi untuk mengucapkan konten teks apa pun menggunakan Web Speech API browser
    const speakTextContent = useCallback(async (text: string, id: string) => {
        if (loadingAudio) return;
        stopSpeaking(); // Hentikan speech sebelumnya

        if (playingAudio === id) {
            setPlayingAudio(null);
            return;
        }

        setLoadingAudio(id);
        setPlayingAudio(id); // Perbarui status pemutaran secara optimis

        try {
            const browserLang = defaultVoiceLangMapping[currentLanguage] || 'id-ID';
            await speak(text, browserLang, undefined, () => {
                setPlayingAudio(null); // Saat selesai, atur ulang status pemutaran
                setLoadingAudio(null);
            });
        } catch (error) {
            console.error("Error playing browser speech:", error);
            alert("Gagal memutar audio. Coba lagi.");
            setPlayingAudio(null);
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio, currentLanguage]);

    const playRuleExplanation = useCallback((ruleName: string, explanation: string, id: string) => {
        const textToSpeak = `${ruleName}. ${explanation}`;
        speakTextContent(textToSpeak, id);
    }, [speakTextContent]);

    return (
        <div className="space-y-4">
            {tajwidData.map((rule, index) => {
                const ruleId = `rule-${index}`;
                const ruleColorClass = tajwidColors[rule.rule] || "text-emerald-dark dark:text-white";

                return (
                    <details key={ruleId} className="group bg-gray-50 dark:bg-dark-blue rounded-lg transition-all duration-300 open:bg-emerald-light/10 dark:open:bg-emerald-dark/20 overflow-hidden">
                        <summary 
                            className={`font-semibold text-lg cursor-pointer list-none flex justify-between items-center ${ruleColorClass} p-4`}
                            onClick={() => playRuleExplanation(rule.rule, rule.explanation, ruleId)}
                            aria-label={`Dengarkan penjelasan hukum ${rule.rule}`}
                        >
                            {rule.rule}
                            <div className="flex items-center gap-2">
                                {loadingAudio === ruleId && <Loader2 className="animate-spin h-5 w-5" />}
                                <Volume2 className={playingAudio === ruleId ? 'text-gold-dark' : ''} />
                                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                            </div>
                        </summary>
                        <div className="px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="text-sm">{rule.explanation}</p>
                            {rule.letters && <p><strong>Huruf:</strong> <span className={`font-arabic text-xl ${ruleColorClass}`} dir="rtl">{rule.letters}</span></p>}
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold">Contoh:</h4>
                                {rule.examples?.map((ex, exIndex) => {
                                    const exampleId = `${ruleId}-ex-${exIndex}`;
                                    return (
                                        <button 
                                            key={exampleId} 
                                            onClick={() => speakTextContent(ex.arabic, exampleId)}
                                            className="w-full flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-dark-blue-card hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                            aria-label={`Dengarkan contoh ${ex.latin}`}
                                            disabled={loadingAudio === exampleId}
                                        >
                                            <div>
                                                <p className="font-arabic text-2xl text-right" dir="rtl">{renderHighlighted(ex.arabic, ex.highlight)}</p>
                                                <p className="text-sm italic text-emerald-dark dark:text-emerald-light text-right">{ex.latin}</p>
                                            </div>
                                            <div className="p-2 rounded-full">
                                                {loadingAudio === exampleId 
                                                    ? <Loader2 className="animate-spin text-gray-500" />
                                                    : <Volume2 className={playingAudio === exampleId ? 'text-gold-dark' : ''}/>
                                                }
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {rule.subRules?.map((sub, subIndex) => (
                                <div key={subIndex} className="ml-4 border-l-2 border-emerald-dark/50 pl-4 py-2 space-y-2">
                                    <h4 
                                        className={`font-semibold ${tajwidColors[sub.name] || 'text-slate-800 dark:text-slate-200'}`}
                                        onClick={() => speakTextContent(`${sub.name}. ${sub.explanation}`, `${ruleId}-sub-${subIndex}-title`)}
                                        aria-label={`Dengarkan penjelasan sub-hukum ${sub.name}`}
                                    >
                                        {sub.name}
                                    </h4>
                                    <p className="text-sm">{sub.explanation}</p>
                                    {sub.examples.map((ex, exSubIndex) => {
                                        const subExampleId = `${ruleId}-sub-${subIndex}-ex-${exSubIndex}`;
                                        return (
                                            <button 
                                                key={subExampleId} 
                                                onClick={() => speakTextContent(ex.arabic, subExampleId)}
                                                className="w-full flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-dark-blue-card hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                                aria-label={`Dengarkan contoh ${ex.latin}`}
                                                disabled={loadingAudio === subExampleId}
                                            >
                                                <div>
                                                    <p className="font-arabic text-2xl text-right" dir="rtl">{renderHighlighted(ex.arabic, ex.highlight)}</p>
                                                    <p className="text-sm italic text-emerald-dark dark:text-emerald-light text-right">{ex.latin}</p>
                                                </div>
                                                <div className="p-2 rounded-full">
                                                    {loadingAudio === subExampleId 
                                                        ? <Loader2 className="animate-spin text-gray-500" />
                                                        : <Volume2 className={playingAudio === subExampleId ? 'text-gold-dark' : ''}/>
                                                    }
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

export default TajwidView;
