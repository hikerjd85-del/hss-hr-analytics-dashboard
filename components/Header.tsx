import React, { useState } from 'react';
import { Search, Sun, Moon, X, Calendar } from 'lucide-react';
import { ViewTab, ViewMode } from '../types';
import { EnhancedSearch } from './EnhancedSearch';
import { Users, Globe } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onTabChange: (tab: ViewTab) => void;
  onLogout: () => void;
  username: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const DATE_PRESETS = ['YTD', 'Q4', 'Q3', 'Last Month', 'Custom'];

export const Header: React.FC<HeaderProps> = ({ currentTab, viewMode, onViewModeChange, onTabChange, onLogout, username, isDarkMode, toggleTheme, searchTerm, onSearch, dateRange, onDateRangeChange }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [themeKey, setThemeKey] = useState(0);

  const handleThemeToggle = () => {
    setThemeKey(prev => prev + 1);
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm"></div>

      <div className="w-full px-6 h-16 flex items-center gap-4 relative z-10">

        {/* Left: Page Title Context */}
        <div className="shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap">
            {currentTab === 'overview' && 'Overview'}
            {currentTab === 'analytics' && 'Executive View'}
            {currentTab === 'reports' && 'Reports'}
            {currentTab === 'copilot' && 'AI Copilot'}
            {currentTab === 'flightrisk' && 'Flight Risk'}
            {currentTab === 'scenarios' && 'Scenarios'}
            {currentTab === 'construction' && 'Workspace'}
          </h2>
        </div>

        <div className="flex-1"></div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('global')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'global'
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Globe size={14} />
              Global
            </button>
            <button
              onClick={() => onViewModeChange('team')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'team'
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Users size={14} />
              My Team
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Desktop Search */}
          <div className="hidden md:block w-64 lg:w-96 transition-all">
            <EnhancedSearch searchTerm={searchTerm} onSearch={onSearch} isDarkMode={isDarkMode} />
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <Search size={18} />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

          {/* Inline Date Presets */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <Calendar size={14} className="text-slate-400 mx-1" />
            {DATE_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => onDateRangeChange(preset.toLowerCase())}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${dateRange === preset.toLowerCase()
                    ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Theme Toggle with animation */}
          <button
            onClick={handleThemeToggle}
            className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="theme-icon-enter" key={themeKey}>
              {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search metrics, reports, analytics..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
                className="flex-1 text-lg font-medium text-slate-800 dark:text-white bg-transparent outline-none placeholder-slate-400"
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="text-xs text-slate-400 px-1">Press Esc to close</div>
          </div>
        </div>
      )}
    </header>
  );
};