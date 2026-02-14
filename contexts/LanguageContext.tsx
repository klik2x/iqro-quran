
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { idStrings } from '../locales/id';
import { translateTexts } from '../services/geminiService';

export const languages = [
    { code: 'id', name: 'Indonesia' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'nl', name: 'Dutch (Nederlands)' },
    { code: 'tr', name: 'Turkish (Türkçe)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'sv', name: 'Swedish (Svenska)' },
    { code: 'pl', name: 'Polish (Polski)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'fil', name: 'Filipino' },
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'th', name: 'Thai (ไทย)' },
    { code: 'vi', 'name': 'Vietnamese (Tiếng Việt)' },
    { code: 'fa', name: 'Persian (فارسی)' },
    { code: 'ku', name: 'Kurdish (Kurdî)' },
    { code: 'uz', name: 'Uzbek (Oʻzbekcha)' },
];

type LanguageCode = typeof languages[number]['code'];
// Define TranslationKeys here, where idStrings is used
export type TranslationKeys = keyof typeof idStrings;
type Translations = Record<TranslationKeys, string>;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  translations: Translations;
  changeLanguage: (langCode: LanguageCode) => void;
  isLoading: boolean;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('id');
  const [translations, setTranslations] = useState<Translations>(idStrings);
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<LanguageCode, Translations>>({ 'id': idStrings });

  const changeLanguage = useCallback(async (langCode: LanguageCode) => {
    if (langCode === currentLanguage) return;

    if (translationCache[langCode]) {
        setTranslations(translationCache[langCode]);
        setCurrentLanguage(langCode);
        return;
    }

    setIsLoading(true);
    try {
        const languageName = languages.find(l => l.code === langCode)?.name || langCode;
        const newTranslations = await translateTexts(idStrings, languageName);
        
        // Validate if Gemini returned a proper object
        if (Object.keys(newTranslations).length < Object.keys(idStrings).length) {
            throw new Error("Translation did not return all keys.");
        }

        setTranslationCache(prev => ({ ...prev, [langCode]: newTranslations as Translations }));
        setTranslations(newTranslations as Translations);
        setCurrentLanguage(langCode);
    } catch (error) {
        console.error("Failed to translate:", error);
        alert(`Failed to switch language to ${langCode}. Please try again.`);
    } finally {
        setIsLoading(false);
    }
  }, [currentLanguage, translationCache]);
  
  const t = useCallback((key: TranslationKeys): string => {
      return translations[key] || idStrings[key];
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, translations, changeLanguage, isLoading, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
