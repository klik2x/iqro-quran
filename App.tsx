
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate, Outlet } from 'react-router-dom';
import { HomeIcon, BookOpen, Mic, BrainCircuit, Headphones, BookHeart, Menu, X, Cog, Sun, Moon, Bookmark, Mail, Heart, ShieldCheck, FileText, HelpCircle, Users, Accessibility, Award, Server, Download } from 'lucide-react'; // Import Award, Server, and Download icon

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { UIProvider, useUI } from './contexts/UIContext';
import { LanguageProvider, useTranslation, TranslationKeys } from './contexts/LanguageContext'; // NEW: Import TranslationKeys
import { PopupProvider } from './contexts/PopupContext';
import { ApiHealthProvider } from './contexts/ApiHealthContext'; // NEW IMPORT

import Dashboard from './pages/Dashboard';
import Mushaf from './pages/Mushaf';
import SurahDetail from './pages/SurahDetail';
import JuzDetail from './pages/JuzDetail';
import Iqro from './pages/Iqro';
import IqroDetail from './pages/IqroDetail';
import Rekam from './pages/Rekam'; // Rekam now uses RecordingModule internally
import Murotal from './pages/Murotal';
import Tafsir from './pages/Tafsir';
import DoaPage from './pages/Doa';
import Bookmarks from './pages/Bookmarks';
import ScrollButtons from './components/ui/ScrollButtons';
import SettingsDropdown from './components/SettingsDropdown';
import ReadingModeExitButton from './components/ui/ReadingModeExitButton';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import PopupEntry from './pages/PopupEntry';
import FamilyPrayerPopup from './components/ui/FamilyPrayerPopup';
import SetoranBerhadiah from './pages/SetoranBerhadiah'; // Import new SetoranBerhadiah page
import CertificatePage from './pages/CertificatePage'; // NEW IMPORT
import AdminStats from './pages/AdminStats'; // NEW IMPORT

