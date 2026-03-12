import React, { useState, useEffect } from 'react';
import { Sun, TrendingUp, AlertTriangle, CheckCircle, ChevronDown, Sunrise, CloudMoon } from 'lucide-react';

interface MorningBriefingProps {
    username: string;
    onClose?: () => void;
}

export const MorningBriefing: React.FC<MorningBriefingProps> = ({ username, onClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [GreetingIcon, setGreetingIcon] = useState<any>(() => Sun);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) { setGreeting('Good morning'); setGreetingIcon(() => Sunrise); }
        else if (hour < 18) { setGreeting('Good afternoon'); setGreetingIcon(() => Sun); }
        else { setGreeting('Good evening'); setGreetingIcon(() => CloudMoon); }
    }, []);

    return (
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001e38] via-[#002f56] to-[#003f73] text-white shadow-xl animate-slide-up border border-blue-500/10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            {/* Collapsed Header Bar — always visible */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="relative z-10 w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <GreetingIcon className="text-yellow-300" size={22} />
                    <span className="text-lg font-bold">{greeting}, {username.split(' ')[0]}</span>
                    {isCollapsed && (
                        <span className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full text-blue-200 ml-2 animate-fade-in">
                            2 alerts • System operational
                        </span>
                    )}
                </div>
                <ChevronDown
                    size={18}
                    className={`text-blue-300 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
                />
            </button>

            {/* Expandable Content */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
                <div className="relative z-10 px-6 pb-6 flex flex-col md:flex-row gap-6">

                    {/* Left: Status Badges */}
                    <div className="flex-1">
                        <p className="text-blue-200 text-sm opacity-90 mb-4">
                            Here is your daily operational briefing.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                <span className="block text-xs text-blue-300 uppercase tracking-wider font-semibold">System Status</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="font-bold text-sm">Operational</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                <span className="block text-xs text-blue-300 uppercase tracking-wider font-semibold">Data Freshness</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    <span className="font-bold text-sm">Updated 08:30 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Insights Cards */}
                    <div className="flex-1 grid gap-3">
                        <div className="bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-xl border border-white/5 flex items-start gap-3 backdrop-blur-md cursor-pointer group">
                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-all shrink-0">
                                <AlertTriangle size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">🔴 Critical: North Zone Overtime</h4>
                                <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
                                    Overtime usage in Clinical wards has spiked <span className="font-bold text-white">+12%</span> vs last week average.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-xl border border-white/5 flex items-start gap-3 backdrop-blur-md cursor-pointer group">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">🟢 Win: Recruitment Velocity</h4>
                                <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
                                    Time-to-fill for Nursing roles dropped to <span className="font-bold text-white">42 days</span> (Target: 45 days).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
