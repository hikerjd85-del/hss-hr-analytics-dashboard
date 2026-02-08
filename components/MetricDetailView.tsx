import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Clock, Filter, ChevronDown, Download, Share2, Printer,
    ArrowUp, ArrowRight, ArrowDown, CreditCard, BedDouble, Users, HardHat,
    UserMinus, Sprout, MapPin, Binoculars, TreeDeciduous, UserCheck, TrendingUp, TrendingDown, AlertTriangle
} from 'lucide-react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, BarChart, LineChart
} from 'recharts';
import { DashboardItem } from '../types';

interface MetricDetailViewProps {
    item: DashboardItem;
    onBack: () => void;
    isDarkMode?: boolean;
}

// --- Metric Configuration Types ---
interface MetricConfig {
    title: string;
    kpiLabel: string;
    kpiLabel2?: string;
    rateLabel: string;
    baseVolume: number;
    baseRate: number;
    color: string;
    secondaryColor: string;
    icon: any;
    chartType: 'hours' | 'workforce' | 'recruitment' | 'risk';
    additionalMetrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
}

// --- Get Metric Configuration ---
const getMetricConfig = (itemId: string): MetricConfig => {
    const configs: Record<string, MetricConfig> = {
        'paid-hours': {
            title: 'Paid Hours',
            kpiLabel: 'Total Paid Hours',
            rateLabel: 'Avg Hours/FTE',
            baseVolume: 5600000,
            baseRate: 152,
            color: '#f97316',
            secondaryColor: '#fdba74',
            icon: CreditCard,
            chartType: 'hours'
        },
        'worked-hours': {
            title: 'Worked Hours',
            kpiLabel: 'Total Worked Hours',
            kpiLabel2: 'Productive Hours',
            rateLabel: 'Utilization Rate',
            baseVolume: 5200000,
            baseRate: 92.8,
            color: '#ea580c',
            secondaryColor: '#fb923c',
            icon: HardHat,
            chartType: 'hours',
            additionalMetrics: [
                { label: 'Non-Productive', value: '7.2%', trend: 'down' },
                { label: 'Overtime Ratio', value: '4.1%', trend: 'neutral' }
            ]
        },
        'sick-hours': {
            title: 'Sick Hours / Days',
            kpiLabel: 'Total Sick Hours',
            kpiLabel2: 'Sick Days',
            rateLabel: 'Sick Rate',
            baseVolume: 320000,
            baseRate: 4.2,
            color: '#ef4444',
            secondaryColor: '#fca5a5',
            icon: BedDouble,
            chartType: 'hours',
            additionalMetrics: [
                { label: 'Avg Days/Employee', value: '5.8', trend: 'up' },
                { label: 'LTD Cases', value: '142', trend: 'neutral' }
            ]
        },
        'overtime': {
            title: 'Overtime (OT) Hours',
            kpiLabel: 'OT Hours',
            rateLabel: 'OT % PH',
            baseVolume: 740000,
            baseRate: 2.9,
            color: '#002f56',
            secondaryColor: '#78be20',
            icon: Clock,
            chartType: 'hours'
        },
        'workforce': {
            title: 'Workforce Overview',
            kpiLabel: 'Total Headcount',
            kpiLabel2: 'FTE Count',
            rateLabel: 'Fill Rate',
            baseVolume: 112500,
            baseRate: 94.2,
            color: '#10b981',
            secondaryColor: '#6ee7b7',
            icon: Users,
            chartType: 'workforce',
            additionalMetrics: [
                { label: 'Active Positions', value: '119,450', trend: 'neutral' },
                { label: 'Vacant', value: '6,950', trend: 'down' }
            ]
        },
        'terminations': {
            title: 'Terminations',
            kpiLabel: 'Total Terminations',
            kpiLabel2: 'Voluntary',
            rateLabel: 'Turnover Rate',
            baseVolume: 4850,
            baseRate: 12.4,
            color: '#dc2626',
            secondaryColor: '#fca5a5',
            icon: UserMinus,
            chartType: 'workforce',
            additionalMetrics: [
                { label: 'Involuntary', value: '1,245', trend: 'down' },
                { label: 'Avg Tenure', value: '4.2 yrs', trend: 'neutral' }
            ]
        },
        'retirements': {
            title: 'Retirements',
            kpiLabel: 'Total Retirements',
            kpiLabel2: 'Pending',
            rateLabel: 'Retirement Rate',
            baseVolume: 2180,
            baseRate: 3.8,
            color: '#059669',
            secondaryColor: '#a7f3d0',
            icon: Sprout,
            chartType: 'workforce',
            additionalMetrics: [
                { label: 'Avg Age', value: '62.4 yrs', trend: 'neutral' },
                { label: 'With Pension', value: '94%', trend: 'up' }
            ]
        },
        'internal-transfers': {
            title: 'Internal Transfers',
            kpiLabel: 'Total Transfers',
            kpiLabel2: 'Promotions',
            rateLabel: 'Mobility Rate',
            baseVolume: 3420,
            baseRate: 5.6,
            color: '#0891b2',
            secondaryColor: '#67e8f9',
            icon: MapPin,
            chartType: 'workforce',
            additionalMetrics: [
                { label: 'Lateral Moves', value: '2,180', trend: 'neutral' },
                { label: 'Cross-Zone', value: '845', trend: 'up' }
            ]
        },
        'vacancy': {
            title: 'Vacancy Analysis',
            kpiLabel: 'Open Positions',
            kpiLabel2: 'Critical Vacancies',
            rateLabel: 'Vacancy Rate',
            baseVolume: 6950,
            baseRate: 5.8,
            color: '#7c3aed',
            secondaryColor: '#c4b5fd',
            icon: Binoculars,
            chartType: 'recruitment',
            additionalMetrics: [
                { label: 'Avg Days Open', value: '42', trend: 'down' },
                { label: 'Cost Impact', value: '$2.4M', trend: 'up' }
            ]
        },
        'retirement-risk': {
            title: 'Retirement Risk',
            kpiLabel: 'At-Risk Employees',
            kpiLabel2: 'Critical Roles',
            rateLabel: 'Risk Coverage',
            baseVolume: 8420,
            baseRate: 68.5,
            color: '#dc2626',
            secondaryColor: '#fecaca',
            icon: TreeDeciduous,
            chartType: 'risk',
            additionalMetrics: [
                { label: '< 2 Years', value: '3,245', trend: 'up' },
                { label: 'Succession Ready', value: '42%', trend: 'neutral' }
            ]
        },
        'new-hires': {
            title: 'New Hires',
            kpiLabel: 'Total New Hires',
            kpiLabel2: 'This Month',
            rateLabel: '90-Day Retention',
            baseVolume: 5680,
            baseRate: 87.2,
            color: '#16a34a',
            secondaryColor: '#86efac',
            icon: UserCheck,
            chartType: 'recruitment',
            additionalMetrics: [
                { label: 'In Onboarding', value: '1,245', trend: 'neutral' },
                { label: 'Completed Training', value: '78%', trend: 'up' }
            ]
        },
        'recruitment': {
            title: 'Recruitment Pipeline',
            kpiLabel: 'Applications',
            kpiLabel2: 'In Review',
            rateLabel: 'Hiring Rate',
            baseVolume: 15400,
            baseRate: 12.5,
            color: '#8b5cf6',
            secondaryColor: '#c4b5fd',
            icon: Users,
            chartType: 'recruitment',
            additionalMetrics: [
                { label: 'Time to Hire', value: '38 days', trend: 'down' },
                { label: 'Offer Accept', value: '82%', trend: 'up' }
            ]
        }
    };

    return configs[itemId] || configs['overtime'];
};

