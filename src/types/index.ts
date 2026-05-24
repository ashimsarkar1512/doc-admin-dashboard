export interface Category {
  id: number | string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'ACTIVE' | 'DISABLED';
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
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  status: 'Active' | 'Inactive';
}
