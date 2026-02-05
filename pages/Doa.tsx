
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const prayers = [
    {
        title: "Doa Sapu Jagat (Kebaikan Dunia Akhirat)",
        arabic: "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْءَاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ",
        latin: "Rabbanā, ātinā fid-dun-yā ḥasanataw wa fil-ākhirati ḥasanataw wa qinā ‘ażāban-nār.",
        translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
        source: "QS. Al-Baqarah: 201"
    },
    {
        title: "Doa Memohon Keteguhan Hati",
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ",
        latin: "Rabbanā lā tuzig qulụbanā ba'da iż hadaitanā wa hab lanā mil ladungka raḥmah, innaka antal-wahhāb.",
        translation: "Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu, sesungguhnya Engkau Maha Pemberi.",
        source: "QS. Ali 'Imran: 8"
    },
    {
        title: "Doa untuk Orang Tua",
        arabic: "رَّبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِمَن دَخَلَ بَيْتِىَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَٱلْمُؤْمِنَٰتِ وَلَا تَزِدِ ٱلظَّٰلِمِينَ إِلَّا تَبَارًۢا",
        latin: "Rabbigfir lī wa liwālidayya wa liman dakhala baitiya mu`minaw wa lil-mu`minīna wal-mu`mināt, wa lā tazidiẓ-ẓālimīna illā tabārā.",
        translation: "Ya Tuhanku, ampunilah aku, ibu bapakku, dan siapa pun yang memasuki rumahku dengan beriman dan semua orang yang beriman laki-laki dan perempuan. Dan janganlah Engkau tambahkan bagi orang-orang yang zalim itu selain kehancuran.",
        source: "QS. Nuh: 28"
    }
];

const PrayerCard: React.FC<typeof prayers[0]> = ({ title, arabic, latin, translation, source }) => (
    <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-bold text-emerald-dark dark:text-white">{title}</h2>
        <p className="font-arabic text-3xl text-right text-gray-800 dark:text-white leading-relaxed">{arabic}</p>
        <p className="text-md italic text-emerald-dark dark:text-emerald-light">{latin}</p>
        <p className="text-md text-gray-700 dark:text-gray-300">"{translation}"</p>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{source}</p>
    </div>
);

const Doa: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('doaTitle')}</h1>
            <div className="space-y-4">
                {prayers.map((prayer, index) => (
                    <PrayerCard key={index} {...prayer} />
                ))}
            </div>
        </div>
    );
};

export default Doa;
