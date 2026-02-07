import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, ComposedChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Filter, Calendar, ChevronDown, TrendingUp, TrendingDown, 
  Users, DollarSign, Activity, AlertCircle, MoreHorizontal, Download 
} from 'lucide-react';

// --- Mock Data Generators ---
const generateTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(m => ({
    name: m,
    headcount: Math.floor(42000 + Math.random() * 2000),
    cost: Math.floor(120 + Math.random() * 20), // In millions
    attrition: Math.floor(1.5 + Math.random() * 1.5),
  }));
};

const DEPT_DATA = [
  { name: 'Nursing', value: 45, color: '#3b82f6' },
  { name: 'Admin', value: 15, color: '#10b981' },
  { name: 'Support', value: 20, color: '#f59e0b' },
  { name: 'Medical', value: 20, color: '#8b5cf6' },
];

const TABLE_DATA = [
  { id: 1, dept: 'Emergency Care', manager: 'Dr. Sarah Smith', headcount: 450, budget: '$12.5M', status: 'On Track', trend: '+2%' },
  { id: 2, dept: 'Human Resources', manager: 'James Wilson', headcount: 85, budget: '$4.2M', status: 'Review', trend: '-5%' },
  { id: 3, dept: 'IT Services', manager: 'Anita Roy', headcount: 120, budget: '$8.9M', status: 'On Track', trend: '+12%' },
  { id: 4, dept: 'Facility Ops', manager: 'Robert Chen', headcount: 310, budget: '$9.1M', status: 'Critical', trend: '-8%' },
  { id: 5, dept: 'Pediatrics', manager: 'Emily Blunt', headcount: 215, budget: '$15.3M', status: 'On Track', trend: '+1%' },
];

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 12 Months');
  const data = generateTrendData();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full animate-in fade-in duration-500">
      
      {/* --- Control Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Leadership Dashboard</h2>
          <p className="text-slate-500 mt-1">High-level insights across organization performance metrics.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-100">
             <Filter size={16} className="text-slate-400" />
             <span className="text-sm font-semibold text-slate-700">Filters:</span>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Calendar size={16} />
              {timeRange}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {/* Mock Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
               {['Last 30 Days', 'Last Quarter', 'Last 12 Months', 'YTD'].map(t => (
                 <div key={t} onClick={() => setTimeRange(t)} className="px-4 py-2 hover:bg-slate-50 text-sm cursor-pointer text-slate-600">
                   {t}
                 </div>
               ))}
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
             Department: All
             <ChevronDown size={14} className="text-slate-400" />
          </button>

          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* --- KPI Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Headcount', value: '44,250', change: '+2.4%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Monthly Labor Cost', value: '$132.5M', change: '+1.2%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Attrition Rate', value: '4.2%', change: '-0.5%', trend: 'down', good: true, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Open Vacancies', value: '1,240', change: '+5.3%', trend: 'up', good: false, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${kpi.bg} ${kpi.color} p-3 rounded-xl`}>
                <kpi.icon size={22} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${
                (kpi.trend === 'up' && kpi.good !== false) || (kpi.trend === 'down' && kpi.good === true) 
                  ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full' 
                  : 'text-rose-600 bg-rose-50 px-2 py-1 rounded-full'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.change}
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpi.value}</div>
              <div className="text-sm font-medium text-slate-400 mt-1">{kpi.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Complex Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Composition Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Labor Cost vs Headcount</h3>
              <p className="text-sm text-slate-400">Correlation analysis over fiscal year</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                <Area yAxisId="left" type="monotone" dataKey="cost" name="Cost ($M)" fill="url(#colorCost)" stroke="#3b82f6" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="headcount" name="Headcount" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Workforce Distribution</h3>
          <p className="text-sm text-slate-400 mb-6">Headcount by functional area</p>
          
          <div className="flex-grow flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={DEPT_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {DEPT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-extrabold text-slate-800">44k</div>
              <div className="text-xs text-slate-400 uppercase font-bold">Total</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
             {DEPT_DATA.map(d => (
               <div key={d.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                 <span className="text-sm font-medium text-slate-600">{d.name}</span>
                 <span className="text-xs text-slate-400 ml-auto">{d.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- Detailed Table --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Department Performance Report</h3>
          <button className="text-sm text-blue-600 font-semibold hover:text-blue-800">View Full Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="p-6">Department</th>
                <th className="p-6">Manager</th>
                <th className="p-6">Headcount</th>
                <th className="p-6">Budget Utilization</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TABLE_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-semibold text-slate-700">{row.dept}</td>
                  <td className="p-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {row.manager.split(' ')[0][0]}{row.manager.split(' ')[1][0]}
                      </div>
                      {row.manager}
                    </div>
                  </td>
                  <td className="p-6 text-slate-600">{row.headcount}</td>
                  <td className="p-6 font-mono text-slate-600">{row.budget}</td>
                  <td className="p-6">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${row.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' : 
                        row.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}
                    `}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <span className={`font-medium ${row.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
           <span className="text-xs text-slate-400 font-medium">Showing 5 of 24 Departments</span>
        </div>
      </div>
    </div>
  );
};
