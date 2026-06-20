import { axiosInstance } from '@/api/axiosInstance';

export interface Patient {
  id: string;
  name: string;
  image: string | null;
  email: string;
  contactNumber: string;
  activeConsultation: number;
  status: 'ACTIVE' | 'BANNED' | 'BLOCKED' | 'DISABLED' | 'DELETED' | string;
  joiningDate: string;
}

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PatientsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPatientsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Patient[];
  meta: PatientsMeta;
}

export interface GetPatientResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Patient;
}

export const getPatients = async (params: GetPatientsParams = {}): Promise<GetPatientsResponse> => {
  const { data } = await axiosInstance.get<GetPatientsResponse>(
    '/admin/patient-manage/all-patients',
    { params }
  );
  return data;
};

export const getPatientDetails = async (id: string): Promise<Patient> => {
  const { data } = await axiosInstance.get<GetPatientResponse>(`/admin/patient-manage/${id}`);
  return data.data;
};

export const updatePatientStatus = async (id: string, status: string): Promise<Patient> => {
  const { data } = await axiosInstance.patch<GetPatientResponse>(`/admin/patient-manage/status/${id}`, { status });
  return data.data;
};
