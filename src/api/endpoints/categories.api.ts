import type { Category } from '@/types';
import { axiosInstance } from '@/api/axiosInstance';

export interface CreateCategoryPayload {
  name: string;
  description: string;
  status: 'ACTIVE' | 'DISABLED';
  paymentPlan?: {
    price: number;
    billingCycle: string;
  } | null;
  iconId?: string;
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
  const { data } = await axiosInstance.get('/admin/categories', { params });
  return {
    ...data,
    data: data.data.map(mapCategoryResponse),
  };
};

export const getCategoryById = async (id: string | number): Promise<Category> => {
  const { data } = await axiosInstance.get(`/admin/categories/${id}`);
  return mapCategoryResponse(data.data || data); // handle standard wrapper if present
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const { data } = await axiosInstance.post('/admin/categories', payload);
  return mapCategoryResponse(data.data || data);
};

export const updateCategory = async ({ id, payload }: { id: string | number; payload: Partial<CreateCategoryPayload> }): Promise<Category> => {
  const { data } = await axiosInstance.patch(`/admin/categories/${id}`, payload);
  return mapCategoryResponse(data.data || data);
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/admin/categories/${id}`);
};
