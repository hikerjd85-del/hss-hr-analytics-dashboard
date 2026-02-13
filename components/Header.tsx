import React from 'react';
import { Search, LayoutGrid, PieChart, LogOut, Sun, Moon, Command, ChevronDown, FileText, Calendar, Download } from 'lucide-react';
import { ViewTab } from '../types';
import { DateRangePicker } from './DateRangePicker';
import { EnhancedSearch } from './EnhancedSearch';

interface HeaderProps {
  currentTab: ViewTab;
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

// Minimal Top Bar for Context & Actions
export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onLogout, username, isDarkMode, toggleTheme, searchTerm, onSearch, dateRange, onDateRangeChange }) => {

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm"></div>

      <div className="w-full px-6 h-16 flex justify-between items-center gap-3 relative z-10">

        {/* Left: Page Title Context */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            {currentTab === 'overview' && 'Dashboard Overview'}
            {currentTab === 'analytics' && 'Executive Analytics'}
            {currentTab === 'reports' && 'Report Generator'}
            {currentTab === 'construction' && 'Workspace'}
          </h2>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced Search */}
          <div className="hidden md:block w-64 lg:w-96 transition-all">
            <EnhancedSearch
              searchTerm={searchTerm}
              onSearch={onSearch}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          {/* Date Range Picker */}
          <DateRangePicker
            selectedRange={dateRange}
            onRangeChange={onDateRangeChange}
            isDarkMode={isDarkMode}
          />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

        </div>
      </div>
    </header>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${active
      ? 'text-[#002f56] bg-white shadow-sm'
      : 'text-slate-500 hover:text-slate-700'}`}
  >
    <Icon size={14} className={active ? 'text-[#78be20]' : ''} />
    {label}
  </button>
);