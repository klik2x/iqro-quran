
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate, Outlet } from 'react-router-dom';
import { HomeIcon, BookOpen, Mic, Headphones, BookHeart, Menu, X, Cog, Bookmark, Mail, Heart, ShieldCheck, FileText, HelpCircle, Users, Download, BookText } from 'lucide-react';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { UIProvider, useUI } from './contexts/UIContext';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';
import { PopupProvider } from './contexts/PopupContext';
import { QuranProvider } from './contexts/QuranContext';

import Dashboard from './pages/Dashboard';
import Mushaf from './pages/Mushaf';
import SurahDetail from './pages/SurahDetail';
import JuzDetail from './pages/JuzDetail';
import PageDetail from './pages/PageDetail';
import Iqro from './pages/Iqro';
import Rekam from './pages/Rekam';
import Murotal from './pages/Murotal';
import Tafsir from './pages/Tafsir';
import Doa from './pages/Doa';
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

const SpeakingHeadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span role="img" aria-label="Belajar Iqro" className={className}>🗣️</span>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UIProvider>
          <BookmarkProvider>
            <QuranProvider>
              <PopupProvider>
                <HashRouter>
                  <AppRoutes />
                </HashRouter>
              </PopupProvider>
            </QuranProvider>
          </BookmarkProvider>
        </UIProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(sessionStorage.getItem('hasSeenWelcome') === 'true');

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  if (!hasSeenWelcome) return <Welcome onFinish={() => setHasSeenWelcome(true)} />;

  if (!isLoggedIn) {
      return (
          <Routes>
              <Route path="/login" element={<Login onLogin={() => { localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }} />} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      );
  }

  return (
    <Routes>
      <Route element={<MainLayout isLoggedIn={isLoggedIn} handleLogout={() => { localStorage.removeItem('isLoggedIn'); setIsLoggedIn(false); }} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mushaf" element={<Mushaf />} />
        <Route path="/surah/:number" element={<SurahDetail />} />
        <Route path="/juz/:number" element={<JuzDetail />} />
        <Route path="/page/:number" element={<PageDetail />} />
        <Route path="/iqro" element={<Iqro />} />
        <Route path="/murotal" element={<Murotal />} />
        <Route path="/tafsir" element={<Tafsir />} />
        <Route path="/doa" element={<Doa />} />
        <Route path="/rekam" element={<Rekam />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/doa-keluarga" element={<PopupEntry />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const MainLayout: React.FC<{isLoggedIn: boolean, handleLogout: () => void}> = ({ isLoggedIn, handleLogout }) => {
  const { theme } = useTheme();
  const { isReadingMode, zoom } = useUI();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={`${theme} font-sans`} style={{ zoom }}>
      <div className="bg-soft-white dark:bg-dark-blue text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="flex">
          {!isReadingMode && <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${isReadingMode ? 'md:ml-0' : 'md:ml-64'}`}>
             {!isReadingMode && <Header onMenuClick={() => setSidebarOpen(true)} onSettingsClick={() => setSettingsOpen(!isSettingsOpen)} isSettingsOpen={isSettingsOpen} setSettingsOpen={setSettingsOpen} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
              <Outlet />
            </main>
          </div>
        </div>
        {!isReadingMode && <BottomNav />}
        <ScrollButtons />
        {isReadingMode && <ReadingModeExitButton />}
      </div>
    </div>
  );
};

const Header: React.FC<any> = ({ onMenuClick, onSettingsClick, isSettingsOpen, setSettingsOpen, isLoggedIn, handleLogout }) => {
    return (
        <header className="sticky top-0 bg-white/80 dark:bg-dark-blue/80 backdrop-blur-md z-30 flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuClick} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><Menu size={20}/></button>
                <Link to="/" className="flex items-center gap-2">
                    <BookOpen className="text-emerald-dark dark:text-emerald-light" />
                    <h1 className="text-lg font-bold text-emerald-dark dark:text-emerald-light">IQRO Quran</h1>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <button className="hidden sm:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Instal Aplikasi"><Download size={20}/></button>
                <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><HomeIcon size={20}/></Link>
                <div className="relative">
                    <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><Cog size={20}/></button>
                    <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                </div>
            </div>
        </header>
    );
};

const Sidebar: React.FC<any> = ({ isSidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { t } = useTranslation();
    
    const mainNav = [
        { path: '/', icon: HomeIcon, label: t('dashboard') },
        { path: '/mushaf', icon: BookOpen, label: t('mushaf') },
        { path: '/iqro', icon: SpeakingHeadIcon, label: t('learnIqro') },
        { path: '/murotal', icon: Headphones, label: t('murotal') },
        { path: '/tafsir', icon: BookText, label: t('tafsir') },
        { path: '/doa', icon: BookHeart, label: t('prayers') },
        { path: '/rekam', icon: Mic, label: t('record') },
        { path: '/doa-keluarga', icon: Users, label: t('familyPrayer') },
    ];

    const supportNav = [
        { path: '/bookmarks', icon: Bookmark, label: t('bookmark') },
        { path: '#', icon: Mail, label: t('contactUs') },
        { path: '#', icon: Heart, label: t('supportUs') },
        { path: '/privacy', icon: ShieldCheck, label: t('privacyPolicy') },
        { path: '/terms', icon: FileText, label: t('termsOfService') },
        { path: '/faq', icon: HelpCircle, label: t('faq') },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-blue-card border-r border-gray-100 dark:border-gray-800 z-40 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-emerald-dark" />
                    <h1 className="text-2xl font-bold text-emerald-dark">IQRO</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
                <nav className="space-y-1">
                    {mainNav.map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === item.path ? 'bg-emerald-dark/10 text-emerald-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <item.icon size={18} className={location.pathname === item.path ? 'text-emerald-dark' : ''}/> 
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>

                <nav className="space-y-1">
                    {supportNav.map(item => (
                        <Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === item.path ? 'bg-emerald-dark/10 text-emerald-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <item.icon size={18}/> 
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 text-center space-y-1">
                <p className="text-[10px] text-gray-400 font-medium">System V.2.0</p>
                <p className="text-[10px] text-gray-400">Te_eR™ Inovative @2026</p>
            </div>
        </aside>
    );
};

const BottomNav: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { path: '/iqro', icon: SpeakingHeadIcon, label: 'Iqro' },
        { path: '/tafsir', icon: BookText, label: 'Tafsir' },
        { path: '/mushaf', icon: BookOpen, label: 'Mushaf', isLarge: true },
        { path: '/murotal', icon: Headphones, label: 'Murotal' },
        { path: '/rekam', icon: Mic, label: 'Rekam' }
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-dark-blue-card/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex justify-around items-center p-2 md:hidden z-30">
            {navItems.map((item, index) => (
                <Link 
                    key={index} 
                    to={item.path} 
                    className={`flex flex-col items-center justify-center transition-all ${
                        item.isLarge ? 'relative -top-4 bg-emerald-dark text-white p-4 rounded-full shadow-xl ring-4 ring-soft-white dark:ring-dark-blue' : 'p-2'
                    } ${location.pathname === item.path && !item.isLarge ? 'text-emerald-dark' : 'text-gray-400'}`}
                >
                    <item.icon size={item.isLarge ? 32 : 24}/>
                    {!item.isLarge && <span className="text-[10px] mt-1 font-semibold">{item.label}</span>}
                </Link>
            ))}
        </nav>
    );
};

export default App;
