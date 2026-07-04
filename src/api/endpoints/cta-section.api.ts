import { axiosInstance } from '@/api/axiosInstance';

export interface UpdateCtaSectionDto {
  page?: string;
  sectionTitle?: string;
  ctaButtonText?: string;
  url?: string;
  openInNewTab?: boolean;
  categoryId?: string;
}

export const getCtaSections = async (pageType: string, categoryId?: string) => {
  const url = categoryId ? `/cta-section?pageType=${pageType}&categoryId=${categoryId}` : `/cta-section?pageType=${pageType}`;
  const { data } = await axiosInstance.get(url);
  return data;
};

export const updateCtaSection = async (id: string, payload: UpdateCtaSectionDto) => {
  const { data } = await axiosInstance.patch(`/cta-section/${id}`, payload);
  return data;
};
