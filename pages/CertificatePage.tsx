
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Download, X, Loader2, Award, User } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import CertificateGenerator from '../components/certificate/CertificateGenerator';
import { CertificateData } from '../types'; // Import the new interface

const CertificatePage: React.FC = () => {
  const { levelNumber, score: scoreParam, userName: userNameParam } = useParams<{ levelNumber: string; score?: string; userName?: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState<string>(userNameParam || 'Pengguna Iqro');

  // Parse score from param or default
  const score = scoreParam ? parseInt(scoreParam, 10) : 0;
  const levelTitle = `${levelNumber}`; // Assuming levelNumber is enough for title

  // Determine badge based on score
  const getBadge = (s: number): 'gold' | 'silver' | 'bronze' | null => {
    if (s >= 90) return 'gold';
    if (s >= 70) return 'silver';
    if (s >= 50) return 'bronze';
    return null;
  };
  const badge = getBadge(score);

  const certificateData: CertificateData = {
    userName: userName,
    levelTitle: levelTitle,
    score: score,
    badge: badge,
    date: new Date().toISOString(),
    appLanguage: currentLanguage as 'id' | 'en' | 'ar', // Pass current language for localization
  };

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      // Temporarily show the hidden certificate div to render it correctly for html2canvas
      certificateRef.current.style.display = 'block';
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#fdfbf7', // Ensure background is set for consistent rendering
      });
      // Hide it again
      certificateRef.current.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${t('sertifikatKelulusanIqro')}_Level_${levelNumber}.png`;
      document.body.appendChild(link); // Append to body to make it clickable
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert(t('failedToGenerateCertificate'));
    } finally {
      setIsGenerating(false);
    }
  };

  // The CertificateGenerator component is hidden by default and only rendered for html2canvas
  // or for debugging.
  // To ensure it's rendered correctly for html2canvas, it needs to be part of the DOM,
  // but we can make it visually hidden.
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-emerald-600 font-bold min-h-[44px] min-w-[44px] px-2 py-1" aria-label={t('cancel')}><X size={20}/> {t('cancel')}</button>
      
      <div className="text-center">
        <h1 className="text-3xl font-black mb-2 flex items-center justify-center gap-2">
          <Award size={32} className="text-gold-dark" /> {t('sertifikatKelulusanIqro')}
        </h1>
        <p className="text-slate-500">{t('certificateInstruction')}</p>
      </div>

      <div className="bg-white dark:bg-dark-blue-card rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('iqroLevel')} {levelNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('yourScore')}: {score}%</p>
          {badge && (
            <div className="flex items-center justify-center mt-4 gap-2">
              <span className="text-gold-dark text-lg font-bold">{t('badge')}:</span>
              {getBadge(score)}
            </div>
          )}
        </div>

        <div className="space-y-2">
            <label htmlFor="user-name-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User size={16} /> {t('enterYourNameForCertificate')}
            </label>
            <input
                id="user-name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t('yourName')}
                className="w-full p-3 bg-gray-100 dark:bg-dark-blue border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-dark"
                aria-label={t('enterYourNameForCertificate')}
            />
        </div>

        <button
          onClick={handleDownloadCertificate}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mt-6 hover:bg-emerald-700 transition"
          disabled={isGenerating || !userName}
          aria-label={t('downloadCertificate')}
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} {t('downloadCertificate')}
        </button>
      </div>

      {/* Render the CertificateGenerator component off-screen for html2canvas to capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
        <CertificateGenerator certificateRef={certificateRef} data={certificateData} userNameInput={userName} />
      </div>
    </div>
  );
};

export default CertificatePage;
