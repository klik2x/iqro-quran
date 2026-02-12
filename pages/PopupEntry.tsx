import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';
import { useTranslation } from '../contexts/LanguageContext';
import { Save, X } from 'lucide-react';

const PopupEntry: React.FC = () => {
    const { names, saveNames } = usePopup();
    const { t } = useTranslation();
    const [nameInput, setNameInput] = useState(names.join(', '));
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    const handleSave = () => {
        saveNames(nameInput);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative text-center">
                <h1 className="text-3xl font-bold text-emerald-dark dark:text-white px-8">{t('popupTitle')}</h1>
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute -top-2 -right-2 p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full sm:right-0 sm:-top-2"
                    aria-label="Tutup"
                >
                    <X size={24} />
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-center italic">
                    "{t('popupIntro')}"
                </p>

                <div>
                    <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('popupNamesLabel')}
                    </label>
                    <div className="relative">
                        <textarea
                            id="name-input"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-dark focus:border-transparent transition"
                            placeholder="Contoh: Ayah, Ibu, Kakak, ..."
                            title={t('popupTooltip')}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-dark hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
                    disabled={isSaved}
                >
                    {isSaved ? (
                        <span>{t('namesSaved')}</span>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>{t('save')}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PopupEntry;
