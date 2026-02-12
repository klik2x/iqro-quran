
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Play, Pause } from 'lucide-react';
import { speak, stopSpeaking } from '../../utils/browserSpeech'; // FIX: Import speak and stopSpeaking

const audioSources = {
    ar: 'وَعَنِ ابْنِ مَسْعُوْدٍ رَضِيَ اللهُ عَنْهُ قَالَ : قَالَ رَسُوْلُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ “مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللهِ فَلَهُ حَسَنَةٌ وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا , لاَ أَقُوْلُ الم حَرْفٌ وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيْمٌ حَرْفٌ”',
    id: 'Ibnu Mas’ud radhiyallahu ‘anhu berkata, Rasulullah shallallahu ‘alaihi wa sallam bersabda, “Barang siapa yang membaca satu huruf dari kitab Allah, maka baginya satu kebaikan. Satu kebaikan itu dibalas dengan sepuluh kali lipatnya. Aku tidak mengatakan alif laam miim itu satu huruf, tetapi aliif itu satu huruf, laam itu satu huruf, dan miim itu satu huruf.”',
};

const HadithCard: React.FC = () => {
    const { t } = useTranslation();
    const [playing, setPlaying] = useState<'ar' | 'id' | null>(null);

    const handlePlay = (lang: 'ar' | 'id') => {
        if (playing === lang) {
            stopSpeaking(); // Hentikan jika sedang memutar audio yang sama
            setPlaying(null);
        } else {
            stopSpeaking(); // Hentikan audio yang sedang diputar sebelum memulai yang baru
            setPlaying(lang);
            const langCode = lang === 'ar' ? 'ar-SA' : 'id-ID';
            speak(audioSources[lang], langCode, undefined, () => {
                setPlaying(null); // Atur ulang status setelah audio selesai
            });
        }
    };
    
    // Cleanup audio on component unmount
    useEffect(() => {
        return () => {
            stopSpeaking(); // Pastikan menghentikan speech saat komponen di-unmount
        };
    }, []);

    return (
        <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md relative">
            <button
                onClick={() => handlePlay('ar')}
                aria-label="Putar audio Hadits dalam Bahasa Arab"
                className="absolute top-4 right-4 p-2 bg-white/30 dark:bg-black/30 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition"
            >
                {playing === 'ar' ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
                onClick={() => handlePlay('id')}
                aria-label="Putar audio terjemahan Hadits"
                className="absolute bottom-4 left-4 p-2 bg-white/30 dark:bg-black/30 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition"
            >
                {playing === 'id' ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <h2 className="text-xl font-bold text-emerald-dark dark:text-white">{t('hadithInfo')}</h2>
                <p className="text-center font-semibold">Satu Huruf yang Dibaca dari Al-Qur’an Sudah Diganjar Pahala</p>
                <p className="font-arabic text-2xl text-right leading-loose" dir="rtl">
                    {audioSources.ar}
                </p>
                <p className="italic text-sm">
                    {audioSources.id}
                </p>
                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                    (HR. Tirmidzi, no. 2910. Hasan Sahih).
                </p>
            </div>
        </div>
    );
};

export default HadithCard;
