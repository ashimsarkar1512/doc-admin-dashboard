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

export interface Doctor {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Assessment {
  submissionId: string;
  submissionCode: string;
  patientName: string | null;
  patientImage: string | null;
  patientId: string;
  provider: string | null;
  patientType: string;
  categoryName: string;
  assessmentName?: string | null;
  status: string;
  date: string;
}

export interface GetDoctorsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Doctor[];
}

export interface GetCategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

export interface GetAssessmentsParams {
  page?: number;
  limit?: number;
}

export interface GetAssessmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment[];
  meta: PatientsMeta;
}

export interface AssignDoctorRequest {
  submissionId: string;
  doctorId: string;
}

export interface AssignDoctorResponse {
  success: boolean;
  statusCode: number;
  message: string;
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

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const { data } = await axiosInstance.get<GetDoctorsResponse>('/admin/patient-manage/all-doctors');
  return data.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get<GetCategoriesResponse>('/admin/patient-manage/all-categories');
  return data.data;
};

export const getAllAssessments = async (params: GetAssessmentsParams = {}): Promise<GetAssessmentsResponse> => {
  const { data } = await axiosInstance.get<GetAssessmentsResponse>(
    '/admin/patient-manage/all-assessments',
    { params }
  );
  return data;
};

export const assignDoctor = async (request: AssignDoctorRequest): Promise<AssignDoctorResponse> => {
  const { data } = await axiosInstance.post<AssignDoctorResponse>(
    '/admin/patient-manage/assign',
    request
  );
  return data;
};

export const getRecentActivity = async (): Promise<Patient[]> => {
  const { data } = await axiosInstance.get<GetPatientsResponse>(
    '/admin/dashboard/recent-activity'
  );
  return data.data;
};