import React from 'react';
import {
   ArrowLeft, Clock, Filter, ChevronDown, Download, Share2, Printer,
   ArrowUp, ArrowRight, ArrowDown
} from 'lucide-react';
import {
   ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
   PieChart, Pie, Cell, Label
} from 'recharts';
import { DashboardItem } from '../types';

interface OvertimeViewProps {
   item: DashboardItem;
   onBack: () => void;
   isDarkMode?: boolean;
}

// --- Data based on Screenshot ---

const TREND_DATA = [
   { month: 'Apr 2025', val: 2.4, trend: 'flat' },
   { month: 'May 2025', val: 2.7, trend: 'up' },
   { month: 'Jun 2025', val: 2.8, trend: 'up' },
   { month: 'Jul 2025', val: 3.2, trend: 'up' },
   { month: 'Aug 2025', val: 3.2, trend: 'flat' },
   { month: 'Sep 2025', val: 2.9, trend: 'down' },
   { month: 'Oct 2025', val: 2.8, trend: 'down' },
   { month: 'Nov 2025', val: 2.8, trend: 'flat' },
   { month: 'Dec 2025', val: 3.1, trend: 'up' },
];

const UNION_DATA = [
   { name: 'AUNP', ot: 13572, rate: 3.4 },
   { name: 'AUPE AUX', ot: 474549, rate: 4.5 },
   { name: 'AUPE GSS', ot: 181637, rate: 0.9 },
   { name: 'HSAA', ot: 137173, rate: 1.1 },
   { name: 'NUEE', ot: 22381, rate: 0.5 },
   { name: 'PARA', ot: 0, rate: 0.0 },
   { name: 'UNA', ot: 1250375, rate: 5.5 },
];

const CLASS_DATA = [
   { name: 'BEC', ot: 3757, rate: 4.6 },
   { name: 'CAS', ot: 156048, rate: 2.1 },
   { name: 'RFT', ot: 915529, rate: 2.7 },
   { name: 'RPT', ot: 877870, rate: 3.7 },
   { name: 'STU', ot: 77, rate: 0.0 },
   { name: 'TFT', ot: 47361, rate: 2.2 },
   { name: 'TPT', ot: 79045, rate: 3.5 },
];

const CLINICAL_DATA = [
   { name: 'Clinical', value: 1987236, rate: 3.6, color: '#002f56' },
   { name: 'Non-Clinical', value: 92451, rate: 0.6, color: '#78be20' },
];

