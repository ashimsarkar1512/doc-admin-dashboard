import { axiosInstance } from '@/api/axiosInstance';

export interface FaqItem {
  id?: string;
  faqId?: string;
  question: string;
  answer: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqSectionResponse {
  id: string;
  sectionTitle: string;
  pageType: string;
  createdAt?: string;
  updatedAt?: string;
  faqs: FaqItem[];
}

export const getFaqByPageType = async (pageType: string): Promise<{ data: FaqSectionResponse }> => {
  const { data } = await axiosInstance.get(`/faq?pageType=${pageType}`);
  return data;
};

export const updateFaq = async (
  payload: {
    pageType: string;
    sectionTitle: string;
    faqs: { question: string; answer: string }[];
  }
): Promise<{ data: FaqSectionResponse }> => {
  const { data } = await axiosInstance.patch(`/faq`, payload);
  return data;
};
