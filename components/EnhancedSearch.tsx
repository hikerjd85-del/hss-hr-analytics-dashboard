import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { DASHBOARD_ITEMS } from '../constants';

interface EnhancedSearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    isDarkMode: boolean;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ searchTerm, onSearch, isDarkMode }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem('hss-recent-searches');
        return saved ? JSON.parse(saved) : [];
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Popular/suggested searches
    const suggestions = ['Overtime', 'Turnover', 'Vacancy', 'New Hires', 'Retirement Risk'];

    // Filter matching items
    const matchingItems = searchTerm.length > 0
        ? DASHBOARD_ITEMS.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5)
        : [];

    // Save to recent searches
    const handleSearchSubmit = (term: string) => {
        if (term.trim() && !recentSearches.includes(term)) {
            const updated = [term, ...recentSearches.slice(0, 4)];
            setRecentSearches(updated);
            localStorage.setItem('hss-recent-searches', JSON.stringify(updated));
        }
        onSearch(term);
        inputRef.current?.blur();
    };

    // Clear recent searches
    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('hss-recent-searches');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showDropdown = isFocused && (recentSearches.length > 0 || searchTerm.length > 0 || suggestions.length > 0);

    return (
        <div ref={dropdownRef} className="relative">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search size={14} className="text-slate-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search metrics..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
                    className={`
            w-48 pl-8 pr-2 py-1.5 border rounded-lg text-sm placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-[#78be20] transition-all
            ${isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700'
                            : 'bg-slate-50 border-slate-200 focus:bg-white'
                        }
            ${isFocused ? 'w-64' : ''}
          `}
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearch('')}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                        <X size={14} className="text-slate-400 hover:text-slate-600" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className={`
          absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-50 overflow-hidden
          animate-fade-in
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
                    {/* Matching Items */}
                    {matchingItems.length > 0 && (
                        <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                            <div className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Metrics</div>
                            {matchingItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSearchSubmit(item.title)}
                                    className={`
                    w-full px-3 py-2 text-left text-sm rounded-lg flex items-center gap-2
                    ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'}
                  `}
                                >
                                    <div className={`w-2 h-2 rounded-full ${item.theme === 'orange' ? 'bg-orange-500' :
                                            item.theme === 'green' ? 'bg-emerald-500' : 'bg-violet-500'
                                        }`} />
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && searchTerm.length === 0 && (
                        <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between px-2 mb-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                    <Clock size={10} /> Recent
                                </div>
                                <button onClick={clearRecent} className="text-[10px] text-slate-400 hover:text-rose-500">
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((term, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSearchSubmit(term)}
                                    className={`
                    w-full px-3 py-2 text-left text-sm rounded-lg
                    ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'}
                  `}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Suggestions */}
                    {searchTerm.length === 0 && (
                        <div className="p-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1 flex items-center gap-1">
                                <TrendingUp size={10} /> Popular
                            </div>
                            <div className="flex flex-wrap gap-1.5 px-2">
                                {suggestions.map((term, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSearchSubmit(term)}
                                        className={`
                      px-2 py-1 text-xs rounded-full font-medium transition-colors
                      ${isDarkMode
                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }
                    `}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
