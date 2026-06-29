import { axiosInstance } from '@/api/axiosInstance';
import type { PaymentsResponse, PaymentDetailResponse } from '@/features/payments/types';

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const getPayments = async (
  params?: GetPaymentsParams
): Promise<PaymentsResponse> => {
  const { data } = await axiosInstance.get('/admin/payments', { params });
  return data;
};

export const getPaymentById = async (id: string): Promise<PaymentDetailResponse> => {
  const { data } = await axiosInstance.get(`/admin/payments/${id}`);
  return data;
};
