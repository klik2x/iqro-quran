
import React from 'react';
import { CertificateData } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { Award } from 'lucide-react';

interface CertificateGeneratorProps {
  data: CertificateData;
  // This ref is typically passed from the parent component that will use html2canvas
  // to capture the content of this component.
  certificateRef: React.RefObject<HTMLDivElement>;
  userNameInput: string; // User input for name
}

const getBadgeIcon = (badge: 'gold' | 'silver' | 'bronze' | null) => {
    switch (badge) {
        case 'gold': return <Award size={64} fill="#FFD700" className="text-gold-light" />;
        case 'silver': return <Award size={64} fill="#C0C0C0" className="text-slate-400" />;
        case 'bronze': return <Award size={64} fill="#CD7F32" className="text-amber-700" />;
        default: return null;
    }
};

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ data, certificateRef, userNameInput }) => {
  const { t } = useTranslation(); // Use global translation context

  // Helper to get translated strings for the certificate
  const getCertificateText = (key: string, langCode: string) => {
    const translations: { [key: string]: { [lang: string]: string } } = {
        'atasKaruniaAllah': {
            'id': 'Atas Karunia dan Rahmat Allah ﷻ',
            'en': 'By the Grace and Mercy of Allah ﷻ',
            'ar': 'بفضل ورحمة الله ﷻ',
        },
        'sertifikatHafalan': {
            'id': 'Sertifikat Kelulusan Iqro',
            'en': 'Iqro Completion Certificate',
            'ar': 'شهادة إتمام إقرأ',
        },
        'diberikanKepada': {
            'id': 'Dengan ini diberikan kepada:',
            'en': 'This certificate is awarded to:',
            'ar': 'تُمنح هذه الشهادة لـ:',
        },
        'atasKeberhasilan': {
            'id': 'atas keberhasilan dalam menyelesaikan pelajaran Iqro:',
            'en': 'for successfully completing the Iqro lesson:',
            'ar': 'لنجاحه في إكمال درس إقرأ:',
        },
        'levelTitle': {
            'id': `${t('iqroLevel')} ${data.levelTitle}`, // Use app-wide translation for "Iqro Level"
            'en': `Iqro Level ${data.levelTitle}`,
            'ar': `مستوى إقرأ ${data.levelTitle}`,
        },
        'denganNilai': {
            'id': `Dengan nilai: ${data.score}%`,
            'en': `With a score of: ${data.score}%`,
            'ar': `بدرجة: ${data.score}%`,
        },
        'dikeluarkanOleh': {
            'id': 'Dikeluarkan oleh IQRO Quran Digital',
            'en': 'Issued by IQRO Quran Digital',
            'ar': 'صادرة عن تطبيق إقرأ القرآن الرقمي',
        },
        'tandaTanganAI': {
            'id': 'AI IQRO',
            'en': 'AI IQRO',
            'ar': 'الذكاء الاصطناعي إقرأ',
        },
    };
    return translations[key]?.[langCode] || translations[key]?.['en'] || key; // Fallback to English, then key itself
  };

  const displayLang = data.appLanguage;
  const currentLocaleDate = new Date(data.date).toLocaleDateString(displayLang === 'ar' ? 'ar-SA' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div 
        ref={certificateRef} 
        className="certificate-template p-8 bg-gradient-to-br from-blue-50 via-white to-gold-50 text-slate-900 text-center relative overflow-hidden font-serif" 
        style={{ width: '800px', height: '600px', backgroundImage: 'url(https://raw.githubusercontent.com/klik2x/iqro-quran/main/assets/certificate_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box' }}
    >
        <div className="border-4 border-gold-dark p-8 h-full flex flex-col justify-between" style={{ borderColor: '#D4AF37' }}>
            <p className="text-xl text-emerald-dark" style={{ color: '#036666' }}>{getCertificateText('atasKaruniaAllah', displayLang)}</p>
            <h1 className="text-5xl font-bold text-gold-dark mt-4 mb-4" style={{ color: '#D4AF37' }}>{getCertificateText('sertifikatHafalan', displayLang)}</h1>
            <p className="text-xl text-slate-700">{getCertificateText('diberikanKepada', displayLang)}</p>
            <p className="text-4xl font-bold mt-2 mb-4 text-emerald-dark" style={{ color: '#036666' }}>{userNameInput || "Pengguna Iqro"}</p>
            <p className="text-xl text-slate-700">{getCertificateText('atasKeberhasilan', displayLang)}</p>
            <p className="text-3xl font-bold text-gold-dark mt-4 mb-4" style={{ color: '#D4AF37' }}>{getCertificateText('levelTitle', displayLang)}</p>
            
            {data.score !== undefined && (
                 <div className="flex items-center justify-center gap-4 mt-2">
                     {getBadgeIcon(data.badge || null)}
                     <p className="text-4xl font-bold text-emerald-dark" style={{ color: '#036666' }}>{getCertificateText('denganNilai', displayLang)}</p>
                 </div>
            )}
           
            <div className="mt-8 flex justify-between items-end">
                <div className="text-left space-y-2">
                    <p className="text-lg text-slate-700">{getCertificateText('dikeluarkanOleh', displayLang)}</p>
                    <p className="text-lg font-bold text-emerald-dark" style={{ color: '#036666' }}>{currentLocaleDate}</p>
                </div>
                <div className="text-right space-y-2">
                    <p className="text-lg text-slate-700">Tanda Tangan:</p>
                    <p className="text-2xl font-bold text-gold-dark" style={{ color: '#D4AF37' }}>{getCertificateText('tandaTanganAI', displayLang)}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CertificateGenerator;
