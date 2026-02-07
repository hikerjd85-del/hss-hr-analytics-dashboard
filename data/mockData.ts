import { AlertData } from '../types';

export const OPERATIONAL_ALERTS: AlertData[] = [
    {
        id: 'overtime-surge',
        title: 'Overtime Surge',
        theme: 'orange', // mapped to 'rose' style in UI usually, but using theme type
        iconName: 'Clock',
        metric: {
            value: '+12.4%',
            trend: '+12.4%',
            status: 'critical',
            subtitle: 'North Zone • Emergency'
        }
    },
    {
        id: 'sick-leave',
        title: 'Sick Leave Spike',
        theme: 'orange',
        iconName: 'Activity',
        metric: {
            value: '+8.5%',
            trend: '+8.5%',
            status: 'warning',
            subtitle: 'All Zones • Viral'
        }
    },
    {
        id: 'nursing-vacancy',
        title: 'Nursing Vacancy',
        theme: 'purple', // mapped to blue in UI usually
        iconName: 'UserMinus',
        metric: {
            value: '142 FTE',
            status: 'warning', // blue/neutral in UI
            subtitle: 'Rural • Recruitment'
        }
    },
    {
        id: 'key-attrition',
        title: 'Key Attrition',
        theme: 'green',
        iconName: 'TrendingDown',
        metric: {
            value: 'High',
            status: 'good', // Emerald in UI
            subtitle: 'Clinical Ops Leadership'
        }
    }
];

export const EXECUTIVE_BRIEFINGS = [
    {
        id: 'overtime', // Was 'workforce-stability'
        title: 'Workforce Stability Risk',
        type: 'CRITICAL',
        content: 'Combined Overtime & Sick Leave in North Zone suggests imminent burnout.'
    },
    {
        id: 'recruitment', // Was 'hiring-velocity'
        title: 'Hiring Velocity Drop',
        type: 'WARNING',
        content: 'Credentialing bottleneck causing 15% increase in time-to-fill.'
    }
];

