import { axiosInstance } from '@/api/axiosInstance';

export type BiFilter = 'last_7_days' | 'last_month' | 'last_year';

export interface BiStats {
  totalRevenue: number;
  totalRefund: number;
  newPatients: number;
  activePatients: number;
  approvalRate: number;
  denialRate: number;
  subscriptionChurn: number;
  avgLTV: number;
}

export interface CategoryRevenue {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

export interface RevenueTrendPoint {
  label: string;
  revenue: number;
  refund: number;
}

export interface PatientGrowthPoint {
  label: string;
  count: number;
}

export interface ApprovalVsDenial {
  approved: number;
  rejected: number;
  approvedPercentage: number;
  rejectedPercentage: number;
}

export interface RevenueByService {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

export const getBiStats = async (): Promise<BiStats> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/stats');
  return data.data;
};

export const getCategoryRevenue = async (): Promise<CategoryRevenue[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/category-revenue');
  return data.data;
};

export const getRevenueTrend = async (filter: BiFilter): Promise<RevenueTrendPoint[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/revenue-vs-refund', {
    params: { filter },
  });
  return data.data;
};

export const getPatientGrowth = async (filter: BiFilter): Promise<PatientGrowthPoint[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/patient-growth', {
    params: { filter },
  });
  return data.data;
};

export const getApprovalVsDenial = async (): Promise<ApprovalVsDenial> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/approval-vs-denial');
  return data.data;
};

export const getRevenueByService = async (): Promise<RevenueByService[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/revenue-by-service');
  return data.data;
};
