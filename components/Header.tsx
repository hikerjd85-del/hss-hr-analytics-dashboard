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

// New HSS Logo with rounded curved arcs
const HSSIcon = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Green arcs (top/right) */}
    <path d="M 18 52 Q 18 18, 52 18 Q 86 18, 86 52" stroke="#78be20" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M 28 52 Q 28 28, 52 28 Q 76 28, 76 52" stroke="#78be20" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M 38 52 Q 38 38, 52 38 Q 66 38, 66 52" stroke="#78be20" strokeWidth="8" strokeLinecap="round" fill="none" />

    {/* Blue arcs (bottom/left) */}
    <path d="M 82 52 Q 82 82, 52 82 Q 22 82, 14 52" stroke="#002f56" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M 72 52 Q 72 72, 52 72 Q 32 72, 24 52" stroke="#002f56" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M 62 52 Q 62 62, 52 62 Q 42 62, 34 52" stroke="#002f56" strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onLogout, username, isDarkMode, toggleTheme, searchTerm, onSearch, dateRange, onDateRangeChange }) => {
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  const handleExport = () => {
    alert("Downloading CSV Report...");
    // Future: impl actual CSV gen
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-white/20 dark:border-white/5 shadow-sm"></div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center gap-3 relative z-10">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0">
            <div className="flex-shrink-0">
              <HSSIcon />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-[#002f56] dark:text-white leading-none">
                  Health Shared Services
                </h1>
                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1 py-0.5 rounded">BETA</span>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#78be20] mt-0.5">People Analytics</span>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden xl:block"></div>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <TabButton
              active={currentTab === 'overview'}
              onClick={() => onTabChange('overview')}
              icon={LayoutGrid}
              label="Overview"
            />
            <TabButton
              active={currentTab === 'analytics'}
              onClick={() => onTabChange('analytics')}
              icon={PieChart}
              label="Executive View"
            />
            <TabButton
              active={currentTab === 'reports'}
              onClick={() => onTabChange('reports')}
              icon={FileText}
              label="Reports"
            />
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Enhanced Search */}
          <div className="hidden md:block">
            <EnhancedSearch
              searchTerm={searchTerm}
              onSearch={onSearch}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            selectedRange={dateRange}
            onRangeChange={onDateRangeChange}
            isDarkMode={isDarkMode}
          />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 pl-2 group relative cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#002f56] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-slate-900 dark:text-white leading-none">{displayName}</div>
              <div className="text-xs text-slate-500 mt-0.5">Admin</div>
            </div>
            <ChevronDown size={12} className="text-slate-400" />

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>

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