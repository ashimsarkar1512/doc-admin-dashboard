import { axiosInstance } from '@/api/axiosInstance';

export interface CreateDoctorPayload {
  avatarId: string;
  featured: boolean;
  fullName: string;
  shortBio: string;
  email: string;
  password: string;
  status: 'ACTIVE' | 'INACTIVE';
  roleTitle: string;
  officeLocation: string;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  thumbnail: string | null;
  featured: boolean;
  roleTitle: string;
  shortBio: string;
  email: string;
  officeLocation: string;
  status: 'ACTIVE' | 'INACTIVE';
  activeConsultation: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  title?: string;
}

export interface DoctorsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDoctorsResponse {
  data: Doctor[];
  meta: DoctorsMeta;
}

export const getDoctors = async (params: GetDoctorsParams = {}): Promise<GetDoctorsResponse> => {
  const { data } = await axiosInstance.get<{ data: Doctor[]; meta: DoctorsMeta }>(
    '/admin/doctors',
    { params }
  );
  return { data: data.data, meta: data.meta };
};

export const createDoctor = async (payload: CreateDoctorPayload): Promise<Doctor> => {
  const { data } = await axiosInstance.post<{ data: Doctor }>('/admin/doctors', payload);
  return data.data;
};

export interface GetDoctorTitlesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string[];
}

export const getDoctorTitles = async (search?: string): Promise<GetDoctorTitlesResponse> => {
  const { data } = await axiosInstance.get<GetDoctorTitlesResponse>('/admin/doctors/titles', {
    params: search ? { title: search } : undefined,
  });
  return data;
};