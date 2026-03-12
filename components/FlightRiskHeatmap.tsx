/**
 * ============================================================
 * FLIGHT RISK HEATMAP
 * ============================================================
 * An interactive org-chart-style heatmap where departments are
 * color-coded by predicted flight risk. Self-contained — remove
 * this file + sidebar entry to cleanly detach.
 * ============================================================
 */
import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronRight,
  Users, TrendingUp, TrendingDown, Minus, DollarSign, Clock, Heart,
  ArrowUpRight, Zap, Info, BarChart3
} from 'lucide-react';
import { SectionGuide } from './SectionGuide';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell,
  RadialBarChart, RadialBar, Legend
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────
interface Department {
  id: string;
  name: string;
  headcount: number;
  riskScore: number; // 0-100
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  turnoverRate: number;
  avgTenure: number;
  compensationGap: number; // % below market
  sentimentScore: number; // 0-100
  openPositions: number;
  flightRiskEmployees: number;
  trendDirection: 'up' | 'down' | 'stable';
  factors: RiskFactor[];
  teams?: Team[];
}

interface Team {
  name: string;
  headcount: number;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
}

interface RiskFactor {
  name: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

// ─── Mock Data ──────────────────────────────────────────────
const DEPARTMENTS: Department[] = [
  {
    id: 'clinical-ops',
    name: 'Clinical Operations',
    headcount: 1240,
    riskScore: 78,
    riskLevel: 'critical',
    turnoverRate: 14.2,
    avgTenure: 2.8,
    compensationGap: -8.5,
    sentimentScore: 42,
    openPositions: 67,
    flightRiskEmployees: 186,
    trendDirection: 'up',
    factors: [
      { name: 'Compensation Gap', impact: 'high', description: 'Avg salary 8.5% below market rate for clinical roles' },
      { name: 'Burnout Indicators', impact: 'high', description: 'Overtime averaging 12+ hrs/week for 4 consecutive months' },
      { name: 'Limited Advancement', impact: 'medium', description: 'Only 12% internal promotion rate vs 20% target' },
    ],
    teams: [
      { name: 'ICU Nursing', headcount: 180, riskScore: 92, riskLevel: 'critical' },
      { name: 'Emergency', headcount: 220, riskScore: 85, riskLevel: 'critical' },
      { name: 'Surgery', headcount: 310, riskScore: 65, riskLevel: 'high' },
      { name: 'General Care', headcount: 290, riskScore: 58, riskLevel: 'moderate' },
      { name: 'Pediatrics', headcount: 240, riskScore: 71, riskLevel: 'high' },
    ],
  },
  {
    id: 'admin',
    name: 'Administration',
    headcount: 580,
    riskScore: 34,
    riskLevel: 'low',
    turnoverRate: 6.1,
    avgTenure: 5.4,
    compensationGap: -2.1,
    sentimentScore: 72,
    openPositions: 12,
    flightRiskEmployees: 29,
    trendDirection: 'down',
    factors: [
      { name: 'Competitive Pay', impact: 'low', description: 'Within 2% of market median' },
      { name: 'Limited Remote Options', impact: 'medium', description: '40% of admin roles could be hybrid but aren\'t' },
    ],
    teams: [
      { name: 'Finance', headcount: 120, riskScore: 28, riskLevel: 'low' },
      { name: 'HR', headcount: 85, riskScore: 31, riskLevel: 'low' },
      { name: 'IT', headcount: 145, riskScore: 42, riskLevel: 'moderate' },
      { name: 'Facilities', headcount: 230, riskScore: 30, riskLevel: 'low' },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership & Management',
    headcount: 320,
    riskScore: 62,
    riskLevel: 'high',
    turnoverRate: 11.8,
    avgTenure: 3.6,
    compensationGap: -5.2,
    sentimentScore: 55,
    openPositions: 18,
    flightRiskEmployees: 48,
    trendDirection: 'up',
    factors: [
      { name: 'Industry Poaching', impact: 'high', description: 'Competitor healthcare systems offering 15-20% premiums' },
      { name: 'Span of Control', impact: 'medium', description: 'Avg manager-to-report ratio is 1:14, above 1:10 benchmark' },
      { name: 'Succession Gaps', impact: 'high', description: '38% of director+ roles have no identified successor' },
    ],
    teams: [
      { name: 'Clinical Directors', headcount: 45, riskScore: 74, riskLevel: 'high' },
      { name: 'Ops Managers', headcount: 110, riskScore: 61, riskLevel: 'high' },
      { name: 'Department Heads', headcount: 65, riskScore: 68, riskLevel: 'high' },
      { name: 'Executive Team', headcount: 100, riskScore: 45, riskLevel: 'moderate' },
    ],
  },
  {
    id: 'support',
    name: 'Support Services',
    headcount: 890,
    riskScore: 45,
    riskLevel: 'moderate',
    turnoverRate: 8.4,
    avgTenure: 4.1,
    compensationGap: -3.8,
    sentimentScore: 64,
    openPositions: 34,
    flightRiskEmployees: 67,
    trendDirection: 'stable',
    factors: [
      { name: 'Market Competition', impact: 'medium', description: 'Retail & hospitality sectors competing for similar talent' },
      { name: 'Shift Work', impact: 'medium', description: 'Evening/night shift positions have 2x higher turnover' },
    ],
    teams: [
      { name: 'Housekeeping', headcount: 280, riskScore: 52, riskLevel: 'moderate' },
      { name: 'Food Services', headcount: 190, riskScore: 48, riskLevel: 'moderate' },
      { name: 'Transport', headcount: 150, riskScore: 39, riskLevel: 'low' },
      { name: 'Security', headcount: 270, riskScore: 41, riskLevel: 'moderate' },
    ],
  },
  {
    id: 'allied-health',
    name: 'Allied Health',
    headcount: 520,
    riskScore: 55,
    riskLevel: 'moderate',
    turnoverRate: 9.7,
    avgTenure: 3.3,
    compensationGap: -6.1,
    sentimentScore: 58,
    openPositions: 28,
    flightRiskEmployees: 52,
    trendDirection: 'up',
    factors: [
      { name: 'Certification Demands', impact: 'medium', description: 'New certification requirements causing role strain' },
      { name: 'Compensation Gap', impact: 'high', description: 'Pharmacy and therapy roles 6% below market' },
    ],
    teams: [
      { name: 'Pharmacy', headcount: 130, riskScore: 63, riskLevel: 'high' },
      { name: 'Physical Therapy', headcount: 110, riskScore: 58, riskLevel: 'moderate' },
      { name: 'Lab Services', headcount: 160, riskScore: 48, riskLevel: 'moderate' },
      { name: 'Radiology', headcount: 120, riskScore: 51, riskLevel: 'moderate' },
    ],
  },
  {
    id: 'research',
    name: 'Research & Education',
    headcount: 280,
    riskScore: 28,
    riskLevel: 'low',
    turnoverRate: 4.8,
    avgTenure: 6.2,
    compensationGap: 1.2,
    sentimentScore: 81,
    openPositions: 8,
    flightRiskEmployees: 14,
    trendDirection: 'down',
    factors: [
      { name: 'Strong Culture', impact: 'low', description: 'High engagement scores and mission alignment' },
    ],
    teams: [
      { name: 'Clinical Research', headcount: 90, riskScore: 25, riskLevel: 'low' },
      { name: 'Medical Education', headcount: 110, riskScore: 22, riskLevel: 'low' },
      { name: 'Innovation Lab', headcount: 80, riskScore: 38, riskLevel: 'low' },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────
function getRiskColor(level: string): string {
  switch (level) {
    case 'critical': return 'bg-rose-500';
    case 'high': return 'bg-orange-500';
    case 'moderate': return 'bg-amber-400';
    case 'low': return 'bg-emerald-500';
    default: return 'bg-slate-400';
  }
}

function getRiskBgClass(level: string): string {
  switch (level) {
    case 'critical': return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
    case 'high': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    case 'moderate': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    case 'low': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  }
}

function getRiskTextColor(level: string): string {
  switch (level) {
    case 'critical': return 'text-rose-600 dark:text-rose-400';
    case 'high': return 'text-orange-600 dark:text-orange-400';
    case 'moderate': return 'text-amber-600 dark:text-amber-400';
    case 'low': return 'text-emerald-600 dark:text-emerald-400';
    default: return 'text-slate-600';
  }
}

function getRiskIcon(level: string) {
  switch (level) {
    case 'critical': return ShieldAlert;
    case 'high': return AlertTriangle;
    case 'moderate': return Shield;
    case 'low': return ShieldCheck;
    default: return Shield;
  }
}

// Styled tooltip
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((e: any, i: number) => (
          <p key={i}><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: e.color }}></span>{e.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ─────────────────────────────────────────
interface FlightRiskHeatmapProps {
  isDarkMode: boolean;
}

export const FlightRiskHeatmap: React.FC<FlightRiskHeatmapProps> = ({ isDarkMode }) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  // Summary KPIs
  const summary = useMemo(() => {
    const totalHC = DEPARTMENTS.reduce((s, d) => s + d.headcount, 0);
    const totalAtRisk = DEPARTMENTS.reduce((s, d) => s + d.flightRiskEmployees, 0);
    const avgRisk = Math.round(DEPARTMENTS.reduce((s, d) => s + d.riskScore, 0) / DEPARTMENTS.length);
    const criticalDepts = DEPARTMENTS.filter(d => d.riskLevel === 'critical').length;
    return { totalHC, totalAtRisk, avgRisk, criticalDepts };
  }, []);

  const riskDistribution = DEPARTMENTS.map(d => ({
    name: d.name.split(' ')[0],
    risk: d.riskScore,
    level: d.riskLevel,
  }));

  const handleDeptToggle = (dept: Department) => {
    if (expandedDept === dept.id) {
      setExpandedDept(null);
      setSelectedDept(null);
    } else {
      setExpandedDept(dept.id);
      setSelectedDept(dept);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg shadow-md shadow-rose-500/20">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">Flight Risk Heatmap</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Predictive attrition analysis by department and team.</p>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"></div>
      </div>

      {/* Guide */}
      <SectionGuide
        title="Flight Risk Heatmap"
        subtitle="Tap to learn how to read and act on predictive attrition data"
        accentColor="from-rose-500 to-orange-500"
        accentBg="from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10"
        purpose="The Flight Risk Heatmap helps you visually identify which departments and teams have the highest risk of talent loss. Each department is color-coded by its predicted risk score (0-100), allowing you to see at a glance where to focus retention efforts and resource allocation."
        steps={[
          { title: 'Review the Summary KPIs', description: 'Start at the top with the four high-level indicators: Total Headcount, Employees At Risk, Average Risk Score, and number of Critical Departments.' },
          { title: 'Scan the Risk Score Chart', description: 'The horizontal bar chart ranks all departments by risk score. Red bars signal critical risk, green bars indicate healthy departments.' },
          { title: 'Click a Department to Expand', description: 'Click any department row to reveal detailed risk factors (compensation gaps, burnout indicators) and team-level breakdown.' },
          { title: 'Examine Team-Level Scores', description: 'Within each expanded department, individual team cards show their own risk scores, helping you pinpoint exactly which teams need attention.' },
          { title: 'Take Action on Risk Factors', description: 'Each risk factor card shows its impact level (High/Medium/Low) and a plain-language explanation of what is driving the risk.' }
        ]}
        keyMetrics={[
          { label: 'Risk Score (0-100)', explanation: 'A composite score combining turnover rate, compensation gap, sentiment, tenure data, and market conditions. Higher = more at risk.' },
          { label: 'Turnover Rate', explanation: 'The percentage of employees who left the department in the current period. Above 10% is concerning; above 14% is critical.' },
          { label: 'Compensation Gap', explanation: 'How far below (or above) market median the department pays. A -8% gap means salaries are 8% below market.' },
          { label: 'Sentiment Score', explanation: 'Aggregated employee engagement and satisfaction score from surveys. Below 50 signals serious morale issues.' },
          { label: 'Trend Direction', explanation: 'The arrow icon shows whether risk is increasing (red up arrow), decreasing (green down arrow), or stable.' },
          { label: 'FTE At Risk', explanation: 'The number of individual employees flagged as flight risks by the predictive model based on their personal risk factors.' }
        ]}
        proTips={[
          { text: 'Focus on departments with BOTH high risk scores AND upward trend arrows. These need immediate attention.' },
          { text: 'Compare Compensation Gap with Turnover Rate. If both are high, a market adjustment may be the most effective intervention.' },
          { text: 'Low Sentiment Scores often precede turnover spikes by 2-3 months. Treat them as early warning signals.' },
          { text: 'Use the team-level breakdown to avoid blanket solutions. Often, one team drives the entire department risk.' }
        ]}
        faqs={[
          { question: 'How is the risk score calculated?', answer: 'It combines turnover rate, compensation vs market, employee sentiment surveys, average tenure, open positions, and industry demand for similar roles into a weighted composite score.' },
          { question: 'How often is this data updated?', answer: 'Risk scores refresh quarterly when new turnover, compensation, and sentiment data becomes available. In production, this can be configured for monthly or real-time updates.' },
          { question: 'What should I do if a department is Critical?', answer: 'Review the risk factor cards for root causes. Start with the highest-impact factors first. Common interventions include market pay adjustments, workload redistribution, career development programs, and targeted retention bonuses.' },
          { question: 'Can I drill down to individual employees?', answer: 'The current view shows department and team-level data. Individual employee risk profiles are available in the detailed HR system. Team-level analysis is typically sufficient for leadership decision-making.' }
        ]}
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Headcount', value: summary.totalHC.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: 'Employees At Risk', value: summary.totalAtRisk.toLocaleString(), icon: AlertTriangle, color: 'text-rose-500' },
          { label: 'Avg Risk Score', value: `${summary.avgRisk}/100`, icon: BarChart3, color: 'text-amber-500' },
          { label: 'Critical Departments', value: summary.criticalDepts.toString(), icon: ShieldAlert, color: 'text-rose-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon size={16} className={kpi.color} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Risk Distribution Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Risk Score by Department</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskDistribution} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="risk" radius={[0, 8, 8, 0]} animationDuration={1200}>
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.level === 'critical' ? '#ef4444' :
                    entry.level === 'high' ? '#f97316' :
                    entry.level === 'moderate' ? '#f59e0b' : '#10b981'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Cards (Heatmap) */}
      <div className="space-y-4">
        {DEPARTMENTS.sort((a, b) => b.riskScore - a.riskScore).map((dept) => {
          const isExpanded = expandedDept === dept.id;
          const RiskIcon = getRiskIcon(dept.riskLevel);

          return (
            <div key={dept.id} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
            } ${getRiskBgClass(dept.riskLevel)}`}>
              {/* Department Header Row */}
              <button
                onClick={() => handleDeptToggle(dept)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-white/40 dark:hover:bg-white/5"
              >
                {/* Risk indicator bar */}
                <div className={`w-2 h-14 rounded-full ${getRiskColor(dept.riskLevel)} shrink-0`}></div>

                {/* Risk Score Circle */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getRiskColor(dept.riskLevel)} bg-opacity-20`}>
                  <span className={`text-xl font-black ${getRiskTextColor(dept.riskLevel)}`}>{dept.riskScore}</span>
                </div>

                {/* Dept Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{dept.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getRiskColor(dept.riskLevel)} text-white`}>
                      {dept.riskLevel}
                    </span>
                    {dept.trendDirection === 'up' && <TrendingUp size={14} className="text-rose-500" />}
                    {dept.trendDirection === 'down' && <TrendingDown size={14} className="text-emerald-500" />}
                    {dept.trendDirection === 'stable' && <Minus size={14} className="text-slate-400" />}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Users size={12} /> {dept.headcount} FTE</span>
                    <span className="flex items-center gap-1"><AlertTriangle size={12} /> {dept.flightRiskEmployees} at risk</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {dept.avgTenure}yr avg tenure</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Turnover</p>
                    <p className={`text-lg font-bold ${dept.turnoverRate > 10 ? 'text-rose-600' : dept.turnoverRate > 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {dept.turnoverRate}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Comp Gap</p>
                    <p className={`text-lg font-bold ${dept.compensationGap < -5 ? 'text-rose-600' : dept.compensationGap < -2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {dept.compensationGap > 0 ? '+' : ''}{dept.compensationGap}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sentiment</p>
                    <p className={`text-lg font-bold ${dept.sentimentScore < 50 ? 'text-rose-600' : dept.sentimentScore < 65 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {dept.sentimentScore}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-black/5 dark:border-white/5 animate-slide-up space-y-6">
                  {/* Risk Factors */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap size={14} /> Key Risk Factors
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {dept.factors.map((factor, i) => (
                        <div key={i} className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-4 border border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              factor.impact === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                              factor.impact === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}>{factor.impact} impact</span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{factor.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-teams Heatmap */}
                  {dept.teams && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users size={14} /> Team Breakdown
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {dept.teams.sort((a, b) => b.riskScore - a.riskScore).map((team, i) => (
                          <div key={i} className={`rounded-xl p-4 border text-center transition-all hover:scale-105 ${getRiskBgClass(team.riskLevel)}`}>
                            <p className={`text-2xl font-black mb-1 ${getRiskTextColor(team.riskLevel)}`}>{team.riskScore}</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-white mb-0.5">{team.name}</p>
                            <p className="text-[10px] text-slate-400">{team.headcount} FTE</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Critical (75+)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div> High (50-74)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Moderate (30-49)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Low (0-29)</div>
      </div>
    </div>
  );
};
