
import React from 'react';

const Footer: React.FC<{t: any}> = ({ t }) => {
  return (
    <footer className="mt-12 py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1121] transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center w-full">
          <p className="text-sm font-black text-slate-400 dark:text-slate-600 tracking-tight">
            Te_eR™ Innovative @2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
