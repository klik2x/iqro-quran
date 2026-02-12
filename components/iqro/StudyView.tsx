
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useIqroProgress } from '../../hooks/useIqroProgress';
import { Info, BookText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { HijaiyahCard } from './HijaiyahCard';
import { iqroData } from '../../data/iqroData';
import { speak, stopSpeaking } from '../../utils/browserSpeech'; // Langsung import speak untuk pembelajaran Iqro
import { defaultVoiceLangMapping } from '../../data/voiceTriggers'; // Untuk pemetaan bahasa

interface StudyViewProps {
    levelData: typeof iqroData[0];
    currentStudyPage: number; // Prop baru untuk kontrol eksternal
    setStudyPage: (page: number | ((prev: number) => number)) => void; // Prop baru untuk kontrol eksternal
}

const StudyView: React.FC<StudyViewProps> = ({ levelData, currentStudyPage, setStudyPage }) => {
    const { markAsCompleted } = useIqroProgress();
    const { t, currentLanguage } = useTranslation(); // Dapatkan bahasa saat ini untuk speech browser

    const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    // AudioController tidak digunakan secara langsung untuk speech browser, tetapi untuk melacak apakah ada yang sedang diputar
    const audioController = useRef<SpeechSynthesisUtterance | null>(null); 

    // Atur ulang status audio internal saat halaman atau level berubah
    useEffect(() => {
        stopSpeaking(); // Pastikan setiap speech browser dihentikan
        setPlayingAudio(null);
        setLoadingAudio(null);
    }, [currentStudyPage, levelData]);


    const handlePlayAudio = useCallback(async (arabicText: string, latinText: string, id: string) => {
        if (loadingAudio) return;
        stopSpeaking(); // Hentikan setiap speech browser yang sedang diputar

        if (playingAudio === id) { // Jika audio yang sama, hentikan
            setPlayingAudio(null);
            return;
        }

        setLoadingAudio(id);
        setPlayingAudio(id); // Perbarui status pemutaran segera

        try {
            const textToSpeak = `${arabicText}. Dibaca: ${latinText}`;
            const browserLang = defaultVoiceLangMapping[currentLanguage] || 'id-ID';
            
            // Panggil Web Speech API secara langsung
            await speak(textToSpeak, browserLang, undefined, () => {
                setPlayingAudio(null); // Saat selesai, atur status pemutaran menjadi null
                markAsCompleted(id); // Tandai sebagai selesai setelah pemutaran berhasil
                setLoadingAudio(null);
            });
        } catch (error) {
            console.error("Error playing browser speech:", error);
            alert("Gagal memutar audio. Coba lagi.");
            setPlayingAudio(null);
            setLoadingAudio(null);
        } finally {
            // setLoadingAudio akan diatur ke null oleh callback onend atau segera jika speak gagal secara sinkron.
            // Pastikan direset jika tidak ada onend yang terpicu (misalnya, API tidak didukung)
            if (!window.speechSynthesis) { // Jika API tidak didukung, onend tidak akan terpicu
                setLoadingAudio(null);
            }
        }
    }, [loadingAudio, playingAudio, markAsCompleted, currentLanguage]);
    
    const section = levelData.sections[currentStudyPage];
    if (!section) return <div className="p-8 text-center">{t('materialNotFound')}</div>;

    const totalPages = levelData.sections.length;

    const goToNextPage = () => {
        if (currentStudyPage < totalPages - 1) {
            setStudyPage(currentStudyPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentStudyPage > 0) {
            setStudyPage(currentStudyPage - 1);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-emerald-light/20 dark:bg-emerald-dark/30 p-4 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-emerald-dark dark:text-emerald-light flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-emerald-dark dark:text-white">{t('learningMaterials')}</h3>
                    <p className="text-sm text-emerald-dark/80 dark:text-emerald-light/80">{levelData.description}</p>
                </div>
            </div>

            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-bold text-lg text-emerald-dark dark:text-white">{section.title}</h3>
                
                {section.info && (
                     <p className="text-sm text-gray-600 dark:text-gray-400 italic">{section.info}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {section.items.map((item, itemIndex) => {
                        const id = `${levelData.level}-${currentStudyPage}-${itemIndex}`;
                        return (
                            <HijaiyahCard
                                key={id}
                                id={id}
                                item={item}
                                level={levelData.level}
                                sectionTitle={section.title}
                                isLoading={loadingAudio === id}
                                isPlaying={playingAudio === id}
                                onPlay={() => handlePlayAudio(item.char, item.latin, id)} // Meneruskan kedua teks Arab dan Latin
                            />
                        );
                    })}
                </div>

                {section.guide && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4 flex items-start gap-3">
                        <BookText size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                        <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap">{section.guide}</p>
                    </div>
                )}
            </div>

            {/* Kontrol Halaman */}
            <div className="flex items-center justify-between pt-4">
                <button 
                    onClick={goToPrevPage} 
                    disabled={currentStudyPage === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-dark-blue rounded-lg font-semibold disabled:opacity-50"
                    aria-label={t('previousPage')}
                >
                    <ChevronLeft size={18} /> {t('previous')}
                </button>
                <span className="font-bold text-gray-600 dark:text-gray-300" aria-live="polite">
                    {t('page')} {currentStudyPage + 1} / {totalPages}
                </span>
                <button 
                    onClick={goToNextPage} 
                    disabled={currentStudyPage === totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-dark text-white rounded-lg font-semibold disabled:opacity-50"
                    aria-label={t('nextPage')}
                >
                    {t('next')} <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default StudyView;
