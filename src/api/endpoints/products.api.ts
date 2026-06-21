import { axiosInstance } from '@/api/axiosInstance';
import type { Product } from '@/types';
import type { PaginatedResponse } from '@/api/endpoints/categories.api';

export interface GetProductsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  const { data } = await axiosInstance.get('/admin/products', { params });
  return data;
};

export interface CreateProductPayload {
  name: string;
  price: string | number;
  stockQuantity: number;
  description?: string;
  categoryId: string;
  images?: string[];
  variants?: { size: string; price: string | number; stockQuantity: number }[];
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const { data } = await axiosInstance.post('/admin/products', payload);
  return data.data || data;
};

export interface UpdateProductPayload {
  name?: string;
  price?: string | number;
  stockQuantity?: number;
  description?: string;
  categoryId?: string;
  images?: string[];
  variants?: { size: string; price: string | number; stockQuantity: number }[];
}

export const updateProduct = async (id: string, payload: UpdateProductPayload): Promise<Product> => {
  const { data } = await axiosInstance.patch(`/admin/products/${id}`, payload);
  return data.data || data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/products/${id}`);
};
