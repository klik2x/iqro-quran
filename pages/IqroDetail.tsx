import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IqroModule from '../components/IqroModule';
import { iqroData } from '../data/iqroData';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

const IqroDetail: React.FC = () => {
    const { levelNumber } = useParams<{ levelNumber: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
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

    return (
        <div className="space-y-4">
            <button onClick={() => navigate('/iqro')} className="flex items-center gap-2 mb-4 font-semibold text-emerald-dark dark:text-emerald-light hover:underline">
                <ArrowLeft size={20} /> Kembali ke Menu Iqro
            </button>
            <IqroModule t={t} levelData={levelData} />
        </div>
    );
};

export default IqroDetail;