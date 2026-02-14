import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { iqroData } from '../../data/iqroData';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { HijaiyahCard } from './HijaiyahCard';
import { speakText, AudioPlaybackControls } from '../../services/geminiService'; // FIX: Changed to speakText and imported AudioPlaybackControls
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useTranslation } from '../../contexts/LanguageContext';

interface PracticeViewProps {
    levelData: typeof iqroData[0];
}

const PracticeView: React.FC<PracticeViewProps> = ({ levelData }) => {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { markAsCompleted } = useIqroProgress();
    const { t } = useTranslation();

    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    // FIX: Refactor audio controller to store playback control, not just sourceNode
    const currentAudioPlaybackRef = useRef<AudioPlaybackControls | null>(null);

    useEffect(() => {
        const flattenedItems = levelData.sections.flatMap((section, sectionIndex) => 
            section.items.map((item, itemIndex) => ({
                ...item, 
                id: `${levelData.level}-${sectionIndex}-${itemIndex}`,
                sectionTitle: section.title
            }))
        );
        setAllItems(flattenedItems);
        setCurrentIndex(0);
    }, [levelData]);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => Math.min(prev + 1, allItems.length - 1));
    }, [allItems.length]);

    const goToPrev = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    // FIX: Updated handlePlayAudio to use speakText and handle both char and latin
    const handlePlayAudio = useCallback(async (char: string, latin: string, id: string) => {
        if (loadingAudio) return;
        
        // Stop current audio if playing
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
            const playback = await speakText(char, 'Kore', 'Indonesian', latin);
            
            // Call play() on the AudioPlayback object to start audio and get controls
            const { sourceNode, controls } = playback.play();
            
            // Store the playback controls
            currentAudioPlaybackRef.current = {
                sourceNode,
                controls,
            };

            setPlayingAudio(id);
            // Set onended callback on the returned controls
            controls.onended = () => { 
                setPlayingAudio(null); 
                currentAudioPlaybackRef.current = null;
            };
        } catch (error) {
            console.error("Error generating speech:", error);
            alert("Gagal memutar audio. Coba lagi.");
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio]);

    const handleNextLesson = () => {
        if (currentItem) {
            markAsCompleted(currentItem.id);
            goToNext();
        }
    };

    const currentItem = allItems[currentIndex];
    
    if (!currentItem) {
        return <div className="text-center p-8">{t('noItemsForPractice')}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
            <div className="w-full max-w-xs sm:max-w-sm">
                 <div className="text-center mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currentItem.sectionTitle}</p>
                    <p className="font-bold text-lg text-emerald-dark dark:text-white">{t('Item')} {currentIndex + 1} / {allItems.length}</p>
                </div>
                <HijaiyahCard 
                    id={currentItem.id}
                    item={currentItem}
                    level={levelData.level}
                    sectionTitle={currentItem.sectionTitle}
                    isLoading={loadingAudio === currentItem.id}
                    isPlaying={playingAudio === currentItem.id}
                    // FIX: Pass both char and latin to onPlay
                    onPlay={(char, latin) => handlePlayAudio(char, latin, currentItem.id)}
                    isLarge={true}
                />
            </div>

            <div className="flex items-center justify-center w-full max-w-xs sm:max-w-sm space-x-4">
                <button 
                    onClick={goToPrev} 
                    disabled={currentIndex === 0} 
                    className="p-4 bg-gray-200 dark:bg-dark-blue rounded-full text-emerald-dark dark:text-emerald-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition min-h-[44px]"
                    aria-label={t('Previous Item')}
                >
                    <ArrowLeft />
                </button>
                <button 
                    onClick={handleNextLesson} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="flex-grow bg-emerald-dark text-white px-6 py-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                    aria-label={t('nextLesson')}
                >
                    <span>{t('nextLesson')}</span>
                    <SkipForward size={20} />
                </button>
                <button 
                    onClick={goToNext} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="p-4 bg-gray-200 dark:bg-dark-blue rounded-full text-emerald-dark dark:text-emerald-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition min-h-[44px]"
                    aria-label={t('Next Item')}
                >
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
};

export default PracticeView;