

import React from 'react';
import { Film, Image, FileText } from 'lucide-react';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext'; // NEW: Import TranslationKeys

const mediaItems = [
    {
        type: 'image',
        title: 'Keutamaan Membaca Al-Quran',
        content: 'https://raw.githubusercontent.com/klik2x/iqro-quran/8aa50dcb5f68c90f2d697a8ca4fea6f26cff9a3e/assets/Alif-Lam-Mim.jpg'
    },
    {
        type: 'image_link',
        title: 'Satu Huruf Diganjar Pahala',
        content: 'https://raw.githubusercontent.com/klik2x/iqro-quran/4fa9f4d3e30464219f40ee03c735232050c866ec/assets/Satu_Huruf_yang_Dibaca_dari_Al-Qur%E2%80%99an_Sudah_Diganjar_Pahala.jpg'
    }
];

const MediaCarousel: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            {/* FIX: Use TranslationKeys type for t() calls */}
            <h2 className="text-xl font-bold text-emerald-dark dark:text-white">{t('mediaInfo' as TranslationKeys)}</h2>
            <div className="flex flex-col space-y-4">
                {mediaItems.map((item, index) => (
                    <div key={index} className="w-full bg-white dark:bg-dark-blue-card rounded-xl shadow-md overflow-hidden">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                           {item.type === 'video' && <iframe width="100%" height="100%" src={item.content} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                           {item.type === 'image' && <img src={item.content} alt={item.title} className="w-full h-full object-cover" />}
                           {item.type === 'image_link' && 
                                <a href={item.content} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                                    <img src={item.content} alt={item.title} className="w-full h-full object-cover"/>
                                </a>
                           }
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