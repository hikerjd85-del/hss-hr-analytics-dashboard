import React from 'react';

interface FooterProps {
  isDarkMode?: boolean;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode, onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('Privacy Policy')} className="hover:text-[#002f56] dark:hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => onNavigate('Terms of Service')} className="hover:text-[#002f56] dark:hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => onNavigate('Support')} className="hover:text-[#002f56] dark:hover:text-white transition-colors">Support</button>
        </div>
        <div>
          © {new Date().getFullYear()} HRAP. All rights reserved.
        </div>
      </div>
    </footer>
  );
};