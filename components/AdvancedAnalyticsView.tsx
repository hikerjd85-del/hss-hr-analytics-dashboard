import React, { useState, useMemo } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Legend
} from 'recharts';
import {
  ArrowLeft, Download, Printer, TrendingUp, TrendingDown, Sparkles, AlertCircle,
  ArrowUpRight, FileText, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { DashboardItem } from '../types';

interface AdvancedAnalyticsViewProps {
  item: DashboardItem;
  onBack: () => void;
  isDarkMode?: boolean;
}

// Metric-specific configuration with written reports
const getMetricAnalytics = (itemId: string) => {
  const configs: Record<string, any> = {
    'overtime': {
      title: 'Overtime Analytics',
      kpis: [
        { label: 'Total OT Cost', value: '$12.4M', trend: '+8.2%', negative: true },
        { label: 'Avg OT/Employee', value: '6.2 hrs/wk', trend: '-2.1%', negative: false },
        { label: 'High-Risk Units', value: '14', trend: '+3', negative: true },
        { label: 'Budget Variance', value: '-$1.8M', trend: 'Over Budget', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'Burnout Risk Alert', desc: 'Emergency Dept has 23% of staff exceeding 60hr/week for 4+ consecutive weeks.', rec: 'Implement mandatory rest periods.', color: 'rose' },
        { type: 'Warning', title: 'Cost Acceleration', desc: 'OT spend increased 15% YoY while productivity metrics remain flat.', rec: 'Review scheduling algorithms.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Staffing Gaps', score: 85 },
        { factor: 'Seasonal Demand', score: 72 },
        { factor: 'Scheduling Issues', score: 68 },
        { factor: 'Training Gaps', score: 45 }
      ],
      writtenReport: {
        executiveSummary: `Overtime expenditure for FY 2026 has reached $12.4M, representing an 8.2% increase over the previous fiscal year. This trend significantly exceeds budgeted projections by $1.8M and warrants immediate executive attention. The primary drivers include persistent staffing gaps in critical care units and inefficient scheduling practices that have not adapted to seasonal demand patterns.`,
        keyFindings: [
          'Emergency Department staff averaging 6.2 overtime hours per week, 48% above industry benchmark',
          '23% of clinical staff in high-acuity areas exceeding safe weekly hour thresholds',
          'Strong correlation (r=0.72) identified between overtime rates and subsequent sick leave usage',
          'Calgary Zone exhibiting highest cost-per-overtime-hour at $78.50, 27% above organizational average',
          '14 units classified as high-risk for burnout based on consecutive overtime patterns'
        ],
        analysis: `The overtime crisis is fundamentally a capacity planning issue compounded by reactive scheduling practices. Root cause analysis reveals that 68% of overtime hours are driven by last-minute shift coverage needs, indicating systemic gaps in float pool utilization and predictive staffing models. The correlation between overtime and sick leave suggests a self-reinforcing cycle where overworked staff require more sick time, further exacerbating coverage gaps. Financial modeling indicates that converting 15% of current overtime hours to permanent FTE positions would yield net savings of $2.1M annually while improving staff wellbeing metrics.`,
        recommendations: [
          { priority: 'Immediate', action: 'Implement mandatory rest periods for staff exceeding 50 hours weekly', impact: 'High', owner: 'Unit Managers' },
          { priority: 'Short-term', action: 'Expand float pool capacity by 25% in high-overtime zones', impact: 'High', owner: 'HR Operations' },
          { priority: 'Medium-term', action: 'Deploy predictive scheduling algorithm to anticipate coverage needs', impact: 'Medium', owner: 'Workforce Planning' },
          { priority: 'Long-term', action: 'Conduct FTE conversion analysis for chronic overtime positions', impact: 'High', owner: 'Finance & HR' }
        ],
        conclusion: `Without intervention, current overtime trends project a $15.2M annual cost and significant patient safety risks due to staff fatigue. The recommended actions, if implemented within 90 days, are projected to reduce overtime expenditure by 22% and improve staff satisfaction scores by 15 points.`
      }
    },
    'terminations': {
      title: 'Turnover Analytics',
      kpis: [
        { label: 'Annualized Rate', value: '12.4%', trend: '+1.2%', negative: true },
        { label: 'Cost of Turnover', value: '$28.6M', trend: '+$4.2M', negative: true },
        { label: 'Avg Tenure at Exit', value: '3.8 yrs', trend: '-0.6 yrs', negative: true },
        { label: 'Regrettable Exits', value: '42%', trend: '+8%', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'High Performer Flight Risk', desc: 'Voluntary exits among top-rated nurses up 34% this quarter.', rec: 'Urgent compensation review for critical roles.', color: 'rose' },
        { type: 'Warning', title: 'First-Year Attrition Spike', desc: '28% of new hires leaving within 12 months, up from 19% baseline.', rec: 'Revamp onboarding program.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Compensation Gap', score: 82 },
        { factor: 'Work-Life Balance', score: 76 },
        { factor: 'Career Growth', score: 64 },
        { factor: 'Management Quality', score: 58 }
      ],
      writtenReport: {
        executiveSummary: `Employee turnover has accelerated to 12.4% annualized rate, with associated costs reaching $28.6M—a $4.2M increase from prior year. Most concerning is the 42% "regrettable exit" rate, indicating we are losing high-performing talent at an unsustainable pace. Exit interview analysis reveals compensation competitiveness and work-life balance as primary drivers, with first-year employees representing a disproportionate share of departures.`,
        keyFindings: [
          'Voluntary turnover among top-quartile performers increased 34% quarter-over-quarter',
          'Average tenure at exit declined to 3.8 years, down 0.6 years from prior period',
          'First-year attrition rate of 28% significantly exceeds 19% organizational baseline',
          'Exit interview themes: compensation (78%), scheduling flexibility (65%), career growth (52%)',
          'Cost per turnover event averages $22,400, including recruitment, training, and productivity loss'
        ],
        analysis: `The turnover crisis reflects a confluence of market and organizational factors. Competitive analysis shows a 12-15% compensation gap for specialized nursing roles compared to regional competitors. Additionally, rigid scheduling practices are driving departures among staff with caregiving responsibilities. The elevated first-year attrition points to onboarding deficiencies—satisfaction surveys show correlation (r=0.78) between onboarding experience and 12-month retention. The $28.6M annual turnover cost understates true impact, as it excludes patient care continuity disruptions and remaining staff morale effects.`,
        recommendations: [
          { priority: 'Immediate', action: 'Conduct market compensation analysis for top 10 critical roles', impact: 'High', owner: 'Total Rewards' },
          { priority: 'Immediate', action: 'Launch retention bonus program for high-performers in shortage areas', impact: 'High', owner: 'HR Business Partners' },
          { priority: 'Short-term', action: 'Pilot flexible scheduling program in 3 high-turnover units', impact: 'Medium', owner: 'Operations' },
          { priority: 'Medium-term', action: 'Redesign onboarding with 90-day mentorship component', impact: 'High', owner: 'Talent Development' }
        ],
        conclusion: `Turnover trends, if unaddressed, project $32M annual costs and critical staffing shortages in specialty areas within 18 months. Priority investment in compensation competitiveness and flexible work arrangements can reduce voluntary turnover by an estimated 25%, yielding $7M+ in annual savings.`
      }
    },
    'vacancy': {
      title: 'Vacancy Analytics',
      kpis: [
        { label: 'Critical Vacancies', value: '847', trend: '+12%', negative: true },
        { label: 'Avg Time to Fill', value: '42 days', trend: '+8 days', negative: true },
        { label: 'Cost of Vacancy', value: '$4.2M/mo', trend: '+$0.8M', negative: true },
        { label: 'Offer Accept Rate', value: '78%', trend: '-4%', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'ICU Staffing Crisis', desc: 'Critical care nursing vacancies at 18.5%, impacting bed availability.', rec: 'Expedite international recruitment.', color: 'rose' },
        { type: 'Warning', title: 'Pipeline Deterioration', desc: 'Qualified applicant pool decreased 22% YoY.', rec: 'Enhance employer branding.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Salary Competition', score: 88 },
        { factor: 'Location Appeal', score: 65 },
        { factor: 'Employer Brand', score: 58 },
        { factor: 'Process Speed', score: 72 }
      ],
      writtenReport: {
        executiveSummary: `The organization currently carries 6,950 open positions with 847 classified as critical vacancies impacting patient care delivery. Average time-to-fill has extended to 42 days (+8 days YoY), contributing to monthly vacancy costs of $4.2M. The declining offer acceptance rate (78%, down 4%) signals competitive positioning challenges requiring immediate strategic response.`,
        keyFindings: [
          'ICU and Emergency nursing vacancies at 18.5%, resulting in 24 closed beds organization-wide',
          'Qualified applicant pool contracted 22% compared to prior year',
          'Competitor salary analysis reveals 15% gap for specialized clinical roles',
          'Offer-to-acceptance conversion declined from 82% to 78% indicating candidate counter-offers',
          'Time-to-fill for specialized roles averages 67 days, creating extended coverage gaps'
        ],
        analysis: `Vacancy challenges stem from a tightening labor market combined with internal process inefficiencies. The 22% applicant pool decline reflects both demographic shifts and employer brand erosion in key markets. Analysis of declined offers reveals salary as primary factor (68%), followed by schedule concerns (22%). Process mapping identified 12 unnecessary days in the screening-to-offer workflow. The cost impact extends beyond direct vacancy expenses—overtime costs in understaffed units exceed $2.1M monthly, and patient throughput metrics show 8% decline correlated with staffing gaps.`,
        recommendations: [
          { priority: 'Immediate', action: 'Approve emergency salary adjustment for ICU/ED nursing roles', impact: 'Critical', owner: 'Executive Leadership' },
          { priority: 'Immediate', action: 'Streamline hiring process to reduce time-to-offer by 40%', impact: 'High', owner: 'Talent Acquisition' },
          { priority: 'Short-term', action: 'Launch international recruitment program for critical care nurses', impact: 'High', owner: 'Global Talent' },
          { priority: 'Medium-term', action: 'Invest $500K in employer branding campaign targeting key talent pools', impact: 'Medium', owner: 'Marketing & HR' }
        ],
        conclusion: `Current vacancy levels represent a patient safety risk and significant financial burden. Immediate action on compensation competitiveness and process efficiency can reduce critical vacancies by 35% within 6 months, recovering approximately $1.5M monthly in avoided overtime and agency costs.`
      }
    },
    'sick-hours': {
      title: 'Absence Analytics',
      kpis: [
        { label: 'Absence Rate', value: '4.8%', trend: '+0.6%', negative: true },
        { label: 'Annual Cost', value: '$18.2M', trend: '+$2.4M', negative: true },
        { label: 'Avg Days/Employee', value: '8.4', trend: '+1.2', negative: true },
        { label: 'LTD Cases', value: '142', trend: '+18', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'Mental Health Trend', desc: 'Stress-related absences up 28% YoY, correlated with overtime.', rec: 'Expand EAP access.', color: 'rose' },
        { type: 'Warning', title: 'Seasonal Pattern', desc: 'Predictive model shows 35% spike expected in Feb-Mar.', rec: 'Pre-position float resources.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Workload Stress', score: 82 },
        { factor: 'Seasonal Illness', score: 75 },
        { factor: 'Chronic Conditions', score: 62 },
        { factor: 'Workplace Safety', score: 48 }
      ],
      writtenReport: {
        executiveSummary: `Organizational absence rate has climbed to 4.8%, representing a 0.6% increase from baseline and driving $18.2M in annual direct and indirect costs. The 28% year-over-year increase in stress-related absences is particularly concerning, showing strong correlation with units experiencing elevated overtime. Long-term disability cases have risen to 142, an 18-case increase requiring proactive intervention.`,
        keyFindings: [
          'Average sick days per employee increased to 8.4, exceeding industry benchmark of 6.2',
          'Mental health-related absence codes increased 28% YoY, concentrated in high-acuity units',
          'Strong correlation (r=0.72) between unit overtime rates and subsequent sick leave patterns',
          '142 active long-term disability cases, up 15% from prior year',
          'Seasonal analysis predicts 35% absence spike in February-March period'
        ],
        analysis: `Absence patterns reveal a systemic wellbeing crisis linked to workload and work environment factors. Units with overtime rates exceeding 10% show 45% higher absence rates, suggesting a burnout-driven cycle. The rise in mental health absences reflects broader workforce stress, potentially exacerbated by post-pandemic adjustment challenges. LTD case growth indicates gaps in early intervention for musculoskeletal and psychological conditions. Cost modeling shows each 0.1% increase in absence rate translates to approximately $380K in direct costs and $620K in productivity impact.`,
        recommendations: [
          { priority: 'Immediate', action: 'Deploy enhanced EAP outreach in high-absence units', impact: 'Medium', owner: 'Employee Health' },
          { priority: 'Immediate', action: 'Pre-position float pool resources for predicted February spike', impact: 'High', owner: 'Workforce Planning' },
          { priority: 'Short-term', action: 'Implement early intervention program for musculoskeletal issues', impact: 'High', owner: 'Occupational Health' },
          { priority: 'Medium-term', action: 'Develop comprehensive wellness program targeting stress reduction', impact: 'High', owner: 'HR & Benefits' }
        ],
        conclusion: `Absence trends indicate a workforce health crisis requiring multi-faceted intervention. Investment in proactive wellness programming and workload management can achieve projected 15% reduction in absence rates, yielding $2.7M annual savings and improved patient care continuity.`
      }
    },
    'retirement-risk': {
      title: 'Succession Risk Analytics',
      kpis: [
        { label: 'Retirement Eligible', value: '8,420', trend: '+12%', negative: true },
        { label: 'Critical Role Risk', value: '342', trend: '+28', negative: true },
        { label: 'Succession Coverage', value: '42%', trend: '-8%', negative: true },
        { label: 'Knowledge Gap Index', value: '6.8/10', trend: '+0.4', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'Leadership Cliff', desc: '34% of senior management eligible for retirement within 24 months.', rec: 'Accelerate leadership development.', color: 'rose' },
        { type: 'Warning', title: 'Specialized Skills Loss', desc: 'Technical specialists have 45% retirement eligibility with minimal succession.', rec: 'Implement knowledge transfer protocols.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Age Demographics', score: 92 },
        { factor: 'Succession Gaps', score: 85 },
        { factor: 'Knowledge Transfer', score: 78 },
        { factor: 'Training Pipeline', score: 62 }
      ],
      writtenReport: {
        executiveSummary: `The organization faces a significant succession crisis with 8,420 employees (7.5% of workforce) eligible for retirement within 24 months. Of greater concern, 342 of these are in critical roles with only 42% succession coverage. The Knowledge Gap Index of 6.8/10 indicates substantial institutional knowledge at risk of departure without adequate transfer mechanisms in place.`,
        keyFindings: [
          '34% of senior management (Director level and above) eligible for retirement within 24 months',
          'Technical specialists in radiology and laboratory services show 45% retirement eligibility',
          'Only 42% of at-risk critical roles have identified successors, down from 50% prior year',
          'Average successor readiness timeline is 18+ months, creating potential leadership gaps',
          'Knowledge documentation exists for only 23% of critical processes and specialized skills'
        ],
        analysis: `The succession crisis reflects decades of demographic patterns now reaching critical mass. The healthcare workforce skews older than general labor markets, and our organization mirrors national trends with 18% of clinical staff over age 55. The 8% decline in succession coverage indicates our development pipeline is not keeping pace with retirement eligibility growth. Most critically, tacit knowledge held by long-tenured specialists—particularly in complex clinical and technical domains—has not been systematically captured. The cost of unplanned leadership transitions averages $180K per role when accounting for productivity loss, interim coverage, and accelerated recruitment.`,
        recommendations: [
          { priority: 'Immediate', action: 'Identify and document top 50 highest-risk critical roles', impact: 'Critical', owner: 'Talent Management' },
          { priority: 'Immediate', action: 'Launch phased retirement program to extend knowledge transfer window', impact: 'High', owner: 'HR Policy' },
          { priority: 'Short-term', action: 'Accelerate high-potential leadership program for identified successors', impact: 'High', owner: 'Leadership Development' },
          { priority: 'Medium-term', action: 'Implement knowledge capture technology for specialized expertise', impact: 'Medium', owner: 'IT & Knowledge Mgmt' }
        ],
        conclusion: `Without aggressive succession intervention, the organization risks losing critical leadership and specialized capabilities that cannot be quickly replaced. A comprehensive succession strategy, implemented over 18 months, can increase coverage to 75% and capture 80% of critical institutional knowledge before departure.`
      }
    },
    'paid-hours': {
      title: 'Paid Hours Analytics',
      kpis: [
        { label: 'Total Paid Hours', value: '5.6M', trend: '+3.2%', negative: false },
        { label: 'Avg Hours/FTE', value: '1,892', trend: '+24 hrs', negative: false },
        { label: 'Non-Productive %', value: '7.8%', trend: '+0.4%', negative: true },
        { label: 'Budget Utilization', value: '98.2%', trend: 'On Target', negative: false }
      ],
      insights: [
        { type: 'Warning', title: 'Non-Productive Hours Rising', desc: 'Training and admin time increased 12% YoY, impacting direct care ratios.', rec: 'Audit non-productive categorizations.', color: 'amber' },
        { type: 'Info', title: 'Seasonal Patterns Identified', desc: 'Q4 shows 8% higher paid hours due to statutory holidays and vacation payouts.', rec: 'Adjust Q4 budget projections.', color: 'blue' }
      ],
      riskFactors: [
        { factor: 'Budget Pressure', score: 65 },
        { factor: 'Productivity Mix', score: 58 },
        { factor: 'Overtime Reliance', score: 72 },
        { factor: 'Scheduling Efficiency', score: 68 }
      ],
      writtenReport: {
        executiveSummary: `Total paid hours for FY 2026 reached 5.6M hours, representing a 3.2% increase over prior year. While budget utilization remains strong at 98.2%, the composition of paid hours warrants attention—non-productive hours have risen to 7.8% of total, driven primarily by increased training requirements and administrative obligations. This shift impacts direct patient care ratios and overall operational efficiency.`,
        keyFindings: [
          'Total paid hours of 5.6M represent $312M in direct labor costs',
          'Average hours per FTE increased to 1,892, reflecting reduced headcount with maintained service levels',
          'Non-productive hours (training, meetings, admin) rose to 7.8%, up from 7.4% prior year',
          'Union-represented staff account for 78% of total paid hours with higher benefit load',
          'Casual and part-time staff paid hours increased 8%, indicating flexible staffing strategy'
        ],
        analysis: `The paid hours profile reflects strategic decisions to maintain service capacity through existing workforce intensification rather than headcount expansion. While this approach has contained costs, the rising non-productive percentage signals potential inefficiency. Analysis reveals that mandatory training requirements added 142,000 hours this year, while meeting time increased 18%. The shift toward casual/part-time staffing, while providing flexibility, increases per-hour costs when benefit load is fully accounted. Budget modeling indicates that current trajectory projects 5.9M paid hours next fiscal year, requiring either budget adjustment or productivity improvements.`,
        recommendations: [
          { priority: 'Immediate', action: 'Audit non-productive hour categorizations for accuracy', impact: 'Medium', owner: 'Finance' },
          { priority: 'Short-term', action: 'Consolidate mandatory training into efficient delivery models', impact: 'Medium', owner: 'Learning & Development' },
          { priority: 'Short-term', action: 'Implement meeting efficiency protocols to reduce admin time', impact: 'Low', owner: 'Operations' },
          { priority: 'Medium-term', action: 'Develop predictive paid hours model for budget planning', impact: 'High', owner: 'Workforce Analytics' }
        ],
        conclusion: `Paid hours management is fundamentally sound but requires attention to productivity mix. Targeted interventions on non-productive hours can recover an estimated 85,000 productive hours annually, equivalent to 45 FTE capacity without additional cost.`
      }
    },
    'worked-hours': {
      title: 'Worked Hours Analytics',
      kpis: [
        { label: 'Total Worked Hours', value: '5.2M', trend: '+2.8%', negative: false },
        { label: 'Utilization Rate', value: '92.8%', trend: '+1.2%', negative: false },
        { label: 'Productive Ratio', value: '94.5%', trend: '-0.8%', negative: true },
        { label: 'Direct Care %', value: '68.2%', trend: '-2.1%', negative: true }
      ],
      insights: [
        { type: 'Warning', title: 'Direct Care Decline', desc: 'Time spent in direct patient care decreased 2.1%, shifting to documentation.', rec: 'Evaluate documentation burden.', color: 'amber' },
        { type: 'Info', title: 'Utilization Improvement', desc: 'Scheduling optimization improved utilization rate by 1.2 percentage points.', rec: 'Expand to additional units.', color: 'blue' }
      ],
      riskFactors: [
        { factor: 'Documentation Burden', score: 78 },
        { factor: 'Scheduling Gaps', score: 62 },
        { factor: 'Task Distribution', score: 65 },
        { factor: 'Technology Friction', score: 58 }
      ],
      writtenReport: {
        executiveSummary: `Worked hours totaled 5.2M for the fiscal year, with utilization rate improving to 92.8%. However, the composition of worked hours reveals concerning trends—direct patient care time declined to 68.2% while documentation and administrative tasks expanded. This shift has implications for care quality, staff satisfaction, and operational efficiency.`,
        keyFindings: [
          'Utilization rate of 92.8% exceeds industry benchmark of 88%, indicating efficient scheduling',
          'Direct patient care time declined from 70.3% to 68.2% of worked hours',
          'Documentation time increased 18% following new EHR module implementation',
          'Clinical support staff worked hours increased 12% to offset RN documentation burden',
          'Weekend and night shift utilization improved 4.2% through enhanced scheduling'
        ],
        analysis: `The worked hours analysis reveals a productivity paradox: while overall utilization has improved, the value of each worked hour has diminished due to non-care task creep. The EHR documentation requirements, while necessary for compliance and quality, have consumed an additional 312,000 hours of clinical time. Staff surveys indicate documentation burden is the top dissatisfier. The compensating increase in clinical support staff partially offsets RN time loss but adds $4.2M in annual labor cost. Analysis of high-performing units shows that technology optimization and task delegation can recover 15-20% of lost direct care time.`,
        recommendations: [
          { priority: 'Immediate', action: 'Deploy documentation efficiency tools (voice-to-text, templates)', impact: 'High', owner: 'IT & Clinical Informatics' },
          { priority: 'Short-term', action: 'Expand scope of practice for clinical support roles', impact: 'High', owner: 'Nursing Leadership' },
          { priority: 'Short-term', action: 'Implement task-time studies in high-burden units', impact: 'Medium', owner: 'Process Improvement' },
          { priority: 'Medium-term', action: 'Redesign clinical workflows to maximize direct care time', impact: 'High', owner: 'Clinical Operations' }
        ],
        conclusion: `While worked hours efficiency has improved, the quality of time utilization requires intervention. Addressing documentation burden and optimizing task distribution can recover an estimated 8% of direct care time, equivalent to 416,000 hours of patient-facing capacity annually.`
      }
    },
    'workforce': {
      title: 'Workforce Analytics',
      kpis: [
        { label: 'Total Headcount', value: '112,450', trend: '+1.8%', negative: false },
        { label: 'FTE Count', value: '98,240', trend: '+2.1%', negative: false },
        { label: 'Fill Rate', value: '94.2%', trend: '-1.4%', negative: true },
        { label: 'Contingent %', value: '8.4%', trend: '+1.2%', negative: true }
      ],
      insights: [
        { type: 'Warning', title: 'Contingent Workforce Growth', desc: 'Agency and contract staff increased 22% YoY, driving cost premiums.', rec: 'Develop conversion strategy.', color: 'amber' },
        { type: 'Info', title: 'Headcount Stabilization', desc: 'Net headcount growth of 1.8% achieved through improved retention.', rec: 'Maintain retention focus.', color: 'blue' }
      ],
      riskFactors: [
        { factor: 'Vacancy Levels', score: 72 },
        { factor: 'Agency Dependency', score: 68 },
        { factor: 'Skill Mix', score: 58 },
        { factor: 'Geographic Distribution', score: 52 }
      ],
      writtenReport: {
        executiveSummary: `The organization employs 112,450 individuals representing 98,240 FTEs, with workforce composition showing notable shifts. Fill rate has declined to 94.2% while contingent workforce has grown to 8.4% of total staffing. These trends indicate ongoing challenges in permanent recruitment while maintaining service levels through flexible staffing arrangements at premium cost.`,
        keyFindings: [
          'Total workforce grew 1.8% through combination of new hires and improved retention',
          'FTE growth of 2.1% reflects shift toward full-time positions in critical areas',
          'Fill rate declined from 95.6% to 94.2%, representing 5,520 unfilled positions',
          'Contingent workforce (agency, travelers) increased 22% to 9,446 workers',
          'RN vacancy rate in acute care reached 12.4%, highest in organization history'
        ],
        analysis: `Workforce dynamics reflect broader healthcare labor market challenges. The 1.8% headcount growth masks significant churn—28% of growth came from contingent workers who command 40-60% cost premiums. Geographic analysis shows rural zones with 18% fill rate gap compared to metro areas. Skill mix analysis indicates over-reliance on experienced staff (>10 years) with insufficient pipeline of early-career professionals. Without intervention, modeling projects fill rate declining to 91% within 18 months.`,
        recommendations: [
          { priority: 'Immediate', action: 'Launch agency-to-permanent conversion program with incentives', impact: 'High', owner: 'HR Operations' },
          { priority: 'Immediate', action: 'Implement rural recruitment incentive package', impact: 'High', owner: 'Talent Acquisition' },
          { priority: 'Short-term', action: 'Expand new graduate programs to build early-career pipeline', impact: 'High', owner: 'Workforce Development' },
          { priority: 'Medium-term', action: 'Develop workforce planning model for 5-year projections', impact: 'Medium', owner: 'Strategic Planning' }
        ],
        conclusion: `Workforce sustainability requires strategic intervention in recruitment, retention, and workforce planning. A comprehensive workforce strategy can improve fill rate to 96% and reduce contingent reliance to 5%, yielding $18M in annual cost avoidance.`
      }
    },
    'retirements': {
      title: 'Retirement Analytics',
      kpis: [
        { label: 'YTD Retirements', value: '2,245', trend: '+18%', negative: true },
        { label: 'Avg Retirement Age', value: '61.2', trend: '-1.4 yrs', negative: true },
        { label: 'Pension Eligible', value: '12,840', trend: '+8%', negative: true },
        { label: 'Early Retirement %', value: '34%', trend: '+6%', negative: true }
      ],
      insights: [
        { type: 'Critical', title: 'Early Retirement Surge', desc: '34% of retirements are early, up from 28% prior year. Stress and burnout cited.', rec: 'Investigate drivers and retention levers.', color: 'rose' },
        { type: 'Warning', title: 'Pension Cliff Approaching', desc: '12,840 employees reaching full pension eligibility within 24 months.', rec: 'Accelerate succession planning.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Early Retirement Trend', score: 85 },
        { factor: 'Pension Eligibility Wave', score: 78 },
        { factor: 'Knowledge Concentration', score: 72 },
        { factor: 'Replacement Timelines', score: 68 }
      ],
      writtenReport: {
        executiveSummary: `Retirement activity has accelerated significantly with 2,245 retirements YTD, an 18% increase from prior year. Most concerning is the 34% early retirement rate, indicating workforce stress factors are driving experienced staff to exit before full pension eligibility. With 12,840 employees approaching pension eligibility, the organization faces substantial workforce transition challenges.`,
        keyFindings: [
          'Average retirement age declined to 61.2 years, down from 62.6 two years ago',
          'Early retirements (before full pension) increased to 34% of all retirements',
          'Exit interviews cite workload stress and schedule inflexibility as primary drivers',
          'Nursing and allied health show highest early retirement rates at 38% and 36%',
          '68% of retirees had 20+ years of service, representing significant institutional knowledge loss'
        ],
        analysis: `The retirement acceleration reflects workforce fatigue accumulated over recent years. The correlation between overtime rates and early retirement decisions is statistically significant (r=0.68), indicating that working conditions are pushing experienced staff out earlier than planned. Financial analysis shows early retirees forgo an average of $42K in pension benefits, suggesting non-financial factors dominate their decision. The cost to the organization includes accelerated replacement recruitment, knowledge loss, and pension liability acceleration. Each early retirement costs approximately $85K in transition expenses.`,
        recommendations: [
          { priority: 'Immediate', action: 'Launch "Stay Interview" program for pension-eligible staff', impact: 'High', owner: 'HR Business Partners' },
          { priority: 'Immediate', action: 'Offer workload reduction options for experienced staff', impact: 'High', owner: 'Operations' },
          { priority: 'Short-term', action: 'Develop phased retirement program extending productive careers', impact: 'High', owner: 'HR Policy' },
          { priority: 'Medium-term', action: 'Create legacy roles for knowledge transfer', impact: 'Medium', owner: 'Talent Management' }
        ],
        conclusion: `The early retirement trend represents both a workforce crisis and a missed retention opportunity. Targeted interventions could retain 25% of early retirees for an additional 2-3 years, preserving $8M in transition costs and invaluable institutional knowledge.`
      }
    },
    'internal-transfers': {
      title: 'Internal Mobility Analytics',
      kpis: [
        { label: 'Total Transfers', value: '3,420', trend: '+8%', negative: false },
        { label: 'Mobility Rate', value: '5.6%', trend: '+0.8%', negative: false },
        { label: 'Promotion Rate', value: '42%', trend: '+4%', negative: false },
        { label: 'Cross-Zone Moves', value: '18%', trend: '-3%', negative: true }
      ],
      insights: [
        { type: 'Info', title: 'Healthy Internal Movement', desc: 'Internal mobility increased 8%, indicating career development opportunities.', rec: 'Maintain career pathing investments.', color: 'blue' },
        { type: 'Warning', title: 'Cross-Zone Mobility Declining', desc: 'Inter-zone transfers decreased 3%, limiting organizational flexibility.', rec: 'Enhance relocation support.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Career Path Clarity', score: 62 },
        { factor: 'Relocation Support', score: 72 },
        { factor: 'Manager Support', score: 58 },
        { factor: 'Opportunity Awareness', score: 65 }
      ],
      writtenReport: {
        executiveSummary: `Internal mobility reached 3,420 transfers this fiscal year, representing a 5.6% mobility rate—a healthy indicator of career development activity. Of these moves, 42% were promotions, demonstrating upward career progression. However, cross-zone mobility has declined to 18%, potentially limiting organizational ability to deploy talent where most needed.`,
        keyFindings: [
          'Internal mobility rate of 5.6% exceeds industry benchmark of 4.8%',
          'Promotions accounted for 42% of all internal moves, up from 38%',
          'Lateral moves for development purposes increased 15%',
          'Cross-zone transfers declined to 18% of moves, down from 21%',
          'Internal fill rate for posted positions reached 34%, saving $4.2M in external recruitment'
        ],
        analysis: `Strong internal mobility indicates a healthy talent marketplace, but patterns reveal optimization opportunities. The promotion rate increase reflects intentional investment in career development, correlating with 12% improvement in engagement scores. However, declining cross-zone mobility creates talent imbalances—rural zones show 15% higher vacancy rates partly due to limited internal sourcing. Analysis of blocked transfers reveals manager resistance as primary barrier in 45% of cases, suggesting cultural and incentive alignment needs. The $4.2M savings from internal fills demonstrates ROI of mobility programs.`,
        recommendations: [
          { priority: 'Immediate', action: 'Enhance relocation assistance package for inter-zone moves', impact: 'Medium', owner: 'Total Rewards' },
          { priority: 'Short-term', action: 'Implement manager accountability for talent sharing', impact: 'High', owner: 'HR Leadership' },
          { priority: 'Short-term', action: 'Launch internal talent marketplace platform', impact: 'High', owner: 'HRIS' },
          { priority: 'Medium-term', action: 'Develop rotation programs for high-potential employees', impact: 'Medium', owner: 'Talent Management' }
        ],
        conclusion: `Internal mobility is a strategic strength but requires balancing with organizational talent deployment needs. Enhanced support for cross-zone moves and manager engagement can increase internal fill rates to 45%, yielding additional $2.8M in recruitment savings.`
      }
    },
    'new-hires': {
      title: 'New Hire Analytics',
      kpis: [
        { label: 'Total New Hires', value: '5,720', trend: '+12%', negative: false },
        { label: '90-Day Retention', value: '87.2%', trend: '+2.4%', negative: false },
        { label: 'Time to Productivity', value: '68 days', trend: '-8 days', negative: false },
        { label: 'Quality of Hire', value: '4.1/5', trend: '+0.2', negative: false }
      ],
      insights: [
        { type: 'Info', title: 'Hiring Acceleration', desc: 'New hire volume increased 12% to address vacancy backlog.', rec: 'Maintain onboarding capacity.', color: 'blue' },
        { type: 'Warning', title: 'First-Year Attrition Risk', desc: '18% of new hires show disengagement indicators by month 6.', rec: 'Implement early intervention program.', color: 'amber' }
      ],
      riskFactors: [
        { factor: 'Onboarding Quality', score: 65 },
        { factor: 'Manager Readiness', score: 72 },
        { factor: 'Cultural Fit', score: 58 },
        { factor: 'Training Adequacy', score: 62 }
      ],
      writtenReport: {
        executiveSummary: `New hire volume reached 5,720 for the fiscal year, a 12% increase reflecting accelerated recruitment to address vacancy backlog. Key success metrics show improvement: 90-day retention increased to 87.2%, time-to-productivity decreased by 8 days, and manager-rated quality of hire improved to 4.1/5. However, early warning indicators suggest 18% of new hires may be at risk for first-year attrition.`,
        keyFindings: [
          'New hire volume of 5,720 represents largest annual intake in organization history',
          '90-day retention improved to 87.2% through enhanced onboarding program',
          'Time-to-productivity reduced to 68 days, down from 76 days',
          'New graduate hires increased 25%, building early-career pipeline',
          'Experienced hire quality scores 15% higher than new graduate cohort initially'
        ],
        analysis: `The new hire analytics reveal both success and emerging challenges. The improved 90-day retention and productivity metrics validate investments in structured onboarding. However, engagement survey analysis of the new hire cohort shows satisfaction declining after month 4, correlating with reduced mentorship contact as formal onboarding concludes. The 18% disengagement indicator suggests first-year attrition may revert to historical 24% rate without intervention. Cost analysis shows each first-year departure costs $18K in sunk recruitment and training investment. The new graduate pipeline expansion is strategic but requires sustained support investment.`,
        recommendations: [
          { priority: 'Immediate', action: 'Extend mentorship program from 90 days to 12 months', impact: 'High', owner: 'Learning & Development' },
          { priority: 'Immediate', action: 'Implement 6-month pulse check with intervention triggers', impact: 'High', owner: 'HR Business Partners' },
          { priority: 'Short-term', action: 'Develop new hire cohort communities for peer support', impact: 'Medium', owner: 'Employee Experience' },
          { priority: 'Medium-term', action: 'Create accelerated development tracks for high-potential new hires', impact: 'Medium', owner: 'Talent Management' }
        ],
        conclusion: `New hire programs are performing well in early stages but require sustained engagement beyond formal onboarding. Extended support investment can improve first-year retention to 85%, protecting $8.6M in annual recruitment and training investment.`
      }
    },
    'recruitment': {
      title: 'Recruitment Analytics',
      kpis: [
        { label: 'Applications', value: '15,420', trend: '-8%', negative: true },
        { label: 'Hire Rate', value: '12.5%', trend: '+1.2%', negative: false },
        { label: 'Time to Hire', value: '38 days', trend: '-4 days', negative: false },
        { label: 'Cost per Hire', value: '$4,850', trend: '+$320', negative: true }
      ],
      insights: [
        { type: 'Warning', title: 'Application Volume Decline', desc: 'Total applications decreased 8% YoY, reflecting tight labor market.', rec: 'Increase sourcing investment.', color: 'amber' },
        { type: 'Info', title: 'Process Efficiency Gains', desc: 'Time-to-hire improved 4 days through automated screening.', rec: 'Expand automation to all roles.', color: 'blue' }
      ],
      riskFactors: [
        { factor: 'Applicant Pool Size', score: 78 },
        { factor: 'Employer Brand', score: 62 },
        { factor: 'Process Speed', score: 55 },
        { factor: 'Offer Competitiveness', score: 72 }
      ],
      writtenReport: {
        executiveSummary: `Recruitment operations processed 15,420 applications with a 12.5% hire rate, yielding 1,928 hires through external channels. While process efficiency improved with time-to-hire decreasing to 38 days, the 8% decline in application volume signals growing labor market challenges. Cost per hire increased to $4,850, reflecting intensified sourcing efforts in competitive segments.`,
        keyFindings: [
          'Application volume declined 8%, with specialized roles showing 22% decrease',
          'Hire rate improved to 12.5% through better candidate screening',
          'Time-to-hire reduced 4 days through automated initial screening',
          'Nursing applications decreased 18% while allied health held steady',
          'Employee referrals account for 24% of hires with 35% lower cost and higher retention'
        ],
        analysis: `The recruitment analytics underscore the structural shift in healthcare labor markets. The application decline is concentrated in high-demand specialties where competitor activity has intensified. Source analysis reveals that job board effectiveness declined 15% while referral and social media sources gained share. The cost-per-hire increase reflects necessary investment in sourcing technology and recruiter capacity. Funnel analysis shows 42% of qualified candidates drop out during the interview scheduling phase, indicating process friction. Offer decline analysis reveals compensation as primary factor in 58% of cases, followed by schedule flexibility at 24%.`,
        recommendations: [
          { priority: 'Immediate', action: 'Increase employee referral bonus for critical roles to $5,000', impact: 'High', owner: 'Talent Acquisition' },
          { priority: 'Immediate', action: 'Implement same-day interview scheduling for qualified candidates', impact: 'High', owner: 'Recruiting Operations' },
          { priority: 'Short-term', action: 'Launch targeted social media campaign for nursing roles', impact: 'Medium', owner: 'Employer Brand' },
          { priority: 'Medium-term', action: 'Develop predictive sourcing model for pipeline optimization', impact: 'High', owner: 'Talent Analytics' }
        ],
        conclusion: `Recruitment effectiveness requires dual focus on applicant pipeline growth and conversion optimization. Recommended investments can increase application volume by 15% and improve offer acceptance rate by 8%, yielding 400+ additional hires annually from existing demand.`
      }
    }
  };

  // Default configuration
  const defaultConfig = {
    title: 'Performance Analytics',
    kpis: [
      { label: 'YTD Performance', value: '94.2%', trend: '+2.1%', negative: false },
      { label: 'Budget Variance', value: '-3.4%', trend: 'On Track', negative: false },
      { label: 'Efficiency Index', value: '87.5', trend: '+4.2', negative: false },
      { label: 'Quality Score', value: '4.2/5', trend: '+0.3', negative: false }
    ],
    insights: [
      { type: 'Info', title: 'Performance Summary', desc: 'Metrics are tracking within acceptable ranges.', rec: 'Continue monitoring.', color: 'blue' },
      { type: 'Info', title: 'Optimization Opportunity', desc: 'Analysis indicates efficiency gains possible.', rec: 'Review processes.', color: 'blue' }
    ],
    riskFactors: [
      { factor: 'Resource Availability', score: 72 },
      { factor: 'Process Efficiency', score: 68 },
      { factor: 'Quality Control', score: 85 },
      { factor: 'Training Levels', score: 78 }
    ],
    writtenReport: {
      executiveSummary: `Current performance metrics indicate the organization is operating within acceptable parameters with a 94.2% YTD performance score. Budget variance of -3.4% remains within tolerance, and quality indicators show positive trajectory. This report provides detailed analysis of current state and opportunities for continued improvement.`,
      keyFindings: [
        'Overall performance tracking 2.1% above prior year baseline',
        'Efficiency index improved by 4.2 points through process optimization initiatives',
        'Quality scores reached 4.2/5, driven by enhanced training programs',
        'Budget adherence within acceptable variance range of ±5%'
      ],
      analysis: `Performance trends reflect successful execution of operational improvement initiatives implemented in prior quarters. The efficiency gains are attributable to workflow optimization and technology investments. Quality improvements correlate with expanded training coverage and enhanced supervision protocols. Continued focus on resource optimization and process standardization should sustain positive trajectory.`,
      recommendations: [
        { priority: 'Ongoing', action: 'Continue monitoring key performance indicators weekly', impact: 'Medium', owner: 'Operations' },
        { priority: 'Short-term', action: 'Expand successful efficiency practices to additional units', impact: 'Medium', owner: 'Process Improvement' },
        { priority: 'Medium-term', action: 'Invest in automation for high-volume routine processes', impact: 'High', owner: 'IT & Operations' }
      ],
      conclusion: `The organization is well-positioned for continued performance improvement. Sustained attention to efficiency and quality initiatives will support long-term operational excellence and stakeholder satisfaction.`
    }
  };

  return configs[itemId] || defaultConfig;
};

// Generate trend data
const generateTrendData = (itemId: string) => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const hash = itemId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = 50 + (hash % 30);
  return months.map((m, i) => ({
    name: m,
    Actual: Math.floor(base + Math.sin(i / 2) * 10 + (Math.random() * 8)),
    Target: Math.floor(base + i * 0.5),
    Forecast: i > 8 ? Math.floor(base + 12 + Math.random() * 5) : null
  }));
};

