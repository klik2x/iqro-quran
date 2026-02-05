
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white mb-6">{t('privacyTitle')}</h1>
            <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-dark dark:text-emerald-light mb-2">{t('privacy1_h')}</h2>
                    <p>{t('privacy1_p')}</p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-dark dark:text-emerald-light mb-2">{t('privacy2_h')}</h2>
                    <p>{t('privacy2_p')}</p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-dark dark:text-emerald-light mb-2">{t('privacy3_h')}</h2>
                    <p>{t('privacy3_p')}</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
