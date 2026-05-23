import type { Category } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Weight loss',
    description: 'Assessments and plans related to weight loss and management.',
    status: 'Active',
    activeAssessments: 12,
    totalPatients: 340,
  },
  {
    id: 2,
    name: 'Mental Health',
    description: 'Therapy and counseling services for mental wellbeing.',
    status: 'Active',
    activeAssessments: 8,
    totalPatients: 215,
  },
  {
    id: 3,
    name: 'Physical Therapy',
    description: 'Rehabilitation and physical therapy sessions.',
    status: 'Inactive',
    activeAssessments: 5,
    totalPatients: 120,
  },
  {
    id: 4,
    name: 'Nutrition',
    description: 'Dietary planning and nutritional counseling.',
    status: 'Active',
    activeAssessments: 15,
    totalPatients: 450,
  },
];
