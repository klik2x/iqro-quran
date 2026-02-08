
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJuzDetail } from '../services/quranApi';
import { Ayah, Surah } from '../types';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { ChevronLeft, Eye, EyeOff, Languages } from 'lucide-react';
import AyahView from '../components/AyahView';
import { useTranslation } from '../contexts/LanguageContext';
import { useQuran } from '../contexts/QuranContext';

const JuzDetail: React.FC = () => {
    const { number } = useParams<{ number: string }>();
    const navigate = useNavigate();
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

    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchJuzDetail(parseInt(number || '1'), selectedEdition);
                setAyahs(data);
            } catch (e) {
                setError("Gagal memuat data Juz.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [number, selectedEdition]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md text-center flex items-center justify-between">
                <button onClick={() => navigate('/mushaf')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-blue transition">
                    <ChevronLeft className="text-emerald-dark dark:text-emerald-light"/>
                </button>
                <h1 className="text-2xl font-bold text-emerald-dark dark:text-white">{t('juz')} {number}</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nomor Juz dalam Al-Qur'an</p>
                <div className="bg-soft-white/95 dark:bg-dark-blue/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-4">
                    <button 
                        onClick={() => setShowTranslation(!showTranslation)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showTranslation ? <EyeOff size={16}/> : <Eye size={16}/>} {showTranslation ? 'Hide' : 'Unhide'} Terjemahan
                    </button>
                    <button 
                        onClick={() => setShowLatin(!showLatin)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showLatin ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showLatin ? <EyeOff size={16}/> : <Eye size={16}/>} {showLatin ? 'Hide' : 'Unhide'} Latin
                    </button>
                    
                    {showTranslation && (
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-inner">
                            <Languages size={14} className="text-emerald-dark dark:text-emerald-light"/>
                            <select 
                                value={selectedEdition} 
                                onChange={(e) => setSelectedEdition(e.target.value)} 
                                className="bg-transparent text-[11px] font-bold outline-none uppercase max-w-[120px]"
                            >
                                {editions.map(ed => (
                                    <option key={ed.identifier} value={ed.identifier}>{ed.language.toUpperCase()} - {ed.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                {ayahs.map((ayah) => (
                    <AyahView 
                        key={ayah.number} 
                        ayah={ayah} 
                        surah={ayah.surah || { englishName: 'Quran', number: 0 } as Surah}
                        showLatin={showLatin}
                        showTranslation={showTranslation}
                    />
                ))}
            </div>
        </div>
    );
};

export default JuzDetail;
