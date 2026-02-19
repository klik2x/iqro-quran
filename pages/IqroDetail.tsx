
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IqroModule from '../components/IqroModule';
import { iqroData } from '../data/iqroData';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { ArrowLeft, Award, Hourglass, BookOpen } from 'lucide-react'; // Import Hourglass
import { useIqroProgress } from '../hooks/useIqroProgress'; // Import useIqroProgress
import { IqroLevelData } from '../types'; // Import IqroLevelData

const IqroDetail: React.FC = () => {
    const { levelNumber } = useParams<{ levelNumber: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { calculateLevelCompletion } = useIqroProgress(); // Use the hook

    const levelId = parseInt(levelNumber || '1');
    // FIX: Explicitly cast to IqroLevelData to match component prop type
    const levelData: IqroLevelData | undefined = iqroData.find(l => l.level === levelId) as IqroLevelData;

    if (!levelData) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-500">Level Iqro tidak ditemukan.</h2>
                <button onClick={() => navigate('/iqro')} className="mt-4 px-4 py-2 bg-emerald-dark text-white rounded-lg">
                  Kembali ke Menu Iqro
                </button>
            </div>
        );
    }

    const levelCompletion = calculateLevelCompletion(levelData.level, levelData.sections);
    const isLevelCompleted = levelCompletion.percentage === 100;

    // NEW: Handle "Coming Soon" levels
    if (levelData.sections.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white dark:bg-dark-blue-card rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <Hourglass size={64} className="text-amber-500 mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-amber-dark dark:text-amber-light mb-3">
            {t(levelData.title as TranslationKeys)}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-md">
            {t(levelData.description as TranslationKeys)}
          </p>
          <button 
            onClick={() => navigate('/iqro')} 
            className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 transition transform hover:scale-105 active:scale-95"
            aria-label="Kembali ke Menu Iqro"
          >
            <ArrowLeft size={20} /> Kembali ke Menu Iqro
          </button>
        </div>
      );
    }


    return (
        <div className="space-y-4">
            <button onClick={() => navigate('/iqro')} className="flex items-center gap-2 mb-4 font-semibold text-emerald-dark dark:text-emerald-light hover:underline">
                <ArrowLeft size={20} /> Kembali ke Menu Iqro
            </button>
            <IqroModule t={t} levelData={levelData} />

            {isLevelCompleted && (
                <div className="mt-8 text-center">
                    <p className="text-lg font-bold text-emerald-dark dark:text-white mb-4">{t('levelCompletedMessage' as TranslationKeys)}</p>
                    <button
                        onClick={() => navigate(`/iqro/${levelData.level}/certificate`)}
                        className="px-6 py-3 bg-gold-dark text-white rounded-xl font-bold flex items-center justify-center gap-3 mx-auto hover:bg-gold-light transition transform hover:scale-105 active:scale-95 min-h-[44px]"
                        // FIX: Added TranslationKeys type to 'viewCertificate'
                        aria-label={t('viewCertificate' as TranslationKeys)}
                    >
                        <Award size={20} /> {t('viewCertificate' as TranslationKeys)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default IqroDetail;