import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface MorningBriefingProps {
    username: string;
    onClose?: () => void;
}

export const MorningBriefing: React.FC<MorningBriefingProps> = ({ username, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    if (!isVisible) return null;

    return (
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl animate-slide-up">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">

                {/* Left: Greeting & high-level Status */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Sun className="text-yellow-300" size={28} />
                        {greeting}, {username.split(' ')[0]}
                    </h2>
                    <p className="text-blue-100 text-lg opacity-90 mb-6">
                        Here is your daily operational briefing.
                    </p>

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                            <span className="block text-xs text-blue-200 uppercase tracking-wider font-semibold">System Status</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="font-bold">Operational</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                            <span className="block text-xs text-blue-200 uppercase tracking-wider font-semibold">Data Freshness</span>
                            <div className="flex items-center gap-2 mt-1">
                                <CheckCircle size={14} className="text-emerald-400" />
                                <span className="font-bold">Updated 08:30 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Key Insights Cards */}
                <div className="flex-1 grid gap-3">
                    <div className="bg-white/10 hover:bg-white/15 transition-colors p-3 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-md cursor-pointer group">
                        <div className="p-2 bg-rose-500/20 rounded-lg text-rose-200 group-hover:bg-rose-500 group-hover:text-white transition-all">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Critical: North Zone Overtime</h4>
                            <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                                Overtime usage in Clinical wards has spiked <span className="font-bold text-white">+12%</span> vs last week average.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/10 hover:bg-white/15 transition-colors p-3 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-md cursor-pointer group">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-200 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Win: Recruitment Velocity</h4>
                            <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                                Time-to-fill for Nursing roles dropped to <span className="font-bold text-white">42 days</span> (Target: 45 days).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
