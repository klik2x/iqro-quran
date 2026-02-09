import React, { useState, useEffect } from 'react';
import { fetchAllSurahs } from '../services/quranApi';
import { fetchTafsir } from '../services/quranService';
import { Surah } from '../types';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';
import { formatHonorifics } from '../utils/honorifics';
import { BookOpen, Info, Search } from 'lucide-react';

const Tafsir: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [tafsirData, setTafsirData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [surahListLoading, setSurahListLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        fetchAllSurahs().then(setSurahs).finally(() => setSurahListLoading(false));
    }, []);

    useEffect(() => {
        const loadTafsir = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTafsir(selectedSurah);
                setTafsirData(data);
            } catch (err) {
                console.error("Failed to fetch tafsir:", err);
                setError("Gagal memuat tafsir. Silakan periksa koneksi Anda.");
            } finally {
                setLoading(false);
            }
        };
        loadTafsir();
    }, [selectedSurah]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
            <div className="text-center">
                <h1 className="text-4xl font-black text-emerald-dark dark:text-white tracking-tight uppercase">{t('tafsirTitle')}</h1>
                <p className="text-slate-500 mt-2 font-medium italic">Memahami makna Al-Quran melalui penjelasan Al-Jalalayn.</p>
            </div>
            
            <div className="sticky top-20 bg-soft-white/90 dark:bg-dark-blue/90 backdrop-blur-md z-30 py-6 px-4 border-b-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Search size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <label htmlFor="surah-select-tafsir" className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">{t('selectSurah')}</label>
                    <select 
                        id="surah-select-tafsir" 
                        value={selectedSurah} 
                        onChange={e => setSelectedSurah(parseInt(e.target.value))}
                        disabled={surahListLoading}
                        className="w-full p-4 bg-white dark:bg-dark-blue border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold transition-all disabled:opacity-50"
                        aria-label="Pilih Surah untuk Tafsir"
                    >
                        {surahListLoading ? <option>Memuat surah...</option> : surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.englishName} ({surah.name})</option>)}
                    </select>
                  </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20 flex gap-4 text-blue-800 dark:text-blue-300 shadow-inner">
              <Info className="shrink-0 text-blue-500" />
              <p className="text-sm font-bold leading-relaxed">Tafsir membantu kita mendalami konteks dan makna spiritual dari setiap ayat untuk memandu kehidupan sehari-hari.</p>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="py-20"><LoadingSpinner /></div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : tafsirData ? (
                    tafsirData.ayahs.map((ayah: any) => (
                        <div key={ayah.number} className="bg-white dark:bg-dark-blue-card p-8 md:p-10 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[11px] font-black bg-emerald-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md shadow-emerald-600/20">Ayat {ayah.numberInSurah}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed text-xl md:text-2xl font-bold tracking-tight">
                                {formatHonorifics(ayah.text)}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-dark-blue-card rounded-3xl border-2 border-dashed border-slate-200">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold">Silakan pilih surah untuk membaca tafsirnya.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tafsir;