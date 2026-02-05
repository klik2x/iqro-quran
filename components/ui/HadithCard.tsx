
import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const HadithCard: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-emerald-dark dark:text-white">{t('hadithInfo')}</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="text-center font-semibold">Satu Huruf yang Dibaca dari Al-Qur’an Sudah Diganjar Pahala</p>
                <p className="font-arabic text-2xl text-right leading-loose" dir="rtl">
                    وَعَنِ ابْنِ مَسْعُوْدٍ رَضِيَ اللهُ عَنْهُ قَالَ : قَالَ رَسُوْلُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ “مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللهِ فَلَهُ حَسَنَةٌ وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا , لاَ أَقُوْلُ الم حَرْفٌ وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيْمٌ حَرْفٌ”
                </p>
                <p className="italic text-sm">
                    Ibnu Mas’ud radhiyallahu ‘anhu berkata, Rasulullah shallallahu ‘alaihi wa sallam bersabda, “Barang siapa yang membaca satu huruf dari kitab Allah, maka baginya satu kebaikan. Satu kebaikan itu dibalas dengan sepuluh kali lipatnya. Aku tidak mengatakan alif laam miim itu satu huruf, tetapi aliif itu satu huruf, laam itu satu huruf, dan miim itu satu huruf.”
                </p>
                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                    (HR. Tirmidzi, no. 2910. Hasan Sahih).
                </p>
            </div>
        </div>
    );
};

export default HadithCard;
