import React, { useState } from 'react';
import { DashboardTile } from './DashboardTile';
import { DashboardItem } from '../types';
import { DASHBOARD_ITEMS } from '../constants';
import { OPERATIONAL_ALERTS, EXECUTIVE_BRIEFINGS } from '../data/mockData';
import {
   AlertTriangle, Clock, Activity, UserMinus, TrendingUp, Layers, Users, Briefcase,
   Sparkles, ArrowUpRight, AlertCircle, TrendingDown, ChevronUp, ChevronDown, Bell
} from 'lucide-react';

interface DashboardGridProps {
   onItemClick: (item: DashboardItem) => void;
   title?: string;
   description?: string;
   isDarkMode?: boolean;
   showOrgBanner?: boolean;
   showAIBriefing?: boolean;
   searchTerm?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
   onItemClick,
   title = "Overview",
   description = "Access key performance indicators and workforce trends across Health & Social Services (HSS).",
   isDarkMode,
   showOrgBanner = false,
   showAIBriefing = false,
   searchTerm = ''
}) => {
   const [alertsCollapsed, setAlertsCollapsed] = useState(false);

   // Categorized Items
   const compItems = DASHBOARD_ITEMS.filter(i => i.theme === 'orange');
   const workforceItems = DASHBOARD_ITEMS.filter(i => i.theme === 'green');
   const talentItems = DASHBOARD_ITEMS.filter(i => i.theme === 'purple');

   const filteredItems = DASHBOARD_ITEMS.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleBriefingClick = (id: string) => {
      const item = DASHBOARD_ITEMS.find(i => i.id === id);
      if (item) {
         onItemClick(item);
      }
   };

   return (
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">

         {/* Title Section with improved Typography */}
         {!searchTerm && (
            <div className="mb-10 relative">
               <h2 className="text-4xl font-extrabold text-[#002f56] dark:text-white tracking-tight mb-3">
                  {title}
               </h2>
               <div className="w-16 h-1.5 bg-gradient-to-r from-[#78be20] to-emerald-400 rounded-full mb-4"></div>
               <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl leading-relaxed font-medium">
                  {description}
               </p>
            </div>
         )}

         {/* --- ACTIVE ALERTS (COMMAND CENTER) --- */}
         {showOrgBanner && !searchTerm && (
            <div className="mb-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
               {/* Header */}
               <div
                  className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer"
                  onClick={() => setAlertsCollapsed(!alertsCollapsed)}
               >
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Bell size={18} className="text-rose-500" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
                     </div>
                     <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Operational Risks</h3>
                     <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full border border-rose-200 dark:border-rose-800">{OPERATIONAL_ALERTS.length} Active</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                     {alertsCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
               </div>

               {/* Content */}
               {!alertsCollapsed && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/30">
                     {OPERATIONAL_ALERTS.map(alert => (
                        <AlertCard
                           key={alert.id}
                           icon={alert.iconName === 'Clock' ? Clock : alert.iconName === 'Activity' ? Activity : alert.iconName === 'UserMinus' ? UserMinus : TrendingDown}
                           color={alert.theme === 'orange' ? 'rose' : alert.theme === 'purple' ? 'blue' : 'emerald'}
                           title={alert.title}
                           value={alert.metric.value}
                           subtitle={alert.metric.subtitle}
                           onClick={() => handleBriefingClick(alert.id)}
                        />
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* --- AI EXECUTIVE BRIEFING --- */}
         {showAIBriefing && (
            <div className="mb-12 bg-gradient-to-br from-indigo-900 via-[#002f56] to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
               {/* Background elements removed for cleaner look */}
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Sparkles size={24} className="text-indigo-300" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold">AI Executive Briefing</h2>
                        <p className="text-indigo-200 text-sm">Automated insights based on latest 24h data ingestion.</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {EXECUTIVE_BRIEFINGS.map(brief => (
                        <div key={brief.id} onClick={() => handleBriefingClick(brief.id)} className="glass-panel bg-white/5 border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex justify-between mb-2">
                              <span className={`text-[10px] font-bold ${brief.type === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'} text-white px-2 py-0.5 rounded`}>{brief.type}</span>
                              <ArrowUpRight className="text-white/50" size={16} />
                           </div>
                           <h3 className="font-bold mb-1">{brief.title}</h3>
                           <p className="text-sm text-indigo-100 opacity-80">{brief.content}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* --- GRID SECTIONS --- */}
         {searchTerm ? (
            <>
               <div className="mb-8"><h2 className="text-3xl font-bold text-slate-800 dark:text-white">Results for "{searchTerm}"</h2></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map(item => <DashboardTile key={item.id} item={item} onClick={onItemClick} isDarkMode={isDarkMode} />)}
               </div>
            </>
         ) : (
            <>
               <SectionHeader icon={Layers} title="Compensation & Utilization" color="text-orange-500" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {compItems.map(item => <DashboardTile key={item.id} item={item} onClick={onItemClick} isDarkMode={isDarkMode} />)}
               </div>

               <SectionHeader icon={Briefcase} title="Workforce Dynamics" color="text-emerald-500" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {workforceItems.map(item => <DashboardTile key={item.id} item={item} onClick={onItemClick} isDarkMode={isDarkMode} />)}
               </div>

               <SectionHeader icon={Users} title="Talent Acquisition" color="text-violet-500" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {talentItems.map(item => <DashboardTile key={item.id} item={item} onClick={onItemClick} isDarkMode={isDarkMode} />)}
               </div>
            </>
         )}
      </div>
   );
};

// --- Sub Components ---

const AlertCard = ({ icon: Icon, color, title, value, subtitle, onClick }: any) => {
   const colors: any = {
      rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', bar: 'bg-rose-500' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', bar: 'bg-orange-500' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', bar: 'bg-blue-500' },
      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bar: 'bg-emerald-500' },
   };
   const c = colors[color];

   return (
      <div
         onClick={onClick}
         className={`
            relative overflow-hidden rounded-xl border ${c.border} bg-white dark:bg-slate-800 
            p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group
         `}
      >
         <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
               <Icon size={18} />
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.border} ${c.text} bg-white dark:bg-slate-900`}>
               Action Req.
            </div>
         </div>
         <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</h4>
            <div className="flex items-end gap-2 mt-1">
               <span className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{value}</span>
               <span className="text-[10px] font-medium text-slate-400 mb-0.5">{subtitle}</span>
            </div>
         </div>
         <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700">
            <div className={`h-full ${c.bar} w-[70%]`}></div>
         </div>
      </div>
   )
};

const SectionHeader = ({ icon: Icon, title, color }: any) => (
   <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
      <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 ${color}`}>
         <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h3>
   </div>
);