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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });
