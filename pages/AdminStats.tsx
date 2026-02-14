
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Server, TrendingUp, Settings2, X, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

// This is a mock implementation for API quota monitoring as direct frontend access
// to real-time quota of a backend service (like Gemini/ElevenLabs) is not typically feasible.
// In a real application, this data would be fetched from a secure backend endpoint.

interface ApiServiceStats {
    name: string;
    totalRequests: number;
    hourlyLimit: number;
    dailyLimit: number;
    status: 'ok' | 'warning' | 'critical';
    lastChecked: string;
}

const AdminStats: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [stats, setStats] = useState<ApiServiceStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMockStats = async () => {
            setLoading(true);
            setError(null);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                // Mock data for demonstration purposes
                const mockStats: ApiServiceStats[] = [
                    {
                        name: 'Gemini API (TTS)',
                        totalRequests: 850,
                        hourlyLimit: 1000,
                        dailyLimit: 25000,
                        status: 'ok',
                        lastChecked: new Date().toLocaleString(),
                    },
                    {
                        name: 'Vocal Studio TTSPro',
                        totalRequests: 70,
                        hourlyLimit: 100,
                        dailyLimit: 3000,
                        status: 'warning',
                        lastChecked: new Date().toLocaleString(),
                    },
                    {
                        name: 'Quran Cloud API',
                        totalRequests: 12000,
                        hourlyLimit: 15000,
                        dailyLimit: 100000,
                        status: 'ok',
                        lastChecked: new Date().toLocaleString(),
                    }
                ];
                setStats(mockStats);
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
                setError("Gagal memuat statistik. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };
        fetchMockStats();
    }, []);

    const getStatusColor = (status: ApiServiceStats['status']) => {
        switch (status) {
            case 'ok': return 'text-green-500';
            case 'warning': return 'text-amber-500';
            case 'critical': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusBarWidth = (current: number, limit: number) => {
        if (limit === 0) return '0%';
        const percentage = (current / limit) * 100;
        return `${Math.min(percentage, 100)}%`; // Cap at 100%
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel')}><X size={20}/> {t('cancel')}</button>
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><Server className="text-purple-500" /> {t('adminStatsTitle')}</h1>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20 flex gap-4 text-blue-800 dark:text-blue-300 shadow-inner mb-8">
              <AlertCircle className="shrink-0 text-blue-500" />
              <p className="text-sm font-bold leading-relaxed">{t('adminStatsDisclaimer')}</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                    <p className="mt-4 text-slate-500">{t('loadingStats')}</p>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-20">{error}</div>
            ) : (
                <div className="space-y-6">
                    {stats.map(service => (
                        <div key={service.name} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                                <span className={`font-semibold text-sm ${getStatusColor(service.status)}`}>
                                    {service.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                                <p><strong>{t('totalRequests')}:</strong> {service.totalRequests}</p>
                                
                                <div>
                                    <p className="mb-1"><strong>{t('hourlyLimit')}:</strong> {service.totalRequests} / {service.hourlyLimit}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                                            style={{ width: getStatusBarWidth(service.totalRequests, service.hourlyLimit) }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="mb-1"><strong>{t('dailyLimit')}:</strong> {service.totalRequests} / {service.dailyLimit}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                            style={{ width: getStatusBarWidth(service.totalRequests, service.dailyLimit) }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    {t('lastChecked')}: {service.lastChecked}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminStats;