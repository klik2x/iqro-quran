
import React, { useState } from 'react';
import { BookCopy, CheckSquare, Sparkles, BookHeart, Bookmark, Trash2 } from 'lucide-react';
import { iqroData } from '../data/iqroData';
import { useTranslation } from '../contexts/LanguageContext';
import { useIqroProgress } from '../hooks/useIqroProgress';

import StudyView from '../components/iqro/StudyView';
import PracticeView from '../components/iqro/PracticeView';
import TajwidView from '../components/iqro/TajwidView';
import QuizView from '../components/iqro/QuizView';
import BookmarksView from '../components/iqro/BookmarksView';

type IqroMode = 'study' | 'practice' | 'tajwid' | 'quiz' | 'bookmarks';

const Iqro: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  const [activeMode, setActiveMode] = useState<IqroMode>('study');
  const { t } = useTranslation();
  const { progress, resetProgress, calculateLevelCompletion } = useIqroProgress();

  const handleResetProgress = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang semua progres belajar Iqro?")) {
        resetProgress();
    }
  };

  const levelData = iqroData.find(level => level.level === activeLevel);
  const totalItemsInLevel = levelData?.sections.reduce((acc, section) => acc + section.items.length, 0) || 0;

  const modes = [
    { id: 'study', label: 'Study', icon: BookCopy },
    { id: 'practice', label: 'Practice', icon: CheckSquare },
    { id: 'tajwid', label: 'Tajwid', icon: Sparkles },
    { id: 'quiz', label: 'Quiz', icon: BookHeart },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('learnIqroTitle')}</h1>
        <button
            onClick={handleResetProgress}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition"
            aria-label="Reset progress"
        >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Reset Progress</span>
        </button>
      </div>

      {/* Level Selector */}
      <div className="relative">
        <div className="flex space-x-2 overflow-x-auto pb-4 -mb-4">
          {iqroData.map(level => {
            const completion = calculateLevelCompletion(level.level, level.sections);
            return (
                <div key={level.level} className="flex-shrink-0">
                    <button
                      onClick={() => setActiveLevel(level.level)}
                      className={`px-6 py-3 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-blue relative w-full
                        ${activeLevel === level.level
                          ? 'bg-white dark:bg-dark-blue-card text-emerald-dark dark:text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-dark-blue text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      Iqro {level.level}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-full overflow-hidden">
                          <div className="h-full bg-gold-dark transition-all duration-500" style={{width: `${completion}%`}}></div>
                      </div>
                    </button>
                </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-blue-card p-4 rounded-b-xl rounded-tr-xl shadow-lg">
        {/* Mode Navigator */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto">
                {modes.map(mode => (
                    <button 
                        key={mode.id}
                        onClick={() => setActiveMode(mode.id as IqroMode)}
                        className={`whitespace-nowrap flex items-center gap-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors
                          ${activeMode === mode.id 
                            ? 'border-emerald-dark dark:border-emerald-light text-emerald-dark dark:text-emerald-light' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <mode.icon size={16} />
                        {mode.label}
                    </button>
                ))}
            </nav>
        </div>

        {/* Content based on mode */}
        {activeMode === 'study' && levelData && <StudyView levelData={levelData} />}
        {activeMode === 'practice' && levelData && <PracticeView levelData={levelData} />}
        {activeMode === 'tajwid' && <TajwidView />}
        {activeMode === 'quiz' && levelData && <QuizView levelData={levelData} />}
        {activeMode === 'bookmarks' && <BookmarksView onNavigate={(level) => { setActiveLevel(level); setActiveMode('study'); }}/>}
      </div>
    </div>
  );
};

export default Iqro;
