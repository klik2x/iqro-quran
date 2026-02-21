import React, { useState, useEffect } from 'react';
import { Tv, Loader2, WifiOff } from 'lucide-react';

interface LiveTvMurotalProps {
  t: (key: string) => string;
}

interface LiveTvData {
  id: number;
  name: string;
  url: string;
}

const LiveTvMurotal: React.FC<LiveTvMurotalProps> = ({ t }) => {
  const [liveTv, setLiveTv] = useState<LiveTvData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveTv = async () => {
      try {
        // Using the exact JSON structure provided in the prompt
        const data = { 
          "livetv": [ 
            { 
               "id": 3, 
               "name": "Quran channel", 
               "url": "https://win.holol.com/live/quran/playlist.m3u8" 
             }, 
             { 
                "id": 4, 
                "name": "Sunna channel", 
                "url": "https://win.holol.com/live/sunnah/playlist.m3u8" 
              }
            ] 
        };

        if (data.livetv && data.livetv.length > 0) {
          // Default to Quran channel (id: 3)
          const quranChannel = data.livetv.find(channel => channel.id === 3) || data.livetv[0];
          setLiveTv(quranChannel);
        } else {
          setError(t('failedToLoadLiveTv'));
        }
      } catch (err) {
        console.error("Failed to fetch live TV data:", err);
        setError(t('failedToLoadLiveTv'));
      } finally {
        setLoading(false);
      }
    };

    fetchLiveTv();
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-blue rounded-xl shadow-lg animate-pulse min-h-[200px]">
        <Loader2 className="w-10 h-10 text-emerald-dark animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-100 dark:bg-red-900 rounded-xl shadow-lg text-red-800 dark:text-red-200 min-h-[200px]">
        <WifiOff className="w-10 h-10" />
        <p className="mt-4 text-center">{error}</p>
      </div>
    );
  }

  if (!liveTv) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-xl shadow-lg text-yellow-800 dark:text-yellow-200 min-h-[200px]">
        <Tv className="w-10 h-10" />
        <p className="mt-4 text-center">{t('failedToLoadLiveTv')}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-dark-blue rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-900/10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
          <Tv className="w-6 h-6 text-emerald-dark dark:text-emerald-light" />
          {t('liveTvMurotal')}
        </h3>
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white rounded-md animate-pulse">
          LIVE
        </span>
      </div>
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>{/* 16:9 Aspect Ratio */}
        <video
          className="absolute top-0 left-0 w-full h-full"
          controls
          autoPlay
          muted
          playsInline
          poster="https://picsum.photos/seed/makkah/1280/720?blur=2"
        >
          <source src={liveTv.url} type="application/x-mpegURL" />
          Your browser does not support the video tag or HLS streams.
        </video>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-dark-blue-card">
        <p className="text-emerald-dark dark:text-emerald-light font-semibold text-sm mb-1">
          {liveTv.name}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs italic">
          {t('liveTvMurotalDescription')}
        </p>
      </div>
    </div>
  );
};

export default LiveTvMurotal;
