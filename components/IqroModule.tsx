

import React, { useState } from 'react';
import { BookOpen, Play, Award, HelpCircle, Bookmark, Trash2 } from 'lucide-react';
import { iqroData } from '../data/iqroData';
import { useIqroProgress } from '../hooks/useIqroProgress';
import { useIqroBookmarks } from '../hooks/useIqroBookmarks';
import StudyView from './iqro/StudyView';
import PracticeView from './iqro/PracticeView';
import TajwidView from './iqro/TajwidView';
import QuizView from './iqro/QuizView';
import BookmarksView from './iqro/BookmarksView';
import { IqroLevelData } from '../types'; // Import IqroLevelData type

type ViewMode = 'study' | 'practice' | 'tajwid' | 'quiz' | 'bookmarks';

interface IqroModuleProps {
    t: any;
    // FIX: Changed levelData type to IqroLevelData
    levelData: IqroLevelData; 
}

const IqroModule: React.FC<IqroModuleProps> = ({ t, levelData }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const { bookmarks } = useIqroBookmarks();
  
  if (!levelData) {
      return <div>Loading...</div>
  }

  return (
      <div className="bg-white dark:bg-dark-blue-card p-4 sm:p-6 rounded-2xl shadow-md">
        {/* Mode Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
            <button onClick={() => setViewMode('study')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${viewMode === 'study' ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-dark-blue'} min-h-[44px]`}>
              <BookOpen size={16}/> {t('study')}
            </button>
            <button onClick={() => setViewMode('practice')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${viewMode === 'practice' ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-dark-blue'} min-h-[44px]`}>
              <Play size={16}/> {t('practice')}
            </button>
            <button onClick={() => setViewMode('tajwid')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${viewMode === 'tajwid' ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-dark-blue'} min-h-[44px]`}>
              <Award size={16}/> {t('tajwid')}
            </button>
            <button onClick={() => setViewMode('quiz')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${viewMode === 'quiz' ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-dark-blue'} min-h-[44px]`}>
              <HelpCircle size={16}/> {t('quiz')}
            </button>
            <button onClick={() => setViewMode('bookmarks')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 relative ${viewMode === 'bookmarks' ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-dark-blue'} min-h-[44px]`}>
              <Bookmark size={16}/> {t('bookmarksMode')}
              {bookmarks.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">{bookmarks.length}</span>}
            </button>
        </div>

        {/* FIX: Ensure levelData is passed with correct type. Already done by fixing IqroModuleProps */}
        {viewMode === 'study' && <StudyView levelData={levelData} />}
        {viewMode === 'practice' && <PracticeView levelData={levelData} />}
        {viewMode === 'tajwid' && <TajwidView />}
        {viewMode === 'quiz' && <QuizView levelData={levelData} />}
        {viewMode === 'bookmarks' && <BookmarksView onNavigate={(level) => { /* Navigation is now handled by parent */ }} />}
      </div>
  );
};

export default IqroModule;