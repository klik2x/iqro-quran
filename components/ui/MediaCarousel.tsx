
import React from 'react';
import { Film, Image, FileText } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

const mediaItems = [
    {
        type: 'video',
        title: 'Cara Menggunakan Fitur Rekam',
        content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Example video
    },
    {
        type: 'image',
        title: 'Mengenal Mode Belajar Iqro',
        content: 'https://via.placeholder.com/400x225.png/036666/FFFFFF?text=Panduan+Iqro'
    },
    {
        type: 'pdf',
        title: 'Panduan Lengkap (PDF)',
        content: '#' // Placeholder link
    }
];

const MediaCarousel: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-dark dark:text-white">{t('mediaInfo')}</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
                {mediaItems.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-64 sm:w-72 bg-white dark:bg-dark-blue-card rounded-xl shadow-md overflow-hidden">
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                           {item.type === 'video' && <iframe width="100%" height="100%" src={item.content} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                           {item.type === 'image' && <img src={item.content} alt={item.title} className="w-full h-full object-cover" />}
                           {item.type === 'pdf' && <a href={item.content} className="flex flex-col items-center justify-center h-full w-full"><FileText size={48} className="text-gray-400" /><p className="text-sm mt-2">Buka PDF</p></a>}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaCarousel;
