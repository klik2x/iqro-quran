
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel')}><ArrowLeft size={20}/> {t('cancel')}</button>
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><Shield className="text-emerald-500" /> {t('privacyTitle')}</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold">{t('privacy1_h')}</h3>
                <p>{t('privacy1_p')}</p>
                <h3 className="text-xl font-bold">{t('privacy2_h')}</h3>
                <p>{t('privacy2_p')}</p>
                <h3 className="text-xl font-bold">{t('privacy3_h')}</h3>
                <p>{t('privacy3_p')}</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
