
import React from 'react';
import { usePopup } from '../../contexts/PopupContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Users } from 'lucide-react';

const PopupDisplay: React.FC = () => {
    const { names } = usePopup();
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-emerald-dark dark:text-emerald-light flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold mb-2 text-emerald-dark dark:text-white">{t('familyPrayer')}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                       {t('popupIntro')}
                    </p>
                    {names.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {names.map((name, index) => (
                                <li key={index} className="font-semibold">{name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            (Belum ada nama yang ditambahkan. Tambahkan di menu 'Doa Keluarga'.)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupDisplay;
