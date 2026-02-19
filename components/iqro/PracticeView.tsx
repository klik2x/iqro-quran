
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, SkipForward, BookText } from 'lucide-react';
import { HijaiyahCard } from './HijaiyahCard';
import { speakText, AudioPlaybackControls } from '../../services/geminiService';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { IqroLevelData } from '../../types';

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
        setCurrentIndex(prev => Math.min(prev + 1, allItems.length - 1));
    }, [allItems.length]);

    const goToPrev = () => {
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            setPlayingAudio(null);
        }
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
            <div className="w-full">
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
