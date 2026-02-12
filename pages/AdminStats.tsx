// pages/AdminStats.tsx (New File)
import React, { useState, useEffect } from 'react';
import { ShieldCheck, BarChart3, Zap, HardDrive, AlertTriangle } from 'lucide-react';

const AdminStats: React.FC = () => {
  const [usage, setUsage] = useState({
    geminiRequests: 0,
    elevenLabsChars: 0,
    totalUsers: 0
  });

  // Simulasi pengambilan data dari backend TTSPro
  useEffect(() => {
    // Di sini Anda akan melakukan fetch ke endpoint admin di TTSPro
    setUsage({
      geminiRequests: 1250, // Contoh jumlah request hari ini
      elevenLabsChars: 45000, // Contoh karakter yang terpakai
      totalUsers: 840
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 border-b-2 pb-4 border-emerald-500">
        <ShieldCheck size={40} className="text-emerald-600" />
        <div>
          <h1 className="text-3xl font-black">Admin Panel: TeeR Inovative</h1>
          <p className="text-slate-500 italic">Pemantauan Kuota Global IQRO Quran Digital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Gemini Usage */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <BarChart3 className="text-blue-500" size={32} />
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">API Gemini</span>
          </div>
          <p className="text-slate-500 font-medium">Total Analisis Suara</p>
          <h2 className="text-4xl font-black">{usage.geminiRequests}</h2>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* ElevenLabs Usage */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-orange-500">
          <div className="flex justify-between items-start mb-4">
            <Zap className="text-orange-500" size={32} />
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">ElevenLabs</span>
          </div>
          <p className="text-slate-500 font-medium">Karakter Terpakai</p>
          <h2 className="text-4xl font-black">{usage.elevenLabsChars.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-2">Limit: 100,000 / bln</p>
        </div>

        {/* User Active */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <HardDrive className="text-emerald-500" size={32} />
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Aktif</span>
          </div>
          <p className="text-slate-500 font-medium">User Global Hari Ini</p>
          <h2 className="text-4xl font-black">{usage.totalUsers}</h2>
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl flex items-center gap-4">
        <AlertTriangle className="text-amber-600" size={32} />
        <p className="text-amber-800 font-medium text-sm">
          <strong>Peringatan Kuota:</strong> Penggunaan ElevenLabs telah mencapai 45%. Pertimbangkan untuk menambah limit jika jumlah pengguna IQRO Digital meningkat drastis di akhir bulan.
        </p>
      </div>
    </div>
  );
};

export default AdminStats;