// --- Dynamic Data Generator ---
const generateMetricData = (itemId: string, filters: any, config: MetricConfig) => {
    let volume = config.baseVolume;

    // Apply filter multipliers
    if (filters.zone && filters.zone !== '(All)') {
        const zoneMultipliers: Record<string, number> = {
            'North': 0.12, 'Edmonton': 0.35, 'Central': 0.15, 'Calgary': 0.28, 'South': 0.10
        };
        volume = Math.floor(volume * (zoneMultipliers[filters.zone] || 0.22));
    }
    if (filters.year === 'FY 2025') volume = Math.floor(volume * 0.95);
    if (filters.month && filters.month !== '(All)') volume = Math.floor(volume / 12);

    const seed = (filters.zone?.length || 0) + (filters.month?.length || 0);
    volume = Math.floor(volume * (0.95 + (seed % 10) / 100));
    const rate = (config.baseRate * (0.9 + (seed % 20) / 100)).toFixed(1);

    // Generate trend data based on chart type
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const trendData = months.map((m, i) => {
        const baseVal = parseFloat(rate);
        const variance = config.chartType === 'risk' ? 5 : (config.chartType === 'hours' ? 0.5 : 2);
        return {
            month: `${m} ${i > 8 ? '2026' : '2025'}`,
            val: (baseVal + (Math.random() * variance - variance / 2)).toFixed(1),
            trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'flat'
        };
    });

    // Generate breakdown data based on metric type
    let breakdownData1: any[] = [];
    let breakdownData2: any[] = [];
    let pieData: any[] = [];

    if (config.chartType === 'hours') {
        breakdownData1 = [
            { name: 'UNA', value: Math.floor(volume * 0.45), rate: parseFloat(rate) * 1.2 },
            { name: 'AUPE GSS', value: Math.floor(volume * 0.25), rate: parseFloat(rate) * 0.9 },
            { name: 'HSAA', value: Math.floor(volume * 0.15), rate: parseFloat(rate) * 1.0 },
            { name: 'Other', value: Math.floor(volume * 0.15), rate: parseFloat(rate) * 0.8 },
        ];
        breakdownData2 = [
            { name: 'RFT', value: Math.floor(volume * 0.55), rate: parseFloat(rate) * 1.1 },
            { name: 'RPT', value: Math.floor(volume * 0.30), rate: parseFloat(rate) * 0.9 },
            { name: 'Casual', value: Math.floor(volume * 0.15), rate: parseFloat(rate) * 1.3 },
        ];
        pieData = [
            { name: 'Clinical', value: Math.floor(volume * 0.72), rate: parseFloat(rate), color: config.color },
            { name: 'Non-Clinical', value: Math.floor(volume * 0.28), rate: parseFloat(rate) * 0.5, color: config.secondaryColor },
        ];
    } else if (config.chartType === 'workforce') {
        breakdownData1 = [
            { name: 'Nursing', value: Math.floor(volume * 0.38), rate: parseFloat(rate) * 1.3 },
            { name: 'Allied Health', value: Math.floor(volume * 0.22), rate: parseFloat(rate) * 0.9 },
            { name: 'Support', value: Math.floor(volume * 0.25), rate: parseFloat(rate) * 1.1 },
            { name: 'Admin', value: Math.floor(volume * 0.15), rate: parseFloat(rate) * 0.7 },
        ];
        breakdownData2 = [
            { name: '< 1 yr', value: Math.floor(volume * 0.18), rate: parseFloat(rate) * 1.8 },
            { name: '1-5 yrs', value: Math.floor(volume * 0.32), rate: parseFloat(rate) * 1.2 },
            { name: '5-10 yrs', value: Math.floor(volume * 0.28), rate: parseFloat(rate) * 0.8 },
            { name: '10+ yrs', value: Math.floor(volume * 0.22), rate: parseFloat(rate) * 0.5 },
        ];
        pieData = itemId === 'terminations' ? [
            { name: 'Voluntary', value: Math.floor(volume * 0.74), rate: 9.2, color: '#f97316' },
            { name: 'Involuntary', value: Math.floor(volume * 0.26), rate: 3.2, color: config.color },
        ] : [
            { name: 'Full-Time', value: Math.floor(volume * 0.62), rate: parseFloat(rate) * 0.8, color: config.color },
            { name: 'Part-Time', value: Math.floor(volume * 0.38), rate: parseFloat(rate) * 1.4, color: config.secondaryColor },
        ];
    } else if (config.chartType === 'recruitment') {
        breakdownData1 = [
            { name: 'Nursing', value: Math.floor(volume * 0.42), rate: parseFloat(rate) * 0.8 },
            { name: 'Technical', value: Math.floor(volume * 0.28), rate: parseFloat(rate) * 1.1 },
            { name: 'Admin', value: Math.floor(volume * 0.18), rate: parseFloat(rate) * 1.4 },
            { name: 'Clinical Support', value: Math.floor(volume * 0.12), rate: parseFloat(rate) * 1.0 },
        ];
        breakdownData2 = [
            { name: 'Internal', value: Math.floor(volume * 0.22), rate: 45 },
            { name: 'Job Board', value: Math.floor(volume * 0.35), rate: 32 },
            { name: 'Referral', value: Math.floor(volume * 0.28), rate: 28 },
            { name: 'Agency', value: Math.floor(volume * 0.15), rate: 18 },
        ];
        pieData = [
            { name: 'New Applications', value: Math.floor(volume * 0.45), rate: 0, color: '#c4b5fd' },
            { name: 'In Review', value: Math.floor(volume * 0.25), rate: 0, color: '#8b5cf6' },
            { name: 'Interview', value: Math.floor(volume * 0.18), rate: 0, color: '#6d28d9' },
            { name: 'Offer Extended', value: Math.floor(volume * 0.12), rate: 0, color: '#4c1d95' },
        ];
    } else { // risk
        breakdownData1 = [
            { name: 'Nursing', value: Math.floor(volume * 0.35), rate: 72 },
            { name: 'Management', value: Math.floor(volume * 0.18), rate: 45 },
            { name: 'Technical', value: Math.floor(volume * 0.25), rate: 68 },
            { name: 'Admin', value: Math.floor(volume * 0.22), rate: 82 },
        ];
        breakdownData2 = [
            { name: '< 1 Year', value: Math.floor(volume * 0.25), rate: 95 },
            { name: '1-2 Years', value: Math.floor(volume * 0.35), rate: 75 },
            { name: '2-5 Years', value: Math.floor(volume * 0.40), rate: 55 },
        ];
        pieData = [
            { name: 'High Risk', value: Math.floor(volume * 0.28), rate: 0, color: '#dc2626' },
            { name: 'Medium Risk', value: Math.floor(volume * 0.42), rate: 0, color: '#f97316' },
            { name: 'Low Risk', value: Math.floor(volume * 0.30), rate: 0, color: '#22c55e' },
        ];
    }

    // Zone distribution
    const zones = [
        { name: 'North', value: Math.floor(volume * 0.12), rate: (parseFloat(rate) * 1.2).toFixed(1) },
        { name: 'Edmonton', value: Math.floor(volume * 0.35), rate: (parseFloat(rate) * 1.0).toFixed(1) },
        { name: 'Central', value: Math.floor(volume * 0.15), rate: (parseFloat(rate) * 1.1).toFixed(1) },
        { name: 'Calgary', value: Math.floor(volume * 0.28), rate: (parseFloat(rate) * 0.9).toFixed(1) },
        { name: 'South', value: Math.floor(volume * 0.10), rate: (parseFloat(rate) * 1.1).toFixed(1) },
    ];

    return { volume, rate, trendData, breakdownData1, breakdownData2, pieData, zones };
};

