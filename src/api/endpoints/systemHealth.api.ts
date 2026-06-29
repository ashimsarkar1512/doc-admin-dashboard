import { axiosInstance } from '@/api/axiosInstance';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';

export interface SystemService {
  id: string;
  key: string;
  name: string;
  category: string;
  status: ServiceStatus;
  description: string;
  responseTimeMs: number | null;
  uptimePercent: number;
  message: string;
  checkedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemMetricItem {
  id: string;
  key: string;
  label: string;
  value: number;
  unit: string | null;
  displayValue: string;
  recordedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealthCounts {
  total: number;
  operational: number;
  degraded: number;
  down: number;
  maintenance: number;
}

export interface SystemHealthOverview {
  title: string;
  counts: SystemHealthCounts;
  services: SystemService[];
  metrics: SystemMetricItem[];
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const getSystemHealthOverview = async (): Promise<SystemHealthOverview> => {
  const { data } = await axiosInstance.get('/compliance/system-health');
  return data;
};
