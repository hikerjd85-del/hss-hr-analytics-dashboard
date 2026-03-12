import React from 'react';
import { LayoutGrid, PieChart, FileText, Settings, Users, HelpCircle, LogOut, ChevronRight, Briefcase, Zap, Sparkles, ShieldAlert, FlaskConical } from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
    currentTab: ViewTab;
    onTabChange: (tab: ViewTab) => void;
    onLogout: () => void;
    username: string;
}

// Organization Logo
const OrgIcon = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="40" width="25" height="40" rx="4" fill="#10b981" />
        <rect x="50" y="20" width="30" height="60" rx="4" fill="#3b82f6" />
        <circle cx="32.5" cy="25" r="8" fill="#f59e0b" />
        <rect x="60" y="35" width="10" height="5" rx="2" fill="white" />
        <rect x="60" y="50" width="10" height="5" rx="2" fill="white" />
        <rect x="60" y="65" width="10" height="5" rx="2" fill="white" />
        <rect x="27.5" y="55" width="10" height="5" rx="2" fill="white" />
        <rect x="27.5" y="65" width="10" height="5" rx="2" fill="white" />
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onLogout, username }) => {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'analytics', label: 'Executive View', icon: PieChart },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    const intelligenceNav = [
        { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
        { id: 'flightrisk', label: 'Flight Risk', icon: ShieldAlert },
        { id: 'scenarios', label: 'Scenario Planner', icon: FlaskConical },
    ];

    const secondaryNav = [
        { id: 'team', label: 'My Team', icon: Users },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'integrations', label: 'Integrations', icon: Zap },
    ];

    const bottomNav = [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];

    return (
        <aside className="w-72 h-screen sticky top-0 bg-[#002f56] text-white flex flex-col shadow-2xl z-50 overflow-hidden font-sans border-r border-[#001e38]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Logo Area */}
            <div className="p-6 pb-10 flex items-center gap-3 relative z-10">
                <div className="bg-white rounded-full p-1 shadow-lg shrink-0">
                    <OrgIcon />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight tracking-tight text-white">[Organization <br /><span className="text-blue-400">Name]</span></h1>
                </div>
            </div>

            {/* Main Nav */}
            <div className="flex-1 py-2 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 relative z-10">
                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">Main Dashboard</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as ViewTab)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${currentTab === item.id
                                    ? 'bg-gradient-to-r from-[#78be20] to-[#5da310] text-white shadow-lg shadow-green-900/20'
                                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {/* Left edge accent bar for active tab */}
                            {currentTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/30" />
                            )}
                            <item.icon size={20} className={`${currentTab === item.id ? 'text-white' : 'text-blue-300 group-hover:text-white transition-colors'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {currentTab === item.id && <ChevronRight size={14} className="opacity-80" />}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">Intelligence</p>
                    {intelligenceNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as ViewTab)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                                currentTab === item.id
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20'
                                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {currentTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/30" />
                            )}
                            <item.icon size={20} className={`${currentTab === item.id ? 'text-white' : 'text-violet-300 group-hover:text-white transition-colors'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {currentTab === item.id && <ChevronRight size={14} className="opacity-80" />}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">Workspace</p>
                    {secondaryNav.map((item) => (
                        <div
                            key={item.id}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/40 cursor-default group"
                        >
                            <item.icon size={18} className="text-blue-300/40" />
                            <span className="flex-1 text-left">{item.label}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-blue-300/50 border border-white/5">Soon</span>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">System</p>
                    {bottomNav.map((item) => (
                        <div
                            key={item.id}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/40 cursor-default group"
                        >
                            <item.icon size={18} className="text-blue-300/40" />
                            <span className="flex-1 text-left">{item.label}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-blue-300/50 border border-white/5">Soon</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Footer with Online Status */}
            <div className="p-4 m-4 bg-[#001e38]/50 rounded-2xl border border-white/5 relative z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg text-white ring-2 ring-white/10">
                            {username.substring(0, 2).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#001e38]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{username}</p>
                        <p className="text-[10px] text-blue-200 truncate">HR Administrator</p>
                    </div>
                    <button onClick={onLogout} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-400" title="Sign Out">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
