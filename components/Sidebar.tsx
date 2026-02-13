import React from 'react';
import { LayoutGrid, PieChart, FileText, Settings, Users, HelpCircle, LogOut, ChevronRight, Briefcase, Zap } from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
    currentTab: ViewTab;
    onTabChange: (tab: ViewTab) => void;
    onLogout: () => void;
    username: string;
}

// Precise Interlocking HSS Logo
const HSSIcon = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="sidebarLogoClip">
                <circle cx="50" cy="50" r="50" />
            </clipPath>
        </defs>
        <g clipPath="url(#sidebarLogoClip)">
            <g strokeWidth={10} fill="none" strokeLinecap="butt">
                {/* Top Green Part */}
                <g stroke="#78be20" transform="translate(0, -1.5)">
                    <path d="M 43 50 A 7 7 0 0 1 50 43 L 100 43" />
                    <path d="M 31 50 A 19 19 0 0 1 50 31 L 100 31" />
                    <path d="M 19 50 A 31 31 0 0 1 50 19 L 100 19" />
                    <path d="M 7 50 A 43 43 0 0 1 50 7 L 100 7" />
                </g>
                {/* Bottom Blue Part */}
                <g stroke="#002f56" transform="translate(0, 1.5)">
                    <path d="M 57 50 A 7 7 0 0 1 50 57 L 0 57" />
                    <path d="M 69 50 A 19 19 0 0 1 50 69 L 0 69" />
                    <path d="M 81 50 A 31 31 0 0 1 50 81 L 0 81" />
                    <path d="M 93 50 A 43 43 0 0 1 50 93 L 0 93" />
                </g>
            </g>
        </g>
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onLogout, username }) => {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'analytics', label: 'Executive View', icon: PieChart },
        { id: 'reports', label: 'Reports', icon: FileText },
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
            <div className="p-6 pb-8 flex items-center gap-3 relative z-10">
                <div className="bg-white rounded-full p-1 shadow-lg shrink-0">
                    <HSSIcon />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Health Shared <br /><span className="text-[#78be20]">Services</span></h1>
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
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${currentTab === item.id
                                    ? 'bg-gradient-to-r from-[#78be20] to-[#5da310] text-white shadow-lg shadow-green-900/20'
                                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={`${currentTab === item.id ? 'text-white' : 'text-blue-300 group-hover:text-white transition-colors'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {currentTab === item.id && <ChevronRight size={14} className="opacity-80" />}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">Workspace</p>
                    {secondaryNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange('construction')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/70 hover:bg-white/5 hover:text-white transition-all group"
                        >
                            <item.icon size={18} className="text-blue-300/70 group-hover:text-white transition-colors" />
                            <span className="flex-1 text-left">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div>
                    <p className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">System</p>
                    {bottomNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange('construction')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/70 hover:bg-white/5 hover:text-white transition-all group"
                        >
                            <item.icon size={18} className="text-blue-300/70 group-hover:text-white transition-colors" />
                            <span className="flex-1 text-left">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 m-4 bg-[#001e38]/50 rounded-2xl border border-white/5 relative z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg text-white ring-2 ring-white/10">
                        {username.substring(0, 2).toUpperCase()}
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
