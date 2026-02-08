import React, { useMemo, useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardItem } from '../types';
import { ICON_MAP } from '../constants';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface DashboardTileProps {
  item: DashboardItem;
  onClick: (item: DashboardItem) => void;
  isDarkMode?: boolean;
}

// Custom Tooltip for Sparkline
const SparklineTooltip = ({ active, payload, label, chartColor }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg border border-slate-700">
        <span className="font-bold">{payload[0].value.toFixed(0)}</span>
        <span className="text-slate-400 ml-1">units</span>
      </div>
    );
  }
  return null;
};

export const DashboardTile: React.FC<DashboardTileProps> = ({ item, onClick, isDarkMode }) => {
  const Icon = ICON_MAP[item.iconName] || ICON_MAP['CreditCard'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  // Generate random sparkline data with month labels for visual effect
  const sparkData = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      month: months[i],
      value: Math.round(50 + Math.random() * 50 + (i * 2)) // slight upward trend
    }));
  }, []);

  // Determine random trend
  const trendDir = useMemo(() => Math.random() > 0.4 ? 'up' : Math.random() > 0.2 ? 'down' : 'flat', []);
  const trendVal = useMemo(() => (Math.random() * 5).toFixed(1), []);

  // Modern Theme Configuration with Gradients
  const themes = {
    orange: {
      gradient: 'from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10',
      border: 'hover:border-orange-300/50 dark:hover:border-orange-700/50',
      iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40',
      iconColor: 'text-orange-600 dark:text-orange-400',
      chartColor: '#f97316',
      shadow: 'hover:shadow-orange-500/10'
    },
    green: {
      gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10',
      border: 'hover:border-emerald-300/50 dark:hover:border-emerald-700/50',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      chartColor: '#10b981',
      shadow: 'hover:shadow-emerald-500/10'
    },
    purple: {
      gradient: 'from-violet-50 to-fuchsia-50 dark:from-violet-900/10 dark:to-fuchsia-900/10',
      border: 'hover:border-violet-300/50 dark:hover:border-violet-700/50',
      iconBg: 'bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
      chartColor: '#8b5cf6',
      shadow: 'hover:shadow-violet-500/10'
    }
  };

  const theme = themes[item.theme];

  return (
    <button
      onClick={() => onClick(item)}
      className={`
        group relative flex flex-col p-5 w-full h-[220px]
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
        rounded-2xl border border-slate-200/60 dark:border-slate-700/60
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl ${theme.shadow} ${theme.border}
        overflow-hidden text-left
      `}
    >
      {/* Subtle Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {/* Header Section */}
      <div className="relative z-10 flex justify-between items-start w-full mb-4">
        <div className={`p-3 rounded-xl ${theme.iconBg} ${theme.iconColor} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>

        {/* Trend Indicator with Accessibility Icons */}
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-slate-100 dark:border-slate-700 ${trendDir === 'up' ? 'text-emerald-600' : trendDir === 'down' ? 'text-rose-500' : 'text-slate-500'}`}>
          {trendDir === 'up' && <TrendingUp size={12} />}
          {trendDir === 'down' && <TrendingDown size={12} />}
          {trendDir === 'flat' && <Minus size={12} />}
          {trendVal}%
        </div>
      </div>

      {/* Title Section */}
      <div className="relative z-10 mb-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {item.title}
        </h3>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Real-time Metric</p>
      </div>

      {/* Interactive Sparkline Chart with Tooltip */}
      <div className="relative z-10 w-full h-12 mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: theme.chartColor }}
              isAnimationActive={true}
            />
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Tooltip
              content={<SparklineTooltip chartColor={theme.chartColor} />}
              cursor={{ stroke: theme.chartColor, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer / Action */}
      <div className="relative z-10 w-full mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-3 opacity-80 group-hover:opacity-100">
        <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">View Details</span>
        <div className={`p-1 rounded-full ${theme.iconColor} bg-white/50 dark:bg-slate-700/50 group-hover:translate-x-1 transition-transform`}>
          <ArrowRight size={14} strokeWidth={3} />
        </div>
      </div>
    </button>
  );
};