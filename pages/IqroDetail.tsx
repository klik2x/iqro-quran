import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IqroModule from '../components/IqroModule';
import { iqroData } from '../data/iqroData';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowLeft, Mic, MicOff, Loader2 } from 'lucide-react';
import { startVoiceCommandListener, stopVoiceCommandListener, getIsListeningStatus } from '../utils/voiceProcessor';
import { useUI } from '../contexts/UIContext'; // Import useUI to use high contrast
import { speak } from '../utils/browserSpeech'; // FIX: Untuk audio feedback perintah suara, gunakan browserSpeech

const IqroDetail: React.FC = () => {
    const { levelNumber } = useParams<{ levelNumber: string }>();
    const navigate = useNavigate();
    const { t, currentLanguage } = useTranslation();
    const { isHighContrast } = useUI(); // Get high contrast state

    const levelId = parseInt(levelNumber || '1');
    const levelData = iqroData.find(l => l.level === levelId);
    
    const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    // This state is passed down to IqroModule to influence which page is active.
    // It's effectively the page number within the IqroModule's 'study' view.
    const [internalIqroPage, setInternalIqroPage] = useState(0); 

    const handleVoiceCommand = useCallback((command: string, recognizedText: string) => {
        console.log(`Command received: ${command}, Text: ${recognizedText}`);
        speak(recognizedText, `id-ID`); // Echo recognized text for feedback

        // Logic for Iqro navigation
        if (command === 'next') {
            setInternalIqroPage(prev => {
                if (levelData && prev < levelData.sections.length - 1) {
                    // FIX: Ensure t() is used to get the translated string
                    speak(t('nextPage'), `id-ID`);
                    return prev + 1;
                }
                // FIX: Ensure t() is used to get the translated string
                speak(t('noNextPage'), `id-ID`);
                return prev;
            });
        } else if (command === 'prev') {
            setInternalIqroPage(prev => {
                if (prev > 0) {
                    // FIX: Ensure t() is used to get the translated string
                    speak(t('previousPage'), `id-ID`);
                    return prev - 1;
                }
                // FIX: Ensure t() is used to get the translated string
                    speak(t('noPrevPage'), `id-ID`);
                return prev;
            });
        } else if (command === 'repeat') {
            // Logic to trigger repeat, perhaps by replaying the current audio element
            // This would require IqroModule to expose a method or a more granular state for audio playback.
            // For now, we'll just acknowledge.
            // FIX: Ensure t() is used to get the translated string
            speak(t('repeating'), `id-ID`);
            console.log("Trigger repeat action for current content.");
        }
    }, [levelData, t]);

    const handleListeningStatusChange = useCallback((status: boolean) => {
        setIsListening(status);
        if (!status) {
            // If stopped, ensure it tries to restart if active
            if (isVoiceCommandActive) {
                console.log("Recognition stopped, but voice command active. Restarting...");
                // Add a small delay to avoid rapid restarts in case of transient errors
                setTimeout(() => {
                    if (isVoiceCommandActive) { // Re-check if still active after delay
                         startVoiceCommandListener(currentLanguage, handleVoiceCommand, handleListeningStatusChange, handleRecognitionError);
                    }
                }, 500); 
            }
        }
    }, [isVoiceCommandActive, currentLanguage, handleVoiceCommand]);

    const handleRecognitionError = useCallback((error: string) => {
        console.error("Voice recognition error:", error);
        setVoiceError(error);
        if (error === 'not-allowed' || error === 'denied') {
            // FIX: Ensure t() is used to get the translated string
            speak(t('micPermissionDenied'), `id-ID`);
            setIsVoiceCommandActive(false); // Turn off toggle if permission denied
        } else {
             // For other errors, try to restart if active
             if (isVoiceCommandActive) {
                 setTimeout(() => {
                    if (isVoiceCommandActive) {
                        startVoiceCommandListener(currentLanguage, handleVoiceCommand, handleListeningStatusChange, handleRecognitionError);
                    }
                 }, 500);
             }
        }
    }, [isVoiceCommandActive, currentLanguage, handleVoiceCommand, t]);

    useEffect(() => {
        if (isVoiceCommandActive) {
            startVoiceCommandListener(currentLanguage, handleVoiceCommand, handleListeningStatusChange, handleRecognitionError);
        } else {
            stopVoiceCommandListener();
            setVoiceError(null);
        }
        return () => {
            stopVoiceCommandListener();
        };
    }, [isVoiceCommandActive, currentLanguage, handleVoiceCommand, handleListeningStatusChange, handleRecognitionError]);


    if (!levelData) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-500">Level Iqro tidak ditemukan.</h2>
                <button onClick={() => navigate('/iqro')} className="mt-4 px-4 py-2 bg-emerald-dark text-white rounded-lg">
                  {t('backToIqroMenu')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button onClick={() => navigate('/iqro')} className="flex items-center gap-2 mb-4 font-semibold text-emerald-dark dark:text-emerald-light hover:underline">
                <ArrowLeft size={20} /> {t('backToIqroMenu')}
            </button>
            
            <IqroModule t={t} levelData={levelData} currentStudyPage={internalIqroPage} setStudyPage={setInternalIqroPage} />

            <div className="fixed bottom-20 md:bottom-4 right-4 z-30 flex flex-col items-end gap-2">
                {voiceError && (
                    <div className="bg-red-500 text-white text-sm p-2 rounded-lg shadow-md mb-2">
                        {t('voiceError')}: {voiceError}
                    </div>
                )}
                <button 
                    onClick={() => setIsVoiceCommandActive(prev => !prev)}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform active:scale-95 border-2 
                                ${isVoiceCommandActive 
                                    ? (isListening ? 'bg-red-500 text-white animate-pulse border-red-600' : 'bg-gray-700 text-white border-gray-800')
                                    : (isHighContrast ? 'bg-hc-button-bg text-hc-button-text border-hc-accent' : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700')
                                }`}
                    aria-label={isVoiceCommandActive ? t('deactivateVoiceCommands') : t('activateVoiceCommands')}
                >
                    {isVoiceCommandActive && isListening ? <Mic size={28} /> : <MicOff size={28} />}
                </button>
                {isVoiceCommandActive && isListening && (
                    <p className={`text-xs mt-1 font-semibold ${isHighContrast ? 'text-hc-accent' : 'text-emerald-dark dark:text-emerald-light'}`}>{t('listening')}...</p>
                )}
            </div>
        </div>
    );
};

export default IqroDetail;
