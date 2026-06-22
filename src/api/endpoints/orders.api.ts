import { axiosInstance } from '@/api/axiosInstance';
import type { Order, OrderResponse } from '@/features/orders/types';

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  doctorName?: string;
  dateRange?: string;
}

export const getOrders = async (
  params?: GetOrdersParams
): Promise<OrderResponse> => {
  const { data } = await axiosInstance.get('/admin/orders', { params });
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await axiosInstance.get(`/admin/orders/${id}`);
  return data.data || data;
};

export interface UpdateOrderPayload {
  status?: string;
  trackingCarrier?: string;
  trackingNumber?: string;
}

export const updateOrder = async (
  id: string,
  payload: UpdateOrderPayload
): Promise<{ success: boolean; statusCode: number; message: string }> => {
  const { data } = await axiosInstance.patch(`/admin/orders/${id}`, payload);
  return data;
};

