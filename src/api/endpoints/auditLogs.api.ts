import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type AuditLogStatus = 'SUCCESS' | 'FAILED';

export interface AuditLog {
  id: string;
  userId: string | null;
  userName: string;
  userRole: string;
  activityType: string;
  event: string;
  ipAddress: string | null;
  sessionDue: string | null;
  fileUrl: string | null;
  status: AuditLogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogStats {
  totalActivities: number;
  activitiesChangePercent: number;
  failedLogins: number;
  failedLoginsChangeThisHour: number;
  activeSessions: number;
  dataExports: number;
}

// ─── Request Shapes ───────────────────────────────────────────────────────────

export interface GetAuditLogsParams {
  search?: string;
  role?: string;
  activityType?: string;
  status?: AuditLogStatus | '';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export type ExportAuditLogsParams = Omit<GetAuditLogsParams, 'page' | 'limit'>;

// ─── API Functions ────────────────────────────────────────────────────────────

export const getAuditLogsStats = async (): Promise<AuditLogStats> => {
  const response = await axiosInstance.get<AuditLogStats>(
    '/compliance/audit-logs/stats'
  );
  return response.data;
};

export const getAuditLogs = async (
  params?: GetAuditLogsParams
): Promise<PaginatedResponse<AuditLog>> => {
  const response = await axiosInstance.get<PaginatedResponse<AuditLog>>(
    '/compliance/audit-logs',
    { params }
  );
  return response.data;
};

export const exportAuditLogs = async (
  params?: ExportAuditLogsParams
): Promise<Blob> => {
  const response = await axiosInstance.get('/compliance/audit-logs/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};