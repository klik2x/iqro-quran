import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { tajwidRules } from '../../data/tajwidData';
import { speak } from '../../utils/browserSpeech'; // Menggunakan file yang Anda lampirkan
import { Volume2, Info, CheckCircle2 } from 'lucide-react';
import { useAudioFeedback } from '../../hooks/useAudioFeedback'; // Opsional untuk Haptic

const TajwidView: React.FC = () => {
    const { t, currentLanguage } = useTranslation();
    const [selectedRule, setSelectedRule] = useState(tajwidRules[0]);

    const handlePlayVoice = (rule: TajwidRule) => {
  // 1. Hentikan suara yang sedang berjalan
  window.speechSynthesis.cancel();

  // 2. Bacakan Penjelasan (Bahasa Indonesia/sesuai sistem)
  const instruction = `${rule.name}. ${rule.description}`;
  
  // Memanggil fungsi speak dari browserSpeech.ts
  speak(instruction, currentLanguage, undefined, () => {
    // 3. Setelah penjelasan selesai, bacakan teks Arab dengan lang 'ar'
    if (rule.exampleAudioText) {
      setTimeout(() => {
        // 'ar' memicu Browser menggunakan engine suara Arab
        speak(rule.exampleAudioText, 'ar');
      }, 800);
    }
  });
};
    // Fungsi untuk membacakan penjelasan tajwid
    const playTajwidInstruction = (rule: any) => {
        if (!rule) return;

        // Batal suara sebelumnya
        window.speechSynthesis.cancel();

        // 1. Bacakan Nama Hukum dan Penjelasan (Bahasa sesuai pilihan User)
        const instruction = `${t('tajwidRule')}: ${rule.name}. ${rule.description}`;
        
        // Gunakan lang sesuai currentLanguage untuk penjelasan
        speak(instruction, currentLanguage, () => {
            // 2. Setelah penjelasan selesai, contohkan bunyi Arab-nya (jika ada)
            if (rule.exampleAudioText) {
                setTimeout(() => {
                    // Gunakan 'ar' untuk teks Arab agar makhraj-nya benar
                    speak(rule.exampleAudioText, 'ar');
                }, 500);
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Informasi */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-800">
                <Info className="text-emerald-600 shrink-0 mt-1" size={20} />
                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    {t('tajwidInstruction')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List Hukum Tajwid (Sidebar) */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {tajwidRules.map((rule) => (
                        <button
                            key={rule.id}
                            onClick={() => {
                                setSelectedRule(rule);
                                playTajwidInstruction(rule);
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border-2 ${
                                selectedRule.id === rule.id 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md' 
                                : 'border-transparent bg-white dark:bg-dark-blue-card hover:border-emerald-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-4 h-4 rounded-full shadow-sm" 
                                    style={{ backgroundColor: rule.color }}
                                />
                                <span className={`font-bold ${selectedRule.id === rule.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {rule.name}
                                </span>
                            </div>
                            <Volume2 size={18} className={selectedRule.id === rule.id ? 'text-emerald-600' : 'text-slate-300'} />
                        </button>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="md:col-span-2 bg-white dark:bg-dark-blue-card rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    {/* Background Ornamen (Aksesibilitas Visual) */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                        <Volume2 size={120} />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl text-emerald-600">
                                <CheckCircle2 size={32} />
                             </div>
                             <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    {selectedRule.name}
                                </h2>
                                <p className="text-emerald-600 font-bold">{t('tajwidHukum')}</p>
                             </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-8" style={{ borderColor: selectedRule.color }}>
                            <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                                {selectedRule.description}
                            </p>
                        </div>

                        {/* Contoh Ayat Tajwid */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">{t('example')}</h4>
                            <div className="flex flex-col items-end gap-4">
                                <p className="font-arabic text-5xl leading-[1.8] text-right" dir="rtl">
                                    {/* Contoh teks Arab yang di-highlight sesuai warna hukum tajwid */}
                                    {selectedRule.exampleArabic}
                                </p>
                                <div className="flex items-center gap-4 w-full">
                                    <button 
                                        onClick={() => playTajwidInstruction(selectedRule)}
                                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 active:scale-95 transition-all min-h-[48px]"
                                    >
                                        <Volume2 size={20} />
                                        <span>{t('listenExample')}</span>
                                    </button>
                                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TajwidView;
