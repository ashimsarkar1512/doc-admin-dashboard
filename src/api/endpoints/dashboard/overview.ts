import { axiosInstance } from '@/api/axiosInstance';

export interface RecentActivity {
  submissionId: string;
  submissionCode: string;
  patientName: string | null;
  patientImage: string | null;
  patientId: string;
  provider: string | null;
  patientType: string;
  categoryName: string;
  assessmentName?: string | null;
  status: string;
  date: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  activeCategories: number;
  totalAssessmentSubmissions: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get<{ data: DashboardStats }>('/admin/dashboard/stats');
  return response.data.data;
};

export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  const response = await axiosInstance.get<{ data: RecentActivity[] }>('/admin/dashboard/recent-activity');
  return response.data.data.slice(0, 5);
};
