import { axiosInstance } from '@/api/axiosInstance';

export interface Assessment {
  submissionId: string;
  submissionCode: string;
  patientName: string;
  patientImage: string | null;
  patientId: string;
  provider: string;
  payment:number
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
  timeRange?: string;
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

// --- Types for Single Assessment Details ---
interface SelectedOption {
  id: string;
  label: string;
}

interface PatientAnswer {
  selectedOptions: SelectedOption[];
  textResponse: string | null;
  file: string | null;
}

interface QuestionOption {
  id: string;
  label: string;
  inputType?: string;
  subQuestions: Question[];
}

interface Question {
  id: string;
  type: 'INPUT' | 'CHECKBOX' | 'RADIO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'INFORMATION_ONLY' | string;
  heading: string | null;
  questionText: string | null;
  description: string | null;
  options: QuestionOption[];
  patientAnswer: PatientAnswer | null;
}

interface Product {
  name: string;
  size?: string | null;
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
  patientName?: string;
  patientImage?: string | null;
  patient?: {
    name: string;
    image?: string | null;
  };
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
