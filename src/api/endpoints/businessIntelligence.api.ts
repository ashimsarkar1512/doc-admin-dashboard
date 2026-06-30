import { axiosInstance } from '@/api/axiosInstance';

export type BiFilter = 'all' | 'today' | 'last_7_days' | 'last_month' | 'last_year' | '';

export interface BiStats {
  totalRevenue: number;
  totalRefund: number;
  newPatients: number;
  activePatients: number;
  approvalRate: number;
  denialRate: number;
  subscriptionChurn: number;
  avgLTV: number;
  refillRate: number;
  intakeDropOff: number;
  providerTurnaround: string | number;
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

export const getBiStats = async (filter?: BiFilter): Promise<BiStats> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/stats', {
    params: filter ? { filter } : undefined
  });
  return data.data;
};

export const getCategoryRevenue = async (filter?: BiFilter): Promise<CategoryRevenue[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/category-revenue', {
    params: filter ? { filter } : undefined,
  });
  return data.data;
};

export const getRevenueTrend = async (filter?: BiFilter): Promise<RevenueTrendPoint[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/revenue-vs-refund', {
    params: filter ? { filter } : undefined,
  });
  return data.data;
};

export const getPatientGrowth = async (filter?: BiFilter): Promise<PatientGrowthPoint[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/patient-growth', {
    params: filter ? { filter } : undefined,
  });
  return data.data;
};

export const getApprovalVsDenial = async (filter?: BiFilter): Promise<ApprovalVsDenial> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/approval-vs-denial', {
    params: filter ? { filter } : undefined,
  });
  return data.data;
};

export const getRevenueByService = async (filter?: BiFilter): Promise<RevenueByService[]> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/revenue-by-service', {
    params: filter ? { filter } : undefined,
  });
  return data.data;
};

export interface DropOffItem {
  id: string;
  userName: string;
  userImage: string | null;
  email: string;
  assessmentName: string;
  userType: string;
  status: string;
  ipAddress: string;
  timeStamp: string;
}

export interface GetDropOffsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  patientType?: string;
  date?: string; // e.g., 'last_7_days'
}

export interface DropOffsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DropOffItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getDropOffs = async (params?: GetDropOffsParams): Promise<DropOffsResponse> => {
  const { data } = await axiosInstance.get('/compliance/business-intelligence/drop-off', { params });
  return data;
};

export const getDropOffById = async (id: string) => {
  const { data } = await axiosInstance.get(`/compliance/business-intelligence/drop-off/${id}`);
  return data;
};

export const deleteDropOff = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/business-intelligence/drop-off/${id}`);
};
