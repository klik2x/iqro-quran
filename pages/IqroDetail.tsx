
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IqroModule from '../components/IqroModule';
import { iqroData } from '../data/iqroData';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowLeft, Award } from 'lucide-react';
import { useIqroProgress } from '../hooks/useIqroProgress'; // Import useIqroProgress

const IqroDetail: React.FC = () => {
    const { levelNumber } = useParams<{ levelNumber: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { calculateLevelCompletion } = useIqroProgress(); // Use the hook

    const levelId = parseInt(levelNumber || '1');
    const levelData = iqroData.find(l => l.level === levelId);

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

    return (
        <div className="space-y-4">
            <button onClick={() => navigate('/iqro')} className="flex items-center gap-2 mb-4 font-semibold text-emerald-dark dark:text-emerald-light hover:underline">
                <ArrowLeft size={20} /> Kembali ke Menu Iqro
            </button>
            <IqroModule t={t} levelData={levelData} />

            {isLevelCompleted && (
                <div className="mt-8 text-center">
                    <p className="text-lg font-bold text-emerald-dark dark:text-white mb-4">{t('levelCompletedMessage')}</p>
                    <button
                        onClick={() => navigate(`/iqro/${levelData.level}/certificate`)}
                        className="px-6 py-3 bg-gold-dark text-white rounded-xl font-bold flex items-center justify-center gap-3 mx-auto hover:bg-gold-light transition transform hover:scale-105 active:scale-95 min-h-[44px]"
                        aria-label={t('downloadCertificate')}
                    >
                        <Award size={20} /> {t('viewCertificate')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default IqroDetail;