
import React, { useState } from 'react';
import { Settings, X, Maximize2, Moon, Sun, ZoomIn, ZoomOut, BookMarked } from 'lucide-react';

interface SettingsMenuProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  zoom: number;
  setZoom: (val: number) => void;
  isReadingMode: boolean;
  setIsReadingMode: (val: boolean) => void;
  t: any;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ darkMode, setDarkMode, zoom, setZoom, isReadingMode, setIsReadingMode, t }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all duration-300 text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95"
        aria-label="Settings"
      >
        <Settings size={26} className={`transition-transform duration-700 ease-in-out ${isOpen ? 'rotate-180 text-emerald-600' : 'group-hover:rotate-45'}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] backdrop-blur-sm bg-black/30" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full mt-4 right-0 w-80 bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border-2 border-slate-50 dark:border-slate-800 z-[70] p-10 animate-in slide-in-from-top-4 zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Settings</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              {/* Reading Mode Toggle */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest"><BookMarked size={16} className="text-emerald-500" /> Reading Mode</label>
                <button 
                  onClick={() => { setIsReadingMode(!isReadingMode); setIsOpen(false); }}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-sm uppercase ${isReadingMode ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {isReadingMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest"><Maximize2 size={16} className="text-blue-500" /> Scale Tampilan</label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-inner">
                  <button onClick={() => setZoom(Math.max(0.7, zoom - 0.1))} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-md hover:bg-emerald-500 hover:text-white transition-all"><ZoomOut size={18}/></button>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-md hover:bg-emerald-500 hover:text-white transition-all"><ZoomIn size={18}/></button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest"><Sun size={16} className="text-amber-500" /> Theme Mode</label>
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                  <button 
                    onClick={() => setDarkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!darkMode ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button 
                    onClick={() => setDarkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${darkMode ? 'bg-slate-700 shadow-xl text-amber-400' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsMenu;
