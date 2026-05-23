export interface Category {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  activeAssessments: number;
  totalPatients: number;
}

export interface InputField {
  id: number;
  inputType: string;
  label: string;
  placeholder: string;
}

export interface AssessmentQuestion {
  id: number;
  type: string;
  // For Information only
  heading?: string;
  description?: string;
  contentAlignment?: string;
  mediaImage?: string;
  // For Single / Multiple choice & Input
  question?: string;
  options?: string[];
  inputFields?: InputField[];
  isRequired?: boolean;
}

export interface Assessment {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  status: 'Active' | 'Draft';
  publishedDate: string;
  totalAssessments: number;
  questions: AssessmentQuestion[];
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
