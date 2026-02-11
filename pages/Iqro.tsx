import React from 'react';
import { Link } from 'react-router-dom';
import { iqroData } from '../data/iqroData';
import { useIqroProgress } from '../hooks/useIqroProgress';
import Introduction from '../components/iqro/Introduction';
import { useTranslation } from '../contexts/LanguageContext';
import { Trash2 } from 'lucide-react';

const Iqro: React.FC = () => {
    const { calculateLevelCompletion, resetProgress } = useIqroProgress();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">Iqro Digital</h1>
                <button 
                  onClick={() => {
                    if (confirm(t('areYouSureReset'))) {
                      resetProgress();
                      // Force a re-render to update progress bars
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition"
                >
                  <Trash2 size={16} />
                  <span>{t('reset')}</span>
                </button>
            </div>
            
            <Introduction />
            
            <div className="space-y-3">
                {iqroData.map(level => {
                    const completion = calculateLevelCompletion(level.level, level.sections);
                    return (
                        <Link 
                            to={`/iqro/${level.level}`} 
                            key={level.level} 
                            className="flex items-center gap-4 p-4 bg-white dark:bg-dark-blue-card rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:border-emerald-dark dark:hover:border-emerald-light transition-all transform hover:scale-[1.02]"
                        >
                            <img src={level.cover} alt={level.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                                <h2 className="font-bold text-lg text-emerald-dark dark:text-white">{level.title}</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 clamp-2">{level.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div 
                                            className="bg-emerald-dark dark:bg-emerald-light h-1.5 rounded-full" 
                                            style={{ width: `${completion.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{completion.completedItems}/{completion.totalItems}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Iqro;