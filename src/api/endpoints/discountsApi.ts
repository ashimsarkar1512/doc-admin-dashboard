import { axiosInstance } from "../axiosInstance";

export interface Discount {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDiscountsParams {
  search?: string;
  type?: "PERCENTAGE" | "FIXED_AMOUNT";
  isActive?: boolean;
  minValue?: number;
  maxValue?: number;
  expiresFrom?: string;
  expiresTo?: string;
  page?: number;
  limit?: number;
}

export interface DiscountPayload {
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  expiresAt: string;
  isActive?: boolean;
}

export interface PaginatedDiscounts {
  data: Discount[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getDiscounts = async (params?: GetDiscountsParams): Promise<PaginatedDiscounts> => {
  const response = await axiosInstance.get("/admin/discounts", { params });
  return response.data;
};

export const getDiscountById = async (id: string): Promise<Discount> => {
  const response = await axiosInstance.get(`/admin/discounts/${id}`);
  return response.data;
};

export const createDiscount = async (payload: DiscountPayload): Promise<Discount> => {
  const response = await axiosInstance.post("/admin/discounts", payload);
  return response.data;
};

export const updateDiscount = async (id: string, payload: Partial<DiscountPayload>): Promise<Discount> => {
  const response = await axiosInstance.patch(`/admin/discounts/${id}`, payload);
  return response.data;
};

export const deleteDiscount = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/discounts/${id}`);
};