
import React, { useState, useEffect } from 'react';
import { fetchAllSurahs, fetchTafsir, fetchTranslationEditions } from '../services/quranService';
import { Surah } from '../types';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { BookText, BookOpenText, Eye, EyeOff, Info } from 'lucide-react';
import { useQuran } from '../contexts/QuranContext';
import { useUI } from '../contexts/UIContext'; // Import useUI

const Tafsir: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [editions, setEditions] = useState<any[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [selectedEdition, setSelectedEdition] = useState<string>('id.kemenag');
    const [tafsirData, setTafsirData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const { showLatin, setShowLatin, showTranslation, setShowTranslation } = useQuran();
    const { zoom } = useUI(); // Get zoom from UIContext

    useEffect(() => {
        const loadLists = async () => {
            try {
                setListLoading(true);
                const [surahData, editionData] = await Promise.all([
                    fetchAllSurahs(),
                    fetchTranslationEditions() // Changed to fetchTranslationEditions as Tafsir edition API is separate or combined
                ]);
                setSurahs(surahData);
                // Filter editions to only show relevant ones for Tafsir if needed, or simply use all translations
                // For now, let's assume 'id.kemenag' is always available or chosen from fetched.
                setEditions(editionData);
            } catch (e) {
                setError("Gagal memuat daftar surah dan edisi tafsir.");
            } finally {
                setListLoading(false);
            }
        };
        loadLists();
    }, []);

    useEffect(() => {
        const loadTafsirData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTafsir(selectedSurah, selectedEdition);
                setTafsirData(data);
            } catch (err) {
                console.error("Failed to fetch tafsir:", err);
                setError("Tafsir untuk edisi ini tidak tersedia atau gagal dimuat.");
            } finally {
                setLoading(false);
            }
        };
        if (selectedSurah && selectedEdition) loadTafsirData();
    }, [selectedSurah, selectedEdition]);

    return (
        <div className="space-y-6" role="main" aria-labelledby="tafsir-main-title" style={{ zoom: zoom }}>
            <h1 id="tafsir-main-title" className="text-3xl font-bold text-emerald-dark dark:text-white flex items-center gap-3">
                <BookText className="text-emerald-dark dark:text-emerald-light" aria-hidden="true" />
                {t('tafsirTitle')}
            </h1>

            <div className="flex flex-col items-center space-y-4">
                 <div className="bg-soft-white/95 dark:bg-dark-blue/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-4" role="toolbar" aria-label="Kontrol Tampilan Tafsir">
                    <button 
                        onClick={() => setShowTranslation(!showTranslation)} 
                        aria-pressed={showTranslation}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showTranslation ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showTranslation ? <EyeOff size={16} aria-hidden="true"/> : <Eye size={16} aria-hidden="true"/>} {showTranslation ? 'Sembunyikan' : 'Tampilkan'} Terjemahan
                    </button>
                    <button 
                        onClick={() => setShowLatin(!showLatin)} 
                        aria-pressed={showLatin}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${showLatin ? 'bg-emerald-dark text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                        {showLatin ? <EyeOff size={16} aria-hidden="true"/> : <Eye size={16} aria-hidden="true"/>} {showLatin ? 'Sembunyikan' : 'Tampilkan'} Latin
                    </button>
                </div>
            </div>
            
            <div className="sticky top-[72px] bg-soft-white dark:bg-dark-blue z-20 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    <div className="space-y-2">
                        <label htmlFor="surah-select-tafsir" className="block text-xs font-bold text-gray-500 uppercase ml-1 tracking-widest">Pilih Surah</label>
                        <select 
                            id="surah-select-tafsir"
                            aria-label="Pilih Surah untuk Tafsir"
                            value={selectedSurah} 
                            onChange={e => setSelectedSurah(parseInt(e.target.value))}
                            disabled={listLoading}
                            className="w-full p-3 bg-white dark:bg-dark-blue-card border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-dark shadow-sm transition-all font-semibold"
                        >
                            {listLoading ? <option>Memuat surah...</option> : surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName} ({s.name})</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="edition-select-tafsir" className="block text-xs font-bold text-gray-500 uppercase ml-1 tracking-widest">Pilih Edisi Tafsir</label>
                        <select 
                            id="edition-select-tafsir"
                            aria-label="Pilih Edisi Kitab Tafsir"
                            value={selectedEdition} 
                            onChange={e => setSelectedEdition(e.target.value)}
                            disabled={listLoading}
                            className="w-full p-3 bg-white dark:bg-dark-blue-card border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-dark shadow-sm transition-all font-semibold"
                        >
                            {listLoading ? <option>Memuat edisi...</option> : editions.map(ed => <option key={ed.identifier} value={ed.identifier}>{ed.language.toUpperCase()} - {ed.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto" aria-live="polite">
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (
                    tafsirData?.ayahs?.map((ayah: any) => (
                        <article 
                            key={ayah.number} 
                            className="bg-white dark:bg-dark-blue-card p-6 md:p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 space-y-6"
                            aria-labelledby={`ayah-${ayah.number}-title`}
                        >
                            <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-emerald-dark text-white flex items-center justify-center font-bold text-sm shadow-inner" aria-hidden="true">
                                        {ayah.numberInSurah}
                                    </span>
                                    <h3 id={`ayah-${ayah.number}-title`} className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpenText size={16} aria-hidden="true" />
                                        Tafsir Ayat {ayah.numberInSurah}
                                    </h3>
                                </div>
                            </div>
                            
                            {(showTranslation || showLatin) ? (
                                <div className="p-6 bg-emerald-light/5 dark:bg-emerald-dark/10 rounded-2xl border-l-4 border-emerald-dark">
                                    <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed antialiased whitespace-pre-wrap">
                                        {ayah.text}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <Info className="mb-2" />
                                    <p className="text-sm italic">Aktifkan 'Terjemahan' di atas untuk membaca isi Tafsir.</p>
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tafsir;