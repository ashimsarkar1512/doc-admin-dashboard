import { axiosInstance } from '@/api/axiosInstance';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DocumentStatsItem {
  type: string;
  count: number;
}

export interface DocumentStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DocumentStatsItem[];
}

export interface DocumentItem {
  id: string;
  documentName: string;
  type: string;
  uploadedBy: string | null;
  date: string;
  size: number;
}

export interface DocumentsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDocumentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DocumentItem[];
  meta: DocumentsMeta;
}

export interface GetDocumentsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export interface DocumentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DocumentItem;
}

// ── API functions ────────────────────────────────────────────────────────────

export const getDocumentStats = async (): Promise<DocumentStatsResponse> => {
  const { data } = await axiosInstance.get<DocumentStatsResponse>('/admin/documents/stats');
  return data;
};

export const getDocuments = async (params: GetDocumentsParams = {}): Promise<GetDocumentsResponse> => {
  const { data } = await axiosInstance.get<GetDocumentsResponse>('/admin/documents', { params });
  return data;
};

export const getDocumentDetails = async (id: string): Promise<DocumentDetailResponse> => {
  const { data } = await axiosInstance.get<DocumentDetailResponse>(`/admin/documents/${id}`);
  return data;
};