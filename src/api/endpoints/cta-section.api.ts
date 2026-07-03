import { axiosInstance } from '@/api/axiosInstance';

export interface UpdateCtaSectionDto {
  page?: string;
  sectionTitle?: string;
  ctaButtonText?: string;
  url?: string;
  openInNewTab?: boolean;
}

export const getCtaSections = async (pageType: string) => {
  const { data } = await axiosInstance.get(`/cta-section?pageType=${pageType}`);
  return data;
};

export const updateCtaSection = async (id: string, payload: UpdateCtaSectionDto) => {
  const { data } = await axiosInstance.patch(`/cta-section/${id}`, payload);
  return data;
};
