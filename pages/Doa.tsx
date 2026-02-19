

import React from 'react';
import DoaModule from '../components/DoaModule';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext'; // NEW: Import TranslationKeys

const DoaPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      <DoaModule />
    </div>
  );
};

export default DoaPage;