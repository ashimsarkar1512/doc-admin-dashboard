import { axiosInstance } from '@/api/axiosInstance';

export interface ServicePageFaq {
  question: string;
  answer: string;
  order?: number;
}

export interface UpdateServicePageDto {
  heroSection?: {
    bannerImageId?: string;
    pageTitle?: string;
  };
  secondSection?: {
    sectionTitle?: string;
    sectionDescription?: string;
    ctaButtonText?: string;
    url?: string;
    buttonTarget?: boolean;
    featuredMediaId?: string;
  };
  faqSection?: {
    sectionTitle?: string;
    faqs?: ServicePageFaq[];
  };
}

export const getServicePage = async (categoryId: string) => {
  const { data } = await axiosInstance.get(`/admin/service-page/${categoryId}`);
  return data;
};

export const updateServicePage = async (categoryId: string, payload: UpdateServicePageDto) => {
  const { data } = await axiosInstance.patch(`/admin/service-page/${categoryId}`, payload);
  return data;
};
