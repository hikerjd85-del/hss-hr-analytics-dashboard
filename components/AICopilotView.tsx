/**
 * ============================================================
 * AI WORKFORCE COPILOT
 * ============================================================
 * A conversational AI chat interface for natural-language
 * queries against workforce data. Fully self-contained —
 * remove this file + its sidebar entry to cleanly detach.
 * ============================================================
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles, Send, Bot, User, TrendingUp, TrendingDown, AlertTriangle,
  ChevronRight, BarChart3, Clock, Users, Loader2, Copy, ThumbsUp,
  ThumbsDown, RotateCcw, Lightbulb
} from 'lucide-react';
import { SectionGuide } from './SectionGuide';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: ChartConfig;
  kpis?: KpiCard[];
  suggestions?: string[];
  timestamp: Date;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  data: any[];
  dataKey: string;
  nameKey: string;
  title: string;
  colors?: string[];
}

interface KpiCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

// ─── Mock Response Engine ───────────────────────────────────
// Simulates an AI backend. Each "intent" maps to a rich answer.
const RESPONSE_MAP: Record<string, Omit<Message, 'id' | 'role' | 'timestamp'>> = {
  overtime: {
    content: `**Overtime Analysis — Q4 2025 vs Q3 2025**\n\nOvertime hours spiked **+12.4%** quarter-over-quarter, primarily driven by the **North Zone Emergency** department. Critical Care and Emergency departments account for **65%** of total overtime spend.\n\n**Root Causes:**\n• Nursing vacancy backfill — 142 open FTE positions\n• Flu season surge in Emergency (+25%)\n• Mandatory overtime in ICU units\n\n**Recommendation:** Accelerate recruitment pipeline for North Zone nursing roles. Consider temporary staffing agency partnerships for a 6-week bridge.`,
    chart: {
      type: 'bar',
      title: 'Overtime Hours by Department',
      nameKey: 'dept',
      dataKey: 'hours',
      data: [
        { dept: 'Critical Care', hours: 4200, prev: 3100 },
        { dept: 'Emergency', hours: 3800, prev: 3200 },
        { dept: 'Surgery', hours: 2100, prev: 1900 },
        { dept: 'General', hours: 1800, prev: 1700 },
        { dept: 'Admin', hours: 900, prev: 850 },
      ],
      colors: ['#ef4444', '#94a3b8'],
    },
    kpis: [
      { label: 'Total OT Hours', value: '16,420', change: '+12.4%', positive: false },
      { label: 'OT Cost', value: '$2.4M', change: '+18.2%', positive: false },
      { label: 'Avg OT/Employee', value: '8.2 hrs', change: '+1.4hrs', positive: false },
    ],
    suggestions: [
      'Show me overtime trends over the past 12 months',
      'Which employees have the most overtime?',
      'Compare overtime costs: North vs South Zone',
    ],
  },
  turnover: {
    content: `**Turnover & Attrition Report**\n\nThe overall turnover rate stands at **8.7%**, which is a **1.2 percentage point improvement** vs Q3. Voluntary separations remain the dominant driver at **72%** of all terminations.\n\n**Key Findings:**\n• Clinical Ops Leadership has the highest attrition at **14.2%**\n• Employees with 2-3 year tenure have **3x higher** flight risk\n• Exit interview themes: compensation (41%), career growth (33%), work-life balance (26%)`,
    chart: {
      type: 'pie',
      title: 'Turnover by Reason',
      nameKey: 'reason',
      dataKey: 'value',
      data: [
        { reason: 'Compensation', value: 41 },
        { reason: 'Career Growth', value: 33 },
        { reason: 'Work-Life Balance', value: 26 },
      ],
      colors: ['#f97316', '#8b5cf6', '#10b981'],
    },
    kpis: [
      { label: 'Turnover Rate', value: '8.7%', change: '-1.2%', positive: true },
      { label: 'Voluntary', value: '72%', change: '-3%', positive: true },
      { label: 'Avg Tenure', value: '4.2 yrs', change: '+0.3', positive: true },
    ],
    suggestions: [
      'Show flight risk heatmap by department',
      'What is the cost of turnover per position?',
      'Which managers have the best retention rates?',
    ],
  },
  recruitment: {
    content: `**Recruitment Pipeline Status**\n\nTime-to-fill has improved to **42 days** (target: 45 days), representing a **6.7% improvement**. The credentialing bottleneck has been partially resolved for nursing roles.\n\n**Pipeline Snapshot:**\n• **87** active requisitions across 4 zones\n• **342** candidates in pipeline (screening → offer)\n• **23** offers pending acceptance\n• Source effectiveness: Internal referrals outperform job boards by **2.8x**`,
    chart: {
      type: 'bar',
      title: 'Recruitment Funnel',
      nameKey: 'stage',
      dataKey: 'count',
      data: [
        { stage: 'Applied', count: 1240 },
        { stage: 'Screened', count: 620 },
        { stage: 'Interviewed', count: 224 },
        { stage: 'Offered', count: 87 },
        { stage: 'Hired', count: 64 },
      ],
      colors: ['#3b82f6'],
    },
    kpis: [
      { label: 'Time-to-Fill', value: '42 days', change: '-6.7%', positive: true },
      { label: 'Open Reqs', value: '87', change: '+12', positive: false },
      { label: 'Offer Accept Rate', value: '78%', change: '+5%', positive: true },
    ],
    suggestions: [
      'What roles are hardest to fill?',
      'Show me cost-per-hire by source',
      'Which zones have the longest time-to-fill?',
    ],
  },
  headcount: {
    content: `**Headcount Overview**\n\nTotal active headcount is **4,231 FTE** as of this quarter, up **2.3%** from Q3. Growth is concentrated in clinical operations, while administrative headcount has been optimized.\n\n**Breakdown by Zone:**\n• North Zone: 1,420 FTE (34%)\n• South Zone: 1,180 FTE (28%)\n• East Zone: 890 FTE (21%)\n• West Zone: 741 FTE (17%)`,
    chart: {
      type: 'line',
      title: 'Headcount Trend (12 months)',
      nameKey: 'month',
      dataKey: 'headcount',
      data: [
        { month: 'Apr', headcount: 4050 },
        { month: 'May', headcount: 4080 },
        { month: 'Jun', headcount: 4095 },
        { month: 'Jul', headcount: 4110 },
        { month: 'Aug', headcount: 4130 },
        { month: 'Sep', headcount: 4136 },
        { month: 'Oct', headcount: 4170 },
        { month: 'Nov', headcount: 4195 },
        { month: 'Dec', headcount: 4210 },
        { month: 'Jan', headcount: 4218 },
        { month: 'Feb', headcount: 4225 },
        { month: 'Mar', headcount: 4231 },
      ],
      colors: ['#10b981'],
    },
    kpis: [
      { label: 'Total FTE', value: '4,231', change: '+2.3%', positive: true },
      { label: 'New Hires', value: '164', change: '+18', positive: true },
      { label: 'Departures', value: '69', change: '-12', positive: true },
    ],
    suggestions: [
      'What is the headcount forecast for next quarter?',
      'Show me department-level breakdown',
      'How does our growth compare to industry benchmarks?',
    ],
  },
};

// Default fallback response
const FALLBACK_RESPONSE: Omit<Message, 'id' | 'role' | 'timestamp'> = {
  content: `I analyzed your question across the workforce data. Here's what I found:\n\n**Summary:** Based on current Q4 data, workforce metrics are trending within acceptable ranges. Key areas to watch include overtime in the North Zone and nursing vacancy rates.\n\nWould you like me to drill deeper into any specific area?`,
  suggestions: [
    'Analyze overtime trends',
    'Show turnover breakdown',
    'What is our current headcount?',
    'Review recruitment pipeline',
  ],
};

// ─── Intent Detection (Simple keyword matching) ─────────────
function detectIntent(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('overtime') || q.includes('ot ') || q.includes('extra hours')) return 'overtime';
  if (q.includes('turnover') || q.includes('attrition') || q.includes('quit') || q.includes('leave') || q.includes('retention')) return 'turnover';
  if (q.includes('recruit') || q.includes('hiring') || q.includes('hire') || q.includes('pipeline') || q.includes('time-to-fill') || q.includes('vacancy')) return 'recruitment';
  if (q.includes('headcount') || q.includes('workforce') || q.includes('employees') || q.includes('fte') || q.includes('staff')) return 'headcount';
  return 'fallback';
}

// ─── Styled Chart Tooltip ───────────────────────────────────
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }}></span>
            {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Chart Renderer ─────────────────────────────────────────
const InlineChart: React.FC<{ config: ChartConfig; isDarkMode: boolean }> = ({ config, isDarkMode }) => {
  const colors = config.colors || ['#3b82f6', '#94a3b8'];
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';

  if (config.type === 'pie') {
    return (
      <div className="my-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{config.title}</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={config.data}
                dataKey={config.dataKey}
                nameKey={config.nameKey}
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                paddingAngle={4}
                strokeWidth={0}
                animationDuration={1200}
              >
                {config.data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {config.data.map((entry: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
              {entry[config.nameKey]} ({entry[config.dataKey]}%)
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (config.type === 'line') {
    return (
      <div className="my-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{config.title}</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey={config.nameKey} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey={config.dataKey} stroke={colors[0]} strokeWidth={2.5} dot={{ strokeWidth: 2, r: 4, fill: colors[0] }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Bar chart (default)
  return (
    <div className="my-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{config.title}</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey={config.nameKey} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey={config.dataKey} fill={colors[0]} radius={[6, 6, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── Suggested Prompts ──────────────────────────────────────
const STARTER_PROMPTS = [
  { text: 'Analyze overtime trends across departments', icon: Clock, color: 'from-orange-500 to-red-500' },
  { text: 'Show me current turnover analysis', icon: TrendingDown, color: 'from-rose-500 to-pink-500' },
  { text: 'What is our total headcount?', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { text: 'Review recruitment pipeline status', icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
];

// ─── Main Component ─────────────────────────────────────────
interface AICopilotViewProps {
  isDarkMode: boolean;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({ isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = text || inputValue.trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay (1.5-3s)
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const intent = detectIntent(query);
      const responseData = RESPONSE_MAP[intent] || FALLBACK_RESPONSE;

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.content,
        chart: responseData.chart as ChartConfig | undefined,
        kpis: responseData.kpis,
        suggestions: responseData.suggestions,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg shadow-md shadow-violet-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">AI Workforce Copilot</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask anything about your workforce data in natural language.</p>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"></div>
      </div>

      {/* Guide */}
      <SectionGuide
        title="AI Workforce Copilot"
        subtitle="Tap to learn how to use natural-language workforce intelligence"
        accentColor="from-violet-500 to-indigo-600"
        accentBg="from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10"
        purpose="The AI Workforce Copilot lets you ask plain-English questions about your HR data and get instant analysis with interactive charts, KPI snapshots, and actionable recommendations. Think of it as your personal HR data analyst available 24/7."
        steps={[
          { title: 'Ask a Question or Pick a Prompt', description: 'Type your question in the input bar at the bottom (e.g., \"Show me overtime trends\") or click one of the suggested prompt cards.' },
          { title: 'Review the AI Response', description: 'The Copilot responds with detailed analysis including bold key findings, data-backed insights, and root cause explanations.' },
          { title: 'Explore Charts & KPIs', description: 'Each response may include inline charts (bar, line, or pie) and KPI summary cards displaying the most important metrics at a glance.' },
          { title: 'Follow Up for Deeper Insights', description: 'Purple follow-up suggestion pills appear after each response. Click any of them to drill deeper into a specific area.' },
          { title: 'Use Action Buttons', description: 'Copy responses with the copy icon, or use thumbs up/down to provide feedback on the analysis quality.' }
        ]}
        keyMetrics={[
          { label: 'Inline Charts', explanation: 'Visual bar, line, and pie charts embedded directly in the conversation to show trends and distributions.' },
          { label: 'KPI Summary Cards', explanation: 'Three snapshot cards per response showing the most critical numbers with trend indicators.' },
          { label: 'Follow-up Prompts', explanation: 'AI-generated next questions to help you drill deeper without starting from scratch.' },
          { label: 'Typing Indicator', explanation: 'Bouncing dots show the AI is analyzing your question (typically 2-3 seconds).' }
        ]}
        proTips={[
          { text: 'Start with broad questions like \"How is overtime trending?\" then use follow-up prompts to narrow down.' },
          { text: 'The Copilot understands natural language. You do not need exact metric names.' },
          { text: 'Click the reset button to start a fresh conversation at any time.' },
          { text: 'Try comparing zones or departments: \"Compare North vs South Zone attrition.\"' }
        ]}
        faqs={[
          { question: 'Is the AI analyzing real-time data?', answer: 'Currently the Copilot uses pre-loaded quarterly data for demonstration. In production it connects to your live HR data warehouse.' },
          { question: 'Can I export the analysis?', answer: 'Use the copy button on any AI response to copy text to your clipboard for emails, reports, or presentations.' },
          { question: 'What topics can I ask about?', answer: 'Overtime, turnover/attrition, recruitment pipeline, headcount trends, and general workforce questions.' },
          { question: 'Who can access this tool?', answer: 'All HR Analytics dashboard users. Data respects your role-based access permissions.' }
        ]}
      />

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">

          {/* Empty State */}
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center">
                  <Bot size={36} className="text-violet-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-white dark:border-slate-800 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">What would you like to know?</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8">I can analyze workforce metrics, generate insights, and help you make data-driven decisions.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(prompt.text)}
                    className="group text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${prompt.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <prompt.icon size={16} className="text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">{prompt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <Bot size={16} className="text-white" />
                  </div>
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#002f56] to-[#004a80] text-white rounded-tr-md'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-md'
                }`}>
                  {/* Format content with markdown-style bold */}
                  <div className={`text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user' ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </div>
                </div>

                {/* KPI Cards */}
                {msg.kpis && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {msg.kpis.map((kpi, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">{kpi.value}</p>
                        <span className={`text-xs font-bold ${kpi.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {kpi.change}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Chart */}
                {msg.chart && <InlineChart config={msg.chart} isDarkMode={isDarkMode} />}

                {/* Action Buttons for AI messages */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" title="Copy">
                      <Copy size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors" title="Helpful">
                      <ThumbsUp size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors" title="Not helpful">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}

                {/* Suggested Follow-ups */}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors flex items-center gap-1"
                      >
                        <Lightbulb size={10} />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-md px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 size={14} className="animate-spin text-violet-500" />
                  <span>Analyzing workforce data...</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/80 backdrop-blur-lg">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="New conversation"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about overtime, turnover, headcount, recruitment..."
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-40 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">AI Copilot uses simulated data for demonstration purposes.</p>
        </div>
      </div>
    </div>
  );
};
