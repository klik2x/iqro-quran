
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useQuran } from '../contexts/QuranContext';
import { fetchSurah } from '../services/quranApi';
import { Ayah, Surah } from '../types';
import AyahView from '../components/AyahView';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { Eye, EyeOff, Languages } from 'lucide-react';

const prayerAyahs = [
    { surah: 2, ayah: 201, title: "Doa Sapu Jagat (Kebaikan Dunia Akhirat)" },
    { surah: 3, ayah: 8, title: "Doa Memohon Keteguhan Hati" },
    { surah: 71, ayah: 28, title: "Doa untuk Orang Tua" }
];

const Doa: React.FC = () => {
    const { t } = useTranslation();
    const { 
        selectedEdition, 
        setSelectedEdition, 
        editions, 
        showLatin, 
        setShowLatin, 
        showTranslation, 
        setShowTranslation 
    } = useQuran();
    
    const [prayers, setPrayers] = useState<{ ayah: Ayah; surah: Surah; title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    prayerAyahs.map(async (p) => {
                        const surahData = await fetchSurah(p.surah, selectedEdition);
                        const ayahData = surahData.ayahs.find(a => a.numberInSurah === p.ayah);
                        return { ayah: ayahData!, surah: surahData, title: p.title };
                    })
                );
                setPrayers(results);
            } catch (err) {
                setError("Gagal memuat ayat-ayat doa.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedEdition]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6 pb-12">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('doaTitle')}</h1>
            
            <div className="sticky top-[72px] z-20 bg-soft-white/95 dark:bg-dark-blue/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-4">
                <button 
                    onClick={() => setShowTranslation(!showTranslation)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                    {showTranslation ? <EyeOff size={16}/> : <Eye size={16}/>} Terjemahan
                </button>
                <button 
                    onClick={() => setShowLatin(!showLatin)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showLatin ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                    {showLatin ? <EyeOff size={16}/> : <Eye size={16}/>} Latin
                </button>
                
                {showTranslation && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-inner">
                        <Languages size={14} className="text-emerald-dark dark:text-emerald-light"/>
                        <select 
                            value={selectedEdition} 
                            onChange={(e) => setSelectedEdition(e.target.value)} 
                            className="bg-transparent text-[11px] font-bold outline-none uppercase max-w-[80px]"
                        >
                            {editions.map(ed => (
                                <option key={ed.identifier} value={ed.identifier}>{ed.language.toUpperCase()} - {ed.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {prayers.map((p, index) => (
                    <div key={index} className="space-y-3">
                        <h2 className="text-xl font-bold text-emerald-dark dark:text-emerald-light pl-2 border-l-4 border-gold-dark">{p.title}</h2>
                        <AyahView 
                            ayah={p.ayah} 
                            surah={p.surah} 
                            showLatin={showLatin} 
                            showTranslation={showTranslation} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doa;
