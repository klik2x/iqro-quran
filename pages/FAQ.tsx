
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const faqs = [
        { q: t('faq1_q'), a: t('faq1_a') },
        { q: t('faq2_q'), a: t('faq2_a') },
        { q: t('faq3_q'), a: t('faq3_a') },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel')}><ArrowLeft size={20}/> {t('cancel')}</button>
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><HelpCircle className="text-blue-500" /> {t('faqTitle')}</h1>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <details key={index} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white p-4">
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
