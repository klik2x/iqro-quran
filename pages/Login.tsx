
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext'; // Import useTranslation

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const { t } = useTranslation(); // Use translation hook

    const handleGoogleLogin = () => {
        // Placeholder for actual Google Auth
        console.log("Simulating Google Login...");
        onLogin();
        navigate('/');
    };

    const handleGuestLogin = () => {
        onLogin();
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-soft-white dark:bg-dark-blue p-4">
            <div className="w-full max-w-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-emerald-dark dark:text-emerald-light">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18-3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h1 className="text-4xl font-bold text-emerald-dark dark:text-emerald-light">IQRO Quran</h1>
                </div>
                
                <div className="bg-white dark:bg-dark-blue-card p-8 rounded-2xl shadow-lg space-y-6">
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.455-11.297-8.169l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.011 35.131 44 30.029 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                        </svg>
                        {t('loginWithGoogle')}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-dark-blue-card text-gray-500">
                                {t('of')}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={handleGuestLogin}
                        className="w-full bg-emerald-dark text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition"
                    >
                        {t('continueAsGuest')}
                    </button>
                </div>
                <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    Dengan melanjutkan, Anda menyetujui <Link to="/terms" className="text-emerald-dark dark:text-emerald-light hover:underline">{t('termsOfService')}</Link> dan <Link to="/privacy" className="text-emerald-dark dark:text-emerald-light hover:underline">{t('privacyPolicy')}</Link> kami.
                </p>
            </div>
        </div>
    );
};

export default Login;