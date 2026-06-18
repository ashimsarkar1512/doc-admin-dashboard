import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getRecentActivity } from '@/api/endpoints/dashboard/overview';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

export const useRecentActivity = () =>
  useQuery({
    queryKey: ['recent-activity'],
    queryFn: getRecentActivity,
  });
