import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  ArrowLeft, Filter, Calendar, Download, Printer, 
  MoreHorizontal, Layers, TrendingUp, TrendingDown, Sparkles, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { DashboardItem } from '../types';

interface AdvancedAnalyticsViewProps {
  item: DashboardItem;
  onBack: () => void;
  isDarkMode?: boolean;
}

// --- Mock Data Generator for "Abstract/Professional" Look ---
const generateData = (seed: string) => {
  // Use simple hashing for stable "random" data per item
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseValue = (hash % 50) * 1000 + 50000; // Base ~50k-100k
  
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  const trendData = months.map((m, i) => {
    const seasonality = Math.sin(i / 1.5) * (baseValue * 0.1);
    const noise = (Math.random() - 0.5) * (baseValue * 0.05);
    const actual = Math.floor(baseValue + seasonality + noise);
    const budget = Math.floor(baseValue + (i * (baseValue * 0.01))); // Slight upward budget
    const forecast = i > 8 ? actual * 1.02 : null; // Forecast for last 3 months
    
    return {
      name: m,
      Actual: actual,
      Budget: budget,
      Forecast: forecast,
      Variance: ((actual - budget) / budget) * 100
    };
  });

  const zones = [
    { name: 'North Zone', value: 15, color: '#6366f1' },
    { name: 'Edmonton', value: 35, color: '#3b82f6' },
    { name: 'Central', value: 15, color: '#0ea5e9' },
    { name: 'Calgary', value: 30, color: '#06b6d4' },
    { name: 'South', value: 5, color: '#14b8a6' },
  ];

  // Adjust distribution based on hash to vary per page
  zones.forEach(z => z.value += (hash % 10) - 5);

  const tableData = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    site: `Site ${String.fromCharCode(65 + i)}-${100 + i}`,
    zone: zones[i % 5].name,
    manager: `Director ${String.fromCharCode(75 + i)}`,
    metricCurrent: Math.floor(baseValue / 20 + (Math.random() * 1000)),
    metricPrev: Math.floor(baseValue / 20 + (Math.random() * 1000)),
    status: Math.random() > 0.8 ? 'Critical' : Math.random() > 0.6 ? 'Review' : 'Good'
  }));

  return { trendData, zones, tableData, baseValue };
};

// --- Dynamic Insight Generator ---
const getInsights = (itemId: string, title: string) => {
  switch (itemId) {
    case 'overtime':
    case 'paid-hours':
    case 'worked-hours':
      return [
        {
          type: 'Critical',
          title: 'Safety Threshold Exceeded',
          desc: `Emergency Dept operating at >15% ${title} rate, exceeding safety guidelines for 3 consecutive weeks.`,
          rec: 'Immediate roster re-balancing required.',
          color: 'rose'
        },
        {
          type: 'Warning',
          title: 'Fatigue Risk Pattern',
          desc: 'Consecutive shift limit breaches have increased by 12% in the North Zone.',
          rec: 'Audit scheduling override codes.',
          color: 'amber'
        }
      ];
    case 'sick-hours':
      return [
        {
          type: 'Critical',
          title: 'Viral Cluster Detected',
          desc: 'Site A-102 showing 40% spike in short-term sick leave, strongly correlated with local flu season data.',
          rec: 'Deploy float pool to cover gaps.',
          color: 'rose'
        },
        {
          type: 'Warning',
          title: 'Mental Health Indicators',
          desc: 'Stress-related absence codes are trending up 8% YoY in high-acuity units.',
          rec: 'Review wellness support program uptake.',
          color: 'amber'
        }
      ];
    case 'vacancy':
    case 'recruitment':
    case 'new-hires':
       return [
        {
          type: 'Critical',
          title: 'Critical Care Coverage Gap',
          desc: 'ICU nursing vacancies are now impacting bed availability in 2 major metro sites.',
          rec: 'Expedite international hire credentials.',
          color: 'rose'
        },
        {
          type: 'Warning',
          title: 'Time-to-Fill Increasing',
          desc: 'Average recruitment cycle for specialized roles has extended by 14 days vs Q1.',
          rec: 'Review screening process bottlenecks.',
          color: 'amber'
        }
      ];
     case 'terminations':
     case 'retirements':
     case 'retirement-risk':
     case 'attrition':
     case 'internal-transfers':
       return [
        {
          type: 'Critical',
          title: 'High Performer Turnover',
          desc: 'Voluntary exit rate among top-rated Clinical Educators has doubled this quarter.',
          rec: 'Conduct deep-dive exit interviews.',
          color: 'rose'
        },
        {
          type: 'Warning',
          title: 'Retirement Cliff Acceleration',
          desc: 'Early retirement applications for Q4 are 20% above historical average.',
          rec: 'Activate succession planning protocols.',
          color: 'amber'
        }
      ];
    default:
      return [
        {
          type: 'Critical',
          title: 'Variance Detected',
          desc: `Unusual variance detected in ${title} across Edmonton Zone for the current period.`,
          rec: 'Investigate localized data anomalies.',
          color: 'rose'
        },
        {
          type: 'Warning',
          title: 'Trend Deviation',
          desc: 'Current trajectory deviates significantly from the 3-year historical baseline.',
          rec: 'Re-forecast Q4 expectations.',
          color: 'amber'
        }
      ];
  }
};

