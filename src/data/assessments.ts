import type { Assessment } from '@/types';

export const CATEGORY_OPTIONS = [
  'Weight Loss',
  'Hormone Therapy',
  'Regrow Hair',
  "Men's Services",
  'Skin Care',
  'Mental Health',
  'Physical Therapy',
  'Nutrition',
];

export const QUESTION_TYPE_OPTIONS = [
  'Information only',
  'Multiple choice',
  'Single choice',
  'Input',
  'Yes / No',
];

export const CONTENT_ALIGNMENT_OPTIONS = [
  'Left aligned',
  'Center aligned',
  'Right aligned',
];

export const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=500&auto=format&fit=crop',
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: 'Weight Loss',
    category: 'Weight Loss',
    description: 'At Weight Loss MD, we provide medically supervised weight management services for individuals in Colorado.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop',
    status: 'Active',
    publishedDate: '11/28/2024',
    totalAssessments: 125,
    questions: [],
  },
  {
    id: 2,
    title: 'Individual Therapy',
    category: "Men's Services",
    description: 'Comprehensive evaluation of joint and muscle discomfort with custom rehab and pain management.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=500&auto=format&fit=crop',
    status: 'Active',
    publishedDate: '11/28/2024',
    totalAssessments: 125,
    questions: [],
  },
  {
    id: 3,
    title: 'Hormone Therapy Intake',
    category: 'Hormone Therapy',
    description: 'Initial consultation form to evaluate eligibility for hormone replacement therapy programs.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop',
    status: 'Active',
    publishedDate: '11/28/2024',
    totalAssessments: 98,
    questions: [],
  },
  {
    id: 4,
    title: 'Hair Restoration Screening',
    category: 'Regrow Hair',
    description: 'A screening assessment to identify patient suitability for hair regrowth treatment plans.',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=500&auto=format&fit=crop',
    status: 'Draft',
    publishedDate: '11/28/2024',
    totalAssessments: 42,
    questions: [],
  },
];
