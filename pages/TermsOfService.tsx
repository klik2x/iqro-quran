
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel' as TranslationKeys)}><ArrowLeft size={20}/> {t('cancel' as TranslationKeys)}</button>
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><FileText className="text-yellow-500" /> {t('termsTitle' as TranslationKeys)}</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <p>{t('termsIntro' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsPurposeTitle' as TranslationKeys)}</h3>
                <p>{t('termsPurposeDesc' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsCopyrightTitle' as TranslationKeys)}</h3>
                <p>{t('termsCopyrightDesc' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsDatabaseSourceTitle' as TranslationKeys)}</h3>
                <p>{t('termsDatabaseSourceDesc' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsAgeUsageTitle' as TranslationKeys)}</h3>
                <p>{t('termsAgeUsageDesc' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsLearningResponsibilityTitle' as TranslationKeys)}</h3>
                <p>{t('termsLearningResponsibilityDesc' as TranslationKeys)}</p>
                
                <h3 className="text-xl font-bold">{t('termsSystemUpdatesTitle' as TranslationKeys)}</h3>
                <p>{t('termsSystemUpdatesDesc' as TranslationKeys)}</p>
            </div>
        </div>
    );
};

export default TermsOfService;
    