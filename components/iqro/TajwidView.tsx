import React, { useState, useCallback, useRef } from 'react';
import { tajwidData } from '../../data/tajwidData';
import { Volume2, Loader2, ChevronDown } from 'lucide-react';
import { speakText, AudioPlaybackControls } from '../../services/geminiService'; // FIX: Changed to speakText and imported AudioPlaybackControls

// Define color mapping for Tajwid rules
const tajwidColors: { [key: string]: string } = {
    "Izhar Halqi": "text-green-600 dark:text-green-400",
    "Idgham": "text-blue-600 dark:text-blue-400",
    "Idgham Bi Ghunnah": "text-blue-500 dark:text-blue-300",
    "Idgham Bila Ghunnah": "text-blue-700 dark:text-blue-500",
    "Iqlab": "text-purple-600 dark:text-purple-400",
    "Ikhfa' Haqiqi": "text-amber-600 dark:text-amber-400",
    "Mad Thobi'i (Asli)": "text-red-600 dark:text-red-400",
};

const TajwidView: React.FC = () => {
    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    // FIX: currentAudioPlaybackRef now uses AudioPlaybackControls
    const currentAudioPlaybackRef = useRef<AudioPlaybackControls | null>(null); // Store current playback to stop it

    const renderHighlighted = (text: string, highlight?: string, ruleColorClass?: string) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <>{parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase()
            ? <span key={i} className={`bg-emerald-200 dark:bg-emerald-700/50 rounded px-1 font-bold ${ruleColorClass}`}>{part}</span> 
            : part
        )}</>;
    };

    const playAudio = useCallback(async (text: string, id: string) => {
        if (loadingAudio) return; // Prevent multiple audio loads
        
        // Stop currently playing audio if any
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.sourceNode?.stop();
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            if (playingAudio === id) { // If clicking the same item, just stop and exit
                setPlayingAudio(null);
                currentAudioPlaybackRef.current = null;
                return;
            }
        }
        
        setLoadingAudio(id);
        try {
            // speakText now returns an AudioPlayback object
            const playback = await speakText(text, 'Kore', 'Indonesian');
            
            // Call play() on the AudioPlayback object to start audio and get controls
            const { sourceNode, controls } = playback.play();
            currentAudioPlaybackRef.current = {
                sourceNode,
                controls,
            };
            setPlayingAudio(id);
            controls.onended = () => {
                setPlayingAudio(null);
                currentAudioPlaybackRef.current = null;
            };
        } catch (error) {
            console.error("Error playing Tajwid example/explanation:", error);
            alert("Gagal memutar audio. Coba lagi.");
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio]);

    return (
        <div className="space-y-4">
            {tajwidData.map((rule, index) => {
                const ruleId = `rule-${index}`;
                const ruleColorClass = tajwidColors[rule.rule] || "text-gray-800 dark:text-gray-200";
                
                return (
                    <details key={index} className="group bg-gray-50 dark:bg-dark-blue rounded-lg transition-all duration-300 open:bg-emerald-light/10 dark:open:bg-emerald-dark/20 overflow-hidden">
                        <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white p-4">
                            <span 
                                className={`flex-grow text-left ${ruleColorClass}`} 
                                onClick={(e) => { e.stopPropagation(); playAudio(`${rule.rule}. ${rule.explanation}`, `${ruleId}-summary`); }}
                                style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }} // Accessibility touch target
                                aria-label={`Dengarkan penjelasan hukum ${rule.rule}`}
                            >
                                {rule.rule}
                            </span>
                            <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="text-sm">
                                <span 
                                    onClick={() => playAudio(rule.explanation, `${ruleId}-explanation`)}
                                    className="cursor-pointer hover:underline"
                                    aria-label={`Dengarkan penjelasan ${rule.rule}`}
                                >
                                    {rule.explanation}
                                </span>
                            </p>
                            {rule.letters && (
                                <p>
                                    <strong
                                        onClick={() => playAudio(`Huruf ${rule.letters}`, `${ruleId}-letters`)}
                                        className="cursor-pointer hover:underline"
                                        aria-label={`Dengarkan huruf-huruf ${rule.rule}`}
                                    >
                                        Huruf:
                                    </strong>{' '}
                                    <span className={`font-arabic text-xl ${ruleColorClass}`} dir="rtl">
                                        {rule.letters}
                                    </span>
                                </p>
                            )}
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold">Contoh:</h4>
                                {rule.examples?.map((ex, exIndex) => (
                                    <div key={exIndex} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-dark-blue-card">
                                        <div 
                                            onClick={() => playAudio(ex.arabic, `ex-${ruleId}-${exIndex}`)}
                                            className="cursor-pointer flex-grow min-h-[44px] flex flex-col justify-center" // Accessibility touch target
                                            aria-label={`Dengarkan contoh ${ex.latin}`}
                                        >
                                            <p className={`font-arabic text-2xl ${ruleColorClass}`} dir="rtl">{renderHighlighted(ex.arabic, ex.highlight, ruleColorClass)}</p>
                                            <p className="text-sm italic text-emerald-dark dark:text-emerald-light">{ex.latin}</p>
                                        </div>
                                        <button 
                                            onClick={() => playAudio(ex.arabic, `ex-btn-${ruleId}-${exIndex}`)}
                                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition min-h-[44px] min-w-[44px]"
                                            aria-label={`Dengarkan contoh ${ex.latin}`}
                                        >
                                            {loadingAudio === `ex-btn-${ruleId}-${exIndex}` 
                                                ? <Loader2 className="animate-spin" />
                                                : <Volume2 className={playingAudio === `ex-btn-${ruleId}-${exIndex}` ? 'text-gold-dark' : ''}/>
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            {rule.subRules?.map((sub, subIndex) => {
                                const subRuleId = `${ruleId}-sub-${subIndex}`;
                                const subRuleColorClass = tajwidColors[sub.name] || ruleColorClass; // Sub-rules might have specific colors

                                return (
                                    <div key={subIndex} className="ml-4 border-l-2 border-emerald-dark/50 pl-4 py-2 space-y-2">
                                        <h4 
                                            className={`font-semibold ${subRuleColorClass}`}
                                            onClick={() => playAudio(`${sub.name}. ${sub.explanation}`, `${subRuleId}-summary`)}
                                            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }} // Accessibility touch target
                                            aria-label={`Dengarkan penjelasan sub-hukum ${sub.name}`}
                                        >
                                            {sub.name}
                                        </h4>
                                        <p className="text-sm">
                                            <span 
                                                onClick={() => playAudio(sub.explanation, `${subRuleId}-explanation`)}
                                                className="cursor-pointer hover:underline"
                                                aria-label={`Dengarkan penjelasan ${sub.name}`}
                                            >
                                                {sub.explanation}
                                            </span>
                                        </p>
                                        {sub.examples.map((ex, exSubIndex) => (
                                            <div key={exSubIndex} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-dark-blue-card">
                                                <div 
                                                    onClick={() => playAudio(ex.arabic, `ex-${subRuleId}-${exSubIndex}`)}
                                                    className="cursor-pointer flex-grow min-h-[44px] flex flex-col justify-center" // Accessibility touch target
                                                    aria-label={`Dengarkan contoh ${ex.latin}`}
                                                >
                                                    <p className={`font-arabic text-2xl ${subRuleColorClass}`} dir="rtl">{renderHighlighted(ex.arabic, ex.highlight, subRuleColorClass)}</p>
                                                    <p className="text-sm italic text-emerald-dark dark:text-emerald-light">{ex.latin}</p>
                                                </div>
                                                <button 
                                                    onClick={() => playAudio(ex.arabic, `ex-btn-${subRuleId}-${exSubIndex}`)}
                                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition min-h-[44px] min-w-[44px]"
                                                    aria-label={`Dengarkan contoh ${ex.latin}`}
                                                >
                                                    {loadingAudio === `ex-btn-${subRuleId}-${exSubIndex}` 
                                                        ? <Loader2 className="animate-spin" />
                                                        : <Volume2 className={playingAudio === `ex-btn-${subRuleId}-${exSubIndex}` ? 'text-gold-dark' : ''}/>
                                                    }
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

export default TajwidView;