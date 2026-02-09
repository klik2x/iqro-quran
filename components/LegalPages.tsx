
import React from 'react';
import { ArrowLeft, Shield, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold"><ArrowLeft size={20}/> Kembali</button>
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><Shield className="text-emerald-500" /> Kebijakan Privasi</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
        <p>Aplikasi IQRO Quran Digital berkomitmen untuk menjaga privasi pengguna. Kami tidak mengumpulkan data pribadi sensitif.</p>
        <h3 className="text-xl font-bold">1. Penggunaan Terjemahan</h3>
        <p>Aplikasi ini bertujuan untuk memudahkan masyarakat luas dalam memahami makna Al-Qur'an melalui terjemahan yang benar dan tepat sesuai dengan maksud ayat.</p>
        <h3 className="text-xl font-bold">2. Sumber Data</h3>
        <p>Aplikasi IQRO Quran Digital menggunakan API kredibel dari Al Quran Cloud (alquran.cloud) sebagai sumber data utama.</p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold"><ArrowLeft size={20}/> Kembali</button>
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><HelpCircle className="text-blue-500" /> Pertanyaan Sering Diajukan</h1>
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <h3 className="font-bold text-lg mb-2">Mengapa saya harus menggunakan aplikasi ini?</h3>
          <p className="text-slate-600 dark:text-slate-400">Agar umat Islam dapat memperoleh akses yang mudah untuk memahami makna ayat Al-Qur'an dengan baik dan benar, khususnya bagi masyarakat awam.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <h3 className="font-bold text-lg mb-2">Apakah aplikasi ini bisa offline?</h3>
          <p className="text-slate-600 dark:text-slate-400">Beberapa fitur utama seperti teks Al-Quran yang sudah pernah dibuka akan tersimpan di cache browser untuk akses offline terbatas.</p>
        </div>
      </div>
    </div>
  );
};
