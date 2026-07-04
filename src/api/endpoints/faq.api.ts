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
  const { data } = await axiosInstance.get(`/faq?pageType=${pageType}`);
  return data;
};

export const updateFaqSection = async (
  payload: UpdateFaqSectionDto
): Promise<FaqSectionResponse> => {
  const { data } = await axiosInstance.patch("/faq", payload);
  return data;
};