export const REPORT_DATA: Record<string, {
    summary: string;
    keyFactors: string[];
    recommendation: string;
    kpis?: { label: string; value: string; change: string; status: 'good' | 'warning' | 'critical' }[];
    chartData?: { label: string; value: number; target?: number }[];
    tableData?: { label: string; current: string; previous: string; change: string }[];
}> = {
    'executive-summary': {
        summary: "Workforce stability metrics indicate a critical variance in overtime usage across the North Zone, driven primarily by vacancies in acute care. However, retention initiatives in the South Zone have yielded a 4% improvement in quarterly attrition rates.",
        keyFactors: [
            "Risk: Sick leave utilization is tracking 12% above forecast for Q2.",
            "Opportunity: New hire velocity has increased by 15% following process optimization."
        ],
        recommendation: "Immediate intervention required for North Zone staffing levels.",
        kpis: [
            { label: 'Total Headcount', value: '112,500', change: '+2.1%', status: 'good' },
            { label: 'Overtime Rate', value: '12.4%', change: '+3.2%', status: 'critical' },
            { label: 'Retention Rate', value: '91%', change: '+2%', status: 'good' },
            { label: 'Time-to-Fill', value: '42 days', change: '-13 days', status: 'good' }
        ],
        chartData: [
            { label: 'North', value: 85, target: 95 },
            { label: 'South', value: 94, target: 95 },
            { label: 'East', value: 92, target: 95 },
            { label: 'West', value: 88, target: 95 },
            { label: 'Central', value: 90, target: 95 }
        ]
    },
    'paid-hours': {
        summary: "Total paid hours have increased by 3.2% YTD, largely driven by a surge in overtime hours in clinical departments. Regular hours remain within 1% of budget variance.",
        keyFactors: [
            "Overtime Usage: Up 15% vs previous quarter.",
            "Regular Hours: Stable with minor seasonal fluctuations."
        ],
        recommendation: "Review scheduling efficiency in clinical wards to reduce overtime dependency.",
        kpis: [
            { label: 'Total Paid Hours', value: '5.6M', change: '+3.2%', status: 'warning' },
            { label: 'Regular Hours', value: '4.9M', change: '+0.8%', status: 'good' },
            { label: 'Overtime Hours', value: '740K', change: '+15%', status: 'critical' }
        ],
        chartData: [
            { label: 'Jan', value: 450 },
            { label: 'Feb', value: 435 },
            { label: 'Mar', value: 485 },
            { label: 'Apr', value: 520 },
            { label: 'May', value: 555 },
            { label: 'Jun', value: 590 }
        ],
        tableData: [
            { label: 'Clinical', current: '2.8M hrs', previous: '2.5M hrs', change: '+12%' },
            { label: 'Admin', current: '1.1M hrs', previous: '1.0M hrs', change: '+10%' },
            { label: 'Support', current: '0.9M hrs', previous: '0.85M hrs', change: '+5.9%' },
            { label: 'Research', current: '0.8M hrs', previous: '0.75M hrs', change: '+6.7%' }
        ]
    },
    'overtime': {
        summary: "Overtime costs have exceeded the quarterly budget by $1.2M. The primary driver is vacancy backfill in specialized nursing units.",
        keyFactors: [
            "Critical Care Units: 40% of total overtime spend.",
            "Emergency Dept: 25% increase due to flu season surge."
        ],
        recommendation: "Accelerate recruitment for specialized nursing roles to mitigate overtime costs.",
        kpis: [
            { label: 'OT Cost YTD', value: '$11.2M', change: '+$2.8M', status: 'critical' },
            { label: 'OT % of Payroll', value: '8.2%', change: '+1.5%', status: 'warning' },
            { label: 'Avg OT/Employee', value: '6.4 hrs', change: '+1.2 hrs', status: 'warning' }
        ],
        chartData: [
            { label: 'Critical Care', value: 4450, target: 2800 },
            { label: 'Emergency', value: 2780, target: 1850 },
            { label: 'Surgery', value: 1850, target: 1400 },
            { label: 'General', value: 1110, target: 1160 },
            { label: 'Admin', value: 465, target: 700 }
        ],
        tableData: [
            { label: 'North Zone', current: '$4.2M', previous: '$2.8M', change: '+50%' },
            { label: 'South Zone', current: '$2.8M', previous: '$2.5M', change: '+12%' },
            { label: 'East Zone', current: '$2.3M', previous: '$2.1M', change: '+9.5%' },
            { label: 'West Zone', current: '$1.9M', previous: '$1.6M', change: '+18.8%' }
        ]
    },
    'sick-hours': {
        summary: "Sick leave utilization has spiked to 5.8%, surpassing the 4% target. This trend is correlated with recent viral outbreaks and reported burnout in high-stress units.",
        keyFactors: [
            "Short-term Disability: 10% increase in stress-related claims.",
            "Viral Impact: 30% of absence attributed to seasonal illness."
        ],
        recommendation: "Implement wellness rounds and review float pool capacity.",
        kpis: [
            { label: 'Sick Rate', value: '5.8%', change: '+1.8%', status: 'critical' },
            { label: 'Avg Days Lost', value: '4.2', change: '+0.8', status: 'warning' },
            { label: 'Cost Impact', value: '$2.1M', change: '+$490K', status: 'critical' }
        ],
        chartData: [
            { label: 'Jan', value: 4.2, target: 4.0 },
            { label: 'Feb', value: 4.5, target: 4.0 },
            { label: 'Mar', value: 5.1, target: 4.0 },
            { label: 'Apr', value: 5.4, target: 4.0 },
            { label: 'May', value: 5.6, target: 4.0 },
            { label: 'Jun', value: 5.8, target: 4.0 }
        ]
    },
    'workforce': {
        summary: "Total headcount has reached 112,500, with a net growth of 2.1% this quarter. As one of the largest healthcare employers in the region, turnover remains manageable but detailed attention is needed in rural sectors.",
        keyFactors: [
            "Retention: 92% retention rate in urban centers.",
            "Rural Gap: 85% retention, highlighting regional disparities."
        ],
        recommendation: "Expand rural retention bonus program and partner with local colleges.",
        kpis: [
            { label: 'Headcount', value: '112,500', change: '+2.1%', status: 'good' },
            { label: 'Turnover', value: '8.2%', change: '-0.5%', status: 'good' },
            { label: 'New Hires', value: '2,870', change: '+18%', status: 'good' }
        ],
        chartData: [
            { label: 'Nursing', value: 42800 },
            { label: 'Clinical', value: 27800 },
            { label: 'Admin', value: 19700 },
            { label: 'Support', value: 14400 },
            { label: 'Exec/Mgmt', value: 7800 }
        ],
        tableData: [
            { label: 'Urban Centers', current: '89,900', previous: '88,100', change: '+2.0%' },
            { label: 'Rural Areas', current: '22,600', previous: '22,000', change: '+2.7%' }
        ]
    },
    'recruitment': {
        summary: "Time-to-fill for clinical roles has improved to 42 days (down from 55), thanks to the new streamlined credentialing process.",
        keyFactors: [
            "Pipeline: 200+ active candidates in final interview stage.",
            "Bottlenecks: Background checks remain the slowest step."
        ],
        recommendation: "Partner with external vendor to expedite background checks.",
        kpis: [
            { label: 'Time-to-Fill', value: '42 days', change: '-13 days', status: 'good' },
            { label: 'Open Positions', value: '568', change: '-74', status: 'good' },
            { label: 'Offer Accept Rate', value: '87%', change: '+5%', status: 'good' }
        ],
        chartData: [
            { label: 'Q1', value: 55 },
            { label: 'Q2', value: 52 },
            { label: 'Q3', value: 48 },
            { label: 'Q4', value: 42 }
        ],
        tableData: [
            { label: 'Nursing', current: '38 days', previous: '52 days', change: '-27%' },
            { label: 'Clinical', current: '45 days', previous: '58 days', change: '-22%' },
            { label: 'Admin', current: '28 days', previous: '35 days', change: '-20%' }
        ]
    }
};
