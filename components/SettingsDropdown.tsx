
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUI } from '../contexts/UIContext';
import { useTranslation, languages } from '../contexts/LanguageContext';
import { Sun, Moon, ZoomIn, ZoomOut, Book, Languages, Download, X, LogOut, Contrast } from 'lucide-react';

interface SettingsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    handleLogout: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ isOpen, onClose, isLoggedIn, handleLogout }) => {
    const { theme, toggleTheme } = useTheme();
    const { increaseZoom, decreaseZoom, toggleReadingMode, isReadingMode, isHighContrast, toggleHighContrast } = useUI();
    const { changeLanguage, currentLanguage, isLoading, t } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeLanguage(e.target.value);
    };
    
    const handleInstallClick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    return (
        <div 
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-72 bg-soft-white dark:bg-dark-blue-card rounded-2xl shadow-2xl p-4 z-[60] border border-gray-200 dark:border-gray-700"
        >
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Tutup Pengaturan"
            >
                <X size={20} />
            </button>
            <div className="space-y-4 pt-5">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Languages size={16} /> {t('language')}
                    </label>
                    <select 
                        value={currentLanguage}
                        onChange={handleLanguageChange}
                        disabled={isLoading}
                        className="w-full p-2 bg-gray-100 dark:bg-dark-blue border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-dark disabled:opacity-50"
                    >
                        {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                    {isLoading && <p className="text-xs text-emerald-dark dark:text-emerald-light animate-pulse">{t('translating')}...</p>}
                </div>

                {installPrompt && (
                     <button 
                        onClick={handleInstallClick} 
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-emerald-dark rounded-lg hover:bg-opacity-90 transition"
                    >
                        <Download size={16} /> {t('installApp')}
                    </button>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {t('display')}
                    </label>
                    <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="font-medium text-sm">{t('zoom')}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={decreaseZoom} className="p-1.5 rounded-full bg-gray-200 dark:bg-dark-blue hover:bg-gray-300 dark:hover:bg-gray-700" aria-label="Perkecil Tampilan"><ZoomOut size={18}/></button>
                            <button onClick={increaseZoom} className="p-1.5 rounded-full bg-gray-200 dark:bg-dark-blue hover:bg-gray-300 dark:hover:bg-gray-700" aria-label="Perbesar Tampilan"><ZoomIn size={18}/></button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="font-medium text-sm">{t('theme')}</span>
                        <button onClick={toggleTheme} className="p-1.5 rounded-full bg-gray-200 dark:bg-dark-blue hover:bg-gray-300 dark:hover:bg-gray-700" aria-label="Ganti Tema">
                            {theme === 'dark' ? <Sun size={18} className="text-gold-light" /> : <Moon size={18} className="text-emerald-dark" />}
                        </button>
                    </div>
                     <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="font-medium text-sm">{t('readingMode')}</span>
                        <button onClick={toggleReadingMode} className={`p-1.5 rounded-full transition-colors ${isReadingMode ? 'bg-emerald-dark' : 'bg-gray-200 dark:bg-dark-blue'}`} aria-label="Aktifkan/Nonaktifkan Mode Baca">
                           <Book size={18} className={isReadingMode ? 'text-white' : ''}/>
                        </button>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="font-medium text-sm">{t('highContrastMode')}</span>
                        <button onClick={toggleHighContrast} className={`p-1.5 rounded-full transition-colors ${isHighContrast ? 'bg-hc-accent text-hc-button-text' : 'bg-gray-200 dark:bg-dark-blue'}`} aria-label="Aktifkan/Nonaktifkan Mode Kontras Tinggi">
                           <Contrast size={18} className={isHighContrast ? 'text-hc-button-text' : ''}/>
                        </button>
                    </div>
                </div>

                 {isLoggedIn && (
                    <>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SettingsDropdown;