import { axiosInstance } from '../axiosInstance';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscribersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: NewsletterSubscriber[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NewsletterStats {
  subscribers: {
    total: number;
    last24h: number;
    last7d: number;
    last30d: number;
  };
  mailQueue: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

export interface NewsletterStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: NewsletterStats;
}

export const getNewsletterSubscribers = async (params?: { page?: number; limit?: number; search?: string }): Promise<NewsletterSubscribersResponse> => {
  const response = await axiosInstance.get<NewsletterSubscribersResponse>('/admin/newsletters', { params });
  return response.data;
};

export const getNewsletterStats = async (): Promise<NewsletterStatsResponse> => {
  const response = await axiosInstance.get<NewsletterStatsResponse>('/admin/newsletters/stats');
  return response.data;
};

export const exportNewsletterSubscribers = async (): Promise<Blob> => {
  const response = await axiosInstance.get('/admin/newsletters/export', { responseType: 'blob' });
  return response.data;
};
