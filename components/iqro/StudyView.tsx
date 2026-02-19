
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { speakText, AudioPlaybackControls } from '../../services/geminiService';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { BookText, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { HijaiyahCard } from './HijaiyahCard';
import { IqroLevelData, IqroItem } from '../../types';

interface StudyViewProps {
    levelData: IqroLevelData;
}

const StudyView: React.FC<StudyViewProps> = ({ levelData }) => {
    const { markAsCompleted } = useIqroProgress();
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(0);
    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    const currentAudioPlaybackRef = useRef<AudioPlaybackControls | null>(null);
    
    useEffect(() => {
        setCurrentPage(0);
    }, [levelData]);

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
            // Requirement: Middle Eastern Arabic accent, ALWAYS use Web Speech API for Iqro study/practice
            const playback = await speakText(char, 'Kore', 'Arabic', true, undefined, true); // isIqroContent: true
            
            const controls = playback.play();
            currentAudioPlaybackRef.current = controls;

            setPlayingAudio(id);
            controls.controls.onended = () => {
                setPlayingAudio(null); 
                markAsCompleted(id);
                currentAudioPlaybackRef.current = null;
            };
        } catch (error) {
            console.error("Error generating speech:", error);
        } finally {
            setLoadingAudio(null);
        }
    }, [loadingAudio, playingAudio, markAsCompleted]);
    
    const section = levelData.sections[currentPage];
    if (!section) return <div className="p-8 text-center">Materi tidak ditemukan.</div>;

    const totalPages = levelData.sections.length;

    const goToNextPage = () => {
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            setPlayingAudio(null);
        }
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentAudioPlaybackRef.current) {
            currentAudioPlaybackRef.current.stop();
            setPlayingAudio(null);
        }
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="flex flex-col space-y-6">
            {/* 1. HEADER: Title & Info on TOP */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-emerald-100 dark:border-emerald-900 pb-3">
                    <div className="bg-emerald-600 text-white p-2 rounded-xl">
                        <BookText size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-emerald-dark dark:text-white">
                        {t(section.title as TranslationKeys)}
                    </h3>
                </div>
                
                {section.info && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {t(section.info as TranslationKeys)}
                        </p>
                    </div>
                )}
            </div>

            {/* 2. CONTENT: Grid in CENTER */}
            <div className="py-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {section.items.map((item, itemIndex) => {
                        const id = `${levelData.level}-${currentPage}-${itemIndex}`;
                        return (
                            <HijaiyahCard
                                key={id}
                                id={id}
                                item={item as IqroItem}
                                level={levelData.level}
                                sectionTitle={section.title}
                                isLoading={loadingAudio === id}
                                isPlaying={playingAudio === id}
                                onPlay={(char, latin) => handlePlayAudio(char, latin, id)}
                                showLatinText={false} // Requirement for Iqro 1 Study tab
                            />
                        );
                    })}
                </div>
            </div>

            {/* 3. FOOTER: Tips/Guide on BOTTOM */}
            {section.guide && (
                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-inner">
                    <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
                        <Lightbulb size={20} className="shrink-0" />
                        <h4 className="font-bold uppercase tracking-widest text-xs">Catatan & Tips Pembelajaran</h4>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed italic antialiased">
                        {t(section.guide as TranslationKeys)}
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-blue border border-gray-200 dark:border-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition disabled:opacity-30 min-h-[44px]"
                >
                    <ChevronLeft size={20} /> {t('Sebelumnya')}
                </button>
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="font-black text-emerald-dark dark:text-emerald-light text-sm">
                        {currentPage + 1} / {totalPages}
                    </span>
                </div>
                <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-dark text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 transition disabled:opacity-30 min-h-[44px]"
                >
                    {t('Berikutnya')} <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default StudyView;
