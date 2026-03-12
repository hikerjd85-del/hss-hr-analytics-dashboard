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
          <span className="text-slate-400 dark:text-slate-500">Privacy Policy</span>
          <span className="text-slate-400 dark:text-slate-500">Terms of Service</span>
          <span className="text-slate-400 dark:text-slate-500">Support</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">v2.1.0</span>
          <span>© {new Date().getFullYear()} HRAP. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};