// HSS Icon Component
const HSSIconSmall = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 5 50 A 45 45 0 0 1 95 50" stroke="#78be20" strokeWidth="12" strokeLinecap="butt" strokeDasharray="141" transform="rotate(-15 50 50)" />
        <path d="M 19 50 A 31 31 0 0 1 81 50" stroke="#78be20" strokeWidth="12" strokeLinecap="butt" strokeDasharray="97" transform="rotate(-15 50 50)" />
        <path d="M 33 50 A 17 17 0 0 1 67 50" stroke="#78be20" strokeWidth="12" strokeLinecap="butt" strokeDasharray="53" transform="rotate(-15 50 50)" />
        <path d="M 95 50 A 45 45 0 0 1 5 50" stroke="#002f56" strokeWidth="12" strokeLinecap="butt" strokeDasharray="141" transform="rotate(-15 50 50)" />
        <path d="M 81 50 A 31 31 0 0 1 19 50" stroke="#002f56" strokeWidth="12" strokeLinecap="butt" strokeDasharray="97" transform="rotate(-15 50 50)" />
        <path d="M 67 50 A 17 17 0 0 1 33 50" stroke="#002f56" strokeWidth="12" strokeLinecap="butt" strokeDasharray="53" transform="rotate(-15 50 50)" />
    </svg>
);

