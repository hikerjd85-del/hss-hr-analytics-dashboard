/**
 * ============================================================
 * PREDICTIVE SCENARIO CANVAS
 * ============================================================
 * An interactive "what-if" planning tool that lets leaders
 * model workforce scenarios (expansions, attrition waves, budget
 * changes) and see cascading impacts in real-time.
 * Self-contained — remove this file + sidebar entry to detach.
 * ============================================================
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  FlaskConical, Play, RotateCcw, TrendingUp, TrendingDown, Minus,
  DollarSign, Users, Clock, AlertTriangle, ChevronRight, Save,
  Copy, ArrowRight, Zap, BarChart3, Target, Layers
} from 'lucide-react';
import { SectionGuide } from './SectionGuide';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Cell, AreaChart, Area
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────
interface ScenarioParams {
  headcountChange: number; // % change to headcount
  attritionRate: number; // new attrition rate %
  budgetAdjust: number; // % budget change
  hiringSpeed: number; // 1-5 scale (1=slow, 5=aggressive)
  overtimePolicy: 'current' | 'reduce_10' | 'reduce_20' | 'freeze';
}

interface ImpactMetric {
  label: string;
  baseline: number;
  projected: number;
  unit: string;
  icon: React.ElementType;
  positive: boolean; // whether increase is positive
}

interface CascadeEffect {
  title: string;
  description: string;
  severity: 'positive' | 'neutral' | 'warning' | 'critical';
  delay: string;
}

// ─── Scenario Presets ───────────────────────────────────────
const SCENARIO_PRESETS = [
  {
    name: 'Aggressive Growth',
    description: 'Expand headcount 15%, boost hiring',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    params: { headcountChange: 15, attritionRate: 9, budgetAdjust: 20, hiringSpeed: 5, overtimePolicy: 'current' as const },
  },
  {
    name: 'Cost Optimization',
    description: 'Reduce budget, control overtime',
    icon: DollarSign,
    color: 'from-blue-500 to-indigo-500',
    params: { headcountChange: -5, attritionRate: 10, budgetAdjust: -15, hiringSpeed: 2, overtimePolicy: 'reduce_20' as const },
  },
  {
    name: 'Attrition Crisis',
    description: 'Simulate 20% turnover spike',
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-600',
    params: { headcountChange: 0, attritionRate: 20, budgetAdjust: 0, hiringSpeed: 3, overtimePolicy: 'current' as const },
  },
  {
    name: 'Stability Focus',
    description: 'Maintain current with minor adjustments',
    icon: Target,
    color: 'from-amber-500 to-orange-500',
    params: { headcountChange: 2, attritionRate: 8, budgetAdjust: 3, hiringSpeed: 3, overtimePolicy: 'reduce_10' as const },
  },
];

// ─── Baseline Metrics ───────────────────────────────────────
const BASELINE = {
  headcount: 4231,
  annualBudget: 285, // $M
  overtimeCost: 2.4, // $M quarterly
  timeToFill: 42, // days
  turnoverRate: 8.7,
  engagementScore: 72,
  trainingBudgetPerHead: 1200,
  openPositions: 87,
};

// ─── Impact Calculator ─────────────────────────────────────
function calculateImpacts(params: ScenarioParams): {
  metrics: ImpactMetric[];
  cascades: CascadeEffect[];
  projections: any[];
  costBreakdown: any[];
} {
  const hcChange = params.headcountChange / 100;
  const newHC = Math.round(BASELINE.headcount * (1 + hcChange));
  const hcDelta = newHC - BASELINE.headcount;

  // Budget
  const budgetChange = params.budgetAdjust / 100;
  const newBudget = Math.round(BASELINE.annualBudget * (1 + budgetChange) * 10) / 10;

  // Overtime
  const otMultiplier = params.overtimePolicy === 'freeze' ? 0.5 :
    params.overtimePolicy === 'reduce_20' ? 0.8 :
    params.overtimePolicy === 'reduce_10' ? 0.9 : 1.0;
  // Higher attrition = more overtime needed
  const attritionOTBoost = params.attritionRate > 12 ? 1.3 : params.attritionRate > 9 ? 1.15 : 1.0;
  const newOT = Math.round(BASELINE.overtimeCost * otMultiplier * attritionOTBoost * 10) / 10;

  // Time-to-fill (affected by hiring speed and competition)
  const hiringFactor = (6 - params.hiringSpeed) * 0.12; // higher speed = lower time
  const growthPressure = hcChange > 0.1 ? 1.15 : hcChange > 0.05 ? 1.08 : 1.0;
  const newTTF = Math.round(BASELINE.timeToFill * (1 + hiringFactor) * growthPressure);

  // Engagement (impacted by attrition and budget)
  const engagementDelta = -(params.attritionRate - BASELINE.turnoverRate) * 1.5 + (budgetChange * 8);
  const newEngagement = Math.round(Math.max(30, Math.min(95, BASELINE.engagementScore + engagementDelta)));

  // Open positions
  const newOpenPos = Math.round(BASELINE.openPositions + (hcDelta * 0.3) + (params.attritionRate - BASELINE.turnoverRate) * 12);

  const metrics: ImpactMetric[] = [
    { label: 'Total Headcount', baseline: BASELINE.headcount, projected: newHC, unit: 'FTE', icon: Users, positive: true },
    { label: 'Annual Budget', baseline: BASELINE.annualBudget, projected: newBudget, unit: '$M', icon: DollarSign, positive: false },
    { label: 'Quarterly OT Cost', baseline: BASELINE.overtimeCost, projected: newOT, unit: '$M', icon: Clock, positive: false },
    { label: 'Time-to-Fill', baseline: BASELINE.timeToFill, projected: newTTF, unit: 'days', icon: Clock, positive: false },
    { label: 'Turnover Rate', baseline: BASELINE.turnoverRate, projected: params.attritionRate, unit: '%', icon: TrendingDown, positive: false },
    { label: 'Engagement Score', baseline: BASELINE.engagementScore, projected: newEngagement, unit: '/100', icon: BarChart3, positive: true },
  ];

  // Cascade effects
  const cascades: CascadeEffect[] = [];

  if (params.attritionRate > 15) {
    cascades.push({
      title: 'Burnout Chain Reaction',
      description: 'High attrition forces remaining staff into mandatory overtime, creating a self-reinforcing burnout cycle.',
      severity: 'critical',
      delay: 'Within 2-4 weeks',
    });
  }
  if (params.attritionRate > 12) {
    cascades.push({
      title: 'Patient Care Impact',
      description: 'Nurse-to-patient ratios in critical care will exceed safe thresholds, requiring immediate agency staffing.',
      severity: 'warning',
      delay: 'Within 6-8 weeks',
    });
  }
  if (hcChange > 0.1) {
    cascades.push({
      title: 'Onboarding Bottleneck',
      description: `Adding ${hcDelta} FTE will strain HR and training capacity. Consider phased hiring over 2 quarters.`,
      severity: 'warning',
      delay: 'Immediate',
    });
  }
  if (budgetChange < -0.1) {
    cascades.push({
      title: 'Training Budget Squeeze',
      description: 'Per-head training allocation drops below $900, risking compliance and development goals.',
      severity: 'warning',
      delay: 'Next quarter',
    });
  }
  if (params.overtimePolicy === 'freeze') {
    cascades.push({
      title: 'Schedule Coverage Gap',
      description: 'OT freeze requires hiring 15-20 additional FTE to maintain 24/7 coverage in clinical units.',
      severity: 'neutral',
      delay: 'Immediate',
    });
  }
  if (newEngagement > 75) {
    cascades.push({
      title: 'Retention Boost Expected',
      description: 'Improved engagement score predicts 2-3% reduction in voluntary turnover over the next 2 quarters.',
      severity: 'positive',
      delay: '3-6 months',
    });
  }
  if (cascades.length === 0) {
    cascades.push({
      title: 'Stable Trajectory',
      description: 'Current scenario parameters maintain workforce equilibrium with no critical cascading risks.',
      severity: 'positive',
      delay: 'Ongoing',
    });
  }

  // 6-month projection data
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const projections = months.map((month, i) => {
    const progress = (i + 1) / 6;
    return {
      month,
      baseline: BASELINE.headcount,
      projected: Math.round(BASELINE.headcount + (hcDelta * progress) - (params.attritionRate * progress * 4)),
    };
  });

  const costBreakdown = [
    { category: 'Salaries', baseline: 180, projected: Math.round(180 * (1 + hcChange) * (1 + budgetChange * 0.2)) },
    { category: 'Benefits', baseline: 52, projected: Math.round(52 * (1 + hcChange)) },
    { category: 'Overtime', baseline: 9.6, projected: Math.round(newOT * 4 * 10) / 10 },
    { category: 'Recruitment', baseline: 8, projected: Math.round(8 * (1 + Math.max(0, hcChange)) * params.hiringSpeed / 3 * 10) / 10 },
    { category: 'Training', baseline: 5.1, projected: Math.round(5.1 * (1 + budgetChange * 0.3) * 10) / 10 },
  ];

  return { metrics, cascades, projections, costBreakdown };
}

// Tooltip
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((e: any, i: number) => (
          <p key={i} className="text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: e.color }}></span>
            {e.name}: {e.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ─────────────────────────────────────────
interface ScenarioCanvasProps {
  isDarkMode: boolean;
}

export const ScenarioCanvas: React.FC<ScenarioCanvasProps> = ({ isDarkMode }) => {
  const [params, setParams] = useState<ScenarioParams>({
    headcountChange: 0,
    attritionRate: 8.7,
    budgetAdjust: 0,
    hiringSpeed: 3,
    overtimePolicy: 'current',
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const results = useMemo(() => calculateImpacts(params), [params]);

  const handlePresetClick = (preset: typeof SCENARIO_PRESETS[0]) => {
    setActivePreset(preset.name);
    setParams(preset.params);
    runScenario();
  };

  const runScenario = useCallback(() => {
    setIsAnimating(true);
    setHasRun(false);
    setTimeout(() => {
      setHasRun(true);
      setIsAnimating(false);
    }, 800);
  }, []);

  const handleReset = () => {
    setParams({
      headcountChange: 0,
      attritionRate: 8.7,
      budgetAdjust: 0,
      hiringSpeed: 3,
      overtimePolicy: 'current',
    });
    setActivePreset(null);
    setHasRun(false);
  };

  const handleSliderChange = (key: keyof ScenarioParams, value: number | string) => {
    setActivePreset(null);
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const textColor = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md shadow-cyan-500/20">
            <FlaskConical size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">Scenario Planner</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Model "what-if" scenarios and see cascading workforce impacts.</p>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
      </div>

      {/* Guide */}
      <SectionGuide
        title="Scenario Planner"
        subtitle="Tap to learn how to model workforce scenarios and interpret results"
        accentColor="from-cyan-500 to-blue-600"
        accentBg="from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10"
        purpose="The Scenario Planner is a strategic planning tool that lets you model different workforce scenarios before making real decisions. Adjust parameters like headcount, attrition, budget, and policies, then instantly see projected impacts on costs, staffing levels, and organizational health over the next 6 months."
        steps={[
          { title: 'Choose a Preset or Customize', description: 'Start by clicking one of the 4 preset scenarios (Aggressive Growth, Cost Optimization, Attrition Crisis, Stability Focus) or manually adjust the parameter sliders on the left panel.' },
          { title: 'Adjust Parameters', description: 'Fine-tune 5 key levers: Headcount Change (%), Attrition Rate (%), Budget Adjustment (%), Hiring Speed (1-5 scale), and Overtime Policy (Current, -10%, -20%, Freeze).' },
          { title: 'Click Run Scenario', description: 'Press the blue Run Scenario button to compute projected impacts. The system calculates across all interconnected workforce variables simultaneously.' },
          { title: 'Review the KPI Impact Cards', description: 'Six impact cards at the top show projected values with color-coded deltas (green = favorable, red = unfavorable) compared to current baselines.' },
          { title: 'Analyze Charts & Cascading Effects', description: 'Review the 6-month headcount projection chart, annual cost breakdown, and cascading effects panel which surfaces downstream risks and opportunities.' }
        ]}
        keyMetrics={[
          { label: 'Headcount Change', explanation: 'Percentage increase or decrease in total employees. +15% means adding roughly 635 FTE to the current 4,231 workforce.' },
          { label: 'Attrition Rate', explanation: 'Expected annual voluntary turnover. Industry average is 8.7%. Values above 12% trigger cascading burnout warnings.' },
          { label: 'Budget Adjustment', explanation: 'Percentage change to the total annual workforce budget ($285M baseline). Affects hiring, training, and compensation capacity.' },
          { label: 'Hiring Speed', explanation: 'Scale from 1 (Conservative) to 5 (Aggressive). Higher speed means faster fills but increased recruitment costs and potential quality trade-offs.' },
          { label: 'Overtime Policy', explanation: 'Controls overtime spending: Current (no change), -10% (moderate reduction), -20% (significant cut), or Freeze (no new OT approved).' },
          { label: 'Cascading Effects', explanation: 'Downstream impacts that emerge from the combination of your parameter choices, shown with severity levels and estimated timelines.' }
        ]}
        proTips={[
          { text: 'Run the same scenario with different Hiring Speeds to see how time-to-fill affects overall cost projections.' },
          { text: 'Use the Attrition Crisis preset to stress-test your department. If cascading effects show Critical warnings, you may need contingency staffing plans.' },
          { text: 'Compare the Aggressive Growth and Cost Optimization presets side-by-side to find the right balance for your team.' },
          { text: 'Pay close attention to the Cascading Effects panel. It surfaces second-order consequences that may not be obvious from the KPI numbers alone.' },
          { text: 'Click Reset to return all parameters to current baseline values before trying a new scenario.' }
        ]}
        faqs={[
          { question: 'How accurate are the projections?', answer: 'Projections are modeled using historical organizational data and industry benchmarks. They provide directional guidance for planning, not exact predictions. Actual results depend on market conditions, policy execution, and external factors.' },
          { question: 'Can I save a scenario for later?', answer: 'The current version computes scenarios on-the-fly. In a future update, saved scenarios will be available for comparison and team sharing.' },
          { question: 'What are Cascading Effects?', answer: 'These are downstream organizational impacts that result from the combination of your chosen parameters. For example, a high attrition rate combined with overtime freeze can trigger a burnout chain reaction, where remaining staff are overworked, leading to even more departures.' },
          { question: 'Why does hiring speed affect cost?', answer: 'Aggressive hiring requires more recruiters, signing bonuses, relocation packages, and expedited onboarding. The model reflects these real-world cost multipliers.' },
          { question: 'What baseline data is used?', answer: 'All projections start from current organizational baselines: 4,231 FTE headcount, $285M annual budget, 8.7% turnover rate, 42-day time-to-fill, and 72/100 engagement score.' }
        ]}
      />

      {/* Scenario Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {SCENARIO_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className={`text-left p-4 rounded-xl border transition-all hover:shadow-md group ${
              activePreset === preset.name 
                ? 'border-blue-400 dark:border-blue-500 shadow-lg ring-2 ring-blue-400/30 bg-white dark:bg-slate-800' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <preset.icon size={18} className="text-white" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{preset.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{preset.description}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL — Controls */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Layers size={14} /> Scenario Parameters
          </h3>

          <div className="space-y-6">
            {/* Headcount Change Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Headcount Change</label>
                <span className={`text-sm font-extrabold ${params.headcountChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {params.headcountChange > 0 ? '+' : ''}{params.headcountChange}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="25"
                step="1"
                value={params.headcountChange}
                onChange={(e) => handleSliderChange('headcountChange', Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-slate-200 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-20%</span><span>0</span><span>+25%</span>
              </div>
            </div>

            {/* Attrition Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Attrition Rate</label>
                <span className={`text-sm font-extrabold ${params.attritionRate > 12 ? 'text-rose-600' : params.attritionRate > 9 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {params.attritionRate}%
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={params.attritionRate}
                onChange={(e) => handleSliderChange('attritionRate', Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-slate-200 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3%</span><span>Industry avg: 8.7%</span><span>25%</span>
              </div>
            </div>

            {/* Budget Adjustment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Budget Adjustment</label>
                <span className={`text-sm font-extrabold ${params.budgetAdjust >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {params.budgetAdjust > 0 ? '+' : ''}{params.budgetAdjust}%
                </span>
              </div>
              <input
                type="range"
                min="-25"
                max="30"
                step="1"
                value={params.budgetAdjust}
                onChange={(e) => handleSliderChange('budgetAdjust', Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-slate-200 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-25%</span><span>0</span><span>+30%</span>
              </div>
            </div>

            {/* Hiring Speed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Hiring Speed</label>
                <span className="text-sm font-extrabold text-blue-600">
                  {['', 'Conservative', 'Cautious', 'Normal', 'Fast', 'Aggressive'][params.hiringSpeed]}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={params.hiringSpeed}
                onChange={(e) => handleSliderChange('hiringSpeed', Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-slate-200 dark:bg-slate-700"
              />
            </div>

            {/* Overtime Policy */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 block">Overtime Policy</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'current', label: 'Current' },
                  { value: 'reduce_10', label: '-10%' },
                  { value: 'reduce_20', label: '-20%' },
                  { value: 'freeze', label: 'Freeze' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSliderChange('overtimePolicy', opt.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      params.overtimePolicy === opt.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-8">
            <button
              onClick={runScenario}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Play size={16} /> Run Scenario
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL — Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loading State */}
          {isAnimating && (
            <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Computing scenario impacts...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasRun && !isAnimating && (
            <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
              <div className="text-center">
                <FlaskConical size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Configure & Run</p>
                <p className="text-xs text-slate-400">Adjust parameters on the left and hit "Run Scenario" to see impact projections.</p>
              </div>
            </div>
          )}

          {/* Results */}
          {hasRun && !isAnimating && (
            <div className="space-y-6 animate-slide-up">
              {/* KPI Impact Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.metrics.map((metric, i) => {
                  const delta = metric.projected - metric.baseline;
                  const deltaPercent = ((delta / metric.baseline) * 100).toFixed(1);
                  const isGood = metric.positive ? delta >= 0 : delta <= 0;

                  return (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-1 ${isGood ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                          {metric.unit === '$M' ? '$' : ''}{metric.projected}{metric.unit === '$M' ? 'M' : metric.unit === 'FTE' ? '' : metric.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs font-bold ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {delta >= 0 ? '+' : ''}{deltaPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400">from {metric.unit === '$M' ? '$' : ''}{metric.baseline}{metric.unit === '$M' ? 'M' : metric.unit === 'FTE' ? '' : metric.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Headcount Projection Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">6-Month Headcount Projection</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.projections}>
                      <defs>
                        <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Baseline" />
                      <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={2.5} fill="url(#projectedGrad)" dot={{ r: 4, fill: '#3b82f6' }} name="Projected" animationDuration={1200} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-slate-400 inline-block" style={{ borderTop: '2px dashed #94a3b8' }}></span> Baseline</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-blue-500 inline-block"></span> Projected</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Annual Cost Impact ($M)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.costBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="category" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Current" animationDuration={1200} />
                      <Bar dataKey="projected" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Projected" animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cascade Effects */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={14} /> Cascading Effects
                </h3>
                <div className="space-y-3">
                  {results.cascades.map((cascade, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                      cascade.severity === 'critical' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800' :
                      cascade.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' :
                      cascade.severity === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' :
                      'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`shrink-0 p-1.5 rounded-lg ${
                        cascade.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-900/30' :
                        cascade.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        cascade.severity === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {cascade.severity === 'critical' && <AlertTriangle size={16} className="text-rose-600" />}
                        {cascade.severity === 'warning' && <AlertTriangle size={16} className="text-amber-600" />}
                        {cascade.severity === 'positive' && <TrendingUp size={16} className="text-emerald-600" />}
                        {cascade.severity === 'neutral' && <Minus size={16} className="text-slate-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{cascade.title}</p>
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">{cascade.delay}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cascade.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
