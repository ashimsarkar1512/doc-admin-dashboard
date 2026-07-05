import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestRecordStatus = 'PENDING' | 'REVIEWED' | 'COMPLETED';

export interface RequestRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  requestType: string;
  additionalNotes: string;
  consent: boolean;
  status: RequestRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RequestRecordsOverview {
  counts: {
    total: number;
    pending: number;
    reviewed: number;
    completed: number;
  };
}

export interface GetRequestRecordsParams {
  search?: string;
  requestType?: string | '';
  status?: RequestRecordStatus | '';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getRequestRecords = async (
  params?: GetRequestRecordsParams
): Promise<PaginatedResponse<RequestRecord>> => {
  const response = await axiosInstance.get<PaginatedResponse<RequestRecord>>(
    '/compliance/request-records',
    { params }
  );
  return response.data;
};

export const getRequestRecordsOverview = async (): Promise<RequestRecordsOverview> => {
  const response = await axiosInstance.get<RequestRecordsOverview>(
    '/compliance/request-records/overview'
  );
  return response.data;
};

export const updateRequestRecordStatus = async (
  id: string,
  payload: Partial<RequestRecord>
): Promise<RequestRecord> => {
  const response = await axiosInstance.patch<RequestRecord>(
    `/compliance/request-records/${id}`,
    payload
  );
  return response.data;
};

export const getRequestRecordById = async (id: string): Promise<RequestRecord> => {
  const response = await axiosInstance.get<RequestRecord>(
    `/compliance/request-records/${id}`
  );
  return response.data;
};

export const deleteRequestRecord = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/request-records/${id}`);
};
