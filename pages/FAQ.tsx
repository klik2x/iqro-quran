import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const FAQ: React.FC = () => {
    const { t } = useTranslation();

    const faqs = [
        { q: t('faq1_q'), a: t('faq1_a') },
        { q: t('faq2_q'), a: t('faq2_a') },
        { q: t('faq3_q'), a: t('faq3_a') },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white mb-6">{t('faqTitle')}</h1>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <details key={index} className="group bg-white dark:bg-dark-blue-card p-4 rounded-lg">
                        <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white">
                            {faq.q}
                             <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
                        </summary>
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            {faq.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
