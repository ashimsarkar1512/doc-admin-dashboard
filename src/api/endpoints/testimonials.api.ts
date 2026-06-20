import type { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload } from '@/types';
import { axiosInstance } from '@/api/axiosInstance';
import type { PaginatedResponse } from './categories.api';

export interface GetTestimonialsParams {
  search?: string;
  minRating?: number;
  maxRating?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

const unwrap = (data: any): Testimonial => data.data ?? data;

export const getTestimonials = async (
  params?: GetTestimonialsParams,
): Promise<PaginatedResponse<Testimonial>> => {
  const { data } = await axiosInstance.get('/admin/testimonials', { params });
  return data;
};

export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const { data } = await axiosInstance.get(`/admin/testimonials/${id}`);
  return unwrap(data);
};

export const createTestimonial = async (
  payload: CreateTestimonialPayload,
): Promise<Testimonial> => {
  const { data } = await axiosInstance.post('/admin/testimonials', payload);
  return unwrap(data);
};

export const updateTestimonial = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTestimonialPayload;
}): Promise<Testimonial> => {
  const { data } = await axiosInstance.patch(`/admin/testimonials/${id}`, payload);
  return unwrap(data);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/testimonials/${id}`);
};
