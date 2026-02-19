import React, { useState, useEffect } from 'react';
import { useTranslation, TranslationKeys } from '../contexts/LanguageContext';
import { LoadingSpinner, ErrorMessage } from './ui/Feedback';

interface LiveTvChannel {
  id: number;
  name: string;
  url: string;
}

const LiveTvModule: React.FC = () => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<LiveTvChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<LiveTvChannel | null>(null);

  useEffect(() => {
    const fetchLiveTvChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real application, you would fetch this from an API
        // For now, using the provided static data
        const staticData = {
          livetv: [
            {
              id: 3,
              name: "Quran channel",
              url: "https://win.holol.com/live/quran/playlist.m3u8"
            },
            {
              id: 4,
              name: "Sunna channel",
              url: "https://win.holol.com/live/sunnah/playlist.m3u8"
            }
          ]
        };
        setChannels(staticData.livetv);
        if (staticData.livetv.length > 0) {
          setSelectedChannel(staticData.livetv[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch Live TV channels:", err);
        setError(err.message || t('failedToLoadLiveTv' as TranslationKeys));
      } finally {
        setLoading(false);
      }
    };

    fetchLiveTvChannels();
  }, [t]);

  return (
    <div className="bg-white dark:bg-dark-blue-card p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-emerald-dark dark:text-white">{t('liveTvMurotal' as TranslationKeys)}</h2>
      {loading ? (
        <div className="h-48 flex items-center justify-center"><LoadingSpinner /></div>
      ) : error ? (
        <ErrorMessage message={`${t('failedToLoadLiveTv' as TranslationKeys)}: ${error}`} />
      ) : (
        <div>
          {selectedChannel && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{selectedChannel.name}</h3>
              <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={selectedChannel.url}
                  title={selectedChannel.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                ></iframe>
              </div>
            </div>
          )}
          {channels.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition
                    ${selectedChannel?.id === channel.id
                      ? 'bg-emerald-dark text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
                  `}
                >
                  {channel.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTvModule;
