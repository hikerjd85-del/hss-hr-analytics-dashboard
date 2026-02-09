import React, { useState, useEffect, useRef } from 'react';
import {
   FileText, CheckCircle2, Circle, Calendar, Layers, Download,
   FileSpreadsheet, Presentation, Loader2, Sparkles, AlertCircle, ChevronRight, Check,
   Printer, Share2, File, ArrowLeft, BarChart3, TrendingUp, CheckSquare, Square
} from 'lucide-react';
import { DASHBOARD_ITEMS } from '../constants';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportGeneratorViewProps {
   isDarkMode?: boolean;
}

// Precise Interlocking HSS Logo for Reports
const ReportLogo = () => (
   <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <clipPath id="reportLogoClip">
            <circle cx="50" cy="50" r="50" />
         </clipPath>
      </defs>
      <g clipPath="url(#reportLogoClip)">
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

import { REPORT_DATA } from '../data/mockData';

// ... imports ...

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({ isDarkMode }) => {
   const [selectedModules, setSelectedModules] = useState<string[]>(['executive-summary', 'overtime', 'workforce']);
   const [viewState, setViewState] = useState<'configure' | 'generating' | 'preview'>('configure');
   const [timeRange, setTimeRange] = useState('YTD');
   const [clientName, setClientName] = useState('Executive Leadership Team'); // Personalization
   const [isDownloading, setIsDownloading] = useState(false);
   const previewRef = useRef<HTMLDivElement>(null);

   const toggleModule = (id: string) => {
      setSelectedModules(prev =>
         prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
      );
   };

   const selectAll = () => {
      const allIds = ['executive-summary', ...DASHBOARD_ITEMS.map(i => i.id)];
      setSelectedModules(allIds);
   };

   const clearAll = () => {
      setSelectedModules([]);
   };

   const handleGenerate = () => {
      setViewState('generating');
      // Simulate generation delay
      setTimeout(() => {
         setViewState('preview');
      }, 2000);
   };

   const handleReset = () => {
      setViewState('configure');
   };

   const handleDownloadWord = () => {
      if (!previewRef.current) return;

      // Create a simplified HTML structure for Word
      const content = previewRef.current.innerHTML;

      const preHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Report Export</title>
        <style>
          body { font-family: 'Arial', sans-serif; }
          .recharts-responsive-container { display: none; } /* Hide interactive charts as they won't render */
          h1 { font-size: 24pt; color: #002f56; margin-bottom: 20px; }
          h2 { font-size: 18pt; color: #002f56; margin-top: 20px; }
          p { font-size: 12pt; color: #333333; line-height: 1.5; }
          .chart-placeholder { padding: 20px; background: #f0f0f0; border: 1px solid #ccc; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div style="padding: 40px;">
    `;

      const disclaimer = `<p style="color: #666; font-style: italic; font-size: 10pt; margin-bottom: 30px;">
      Note: This document was exported from the HSS People Analytics Dashboard. Interactive charts may not be fully visible. 
      Please refer to the PDF version or live dashboard for visual analytics.
    </p>`;

      const postHtml = "</div></body></html>";

      const html = preHtml + disclaimer + content + postHtml;

      const blob = new Blob(['\ufeff', html], {
         type: 'application/msword'
      });

      const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

      const link = document.createElement('a');
      link.href = url;
      link.download = `HSS_Report_${timeRange.replace(' ', '_')}_FY2026.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const handleDownloadPDF = async () => {
      if (!previewRef.current) return;
      setIsDownloading(true);
      try {
         const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
         const imgData = canvas.toDataURL('image/png');
         const imgWidth = 210;
         const pageHeight = 295;
         const imgHeight = (canvas.height * imgWidth) / canvas.width;
         const pdf = new jsPDF('p', 'mm', [imgWidth, Math.max(imgHeight, pageHeight)]);
         pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
         pdf.save(`HSS_Report_${timeRange.replace(' ', '_')}_FY2026.pdf`);
      } catch (error) {
         console.error('PDF generation failed', error);
         alert('Failed to generate PDF. Please try again.');
      } finally {
         setIsDownloading(false);
      }
   };

   // Group items by theme for display
   const compItems = DASHBOARD_ITEMS.filter(i => i.theme === 'orange');
   const workforceItems = DASHBOARD_ITEMS.filter(i => i.theme === 'green');
   const talentItems = DASHBOARD_ITEMS.filter(i => i.theme === 'purple');

   const ModuleCheckbox = ({ id, label, checked, onChange }: any) => {
      return (
         <label
            onClick={() => onChange(id)}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 cursor-pointer transition-all dark:bg-slate-800 dark:border-slate-700"
         >
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${checked ? 'bg-[#78be20] border-[#78be20] text-white' : 'border-slate-300 bg-white'}`}>
               {checked && <Check size={12} strokeWidth={3} />}
            </div>
            <span className={`text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
         </label>
      );
   };

   return (
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">

         {/* Header */}
         <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
               {viewState === 'preview' && (
                  <button onClick={handleReset} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                     <ArrowLeft size={20} className="text-slate-500" />
                  </button>
               )}
               <h1 className="text-3xl font-bold text-[#002f56] dark:text-white">
                  {viewState === 'preview' ? 'Report Preview' : 'Report Builder'}
               </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
               {viewState === 'preview'
                  ? 'Review your report before exporting.'
                  : 'Configure your executive briefing below.'}
            </p>
         </div>

         {viewState === 'preview' && (
            <div className="flex gap-3 mb-8">
               <button
                  onClick={handleDownloadWord}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
               >
                  <FileText size={18} className="text-blue-600" />
                  Word
               </button>
               <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#002f56] hover:bg-[#003f73] text-white rounded-lg font-medium transition-colors disabled:opacity-70"
               >
                  {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  {isDownloading ? 'Processing...' : 'PDF'}
               </button>
            </div>
         )}

         <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT COLUMN: Configuration */}
            {viewState !== 'preview' && (
               <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">

                  {/* Report Settings Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Report Settings</h3>

                     <div className="space-y-4">
                        {/* Timeframe */}
                        <div>
                           <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Time Period</label>
                           <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                              {['Last Month', 'Q2 2025', 'YTD'].map(t => (
                                 <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${timeRange === t
                                       ? 'bg-white text-[#002f56] shadow-sm'
                                       : 'text-slate-500 hover:text-slate-700'
                                       }`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Prepared For */}
                        <div>
                           <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Prepared For</label>
                           <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Enter recipient name"
                              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#78be20]/50 focus:border-[#78be20]"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Report Templates Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Templates</h3>
                     <div className="grid grid-cols-2 gap-2">
                        <button
                           onClick={() => setSelectedModules(['executive-summary', 'overtime', 'sick-hours', 'paid-hours', 'worked-hours'])}
                           className="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                           <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#002f56]">Monthly Ops</div>
                           <div className="text-[10px] text-slate-400">5 modules</div>
                        </button>
                        <button
                           onClick={() => setSelectedModules(['executive-summary', 'workforce', 'terminations', 'new-hires', 'vacancy', 'recruitment'])}
                           className="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                           <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#002f56]">Quarterly Review</div>
                           <div className="text-[10px] text-slate-400">6 modules</div>
                        </button>
                        <button
                           onClick={() => setSelectedModules(['executive-summary', 'vacancy', 'new-hires', 'recruitment', 'internal-transfers'])}
                           className="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                           <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#002f56]">Recruitment</div>
                           <div className="text-[10px] text-slate-400">5 modules</div>
                        </button>
                        <button
                           onClick={selectAll}
                           className="p-3 text-left rounded-lg border border-[#78be20]/30 bg-[#78be20]/5 hover:bg-[#78be20]/10 transition-colors group"
                        >
                           <div className="text-xs font-bold text-[#78be20]">Full Brief</div>
                           <div className="text-[10px] text-slate-400">All modules</div>
                        </button>
                     </div>
                  </div>

                  {/* Content Modules Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content Modules</h3>
                        <div className="flex gap-2 text-xs">
                           <button onClick={selectAll} className="font-medium text-blue-600 hover:underline">All</button>
                           <span className="text-slate-300">|</span>
                           <button onClick={clearAll} className="font-medium text-slate-400 hover:underline">None</button>
                        </div>
                     </div>

                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        {/* Overview */}
                        <div>
                           <p className="text-xs font-medium text-slate-400 uppercase mb-2">Overview</p>
                           <ModuleCheckbox id="executive-summary" label="Executive Summary" checked={selectedModules.includes('executive-summary')} onChange={toggleModule} />
                        </div>

                        {/* Compensation */}
                        <div>
                           <p className="text-xs font-medium text-slate-400 uppercase mb-2">Compensation</p>
                           <div className="space-y-2">
                              {compItems.map(item => (
                                 <ModuleCheckbox key={item.id} id={item.id} label={item.title} checked={selectedModules.includes(item.id)} onChange={toggleModule} />
                              ))}
                           </div>
                        </div>

                        {/* Workforce */}
                        <div>
                           <p className="text-xs font-medium text-slate-400 uppercase mb-2">Workforce</p>
                           <div className="space-y-2">
                              {workforceItems.map(item => (
                                 <ModuleCheckbox key={item.id} id={item.id} label={item.title} checked={selectedModules.includes(item.id)} onChange={toggleModule} />
                              ))}
                           </div>
                        </div>

                        {/* Talent */}
                        <div>
                           <p className="text-xs font-medium text-slate-400 uppercase mb-2">Talent</p>
                           <div className="space-y-2">
                              {talentItems.map(item => (
                                 <ModuleCheckbox key={item.id} id={item.id} label={item.title} checked={selectedModules.includes(item.id)} onChange={toggleModule} />
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Generate Button */}
                     <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                           onClick={handleGenerate}
                           disabled={selectedModules.length === 0}
                           className="w-full flex items-center justify-center gap-2 bg-[#78be20] hover:bg-[#6aab1a] text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <Sparkles size={18} />
                           Generate Report
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* RIGHT COLUMN: Preview / View */}
            <div className={`transition-all duration-500 ${viewState === 'preview' ? 'w-full mx-auto max-w-5xl' : 'w-full lg:w-8/12'}`}>

               <div className={`bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center relative min-h-[700px] transition-colors ${viewState === 'preview' ? 'shadow-2xl' : ''}`}>

                  {/* Background Decoration */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  {/* --- CONFIGURE STATE: Show empty/placeholder --- */}
                  {viewState === 'configure' && (
                     <div className="text-center z-10 px-8">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                           <FileText size={28} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Report Preview</h3>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">Select your modules and click "Generate Report" to see a preview here.</p>
                     </div>
                  )}

                  {/* --- 2. LOADING STATE --- */}
                  {viewState === 'generating' && (
                     <div className="text-center z-10">
                        <Loader2 size={40} className="mx-auto text-[#002f56] dark:text-white animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-[#002f56] dark:text-white mb-2">Compiling Report...</h3>
                        <p className="text-slate-500 dark:text-slate-400">Aggregating {selectedModules.length} data sources for {timeRange}</p>
                     </div>
                  )}

                  {/* --- 3. LIVE DOCUMENT PREVIEW --- */}
                  {viewState === 'preview' && (
                     <div ref={previewRef} className="w-full bg-white text-slate-900 shadow-2xl rounded-sm min-h-[800px] flex flex-col relative animate-slide-up">

                        {/* Report Header */}
                        <div className="h-3 bg-[#002f56] w-full"></div>
                        <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center">
                           <div className="flex items-center gap-5">
                              <div className="relative">
                                 <ReportLogo />
                              </div>
                              <div>
                                 <h1 className="text-3xl font-serif font-bold text-[#002f56] leading-none mb-1">Health Shared Services</h1>
                                 <p className="text-lg text-slate-500 font-medium">Executive Performance Report</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Prepared For</div>
                              <div className="text-xl font-bold text-slate-800">{clientName || 'Leadership Team'}</div>
                              <div className="text-sm font-bold text-[#78be20] uppercase mt-1">{timeRange} 2026</div>
                           </div>
                        </div>

                        {/* Report Content */}
                        <div className="px-12 py-10 space-y-12">

                           {/* Render Modules */}
                           {selectedModules.map((modId) => {
                              const data = REPORT_DATA[modId];
                              const item = DASHBOARD_ITEMS.find(i => i.id === modId);
                              const title = item ? item.title : (modId === 'executive-summary' ? 'Executive Summary' : modId);

                              if (!data) return null;

                              const statusColors = {
                                 good: 'text-emerald-600 bg-emerald-50',
                                 warning: 'text-amber-600 bg-amber-50',
                                 critical: 'text-red-600 bg-red-50'
                              };

                              return (
                                 <div key={modId} className="break-inside-avoid mb-8">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 border-b-2 border-[#002f56] pb-2 mb-6">
                                       <div className={`p-2 rounded-lg bg-[#002f56] text-white`}>
                                          {modId === 'executive-summary' ? <Sparkles size={18} /> : <BarChart3 size={18} />}
                                       </div>
                                       <h2 className="text-xl font-bold text-[#002f56] uppercase tracking-wide">{title}</h2>
                                    </div>

                                    {/* KPI Cards */}
                                    {data.kpis && (
                                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                          {data.kpis.map((kpi, i) => (
                                             <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">{kpi.label}</div>
                                                <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
                                                <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded inline-block ${statusColors[kpi.status]}`}>
                                                   {kpi.change}
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    )}

                                    {/* Chart */}
                                    {data.chartData && (
                                       <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
                                          <h4 className="text-sm font-bold text-slate-600 uppercase mb-4">Performance Trend</h4>
                                          <div className="h-48">
                                             <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                   <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                                                   <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                                   <Bar dataKey="value" fill="#002f56" radius={[4, 4, 0, 0]}>
                                                      {data.chartData.map((entry, index) => (
                                                         <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.target && entry.value > entry.target ? '#ef4444' : '#002f56'}
                                                         />
                                                      ))}
                                                   </Bar>
                                                   {data.chartData[0]?.target && (
                                                      <Bar dataKey="target" fill="#78be20" radius={[4, 4, 0, 0]} opacity={0.5} />
                                                   )}
                                                </BarChart>
                                             </ResponsiveContainer>
                                          </div>
                                          {data.chartData[0]?.target && (
                                             <div className="flex gap-4 mt-3 text-xs">
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#002f56] rounded"></span> Actual</span>
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#78be20] opacity-50 rounded"></span> Target</span>
                                             </div>
                                          )}
                                       </div>
                                    )}

                                    {/* Data Table */}
                                    {data.tableData && (
                                       <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-6 shadow-sm">
                                          <h4 className="text-sm font-bold text-slate-600 uppercase p-4 bg-slate-50 border-b border-slate-200">Comparison Data</h4>
                                          <table className="w-full text-sm">
                                             <thead className="bg-slate-100">
                                                <tr>
                                                   <th className="text-left px-4 py-2 font-semibold text-slate-600">Category</th>
                                                   <th className="text-right px-4 py-2 font-semibold text-slate-600">Current</th>
                                                   <th className="text-right px-4 py-2 font-semibold text-slate-600">Previous</th>
                                                   <th className="text-right px-4 py-2 font-semibold text-slate-600">Change</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                {data.tableData.map((row, i) => (
                                                   <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                      <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                                                      <td className="px-4 py-3 text-right text-slate-800 font-semibold">{row.current}</td>
                                                      <td className="px-4 py-3 text-right text-slate-500">{row.previous}</td>
                                                      <td className={`px-4 py-3 text-right font-bold ${row.change.startsWith('+') && !row.change.includes('days') ? 'text-red-600' : 'text-emerald-600'}`}>
                                                         {row.change}
                                                      </td>
                                                   </tr>
                                                ))}
                                             </tbody>
                                          </table>
                                       </div>
                                    )}

                                    {/* Summary and Recommendation */}
                                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-[#78be20]">
                                       <p className="text-slate-700 leading-relaxed mb-4">{data.summary}</p>

                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {data.keyFactors && (
                                             <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Factors</h4>
                                                <ul className="space-y-1">
                                                   {data.keyFactors.map((factor, i) => (
                                                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#78be20] flex-shrink-0"></span>
                                                         <span>{factor}</span>
                                                      </li>
                                                   ))}
                                                </ul>
                                             </div>
                                          )}
                                          {data.recommendation && (
                                             <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Recommendation</h4>
                                                <div className="bg-white border border-slate-200 p-3 rounded-lg">
                                                   <div className="flex gap-2">
                                                      <CheckCircle2 size={16} className="text-[#78be20] shrink-0 mt-0.5" />
                                                      <p className="text-sm font-medium text-slate-700">{data.recommendation}</p>
                                                   </div>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}

                        </div>

                        {/* Report Footer */}
                        <div className="mt-auto px-12 py-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                           <span>Generated by HSS People Analytics</span>
                           <span>Confidential & Proprietary</span>
                           <span>{new Date().toLocaleDateString()}</span>
                        </div>
                     </div>
                  )}

               </div>

            </div>
         </div>
      </div>
   );
};

const FormatButton = ({ active, onClick, icon: Icon, label }: any) => (
   <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${active
         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
         : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
         }`}
   >
      <Icon size={24} className="mb-2" />
      <span className="text-xs font-bold">{label}</span>
   </button>
);