
import React, { useState, useCallback, useRef } from 'react';
import { tajwidData } from '../data/tajwidData';
import { Volume2, Loader2, ChevronDown } from 'lucide-react';
import { generateSpeech } from '../services/geminiService'; // Ensure this is updated for fallback

const TajwidView: React.FC = () => {
    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const audioController = useRef<AudioBufferSourceNode | null>(null);
    
    const renderHighlighted = (text: string, highlight?: string) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <>{parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase()
            ? <span key={i} className="bg-emerald-200 dark:bg-emerald-700/50 rounded px-1">{part}</span> 
            : part
        )}</>;
    };

    const playAudio = useCallback(async (text: string, id: string) => {
        if (loadingAudio) return;
        if (playingAudio) {
            audioController.current?.stop();
            if (playingAudio === id) {
                setPlayingAudio(null);
                return;
            }
        }
        
        setLoadingAudio(id);
        try {
            const { sourceNode, controls } = await generateSpeech(text);
            audioController.current = sourceNode || null; // Update controller if actual sourceNode is returned
            setPlayingAudio(id);
            controls.onended = () => setPlayingAudio(null);
        } catch (error) {
            console.error("Error playing Tajwid example:", error);
            alert("Gagal memutar audio contoh.");
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio]);

    return (
        <div className="space-y-4">
            {tajwidData.map((rule, index) => (
                <details key={index} className="group bg-gray-50 dark:bg-dark-blue rounded-lg transition-all duration-300 open:bg-emerald-light/10 dark:open:bg-emerald-dark/20 overflow-hidden">
                    <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white p-4">
                        {rule.rule}
                        <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-300">
                        <p>{rule.explanation}</p>
                        {rule.letters && <p><strong>Huruf:</strong> <span className="font-arabic text-xl" dir="rtl">{rule.letters}</span></p>}
                        
                        <div className="space-y-2">
                            <h4 className="font-semibold">Contoh:</h4>
                            {rule.examples?.map((ex, exIndex) => (
                                <div key={exIndex} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-dark-blue-card">
                                    <div>
                                        <p className="font-arabic text-2xl" dir="rtl">{renderHighlighted(ex.arabic, ex.highlight)}</p>
                                        <p className="text-sm italic text-emerald-dark dark:text-emerald-light">{ex.latin}</p>
                                    </div>
                                    <button 
                                        onClick={() => playAudio(ex.arabic, `ex-${index}-${exIndex}`)}
                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                        aria-label={`Dengarkan ${ex.latin}`}
                                    >
                                        {loadingAudio === `ex-${index}-${exIndex}` 
                                            ? <Loader2 className="animate-spin" />
                                            : <Volume2 className={playingAudio === `ex-${index}-${exIndex}` ? 'text-gold-dark' : ''}/>
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {rule.subRules?.map((sub, subIndex) => (
                            <div key={subIndex} className="ml-4 border-l-2 border-emerald-dark/50 pl-4 py-2 space-y-2">
                                <h4 className="font-semibold">{sub.name}</h4>
                                <p className="text-sm">{sub.explanation}</p>
                                {sub.examples.map((ex, exSubIndex) => (
                                    <div key={exSubIndex} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-dark-blue-card">
                                        <div>
                                            <p className="font-arabic text-2xl" dir="rtl">{renderHighlighted(ex.arabic, ex.highlight)}</p>
                                            <p className="text-sm italic text-emerald-dark dark:text-emerald-light">{ex.latin}</p>
                                        </div>
                                         <button 
                                            onClick={() => playAudio(ex.arabic, `sub-${index}-${subIndex}-${exSubIndex}`)}
                                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                            aria-label={`Dengarkan ${ex.latin}`}
                                        >
                                            {loadingAudio === `sub-${index}-${subIndex}-${exSubIndex}` 
                                                ? <Loader2 className="animate-spin" />
                                                : <Volume2 className={playingAudio === `sub-${index}-${subIndex}-${exSubIndex}` ? 'text-gold-dark' : ''}/>
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default TajwidView;
