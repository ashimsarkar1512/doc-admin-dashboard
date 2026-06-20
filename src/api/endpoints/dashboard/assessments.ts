import { axiosInstance } from '@/api/axiosInstance';

export interface Assessment {
  submissionId: string;
  submissionCode: string;
  patientName: string;
  patientImage: string | null;
  patientId: string;
  provider: string;
  patientType: 'New Patient' | 'Repeat Patient' | string;
  categoryName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUESTED REFILL' | string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface GetAssessmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  patientType?: string;
  date?: string;
}

export interface AssessmentsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAssessmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment[];
  meta: AssessmentsMeta;
}

export interface GetCategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

// --- New Types for Single Assessment Details ---

interface PatientAnswer {
  selectedOptions: string[];
  textResponse: string | null;
  file: string | null;
}

interface QuestionOption {
  id: string;
  label: string;
  inputType?: string;
  subQuestions: any[];
}

interface Question {
  id: string;
  type: 'INPUT' | 'CHECKBOX' | 'RADIO' | string;
  heading: string;
  questionText: string;
  description: string;
  options: QuestionOption[];
  patientAnswer: PatientAnswer;
}

interface Product {
  name: string;
  size?: string;
  image: string;
  price: number;
}

interface PaymentSummary {
  products: Product[];
  subtotal: number;
  serviceDuration: string;
  serviceFees: number;
  shippingCharge: number;
  discount: number;
  total: number;
}

interface ComplianceConfirmation {
  agreedToTermsAndPrivacy: boolean;
  certifiedInfoAccurate: boolean;
  understoodFalseInfoConsequences: boolean;
  understoodRecommendationsBasis: boolean;
  understoodAdditionalInfoMayBeRequested: boolean;
}

interface AssessmentInfo {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

interface ReviewedBy {
  id: string;
  name: string;
}

export interface AssessmentDetails {
  submissionId: string;
  submissionCode: string;
  status: string;
  isEditable: boolean;
  assessment: AssessmentInfo;
  reviewedBy?: ReviewedBy | null;
  doctorNotes?: string | null;
  questions: Question[];
  complianceConfirmation: ComplianceConfirmation;
  paymentSummary: PaymentSummary;
}

export interface GetAssessmentDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AssessmentDetails;
}

export const getAssessments = async (params: GetAssessmentsParams = {}): Promise<GetAssessmentsResponse> => {
  const { data } = await axiosInstance.get<GetAssessmentsResponse>(
    '/admin/patient-manage/all-assessments',
    { params }
  );
  return data;
};

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } = await axiosInstance.get<GetCategoriesResponse>('/admin/patient-manage/all-categories');
  return data;
};

export const getAssessmentDetails = async (submissionId: string): Promise<GetAssessmentDetailsResponse> => {
  const { data } = await axiosInstance.get<GetAssessmentDetailsResponse>(
    `/admin/patient-manage/all-assessments/${submissionId}`
  );
  return data;
};
