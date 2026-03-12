import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

interface DateRangePickerProps {
    selectedRange: string;
    onRangeChange: (range: string) => void;
    isDarkMode: boolean;
}

const DATE_RANGES = [
    { id: 'last-7-days', label: 'Last 7 Days' },
    { id: 'last-30-days', label: 'Last 30 Days' },
    { id: 'last-3-months', label: 'Last 3 Months' },
    { id: 'last-6-months', label: 'Last 6 Months' },
    { id: 'ytd', label: 'Year to Date' },
    { id: 'last-year', label: 'Last Year' },
    { id: 'all-time', label: 'All Time' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    selectedRange,
    onRangeChange,
    isDarkMode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = DATE_RANGES.find(r => r.id === selectedRange)?.label || 'Select Range';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                    }
        `}
            >
                <Calendar size={14} className="text-slate-400" />
                <span>{selectedLabel}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`
          absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden
          animate-fade-in
          ${isDarkMode
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }
        `}>
                    {DATE_RANGES.map((range) => (
                        <button
                            key={range.id}
                            onClick={() => { onRangeChange(range.id); setIsOpen(false); }}
                            className={`
                w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
                transition-colors
                ${selectedRange === range.id
                                    ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900')
                                    : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50')
                                }
              `}
                        >
                            {range.label}
                            {selectedRange === range.id && (
                                <Check size={14} className="text-emerald-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
