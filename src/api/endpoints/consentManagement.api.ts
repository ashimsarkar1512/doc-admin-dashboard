import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface ConsentStats {
  total: number;
  granted: number;
  pending: number;
  revoked: number;
}

export interface ConsentLog {
  id: string;
  userName: string;
  email: string;
  type: string;
  status: string;
  source: string;
  userId: string;
  consentDate: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Shapes ───────────────────────────────────────────────────────────

export interface GetConsentsParams {
  search?: string;
  role?: string;
  type?: string;
  status?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export type ExportConsentsParams = Omit<GetConsentsParams, 'page' | 'limit'>;

// ─── API Functions ────────────────────────────────────────────────────────────

export const getConsentStats = async (): Promise<ConsentStats> => {
  const response = await axiosInstance.get<ConsentStats>(
    '/compliance/consents/stats'
  );
  return response.data;
};

export const getConsents = async (
  params?: GetConsentsParams
): Promise<PaginatedResponse<ConsentLog>> => {
  const response = await axiosInstance.get<PaginatedResponse<ConsentLog>>(
    '/compliance/consents',
    { params }
  );
  return response.data;
};

export const submitConsent = async (
  data: Record<string, unknown>
): Promise<unknown> => {
  const response = await axiosInstance.post('/compliance/consents', data);
  return response.data;
};

export const exportConsents = async (
  params?: ExportConsentsParams
): Promise<Blob> => {
  const response = await axiosInstance.get('/compliance/consents/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

export const getConsentById = async (id: string): Promise<ConsentLog> => {
  const response = await axiosInstance.get<ConsentLog>(
    `/compliance/consents/${id}`
  );
  return response.data;
};

export const updateConsent = async (
  id: string,
  data: Partial<ConsentLog>
): Promise<ConsentLog> => {
  const response = await axiosInstance.patch<ConsentLog>(
    `/compliance/consents/${id}`,
    data
  );
  return response.data;
};

export const deleteConsent = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/consents/${id}`);
};
