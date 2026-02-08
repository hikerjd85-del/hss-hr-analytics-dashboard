import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { DashboardItem, ViewTab } from '../types';

interface BreadcrumbsProps {
    currentTab: ViewTab;
    selectedItem: DashboardItem | null;
    onNavigateHome: () => void;
    onNavigateTab: (tab: ViewTab) => void;
    isDarkMode: boolean;
}

const TAB_LABELS: Record<ViewTab, string> = {
    overview: 'Overview',
    analytics: 'Executive View',
    reports: 'Reports',
    construction: 'Under Construction'
};

const THEME_LABELS: Record<string, string> = {
    orange: 'Scheduled Hours',
    green: 'Workforce Dynamics',
    purple: 'Talent Acquisition'
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    currentTab,
    selectedItem,
    onNavigateHome,
    onNavigateTab,
    isDarkMode
}) => {
    const crumbs: { label: string; onClick?: () => void }[] = [];

    // Home
    crumbs.push({
        label: 'Dashboard',
        onClick: onNavigateHome
    });

    // Tab level
    if (currentTab !== 'overview' || selectedItem) {
        crumbs.push({
            label: TAB_LABELS[currentTab],
            onClick: () => onNavigateTab(currentTab)
        });
    }

    // Category level (based on theme)
    if (selectedItem) {
        const category = THEME_LABELS[selectedItem.theme];
        if (category) {
            crumbs.push({
                label: category
            });
        }

        // Metric level
        crumbs.push({
            label: selectedItem.title
        });
    }

    return (
        <nav className={`flex items-center gap-1.5 text-sm px-6 py-3 border-b ${isDarkMode
                ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                : 'bg-white/80 border-slate-200 text-slate-600'
            }`}>
            {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <ChevronRight size={14} className="text-slate-400" />
                    )}
                    {index === 0 && (
                        <Home size={14} className="mr-1 text-slate-400" />
                    )}
                    {crumb.onClick && index < crumbs.length - 1 ? (
                        <button
                            onClick={crumb.onClick}
                            className={`hover:underline transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
                                }`}
                        >
                            {crumb.label}
                        </button>
                    ) : (
                        <span className={`font-medium ${index === crumbs.length - 1
                                ? (isDarkMode ? 'text-white' : 'text-slate-900')
                                : ''
                            }`}>
                            {crumb.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
