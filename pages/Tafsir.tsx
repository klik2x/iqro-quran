
import React, { useState, useEffect } from 'react';
import { fetchAllSurahs } from '../services/quranApi';
import { Surah } from '../types';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { useTranslation } from '../contexts/LanguageContext';

interface TafsirAyah {
    ayah: number;
    text: string;
}

const Tafsir: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [tafsir, setTafsir] = useState<TafsirAyah[]>([]);
    const [loading, setLoading] = useState(false);
    const [surahListLoading, setSurahListLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const loadSurahs = async () => {
            try {
                const data = await fetchAllSurahs();
                setSurahs(data);
            } catch (e) {
                console.error("Failed to load surah list for Tafsir", e);
                setError("Gagal memuat daftar surah.");
            } finally {
                setSurahListLoading(false);
            }
        };
        loadSurahs();
    }, []);

    useEffect(() => {
        const loadTafsir = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.quran.gading.dev/surah/${selectedSurah}`);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const data = await response.json();

                if (data && data.data && data.data.verses) {
                    const formattedTafsir: TafsirAyah[] = data.data.verses.map((verse: any) => ({
                        ayah: verse.number.inSurah,
                        text: verse.tafsir?.id?.kemenag?.long ?? 'Tafsir untuk ayat ini tidak tersedia.'
                    }));
                    setTafsir(formattedTafsir);
                } else {
                    throw new Error("Struktur data tafsir tidak valid.");
                }
            } catch (err) {
                console.error("Failed to fetch tafsir:", err);
                setError("Gagal memuat tafsir. Silakan coba pilih surah lain.");
                setTafsir([]);
            } finally {
                setLoading(false);
            }
        };
        loadTafsir();
    }, [selectedSurah]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-emerald-dark dark:text-white">{t('tafsirTitle')}</h1>
            <div className="sticky top-16 bg-soft-white/80 dark:bg-dark-blue/80 backdrop-blur-sm z-10 py-4">
                <label htmlFor="surah-select-tafsir" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectSurah')}</label>
                <select 
                    id="surah-select-tafsir" 
                    value={selectedSurah} 
                    onChange={e => setSelectedSurah(parseInt(e.target.value))}
                    disabled={surahListLoading}
                    className="w-full p-3 bg-gray-100 dark:bg-dark-blue-card border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-dark disabled:opacity-50"
                    aria-label="Pilih Surah untuk menampilkan tafsir"
                >
                    {surahListLoading ? <option>Memuat surah...</option> : surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.englishName}</option>)}
                </select>
            </div>
            <div className="space-y-4" aria-live="polite" aria-busy={loading}>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                tafsir.map(item => (
                    <div key={item.ayah} className="bg-white dark:bg-dark-blue-card p-4 rounded-xl shadow-sm">
                        <span className="text-sm font-bold bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white px-3 py-1 rounded-full">Ayat {item.ayah}</span>
                        <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.text}</p>
                    </div>
                ))
            )}
            </div>
        </div>
    );
};

export default Tafsir;
