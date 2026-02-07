import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import {
  ArrowLeft, Filter, ChevronRight, Download, Share2, HelpCircle,
  Info, Calendar, MapPin, Users, Briefcase, Building2, Home, ChevronLeft
} from 'lucide-react';
import { DashboardItem } from '../types';

interface DetailViewProps {
  item: DashboardItem;
  onBack: () => void;
  isDarkMode?: boolean;
}

// --- Mock Data Generators ---
const generateBreakdownData = (itemId: string, filters: { year: string; zone: string | null; search: string }) => {
  const isHours = itemId.includes('hours') || itemId.includes('overtime');

  // Scale adjustment based on global filters
  let scale = isHours ? 100000 : 1000;
  let base = isHours ? 20 : 95;
  let variance = isHours ? 50 : 25;

  // If a specific zone is selected, reduce the total volume significantly to simulate filtering
  if (filters.zone) {
    scale = scale * 0.25; // Approximate share of a single zone
  }

  // If search is active, further reduce
  if (filters.search) {
    scale = scale * 0.1;
  }

  const total = Math.floor(Math.random() * variance * scale) + (base * scale);
  const target = Math.floor(total * 0.95);

  // If filtered by zone, only show that zone in the distribution chart with 100% value, others 0
  const zones = [
    { name: 'Calgary', value: filters.zone && filters.zone !== 'Calgary' ? 0 : Math.floor(total * (filters.zone ? 1 : 0.38)) },
    { name: 'Edmonton', value: filters.zone && filters.zone !== 'Edmonton' ? 0 : Math.floor(total * (filters.zone ? 1 : 0.35)) },
    { name: 'Central', value: filters.zone && filters.zone !== 'Central' ? 0 : Math.floor(total * (filters.zone ? 1 : 0.12)) },
    { name: 'North', value: filters.zone && filters.zone !== 'North' ? 0 : Math.floor(total * (filters.zone ? 1 : 0.09)) },
    { name: 'South', value: filters.zone && filters.zone !== 'South' ? 0 : Math.floor(total * (filters.zone ? 1 : 0.06)) },
  ];

  // Re-distribute other metrics based on the new filtered total
  const unions = [
    { name: 'UNA', value: Math.floor(total * 0.32) },
    { name: 'AUPE GSS', value: Math.floor(total * 0.28) },
    { name: 'HSAA', value: Math.floor(total * 0.18) },
    { name: 'AUPE AUX', value: Math.floor(total * 0.15) },
    { name: 'NUEE', value: Math.floor(total * 0.05) },
    { name: 'PARA', value: Math.floor(total * 0.02) },
  ];

  const classification = [
    { name: 'RFT (Reg Full-time)', value: Math.floor(total * 0.45) },
    { name: 'RPT (Reg Part-time)', value: Math.floor(total * 0.35) },
    { name: 'CAS (Casual)', value: Math.floor(total * 0.10) },
    { name: 'TFT (Temp Full-time)', value: Math.floor(total * 0.05) },
    { name: 'TPT (Temp Part-time)', value: Math.floor(total * 0.05) },
  ];

  const clinical = [
    { name: 'Clinical', value: Math.floor(total * 0.78), color: '#3b82f6' },
    { name: 'Non-Clinical', value: Math.floor(total * 0.22), color: '#64748b' },
  ];

  return { total, target, zones, unions, classification, clinical };
};

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, isDarkMode }) => {
  const [activeYear, setActiveYear] = useState('FY 2026');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const data = useMemo(() => generateBreakdownData(item.id, {
    year: activeYear,
    zone: selectedZone,
    search: searchTerm
  }), [item.id, activeYear, selectedZone, searchTerm]);

  // Theme colors
  const themeColor = item.theme === 'orange' ? '#f97316' : item.theme === 'green' ? '#10b981' : '#8b5cf6';
  const barColor = item.theme === 'orange' ? '#fdba74' : item.theme === 'green' ? '#86efac' : '#c4b5fd';

  // Chart Styling
  const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';
  const textFill = isDarkMode ? '#94a3b8' : '#64748b';

  // ... (maintain CustomTooltip)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl text-xs font-medium min-w-[150px]">
          <p className="mb-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{label ? label : payload[0].name}</p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 dark:text-slate-300">Actual:</span>
            <span className="font-bold" style={{ color: themeColor }}>{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-current opacity-50" style={{ color: themeColor, width: '75%' }}></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in transition-colors relative">

      {/* ... (breadcrumb and main content wrapper same as before) */}
      <div className={`flex-grow p-6 lg:p-10 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
          <div className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={onBack}>
            <Home size={12} />
            <span>Dashboard</span>
          </div>
          <ChevronRight size={12} />
          <span className="text-slate-800 dark:text-slate-200">{item.theme} Metrics</span>
          <ChevronRight size={12} />
          <span className={item.theme === 'orange' ? 'text-orange-600' : item.theme === 'green' ? 'text-emerald-600' : 'text-violet-600'}>
            {item.title}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md group"
            >
              <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{item.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Enterprise Reporting • {activeYear}</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm ${sidebarOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
            >
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#002f56] text-white rounded-xl text-sm font-bold hover:bg-[#003f73] transition-all shadow-md shadow-blue-900/20">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Top Metric Card (Hero) */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-white/20 dark:border-slate-700 mb-8 relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-2 h-full bg-${item.theme}-500`}></div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart size={120} className="text-slate-900 dark:text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total YTD Volume</span>
                {selectedZone && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">{selectedZone} Only</span>}
              </div>
              <div className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                {data.total.toLocaleString()}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                  +4.2% vs Last Year
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Target: <span className="font-mono font-semibold">{data.target.toLocaleString()}</span>
                </span>
              </div>
            </div>
            {/* ... Mini Chart ... */}
            <div className="h-24 w-48 hidden md:block">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.zones}>
                  <Bar dataKey="value" fill={themeColor} radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ... (Charts rows same as before) ... */}
        {/* ROW 1: Geographic Distribution */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Geographic Distribution</h3>
            <button className="text-slate-400 hover:text-slate-600"><Info size={18} /></button>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.zones} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textFill, fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textFill, fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc', opacity: 0.5 }} />
                <ReferenceLine y={data.total / 5} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#94a3b8', fontSize: 10 }} />
                <Bar dataKey="value" fill={themeColor} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2: Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BreakdownCard title="Union Breakdown" data={data.unions} total={data.total} color={barColor} />
          <BreakdownCard title="Employee Classification" data={data.classification} total={data.total} color={barColor} />
        </div>

      </div>

      {/* --- Collapsible Filter Drawer (Right) --- */}
      <div
        className={`
            fixed right-0 top-20 h-[calc(100vh-80px)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
            border-l border-slate-200 dark:border-slate-700 shadow-2xl z-40
            transition-transform duration-300 ease-in-out w-80 p-6 overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
         `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Filters</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <ChevronRight className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <FilterGroup icon={Calendar} label="Fiscal Year">
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
            >
              <option>FY 2026</option>
              <option>FY 2025</option>
              <option>FY 2024</option>
            </select>
          </FilterGroup>

          <FilterGroup icon={MapPin} label="Zone">
            <div className="grid grid-cols-2 gap-2">
              {['North', 'Edmonton', 'Central', 'Calgary', 'South'].map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(selectedZone === z ? null : z)}
                  className={`
                        text-xs font-medium px-3 py-2 rounded-lg border transition-all text-left
                        ${selectedZone === z
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400'
                    }
                      `}
                >
                  {z}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup icon={Building2} label="Functional Center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
            />
          </FilterGroup>

          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Export Data</h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Download current view as CSV or PDF.</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

const FilterGroup = ({ icon: Icon, label, children }: any) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-slate-400" />
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
    {children}
  </div>
);

const BreakdownCard = ({ title, data, total, color }: any) => (
  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 flex flex-col h-full">
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">{title}</h3>
    <div className="flex-grow space-y-4">
      {data.map((item: any, i: number) => (
        <div key={i} className="group">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
            <span className="text-slate-900 dark:text-white">{item.value.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(item.value / total) * 180}%`, backgroundColor: color }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);