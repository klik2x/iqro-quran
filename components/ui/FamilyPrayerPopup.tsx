
import React from 'react';
import { usePopup } from '../../contexts/PopupContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FamilyPrayerPopupProps {
    onClose: () => void;
}

const FamilyPrayerPopup: React.FC<FamilyPrayerPopupProps> = ({ onClose }) => {
    const { names } = usePopup();
    const { t } = useTranslation();

    if (names.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-dark-blue-card w-full max-w-md rounded-2xl p-6 pt-10 space-y-4 shadow-xl relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Tutup"
                >
                    <X size={20} />
                </button>
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                       "{t('popupIntro')}"
                    </p>
                    <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-dark-blue p-3 rounded-lg text-left">
                        <ul className="space-y-1 text-gray-800 dark:text-gray-200">
                            {names.map((name, index) => (
                                <li key={index} className="font-semibold text-lg">{name}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Anda dapat mengubah daftar ini di halaman <Link to="/doa-keluarga" onClick={onClose} className="text-emerald-dark dark:text-emerald-light font-semibold hover:underline">Doa Keluarga</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FamilyPrayerPopup;
