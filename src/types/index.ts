export interface Category {
  id: number | string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'ACTIVE' | 'DISABLED';
  paymentPlan?: {
    id?: string;
    price: number | string;
    billingCycle: string;
  } | null;
  icon?: {
    id: string;
    fileUrl: string;
    fileName?: string;
  } | null;
  activeAssessments: number;
  totalPatients: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InputField {
  id: number;
  inputType: string;
  label: string;
  placeholder: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  placeholder?: string | null;
  inputType?: string | null;
  subQuestions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'INFORMATION_ONLY' | 'INPUT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  heading?: string | null;
  media?: string | null;
  questionText?: string | null;
  description?: string | null;
  contentAlignment?: 'LEFT' | 'CENTER' | 'RIGHT' | string | null;
  isRequired: boolean;
  assessmentId: string;
  parentOptionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  options?: QuestionOption[];
  parentOption?: QuestionOption | null;
}

export interface Assessment {
  id: string;
  title: string;
  thumbnail?: string | null;
  description: string;
  status: 'ACTIVE' | 'DRAFT' | 'DISABLED';
  categoryId: string;
  createdAt?: string;
  publishedAt?: string | null;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
  totalQuestions: number;
  totalAssessments: number;
}

export interface Product {
  id: string;
  name: string;
  images?: string[];
  price: string;
  stockQuantity: number;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  status?: 'Active' | 'Inactive'; // Keep if used in frontend, else omit
}
