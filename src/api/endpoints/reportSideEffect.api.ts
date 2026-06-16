import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SeverityLevel = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'ESCALATED' | 'DISMISSED';

export interface SideEffectAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  context: string;
  uploadedById: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface SideEffectService {
  id: string;
  name: string;
}

export interface SideEffectProvider {
  id: string;
  name: string;
}

export interface SideEffectReport {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  severity: SeverityLevel;
  status: ReportStatus;
  description: string;
  serviceId: string;
  service: SideEffectService;
  providerId: string;
  provider: SideEffectProvider;
  attachments: SideEffectAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SideEffectOverview {
  counts: {
    total: number;
    pending: number;
    lifeThreatening: number;
    withAttachments: number;
  };
}

export interface GetSideEffectReportsParams {
  search?: string;
  severity?: SeverityLevel | '';
  status?: ReportStatus | '';
  serviceId?: string;
  providerId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface UpdateSideEffectReportPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceId?: string;
  providerId?: string;
  severity?: SeverityLevel;
  description?: string;
  status?: ReportStatus;
  attachmentIds?: string[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getSideEffectReports = async (
  params?: GetSideEffectReportsParams
): Promise<PaginatedResponse<SideEffectReport>> => {
  const response = await axiosInstance.get<PaginatedResponse<SideEffectReport>>(
    '/compliance/side-effect-reports',
    { params }
  );
  return response.data;
};

export const getSideEffectReportsOverview = async (): Promise<SideEffectOverview> => {
  const response = await axiosInstance.get<SideEffectOverview>(
    '/compliance/side-effect-reports/overview'
  );
  return response.data;
};

export const getSideEffectReportById = async (id: string): Promise<SideEffectReport> => {
  const response = await axiosInstance.get<SideEffectReport>(
    `/compliance/side-effect-reports/${id}`
  );
  return response.data;
};

export const updateSideEffectReport = async (
  id: string,
  payload: UpdateSideEffectReportPayload
): Promise<SideEffectReport> => {
  const response = await axiosInstance.patch<SideEffectReport>(
    `/compliance/side-effect-reports/${id}`,
    payload
  );
  return response.data;
};

export const deleteSideEffectReport = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/side-effect-reports/${id}`);
};