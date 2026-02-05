
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { iqroData } from '../../data/iqroData';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { HijaiyahCard } from './HijaiyahCard';
import { generateSpeech } from '../../services/geminiService';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useTranslation } from '../../contexts/LanguageContext';

type AudioPlaybackResult = {
  sourceNode: AudioBufferSourceNode;
  controls: { onended: (() => void) | null };
};

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
    const audioCache = useRef<Map<string, () => AudioPlaybackResult>>(new Map());
    const audioController = useRef<AudioBufferSourceNode | null>(null);

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

    const handlePlayAudio = useCallback(async (text: string, id: string) => {
        if (loadingAudio) return;
        if (playingAudio) audioController.current?.stop();

        if (audioCache.current.has(id)) {
            const play = audioCache.current.get(id)!;
            const { sourceNode, controls } = play();
            audioController.current = sourceNode;
            setPlayingAudio(id);
            controls.onended = () => { setPlayingAudio(null); };
            return;
        }

        setLoadingAudio(id);
        try {
            const { play, sourceNode, controls } = await generateSpeech(text);
            audioCache.current.set(id, play);
            audioController.current = sourceNode;
            setPlayingAudio(id);
            controls.onended = () => { setPlayingAudio(null); };
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
                    <p className="font-bold text-lg text-emerald-dark dark:text-white">Item {currentIndex + 1} / {allItems.length}</p>
                </div>
                <HijaiyahCard 
                    id={currentItem.id}
                    item={currentItem}
                    level={levelData.level}
                    sectionTitle={currentItem.sectionTitle}
                    isLoading={loadingAudio === currentItem.id}
                    isPlaying={playingAudio === currentItem.id}
                    onPlay={() => handlePlayAudio(currentItem.char, currentItem.id)}
                    isLarge={true}
                />
            </div>

            <div className="flex items-center justify-center w-full max-w-xs sm:max-w-sm space-x-4">
                <button 
                    onClick={goToPrev} 
                    disabled={currentIndex === 0} 
                    className="p-4 bg-gray-200 dark:bg-dark-blue rounded-full text-emerald-dark dark:text-emerald-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    aria-label="Previous Item"
                >
                    <ArrowLeft />
                </button>
                <button 
                    onClick={handleNextLesson} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="flex-grow bg-emerald-dark text-white px-6 py-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label="Next Lesson"
                >
                    <span>{t('nextLesson')}</span>
                    <SkipForward size={20} />
                </button>
                <button 
                    onClick={goToNext} 
                    disabled={currentIndex === allItems.length - 1} 
                    className="p-4 bg-gray-200 dark:bg-dark-blue rounded-full text-emerald-dark dark:text-emerald-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    aria-label="Next Item"
                >
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
};

export default PracticeView;