export const AdvancedAnalyticsView: React.FC<AdvancedAnalyticsViewProps> = ({ item, onBack, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');
  const analytics = useMemo(() => getMetricAnalytics(item.id), [item.id]);
  const trendData = useMemo(() => generateTrendData(item.id), [item.id]);

  const accentColor = item.theme === 'orange' ? '#f59e0b' : item.theme === 'green' ? '#10b981' : '#8b5cf6';
  const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-20 z-40 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {analytics.title}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500">FY 2026</span>
              </h2>
              <p className="text-xs text-slate-400">Executive Decision Support System</p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-colors flex items-center gap-2 ${activeTab === 'report' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                <FileText size={14} />
                Written Report
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-600"></div>
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Printer size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Download size={18} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' ? (
          <DashboardView analytics={analytics} trendData={trendData} accentColor={accentColor} gridStroke={gridStroke} isDarkMode={isDarkMode} />
        ) : (
          <WrittenReportView analytics={analytics} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};

// Scenario Simulator Component
const ScenarioSimulator = ({ accentColor }: { accentColor: string }) => {
  const [attritionRate, setAttritionRate] = useState(12);
  const [hiringRate, setHiringRate] = useState(10);

  // Simple calculation for projection
  const currentHeadcount = 98240;
  const data = useMemo(() => {
    let hc = currentHeadcount;
    return Array.from({ length: 12 }, (_, i) => {
      const attrition = hc * (attritionRate / 100 / 12);
      const hires = hc * (hiringRate / 100 / 12);
      hc = hc - attrition + hires;
      return {
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        Headcount: Math.round(hc),
        Baseline: Math.round(currentHeadcount * (1 + (i * 0.001))) // Slight natural growth
      };
    });
  }, [attritionRate, hiringRate]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Workforce Scenario Simulator</h3>
          <p className="text-xs text-slate-500">Project headcount based on varying attrition and hiring rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-slate-50 dark:bg-slate-700/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700">

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Annual Attrition Rate</label>
              <span className="text-sm font-bold text-rose-500">{attritionRate}%</span>
            </div>
            <input
              type="range" min="5" max="25" step="0.5"
              value={attritionRate}
              onChange={(e) => setAttritionRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Impacts outflow of staff.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hiring Velocity</label>
              <span className="text-sm font-bold text-emerald-500">{hiringRate}%</span>
            </div>
            <input
              type="range" min="5" max="25" step="0.5"
              value={hiringRate}
              onChange={(e) => setHiringRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Impacts inflow of new staff.</p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Projected Delta</span>
              <span className={`text-lg font-bold ${hiringRate >= attritionRate ? 'text-emerald-500' : 'text-rose-500'}`}>
                {hiringRate >= attritionRate ? '+' : ''}{((hiringRate - attritionRate)).toFixed(1)}%
              </span>
            </div>
          </div>

        </div>

        {/* Chart */}
        <div className="lg:col-span-2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="Headcount" stroke={accentColor} fill={accentColor} fillOpacity={0.1} strokeWidth={3} />
              <Area type="monotone" dataKey="Baseline" stroke="#94a3b8" fill="none" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ analytics, trendData, accentColor, gridStroke, isDarkMode }: any) => {
  const scrollToCharts = () => {
    document.getElementById('analytics-charts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* AI Briefing */}
      <div className="bg-gradient-to-br from-indigo-900 via-[#002f56] to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* ... existing AI Briefing code ... */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg"><Sparkles size={24} className="text-indigo-300" /></div>
            <div>
              <h2 className="text-xl font-bold">AI Executive Briefing</h2>
              <p className="text-indigo-200 text-sm">Real-time analysis based on latest data</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.insights.map((insight: any, i: number) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <span className={`bg-${insight.color}-500/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase`}>{insight.type}</span>
                  <ArrowUpRight size={18} className="text-white/50" />
                </div>
                <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
                <p className="text-sm text-indigo-100 leading-relaxed mb-3">{insight.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                    <AlertCircle size={14} /><span>Rec: {insight.rec}</span>
                  </div>
                  <button
                    onClick={scrollToCharts}
                    className="text-[10px] font-bold text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                  >
                    Why? →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PCBs & Simulator Row */}
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.kpis.map((kpi: any, i: number) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.negative ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{kpi.label}</h4>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-white">{kpi.value}</div>
              <div className={`text-xs font-medium mt-1 flex items-center gap-1 ${kpi.negative ? 'text-rose-500' : 'text-emerald-500'}`}>
                {kpi.negative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}{kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Simulator */}
        <ScenarioSimulator accentColor={accentColor} />
      </div>

      {/* Charts */}
      <div id="analytics-charts" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-4">Performance Trend</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="Actual" stroke={accentColor} fill={accentColor} fillOpacity={0.1} strokeWidth={2} />
                <Line type="monotone" dataKey="Target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-4">Risk Factors</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics.riskFactors}>
                <PolarGrid stroke={gridStroke} />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                <Radar dataKey="score" stroke={accentColor} fill={accentColor} fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {analytics.riskFactors.map((rf: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{rf.factor}</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${rf.score > 75 ? 'bg-rose-500' : rf.score > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${rf.score}%` }} />
                  </div>
                  <span className="text-slate-500 w-6">{rf.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Written Report View Component
const WrittenReportView = ({ analytics, isDarkMode }: any) => {
  const report = analytics.writtenReport;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-[#002f56] to-[#004f71] text-white px-8 py-6">
        <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
          <FileText size={14} />
          Executive Report
        </div>
        <h1 className="text-2xl font-bold">{analytics.title}</h1>
        <p className="text-indigo-200 text-sm mt-1">Health Shared Services • FY 2026 • Generated {new Date().toLocaleDateString()}</p>
      </div>

      <div className="px-8 py-8 space-y-8 max-w-4xl">
        {/* Executive Summary */}
        <section>
          <h2 className="text-lg font-bold text-[#002f56] dark:text-white border-b-2 border-[#78be20] pb-2 mb-4">Executive Summary</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.executiveSummary}</p>
        </section>

        {/* Key Findings */}
        <section>
          <h2 className="text-lg font-bold text-[#002f56] dark:text-white border-b-2 border-[#78be20] pb-2 mb-4">Key Findings</h2>
          <ul className="space-y-3">
            {report.keyFindings.map((finding: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#78be20]/20 text-[#78be20] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Analysis */}
        <section>
          <h2 className="text-lg font-bold text-[#002f56] dark:text-white border-b-2 border-[#78be20] pb-2 mb-4">Analysis</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.analysis}</p>
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-lg font-bold text-[#002f56] dark:text-white border-b-2 border-[#78be20] pb-2 mb-4">Recommendations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700 text-left">
                  <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-300">Priority</th>
                  <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-300">Action</th>
                  <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-300">Impact</th>
                  <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-300">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-600">
                {report.recommendations.map((rec: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${rec.priority === 'Immediate' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                        rec.priority === 'Short-term' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>{rec.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{rec.action}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold ${rec.impact === 'Critical' || rec.impact === 'High' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                        {rec.impact === 'Critical' ? <AlertTriangle size={12} /> : rec.impact === 'High' ? <CheckCircle size={12} /> : null}
                        {rec.impact}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{rec.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-lg font-bold text-[#002f56] dark:text-white border-b-2 border-[#78be20] pb-2 mb-4">Conclusion</h2>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border-l-4 border-[#78be20]">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.conclusion}</p>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-600 text-center text-xs text-slate-400">
          <p>This report was generated by the Health Shared Services People Analytics Platform</p>
          <p className="mt-1">Confidential • For Internal Use Only</p>
        </div>
      </div>
    </div>
  );
};