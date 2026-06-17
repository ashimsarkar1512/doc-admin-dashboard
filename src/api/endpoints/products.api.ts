import { API_BASE_URL } from '@/api/config';
import type { Product } from '@/types';
import type { PaginatedResponse } from '@/api/endpoints/categories.api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
  return response.json() as Promise<T>;
}

export interface GetProductsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  const url = new URL(`${API_BASE_URL}/admin/products`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString());
  return handleResponse<PaginatedResponse<Product>>(response);
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
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Product>(response);
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
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Product>(response);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
};
