<<<<<<< HEAD
import { axiosInstance } from "@/api/axiosInstance";

export interface FaqItem {
  id: string;
  faqId: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaqSection {
  id: string;
  sectionTitle: string;
  pageType: string;
  createdAt: string;
  updatedAt: string;
  faqs: FaqItem[];
}

export interface FaqSectionResponse {
  success: boolean;
  message: string;
  data: FaqSection;
}

export interface UpdateFaqItemDto {
  question: string;
  answer: string;
}

export interface UpdateFaqSectionDto {
  pageType: string;
  sectionTitle: string;
  faqs: UpdateFaqItemDto[];
}

export const getFaqSection = async (
  pageType: string
): Promise<FaqSectionResponse> => {
=======
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
>>>>>>> ashim
  const { data } = await axiosInstance.get(`/faq?pageType=${pageType}`);
  return data;
};

<<<<<<< HEAD
export const updateFaqSection = async (
  payload: UpdateFaqSectionDto
): Promise<FaqSectionResponse> => {
  const { data } = await axiosInstance.patch("/faq", payload);
=======
export const updateFaq = async (
  payload: {
    pageType: string;
    sectionTitle: string;
    faqs: { question: string; answer: string }[];
  }
): Promise<{ data: FaqSectionResponse }> => {
  const { data } = await axiosInstance.patch(`/faq`, payload);
>>>>>>> ashim
  return data;
};
