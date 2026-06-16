import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type StateCoverageStatus = 'COMPLIANT' | 'RESTRICTED' | 'COMMING_SOON';

export interface CategoryBasic {
  id: string;
  name: string;
}

export interface StateCoverage {
  id: string;
  stateCode: string;
  stateName: string;
  status: StateCoverageStatus;
  isComingSoon: boolean;
  allowedCategories: CategoryBasic[];
  restrictedCategories: CategoryBasic[];
  createdAt: string;
  updatedAt: string;
}

export interface GetStateCoveragesParams {
  search?: string;
  status?: StateCoverageStatus | '';
  page?: number;
  limit?: number;
}

export interface UpdateRestrictionsPayload {
  allowedCategoryIds: string[];
  isComingSoon: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoryBasic[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getStateCoverages = async (
  params?: GetStateCoveragesParams
): Promise<PaginatedResponse<StateCoverage>> => {
  const response = await axiosInstance.get<PaginatedResponse<StateCoverage>>(
    '/compliance/state-coverages',
    { params }
  );
  return response.data;
};

export const getStateCoverageById = async (id: string): Promise<StateCoverage> => {
  const response = await axiosInstance.get<StateCoverage>(
    `/compliance/state-coverages/${id}`
  );
  return response.data;
};

export const updateStateRestrictions = async (
  id: string,
  payload: UpdateRestrictionsPayload
): Promise<StateCoverage> => {
  const response = await axiosInstance.put<StateCoverage>(
    `/compliance/state-coverages/${id}/restrictions`,
    payload
  );
  return response.data;
};

export const deleteStateCoverage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/state-coverages/${id}`);
};

export const getAllCategories = async (): Promise<CategoryBasic[]> => {
  const response = await axiosInstance.get<CategoriesResponse>('/patient/categories-names');
  return response.data.data;
};