export const AdvancedAnalyticsView: React.FC<AdvancedAnalyticsViewProps> = ({ item, onBack, isDarkMode }) => {
  const [fiscalYear, setFiscalYear] = useState('2023/24');
  
  // Memoize data so it doesn't regenerate on re-renders unless item changes
  const { trendData, zones, tableData } = useMemo(() => generateData(item.id), [item.id]);

  // Generate specific insights for this item
  const insights = useMemo(() => getInsights(item.id, item.title), [item.id, item.title]);

  // Theme Logic
  const accentColor = item.theme === 'orange' ? '#f59e0b' : item.theme === 'green' ? '#10b981' : '#8b5cf6';
  
  // Chart Colors
  const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';
  const textFill = isDarkMode ? '#94a3b8' : '#94a3b8';
  const budgetStroke = isDarkMode ? '#475569' : '#cbd5e1';

  // KPI Calculation
  const totalActual = trendData.reduce((acc, curr) => acc + curr.Actual, 0);
  const totalBudget = trendData.reduce((acc, curr) => acc + curr.Budget, 0);
  const variance = ((totalActual - totalBudget) / totalBudget) * 100;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 pb-12 w-full animate-in fade-in duration-500 transition-colors">
      
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-20 z-40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{item.title} Analytics</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                FY {fiscalYear}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Performance Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Bar */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded shadow-sm border border-slate-200 dark:border-slate-600">
              <Calendar size={14} className="text-slate-400" />
              {fiscalYear}
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-2"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium rounded transition-colors">
              <Filter size={14} />
              All Zones
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium rounded transition-colors">
              <Layers size={14} />
              Union Exempt
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 mx-2 hidden md:block"></div>
          
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Export PDF">
            <Printer size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Download CSV">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* AI EXECUTIVE BRIEFING - NEW SECTION */}
        <div className="mb-10 bg-gradient-to-br from-indigo-900 via-[#002f56] to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
           {/* Abstract Background Shapes */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                    <Sparkles size={24} className="text-indigo-300" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold">AI Executive Briefing</h2>
                    <p className="text-indigo-200 text-sm">Automated insights based on latest 24h data ingestion.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Insight Card 1 */}
                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                       <span className={`bg-${insights[0].color}-500/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                          {insights[0].type}
                       </span>
                       <ArrowUpRight size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{insights[0].title}</h3>
                    <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                       {insights[0].desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                       <AlertCircle size={14} />
                       <span>Recommendation: {insights[0].rec}</span>
                    </div>
                 </div>

                 {/* Insight Card 2 */}
                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                       <span className={`bg-${insights[1].color}-500/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                          {insights[1].type}
                       </span>
                       <ArrowUpRight size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{insights[1].title}</h3>
                    <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                       {insights[1].desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                       <AlertCircle size={14} />
                       <span>Recommendation: {insights[1].rec}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Actual YTD" 
            value={totalActual.toLocaleString()} 
            trend={variance > 0 ? "+2.4%" : "-1.2%"} 
            isPositive={variance < 5} 
            itemTheme={item.theme}
            isDarkMode={isDarkMode}
          />
          <KPICard 
            title="Budget YTD" 
            value={totalBudget.toLocaleString()} 
            subValue="100% Utilization"
            itemTheme={item.theme}
            neutral
            isDarkMode={isDarkMode}
          />
          <KPICard 
            title="Variance" 
            value={`${variance.toFixed(1)}%`}
            trend="Needs Review"
            isPositive={false}
            itemTheme={item.theme}
            isDarkMode={isDarkMode}
          />
          <KPICard 
            title="Forecast (Year End)" 
            value={(totalActual * 1.2).toLocaleString()} 
            subValue="Confidence: High"
            itemTheme={item.theme}
            neutral
            isDarkMode={isDarkMode}
          />
        </div>

        {/* MAIN VISUALIZATION ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Trend Analysis: Actual vs Budget</h3>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background: accentColor}}></div>Actual</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>Budget</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-slate-300 dark:border-slate-500 border-dashed"></div>Forecast</span>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                  <defs>
                    <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textFill, fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: textFill, fontSize: 11}} />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000'}}
                  />
                  <Area type="monotone" dataKey="Actual" stroke={accentColor} fill="url(#fillColor)" strokeWidth={3} />
                  <Line type="monotone" dataKey="Budget" stroke={budgetStroke} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Forecast" stroke={accentColor} strokeWidth={2} dot={false} strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Regional Distribution</h3>
              <MoreHorizontal size={16} className="text-slate-400 cursor-pointer" />
            </div>
            
            <div className="flex-grow flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height={250}>
                 <PieChart>
                   <Pie
                     data={zones}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {zones.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                     ))}
                   </Pie>
                   <RechartsTooltip contentStyle={{backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'}} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-slate-800 dark:text-white">5</span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Zones</span>
               </div>
            </div>

            <div className="space-y-3 mt-2">
               {zones.map(z => (
                 <div key={z.name} className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{background: z.color}}></div>
                     <span className="text-slate-600 dark:text-slate-300 font-medium">{z.name}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{width: `${z.value}%`, background: z.color}}></div>
                     </div>
                     <span className="text-slate-500 dark:text-slate-400 w-8 text-right">{z.value}%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* DETAILED DATA TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
           <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
             <div className="flex items-center gap-3">
               <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Detailed Breakdown</h3>
               <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">Live Data</span>
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search site..." 
                  className="text-xs border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-slate-400"
                />
             </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead>
                 <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                   <th className="px-6 py-4">Facility / Site</th>
                   <th className="px-6 py-4">Zone</th>
                   <th className="px-6 py-4">Manager</th>
                   <th className="px-6 py-4 text-right">Current Period</th>
                   <th className="px-6 py-4 text-right">Prev Period</th>
                   <th className="px-6 py-4 text-right">Variance</th>
                   <th className="px-6 py-4 text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {tableData.map((row) => {
                   const rowVar = ((row.metricCurrent - row.metricPrev) / row.metricPrev) * 100;
                   return (
                     <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{row.site}</td>
                       <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.zone}</td>
                       <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-500 dark:text-slate-300">
                            {row.manager.charAt(9)}
                          </div>
                          {row.manager}
                       </td>
                       <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{row.metricCurrent.toLocaleString()}</td>
                       <td className="px-6 py-4 text-right font-mono text-slate-500 dark:text-slate-400">{row.metricPrev.toLocaleString()}</td>
                       <td className={`px-6 py-4 text-right font-medium ${rowVar > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                         {rowVar > 0 ? '+' : ''}{rowVar.toFixed(1)}%
                       </td>
                       <td className="px-6 py-4 text-center">
                         <span className={`
                           inline-block w-2 h-2 rounded-full
                           ${row.status === 'Good' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                             row.status === 'Review' ? 'bg-amber-400' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}
                         `}></span>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
           
           <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-400">
             <span>Showing 12 of 148 entries</span>
             <div className="flex gap-1">
               <button className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50">Prev</button>
               <button className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">1</button>
               <button className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded hover:bg-white dark:hover:bg-slate-700">2</button>
               <button className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded hover:bg-white dark:hover:bg-slate-700">Next</button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for KPI Cards
const KPICard = ({ title, value, subValue, trend, isPositive, neutral, itemTheme, isDarkMode }: any) => {
  const TrendIcon = trend && (isPositive ? TrendingUp : TrendingDown); 
  
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      {/* Subtle top border accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
        ${itemTheme === 'orange' ? 'from-orange-400 to-amber-300' : 
          itemTheme === 'green' ? 'from-emerald-400 to-teal-300' : 
          'from-violet-400 to-fuchsia-300'}`} 
      />
      
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
        {!neutral && trend && (
           <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
             {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
             {trend}
           </div>
        )}
      </div>
      
      <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1 group-hover:scale-105 transition-transform origin-left duration-300">
        {value}
      </div>
      
      {subValue && (
        <div className="text-xs text-slate-400 mt-2 font-medium">
          {subValue}
        </div>
      )}

      {/* Abstract Background Decoration */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700 opacity-50 group-hover:scale-150 transition-transform duration-500 z-0"></div>
    </div>
  );
};