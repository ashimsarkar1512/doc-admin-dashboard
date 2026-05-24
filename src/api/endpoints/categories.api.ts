import type { Category } from '@/types';
import { API_BASE_URL } from '@/api/config';

export interface CreateCategoryPayload {
  name: string;
  description: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface GetCategoriesParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Map backend response to ensure optional properties exist
const mapCategoryResponse = (data: Omit<Category, 'activeAssessments' | 'totalPatients'> & Partial<Category>): Category => ({
  ...data,
  activeAssessments: data.activeAssessments || 0,
  totalPatients: data.totalPatients || 0,
});

export const getCategories = async (params?: GetCategoriesParams): Promise<PaginatedResponse<Category>> => {
  const url = new URL(`${API_BASE_URL}/admin/categories`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch categories');
  
  const result = await response.json();
  
  return {
    ...result,
    data: result.data.map(mapCategoryResponse),
  };
};

export const getCategoryById = async (id: string | number): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch category');
  
  const data = await response.json();
  return mapCategoryResponse(data);
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unexpected error occurred while creating the category.' };
    }
    throw new Error(errorData.message || 'Failed to create category');
  }

  const data = await response.json();
  return mapCategoryResponse(data);
};

export const updateCategory = async ({ id, payload }: { id: string | number; payload: Partial<CreateCategoryPayload> }): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unexpected error occurred while updating the category.' };
    }
    throw new Error(errorData.message || 'Failed to update category');
  }

  const data = await response.json();
  return mapCategoryResponse(data);
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
};
