

import React from 'react';
import { usePopup } from '../../contexts/PopupContext';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { Users, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopupDisplay: React.FC = () => {
    const { names } = usePopup();
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md relative">
            <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-emerald-dark dark:text-emerald-light flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold mb-2 text-emerald-dark dark:text-white">{t('familyPrayer' as TranslationKeys)}</h2>
                    {/* FIX: Use TranslationKeys type for t() calls */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                       {t('popupIntro' as TranslationKeys)}
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
             <Link 
                to="/doa-keluarga" 
                className="absolute bottom-4 right-4 bg-emerald-dark text-white p-3 rounded-full shadow-lg hover:bg-opacity-80 active:scale-90 transition-transform"
                aria-label="Ubah daftar nama doa keluarga"
            >
                <Edit2 size={20} />
            </Link>
        </div>
    );
};

export default PopupDisplay;