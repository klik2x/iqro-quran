
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const faqs = [
        { q: t('faq1_q' as TranslationKeys), a: t('faq1_a' as TranslationKeys) },
        { q: t('faq2_q' as TranslationKeys), a: t('faq2_a' as TranslationKeys) },
        { q: t('faq3_q' as TranslationKeys), a: t('faq3_a' as TranslationKeys) },
        { q: t('faq4_q' as TranslationKeys), a: t('faq4_a' as TranslationKeys) },
        { q: t('faq5_q' as TranslationKeys), a: t('faq5_a' as TranslationKeys) },
        { q: t('faq6_q' as TranslationKeys), a: t('faq6_a' as TranslationKeys) },
        { q: t('faq7_q' as TranslationKeys), a: t('faq7_a' as TranslationKeys) },
        { q: t('faq8_q' as TranslationKeys), a: t('faq8_a' as TranslationKeys) },
        { q: t('faq9_q' as TranslationKeys), a: t('faq9_a' as TranslationKeys) },
        { q: t('faq10_q' as TranslationKeys), a: t('faq10_a' as TranslationKeys) },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel' as TranslationKeys)}><ArrowLeft size={20}/> {t('cancel' as TranslationKeys)}</button>
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><HelpCircle className="text-blue-500" /> {t('faqTitle' as TranslationKeys)}</h1>
            <div className="space-y-6">
                <p className="text-slate-500 italic text-center">{t('faqIntro' as TranslationKeys)}</p>
                {faqs.map((faq, index) => (
                    <details key={index} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white p-4 min-h-[44px]">
                            {faq.q}
                            <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
                        </summary>
                        <p className="mt-3 px-4 pb-4 text-slate-600 dark:text-slate-400">
                            {faq.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
    