import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { iqroPageData } from '../data/iqroPageData';
import { useIqro } from '../hooks/useIqro';
import { ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';

const IqroLevelPage: React.FC = () => {
    const { levelNumber } = useParams<{ levelNumber: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const levelId = parseInt(levelNumber || '1');
    const levelData = iqroPageData.find(l => l.id === levelId);

    const initialPage = parseInt(searchParams.get('page') || '1');
    const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);

    const { updateLastRead, togglePageCompletion, isPageCompleted } = useIqro();

    useEffect(() => {
        if (levelData && (currentPage > levelData.pages.length || currentPage < 1) && levelData.pages.length > 0) {
            setCurrentPage(1);
        }
    }, [levelData, currentPage]);


    useEffect(() => {
        updateLastRead(levelId, currentPage);
        setSearchParams({ page: currentPage.toString() }, { replace: true });
    }, [currentPage, levelId, updateLastRead, setSearchParams]);

    if (!levelData) {
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Level Iqro tidak ditemukan.</h2>
            <button onClick={() => navigate('/iqro')} className="mt-4 px-4 py-2 bg-emerald-dark text-white rounded-lg">
              Kembali ke Menu Iqro
            </button>
          </div>
        );
    }
    
    const totalPages = levelData.pages.length;
    const pageContent = levelData.pages[currentPage - 1] || [];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    const handleMarkAsRead = () => {
        togglePageCompletion(levelId, currentPage);
    };
    
    const isCompleted = isPageCompleted(levelId, currentPage);

    return (
        <div className="flex flex-col h-full">
            <main className="flex-grow space-y-4">
                {totalPages > 0 ? pageContent.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-2 gap-4">
                        {row.map((item, itemIndex) => (
                            <div key={itemIndex} className="bg-white dark:bg-dark-blue-card p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                                <p className="font-arabic text-4xl sm:text-5xl" dir="rtl">{item.arabic}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{item.latin}</p>
                            </div>
                        ))}
                    </div>
                )) : (
                    <div className="text-center p-8 text-gray-500">Materi untuk level ini belum tersedia.</div>
                )}
            </main>

            {totalPages > 0 && (
              <footer className="fixed bottom-16 md:static md:bottom-auto left-0 right-0 bg-white/80 dark:bg-dark-blue-card/80 backdrop-blur-sm z-20 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className="p-2 rounded-full disabled:opacity-30"
                      aria-label="Halaman Sebelumnya"
                  >
                      <ChevronLeft size={28} />
                  </button>

                  <div className="font-bold text-lg">{currentPage} / {totalPages}</div>
                  
                  <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full disabled:opacity-30"
                      aria-label="Halaman Berikutnya"
                  >
                      <ChevronRight size={28} />
                  </button>
                  
                  <button
                      onClick={handleMarkAsRead}
                      className={`absolute bottom-full right-4 mb-2 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-dark-blue-card'}`}
                  >
                      {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                      Sudah dibaca
                  </button>
              </footer>
            )}
        </div>
    );
};

export default IqroLevelPage;
