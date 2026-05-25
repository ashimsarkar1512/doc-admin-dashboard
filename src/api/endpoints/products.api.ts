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
  price: string;
  stockQuantity: number;
  description?: string;
  categoryId: string;
  images?: File[];
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('price', payload.price);
  formData.append('stockQuantity', String(payload.stockQuantity));
  formData.append('categoryId', payload.categoryId);
  if (payload.description) formData.append('description', payload.description);
  
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<Product>(response);
};

export interface UpdateProductPayload {
  name?: string;
  price?: string;
  stockQuantity?: number;
  description?: string;
  categoryId?: string;
  images?: File[];
}

export const updateProduct = async (id: string, payload: UpdateProductPayload): Promise<Product> => {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.price !== undefined) formData.append('price', payload.price);
  if (payload.stockQuantity !== undefined) formData.append('stockQuantity', String(payload.stockQuantity));
  if (payload.categoryId !== undefined) formData.append('categoryId', payload.categoryId);
  if (payload.description !== undefined) formData.append('description', payload.description);
  
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PATCH',
    body: formData,
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