// Precise Interlocking HSS Logo Small
const HSSIconSmall = () => (
   <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <clipPath id="overtimeLogoClip">
            <circle cx="50" cy="50" r="50" />
         </clipPath>
      </defs>
      <g clipPath="url(#overtimeLogoClip)">
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

export const OvertimeView: React.FC<OvertimeViewProps> = ({ item, onBack, isDarkMode }) => {

   const textColor = isDarkMode ? '#e2e8f0' : '#334155';
   const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';

   return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors">
         {/* Top Header Strip specific to Report */}
         <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4 transition-colors">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                  <ArrowLeft size={20} />
               </button>

               <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <HSSIconSmall />
                  <div>
                     <h1 className="text-xl font-bold text-[#002f56] dark:text-white leading-tight">Overtime (OT) hours</h1>
                     <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-[#78be20] uppercase tracking-widest">People Analytics</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">Health Shared Services</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xl text-right hidden lg:block bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
               <span className="text-[#002f56] dark:text-blue-300 font-bold">Please Note:</span> Acute care, Assisted Living, and Primary Care data have been filtered. New public health agencies data may be included.
            </div>
         </div>

         <div className="flex-grow p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">

            {/* TOP ROW: KPI & Trend */}
            <div className="grid grid-cols-12 gap-6 h-auto md:h-32">
               {/* KPI BOX */}
               <div className="col-span-12 md:col-span-3 bg-white dark:bg-slate-800 border-2 border-[#002f56]/10 dark:border-slate-700 rounded-xl p-4 flex items-center gap-6 shadow-sm transition-colors">
                  <div className="w-16 h-16 rounded-full bg-[#002f56] flex items-center justify-center text-white shadow-lg shadow-[#002f56]/20">
                     <Clock size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-1 mb-1">FY 2026</div>
                     <div className="flex justify-between items-baseline gap-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">OT Hours</span>
                        <span className="text-2xl font-bold text-[#002f56] dark:text-white">2.08M</span>
                     </div>
                     <div className="flex justify-between items-baseline gap-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">OT % PH</span>
                        <span className="text-2xl font-bold text-[#78be20]">2.9%</span>
                     </div>
                  </div>
               </div>

               {/* TREND STRIP */}
               <div className="col-span-12 md:col-span-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center justify-between overflow-x-auto shadow-sm transition-colors">
                  {TREND_DATA.map((t, i) => (
                     <div key={i} className="flex flex-col items-center min-w-[80px] px-4 border-r border-slate-100 dark:border-slate-700 last:border-0 group cursor-default">
                        <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase">{t.month}</span>
                        <div className="mb-1 transform group-hover:scale-110 transition-transform">
                           {t.trend === 'up' && <ArrowUp size={20} className="text-red-500" strokeWidth={4} />}
                           {t.trend === 'down' && <ArrowDown size={20} className="text-[#78be20]" strokeWidth={4} />}
                           {t.trend === 'flat' && <ArrowRight size={20} className="text-orange-400" strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.val}%</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* MAIN CONTENT ROW */}
            <div className="flex-grow grid grid-cols-12 gap-6">

               {/* LEFT COL: Geo Zones (Replicating the blocks) */}
               <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3 h-1/3">
                     <div className="bg-[#002f56] p-4 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full"></div>
                        <div className="text-xs font-bold uppercase opacity-70 mb-1">North</div>
                        <div className="text-lg font-bold">308k</div>
                        <div className="text-xs font-medium opacity-90 text-[#78be20]">4.8% Rate</div>
                     </div>
                     <div className="bg-[#003f73] p-4 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full"></div>
                        <div className="text-xs font-bold uppercase opacity-70 mb-1">Central</div>
                        <div className="text-lg font-bold">263k</div>
                        <div className="text-xs font-medium opacity-90 text-[#78be20]">3.6% Rate</div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 h-1/3">
                     <div className="bg-[#004f71] p-4 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full"></div>
                        <div className="text-xs font-bold uppercase opacity-70 mb-1">Edmonton</div>
                        <div className="text-lg font-bold">833k</div>
                        <div className="text-xs font-medium opacity-90 text-[#78be20]">3.3% Rate</div>
                     </div>
                     <div className="bg-[#78be20] p-4 text-[#002f56] rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-bl-full"></div>
                        <div className="text-xs font-bold uppercase opacity-70 mb-1">Calgary</div>
                        <div className="text-lg font-bold">562k</div>
                        <div className="text-xs font-bold opacity-90">2.0% Rate</div>
                     </div>
                  </div>
                  <div className="bg-[#99d150] p-4 text-[#002f56] rounded-xl shadow-sm hover:shadow-md transition-shadow h-1/3 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full"></div>
                     <div className="text-xs font-bold uppercase opacity-70 mb-1">South</div>
                     <div className="text-lg font-bold">111k</div>
                     <div className="text-xs font-bold opacity-90">2.4% Rate</div>
                  </div>
               </div>

               {/* MIDDLE COL: Charts */}
               <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

                  {/* Row 1 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">

                     {/* Union Chart */}
                     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex flex-col transition-colors">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                           <div className="w-1 h-4 bg-[#002f56] dark:bg-blue-400 rounded-full"></div>
                           <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Union Breakdown</span>
                        </div>
                        <div className="flex-grow">
                           <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart layout="vertical" data={UNION_DATA} margin={{ left: 30, right: 30, bottom: 0 }}>
                                 <XAxis type="number" hide />
                                 <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} interval={0} axisLine={false} tickLine={false} />
                                 <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                    cursor={{ fill: isDarkMode ? '#334155' : '#f8fafc' }}
                                 />
                                 <Bar dataKey="ot" fill="#78be20" barSize={12} radius={[0, 4, 4, 0]} name="OT Hours" />
                                 <Line dataKey="rate" stroke="#002f56" strokeWidth={2} dot={{ r: 3, fill: '#002f56', strokeWidth: 0 }} name="OT % PH" />
                              </ComposedChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Classification Chart */}
                     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex flex-col transition-colors">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                           <div className="w-1 h-4 bg-[#002f56] dark:bg-blue-400 rounded-full"></div>
                           <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Employee Class</span>
                        </div>
                        <div className="flex-grow">
                           <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart layout="vertical" data={CLASS_DATA} margin={{ left: 30, right: 30, bottom: 0 }}>
                                 <XAxis type="number" hide />
                                 <YAxis dataKey="name" type="category" width={30} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} interval={0} axisLine={false} tickLine={false} />
                                 <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                    cursor={{ fill: isDarkMode ? '#334155' : '#f8fafc' }}
                                 />
                                 <Bar dataKey="ot" fill="#78be20" barSize={12} radius={[0, 4, 4, 0]} name="OT Hours" />
                                 <Line dataKey="rate" stroke="#002f56" strokeWidth={2} dot={{ r: 3, fill: '#002f56', strokeWidth: 0 }} name="OT % PH" />
                              </ComposedChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>

                  {/* Row 2: Clinical Split */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex-grow flex flex-col transition-colors">
                     <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-1 h-4 bg-[#002f56] dark:bg-blue-400 rounded-full"></div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Clinical vs Non-Clinical Split</span>
                     </div>
                     <div className="flex-grow flex items-center justify-center gap-12">
                        <div className="w-48 h-48 relative">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={CLINICAL_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={2}
                                 >
                                    {CLINICAL_DATA.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                 </Pie>
                              </PieChart>
                           </ResponsiveContainer>
                           {/* Center Text */}
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                              <div className="text-xl font-extrabold text-[#002f56] dark:text-white">2.08M</div>
                           </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-6">
                           {CLINICAL_DATA.map(d => (
                              <div key={d.name} className="flex flex-col">
                                 <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.name}</span>
                                 </div>
                                 <div className="pl-5">
                                    <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{d.value.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-slate-400">Rate: {d.rate}%</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

               </div>

               {/* RIGHT COL: Filters */}
               <div className="col-span-12 lg:col-span-2 bg-gradient-to-b from-[#002f56] to-[#004f71] dark:from-slate-800 dark:to-slate-900 rounded-xl text-white p-5 flex flex-col gap-5 shadow-lg transition-colors">
                  <div className="flex items-center gap-2 border-b border-white/20 pb-4">
                     <Filter size={18} className="text-[#78be20]" />
                     <h3 className="text-sm font-bold uppercase tracking-wider">Report Filters</h3>
                  </div>

                  <FilterSelect label="Year" value="FY 2026" />
                  <FilterSelect label="Month" value="(All)" />
                  <FilterSelect label="Geo Zone" value="(All)" />
                  <FilterSelect label="Union Group" value="(All)" />
                  <FilterSelect label="Job Function" value="(All)" />
                  <FilterSelect label="Cost Center" value="(All)" />
                  <FilterSelect label="Site" value="(All)" />
                  <FilterSelect label="Urban/Rural" value="(All)" />

                  <button className="mt-auto w-full py-2 bg-[#78be20] hover:bg-[#89d624] text-[#002f56] font-bold text-xs rounded uppercase tracking-wide transition-colors">
                     Reset All
                  </button>
               </div>
            </div>

         </div>
      </div>
   );
};

const FilterSelect = ({ label, value }: { label: string, value: string }) => (
   <div className="flex flex-col gap-1.5 group cursor-pointer">
      <label className="text-[10px] uppercase font-bold text-[#78be20] group-hover:text-white transition-colors">{label}</label>
      <div className="bg-black/20 border border-white/10 px-3 py-2 rounded flex justify-between items-center text-xs hover:bg-black/30 transition-colors">
         {value}
         <ChevronDown size={12} className="opacity-50" />
      </div>
   </div>
);