// Format large numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toLocaleString();
};

// Chart Label Getters
const getChartLabels = (config: MetricConfig) => {
    if (config.chartType === 'hours') {
        return { chart1: 'Union Breakdown', chart2: 'Employee Class', pie: 'Clinical vs Non-Clinical Split' };
    } else if (config.chartType === 'workforce') {
        return { chart1: 'By Department', chart2: 'By Tenure', pie: 'Employment Type' };
    } else if (config.chartType === 'recruitment') {
        return { chart1: 'By Role Type', chart2: 'By Source', pie: 'Pipeline Stage' };
    } else {
        return { chart1: 'By Department', chart2: 'Time to Retirement', pie: 'Risk Level Distribution' };
    }
};

export const MetricDetailView: React.FC<MetricDetailViewProps> = ({ item, onBack, isDarkMode }) => {
    const [filters, setFilters] = useState({
        year: 'FY 2026',
        month: '(All)',
        zone: '(All)',
        union: '(All)',
        func: '(All)',
        costCenter: '(All)',
        site: '(All)'
    });

    const config = useMemo(() => getMetricConfig(item.id), [item.id]);
    const data = useMemo(() => generateMetricData(item.id, filters, config), [item.id, filters, config]);
    const chartLabels = useMemo(() => getChartLabels(config), [config]);
    const ConfigIcon = config.icon;

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors">
            {/* Top Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                        <HSSIconSmall />
                        <div>
                            <h1 className="text-xl font-bold text-[#002f56] dark:text-white">{config.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-[#78be20] uppercase tracking-widest">People Analytics</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Health Shared Services</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xl text-right hidden lg:block bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
                    <span className="text-[#002f56] dark:text-blue-300 font-bold">Please Note:</span> Data refreshed daily. Filters applied by default.
                </div>
            </div>

            <div className="flex-grow p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">

                {/* TOP ROW: KPIs & Trend */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Main KPI Card */}
                    <div className="col-span-12 md:col-span-3 bg-white dark:bg-slate-800 border-2 rounded-xl p-4 flex items-center gap-6 shadow-sm" style={{ borderColor: `${config.color}20` }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: config.color }}>
                            <ConfigIcon size={32} strokeWidth={2.5} />
                        </div>
                        <div className="flex-grow">
                            <div className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-1 mb-2">{filters.year}</div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{config.kpiLabel}</span>
                                <span className="text-2xl font-bold" style={{ color: config.color }}>{formatNumber(data.volume)}</span>
                            </div>
                            <div className="flex justify-between items-baseline mt-1">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{config.rateLabel}</span>
                                <span className="text-xl font-bold text-[#78be20]">{data.rate}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Metrics Cards */}
                    {config.additionalMetrics && (
                        <div className="col-span-12 md:col-span-3 grid grid-cols-2 gap-3">
                            {config.additionalMetrics.map((metric, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{metric.label}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-slate-800 dark:text-white">{metric.value}</span>
                                        {metric.trend === 'up' && <TrendingUp size={14} className="text-red-500" />}
                                        {metric.trend === 'down' && <TrendingDown size={14} className="text-green-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trend Strip */}
                    <div className={`col-span-12 ${config.additionalMetrics ? 'md:col-span-6' : 'md:col-span-9'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center justify-between overflow-x-auto shadow-sm`}>
                        {data.trendData.map((t, i) => (
                            <div key={i} className="flex flex-col items-center min-w-[70px] px-3 border-r border-slate-100 dark:border-slate-700 last:border-0 group cursor-default">
                                <span className="text-[9px] font-bold text-slate-400 mb-1 uppercase">{t.month}</span>
                                <div className="mb-1 transform group-hover:scale-110 transition-transform">
                                    {t.trend === 'up' && <ArrowUp size={16} className="text-red-500" strokeWidth={4} />}
                                    {t.trend === 'down' && <ArrowDown size={16} className="text-[#78be20]" strokeWidth={4} />}
                                    {t.trend === 'flat' && <ArrowRight size={16} className="text-orange-400" strokeWidth={4} />}
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.val}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="flex-grow grid grid-cols-12 gap-6">

                    {/* LEFT COL: Zone Tiles */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <ZoneTile name="North" data={data.zones[0]} color={config.color} />
                            <ZoneTile name="Central" data={data.zones[2]} color={config.color} opacity={0.85} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <ZoneTile name="Edmonton" data={data.zones[1]} color={config.color} opacity={0.75} />
                            <ZoneTile name="Calgary" data={data.zones[3]} color={config.secondaryColor} textColor="#002f56" />
                        </div>
                        <div className="p-4 rounded-xl shadow-sm relative overflow-hidden" style={{ backgroundColor: config.secondaryColor }}>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full"></div>
                            <div className="text-xs font-bold uppercase opacity-70 mb-1 text-[#002f56]">South</div>
                            <div className="text-lg font-bold text-[#002f56]">{formatNumber(data.zones[4].value)}</div>
                            <div className="text-xs font-bold opacity-90 text-[#002f56]">{data.zones[4].rate}% Rate</div>
                        </div>
                    </div>

                    {/* MIDDLE COL: Charts */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

                        {/* Row 1: Two Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
                            <ChartCard title={chartLabels.chart1} data={data.breakdownData1} color={config.secondaryColor} lineColor={config.color} isDarkMode={isDarkMode} />
                            <ChartCard title={chartLabels.chart2} data={data.breakdownData2} color={config.secondaryColor} lineColor={config.color} isDarkMode={isDarkMode} />
                        </div>

                        {/* Row 2: Pie Chart */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex-grow flex flex-col">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: config.color }}></div>
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{chartLabels.pie}</span>
                            </div>
                            <div className="flex-grow flex items-center justify-center gap-12">
                                <div className="w-48 h-48 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={data.pieData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270} paddingAngle={2}>
                                                {data.pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Total</div>
                                        <div className="text-xl font-extrabold text-[#002f56] dark:text-white">{formatNumber(data.volume)}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {data.pieData.map(d => (
                                        <div key={d.name} className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.name}</span>
                                            </div>
                                            <div className="pl-5">
                                                <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{d.value.toLocaleString()}</div>
                                                {d.rate > 0 && <div className="text-xs font-bold text-slate-400">Rate: {d.rate}%</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: Filters */}
                    <div className="col-span-12 lg:col-span-2 bg-gradient-to-b from-[#002f56] to-[#004f71] dark:from-slate-800 dark:to-slate-900 rounded-xl text-white p-5 flex flex-col gap-4 shadow-lg">
                        <div className="flex items-center gap-2 border-b border-white/20 pb-4">
                            <Filter size={18} className="text-[#78be20]" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Report Filters</h3>
                        </div>

                        <FilterSelect label="Year" value={filters.year} options={['FY 2026', 'FY 2025', 'FY 2024']} onChange={(v) => handleFilterChange('year', v)} />
                        <FilterSelect label="Month" value={filters.month} options={['(All)', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']} onChange={(v) => handleFilterChange('month', v)} />
                        <FilterSelect label="Geo Zone" value={filters.zone} options={['(All)', 'North', 'Central', 'Edmonton', 'Calgary', 'South']} onChange={(v) => handleFilterChange('zone', v)} />
                        <FilterSelect label="Union Group" value={filters.union} options={['(All)', 'UNA', 'HSAA', 'AUPE', 'NUEE']} onChange={(v) => handleFilterChange('union', v)} />
                        <FilterSelect label="Job Function" value={filters.func} options={['(All)', 'Nursing', 'Allied Health', 'Admin', 'Support']} onChange={(v) => handleFilterChange('func', v)} />

                        <button
                            onClick={() => setFilters({ year: 'FY 2026', month: '(All)', zone: '(All)', union: '(All)', func: '(All)', costCenter: '(All)', site: '(All)' })}
                            className="mt-auto w-full py-2 bg-[#78be20] hover:bg-[#89d624] text-[#002f56] font-bold text-xs rounded uppercase tracking-wide transition-colors">
                            Reset All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Zone Tile Component
const ZoneTile = ({ name, data, color, textColor = 'white', opacity = 1 }: any) => (
    <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" style={{ backgroundColor: color, opacity, color: textColor }}>
        <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full"></div>
        <div className="text-xs font-bold uppercase opacity-70 mb-1">{name}</div>
        <div className="text-lg font-bold">{formatNumber(data.value)}</div>
        <div className={`text-xs font-medium opacity-90 ${textColor === 'white' ? 'text-[#78be20]' : ''}`}>{data.rate}% Rate</div>
    </div>
);

// Chart Card Component
const ChartCard = ({ title, data, color, lineColor, isDarkMode }: any) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: lineColor }}></div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart layout="vertical" data={data} margin={{ left: 20, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} interval={0} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: isDarkMode ? '#334155' : '#f8fafc' }} />
                    <Bar dataKey="value" fill={color} barSize={12} radius={[0, 4, 4, 0]} name="Volume" />
                    <Line dataKey="rate" stroke={lineColor} strokeWidth={2} dot={{ r: 3, fill: lineColor, strokeWidth: 0 }} name="Rate" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// Interactive Filter Component
const FilterSelect = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1.5 group relative">
            <label className="text-[10px] uppercase font-bold text-[#78be20] group-hover:text-white transition-colors">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black/20 border border-white/10 px-3 py-2 rounded flex justify-between items-center text-xs hover:bg-black/30 transition-colors text-left"
            >
                {value}
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-[100%] left-0 w-full bg-slate-800 border border-slate-700 shadow-xl rounded-md z-50 max-h-48 overflow-y-auto mt-1">
                    {options.map(opt => (
                        <div
                            key={opt}
                            className="px-3 py-2 text-xs hover:bg-slate-700 cursor-pointer text-slate-200"
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
