import { axiosInstance } from '@/api/axiosInstance';

export interface HowItWorksStep {
  title: string;
  timeline: string;
  description: string;
}

export interface HowItWorksFaq {
  question: string;
  answer: string;
}

export interface HowItWorksResponse {
  id: string;
  sectionTitle: string;
  sectionDescription: string;
  steps: HowItWorksStep[];
  disclaimerTitle: string;
  disclaimerDescription: string;
  faqSectionTitle: string;
  faqs: HowItWorksFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateHowItWorksDto {
  sectionTitle: string;
  sectionDescription: string;
  steps: HowItWorksStep[];
  disclaimerTitle: string;
  disclaimerDescription: string;
  faqSectionTitle: string;
  faqs: HowItWorksFaq[];
}

export const getHowItWorksSection = async (): Promise<{ data: HowItWorksResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/how-it-works');
  return data;
};

export const updateHowItWorksSection = async (payload: UpdateHowItWorksDto): Promise<{ data: HowItWorksResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/how-it-works', payload);
  return data;
};