// Custom Emoji Icon component for 🗣️
const SpeakingHeadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span role="img" aria-label="Belajar Iqro" className={className}>
        🗣️
    </span>
);


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UIProvider>
          <BookmarkProvider>
            <PopupProvider>
              <ApiHealthProvider> {/* NEW: ApiHealthProvider */}
                <HashRouter>
                  <AppRoutes />
                </HashRouter>
              </ApiHealthProvider>
            </PopupProvider>
          </BookmarkProvider>
        </UIProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // NEW: Admin state
  const [hasSeenWelcome, setHasSeenWelcome] = useState(sessionStorage.getItem('hasSeenWelcome') === 'true');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    if (username === 'admin-iqro') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    } else {
      localStorage.removeItem('isAdmin');
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('hasSeenFamilyPrayerPopup');
    sessionStorage.removeItem('hasSeenWelcome');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(loggedIn);
    setIsAdmin(admin);
  }, []);

  if (!hasSeenWelcome) {
    return <Welcome onFinish={() => setHasSeenWelcome(true)} />;
  }

  if (!isLoggedIn) {
      return (
          <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      );
  }

  // Admin route protection
  const AdminRoute = () => {
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route element={<MainLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mushaf" element={<Mushaf />} />
        <Route path="/surah/:number" element={<SurahDetail />} />
        <Route path="/juz/:number" element={<JuzDetail />} />
        <Route path="/iqro" element={<Iqro />} />
        <Route path="/iqro/:levelNumber" element={<IqroDetail />} />
        <Route path="/iqro/:levelNumber/certificate" element={<CertificatePage />} /> {/* NEW ROUTE */}
        <Route path="/murotal" element={<Murotal />} />
        <Route path="/tafsir" element={<Tafsir />} />
        <Route path="/doa" element={<DoaPage />} />
        <Route path="/rekam" element={<Rekam />} />
        <Route path="/setoran-berhadiah" element={<SetoranBerhadiah />} /> {/* NEW ROUTE */}
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/doa-keluarga" element={<PopupEntry />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="stats" element={<AdminStats />} /> {/* NEW HIDDEN ROUTE */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

interface MainLayoutProps {
    isLoggedIn: boolean;
    handleLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isLoggedIn, handleLogout }) => {
  const { theme } = useTheme();
  const { isReadingMode, zoom } = useUI();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [showFamilyPrayerPopup, setShowFamilyPrayerPopup] = useState(false);
  const location = useLocation();

  const [installPrompt, setInstallPrompt] = useState<any>(null); // NEW: State for PWA install prompt

  useEffect(() => {
      const handler = (e: Event) => {
          e.preventDefault();
          setInstallPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenFamilyPrayerPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowFamilyPrayerPopup(true);
        sessionStorage.setItem('hasSeenFamilyPrayerPopup', 'true');
      }, 1500); // 1.5 second delay
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <div className={`${theme} font-sans`} style={{ zoom: zoom }}>
      <div className="bg-soft-white dark:bg-dark-blue text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="flex">
          {!isReadingMode && <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${isReadingMode ? 'md:ml-0' : 'md:ml-64'}`}>
             {!isReadingMode && <Header 
                onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
                onSettingsClick={() => setSettingsOpen(!isSettingsOpen)}
                isSettingsOpen={isSettingsOpen}
                setSettingsOpen={setSettingsOpen}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                installPrompt={installPrompt} // NEW: Pass installPrompt
                setInstallPrompt={setInstallPrompt} // NEW: Pass setInstallPrompt
             />}
            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        {!isReadingMode && <BottomNav />}
        <ScrollButtons />
        {isReadingMode && <ReadingModeExitButton />}
        {showFamilyPrayerPopup && <FamilyPrayerPopup onClose={() => setShowFamilyPrayerPopup(false)} />}
      </div>
    </div>
  );
};


interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
  installPrompt: any; // NEW: Prop for PWA install prompt
  setInstallPrompt: (prompt: any) => void; // NEW: Setter for PWA install prompt
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick, isSettingsOpen, setSettingsOpen, isLoggedIn, handleLogout, installPrompt, setInstallPrompt }) => {
    const { t } = useTranslation(); // Use translation hook

    const handleInstallClick = async () => { // NEW: PWA install logic
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    return (
        <header className="sticky top-0 bg-soft-white/80 dark:bg-dark-blue/80 backdrop-blur-sm z-40 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuClick} className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-blue-card min-h-[44px] min-w-[44px]" aria-label={t('openMenu' as TranslationKeys)}>
                    <Menu className="h-6 w-6 text-emerald-dark dark:text-emerald-light" />
                </button>
                 <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-dark dark:text-emerald-light">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h1 className="text-xl font-bold text-emerald-dark dark:text-emerald-light">IQRO Quran</h1>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {installPrompt && ( // NEW: Show install button if prompt is available
                    <button 
                        onClick={handleInstallClick} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-blue-card min-h-[44px] min-w-[44px]" 
                        aria-label={t('installApp' as TranslationKeys)}
                    >
                        <Download className="h-6 w-6 text-emerald-dark dark:text-emerald-light" />
                    </button>
                )}
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-blue-card min-h-[44px] min-w-[44px]" aria-label={t('accessibilitySettings' as TranslationKeys)} onClick={() => alert(t('accessibilityComingSoon' as TranslationKeys))}>
                    <Accessibility className="h-6 w-6 text-emerald-dark dark:text-emerald-light" />
                </button>
                <Link to="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-blue-card min-h-[44px] min-w-[44px]" aria-label={t('goToHomePage' as TranslationKeys)}>
                    <HomeIcon className="h-6 w-6 text-emerald-dark dark:text-emerald-light" />
                </Link>
                <div className="relative">
                    <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-blue-card min-h-[44px] min-w-[44px]" aria-label={t('openSettings' as TranslationKeys)}>
                        <Cog className="h-6 w-6 text-emerald-dark dark:text-emerald-light" />
                    </button>
                    <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                </div>
            </div>
        </header>
    );
};

const Sidebar: React.FC<{ isSidebarOpen: boolean; setSidebarOpen: (isOpen: boolean) => void }> = ({ isSidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { t } = useTranslation();
    const navItems = [
        { path: '/', icon: HomeIcon, label: t('dashboard' as TranslationKeys) },
        { path: '/mushaf', icon: BookOpen, label: t('mushaf' as TranslationKeys) },
        { path: '/iqro', icon: SpeakingHeadIcon, label: t('learnIqro' as TranslationKeys) },
        { path: '/murotal', icon: Headphones, label: t('murotal' as TranslationKeys) },
        { path: '/tafsir', icon: BookOpen, label: t('tafsir' as TranslationKeys) },
        { path: '/doa', icon: BookHeart, label: t('prayers' as TranslationKeys) },
        { path: '/rekam', icon: Mic, label: t('record' as TranslationKeys) },
        { path: '/setoran-berhadiah', icon: Award, label: t('setoranBerhadiah' as TranslationKeys) }, // NEW: Setoran Berhadiah
        { path: '/doa-keluarga', icon: Users, label: t('familyPrayer' as TranslationKeys) },
    ];

    const staticItems = [
        { path: '/bookmarks', icon: Bookmark, label: t('bookmark' as TranslationKeys) },
        { type: 'link', href: 'mailto:hijr.time+qoriquran@gmail.com', icon: Mail, label: t('contactUs' as TranslationKeys) },
        { type: 'link', href: 'https://sociabuzz.com/syukrankatsiron/tribe', icon: Heart, label: t('supportUs' as TranslationKeys) },
        { path: '/privacy', icon: ShieldCheck, label: t('privacyPolicy' as TranslationKeys) },
        { path: '/terms', icon: FileText, label: t('termsOfService' as TranslationKeys) },
        { path: '/faq', icon: HelpCircle, label: t('faq' as TranslationKeys) },
        { path: '/admin/stats', icon: Server, label: t('adminStatsTitle' as TranslationKeys) }, // NEW: Admin Stats
    ];

    return (
        <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-dark-blue-card w-64 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-dark dark:text-emerald-light">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h1 className="text-xl font-bold text-emerald-dark dark:text-emerald-light">IQRO</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 min-h-[44px] min-w-[44px]" aria-label={t('closeMenu' as TranslationKeys)}>
                    <X className="h-6 w-6" />
                </button>
            </div>
            <nav className="p-4 flex-grow overflow-y-auto">
              <ul>
                  {navItems.map(item => (
                      <li key={item.path}>
                          <Link to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-3 px-3 py-3 my-1 rounded-lg transition-colors min-h-[44px] ${location.pathname === item.path ? 'bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                              { item.label === t('learnIqro' as TranslationKeys)
                                ? <item.icon className="w-5 text-center text-xl" />
                                : <item.icon className="h-5 w-5" />
                              }
                              <span className="font-medium">{item.label}</span>
                          </Link>
                      </li>
                  ))}
              </ul>
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
               <ul>
                  {staticItems.map(item => (
                      <li key={item.label}>
                        {item.type === 'link' ? (
                            <a href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="flex items-center space-x-3 px-3 py-3 my-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px]">
                               <item.icon className="h-5 w-5" />
                               <span className="font-medium">{item.label}</span>
                            </a>
                        ) : (
                          <Link to={item.path!} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-3 px-3 py-3 my-1 rounded-lg transition-colors min-h-[44px] ${location.pathname === item.path ? 'bg-emerald-light/30 text-emerald-dark dark:bg-emerald-dark/50 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                          </Link>
                        )}
                      </li>
                  ))}
              </ul>
            </nav>
             <div className="text-center text-xs text-gray-400 p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="mb-1 font-mono">System V.2.0</p>
                <p>Te_eR™ Inovative @2026</p>
            </div>
        </aside>
    );
};

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const navItems = [
        { path: '/iqro', icon: SpeakingHeadIcon, label: t('learnIqro' as TranslationKeys) },
        { path: '/tafsir', icon: BookHeart, label: t('tafsir' as TranslationKeys) },
        { path: '/mushaf', icon: BookOpen, label: t('mushaf' as TranslationKeys) },
        { path: '/murotal', icon: Headphones, label: t('murotal' as TranslationKeys) },
        { path: '/rekam', icon: Mic, label: t('record' as TranslationKeys) },
    ];
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-blue-card/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 md:hidden z-30">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <Link 
                        to={item.path} 
                        key={item.path} 
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 min-h-[44px] ${location.pathname === item.path ? 'text-emerald-dark dark:text-gold-light' : 'text-gray-500 dark:text-gray-400'} ${item.path === '/mushaf' ? 'transform -translate-y-3' : ''}`}
                        aria-label={item.label}
                    >
                        <div className={`flex items-center justify-center rounded-full transition-all duration-200 ${item.path === '/mushaf' ? 'bg-emerald-dark dark:bg-gold-light p-4 -mt-6 shadow-lg' : 'p-2'}`}>
                          { item.label === t('learnIqro' as TranslationKeys)
                            ? <item.icon className={`${item.path === '/mushaf' ? 'text-3xl' : 'text-2xl'}`} />
                            : <item.icon className={`${item.path === '/mushaf' ? 'h-8 w-8 text-white dark:text-emerald-dark' : 'h-6 w-6'}`} />
                          }
                        </div>
                        <span className={`text-[10px] mt-1 ${item.path === '/mushaf' ? 'font-semibold text-emerald-dark dark:text-gold-light' : ''}`}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default App;