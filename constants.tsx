import { DashboardItem } from './types';
import {
  CreditCard,
  HardHat,
  Clock,
  BedDouble,
  Stethoscope,
  UserMinus,
  Sprout,
  MapPin,
  Binoculars,
  UserCheck,
  Users,
  TreeDeciduous,
  LucideIcon
} from 'lucide-react';

export const DASHBOARD_ITEMS: DashboardItem[] = [
  // Row 1 - Orange
  { id: 'paid-hours', title: 'Paid hours', theme: 'orange', iconName: 'CreditCard' },
  { id: 'worked-hours', title: 'Worked hours', theme: 'orange', iconName: 'HardHat' },
  { id: 'overtime', title: 'Overtime', theme: 'orange', iconName: 'Clock' },
  { id: 'sick-hours', title: 'Sick hours/days', theme: 'orange', iconName: 'BedDouble' },
  // Row 2 - Green
  { id: 'workforce', title: 'Workforce', theme: 'green', iconName: 'Stethoscope' },
  { id: 'terminations', title: 'Terminations', theme: 'green', iconName: 'UserMinus' },
  { id: 'retirements', title: 'Retirements', theme: 'green', iconName: 'Sprout' },
  { id: 'internal-transfers', title: 'Internal Transfers', theme: 'green', iconName: 'MapPin' },
  // Row 3 - Purple
  { id: 'vacancy', title: 'Vacancy', theme: 'purple', iconName: 'Binoculars' },
  { id: 'retirement-risk', title: 'Retirement Risk', theme: 'purple', iconName: 'TreeDeciduous' },
  { id: 'new-hires', title: 'New Hires', theme: 'purple', iconName: 'UserCheck' },
  { id: 'recruitment', title: 'Recruitment', theme: 'purple', iconName: 'Users' },
];

export const ICON_MAP: Record<string, LucideIcon> = {
  CreditCard,
  HardHat,
  Clock,
  BedDouble,
  Stethoscope,
  UserMinus,
  Sprout,
  MapPin,
  Binoculars,
  TreeDeciduous,
  UserCheck,
  Users
};

export const MOCK_DATA: Record<string, { data: any[], type: 'bar' | 'line' | 'area' }> = {
  'paid-hours': {
    type: 'bar',
    data: [
      { name: 'Jan', value: 280000, target: 268000 },
      { name: 'Feb', value: 290000, target: 268000 },
      { name: 'Mar', value: 275000, target: 268000 },
      { name: 'Apr', value: 284000, target: 268000 },
      { name: 'May', value: 302000, target: 268000 },
      { name: 'Jun', value: 298000, target: 268000 },
    ]
  },
  'overtime': {
    type: 'area',
    data: [
      { name: 'Jan', value: 11600, target: 9300 },
      { name: 'Feb', value: 15100, target: 9300 },
      { name: 'Mar', value: 11100, target: 9300 },
      { name: 'Apr', value: 12100, target: 9300 },
      { name: 'May', value: 16200, target: 9300 },
    ]
  },
  'workforce': {
    type: 'line',
    data: [
      { name: '2019', value: 95000 },
      { name: '2020', value: 98500 },
      { name: '2021', value: 102000 },
      { name: '2022', value: 108000 },
      { name: '2023', value: 112500 },
    ]
  }
};

// Fallback data for items not explicitly defined
export const DEFAULT_MOCK_DATA = [
  { name: 'Q1', value: 400 },
  { name: 'Q2', value: 300 },
  { name: 'Q3', value: 550 },
  { name: 'Q4', value: 480 },
];
