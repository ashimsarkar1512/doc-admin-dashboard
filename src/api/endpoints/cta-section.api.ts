import { axiosInstance } from '@/api/axiosInstance';

export interface CtaSectionResponse {
  id: string;
  page: string;
  categoryId: string | null;
  sectionTitle: string;
  ctaButtonText: string;
  url: string;
  openInNewTab: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCtaSectionDto {
  page?: string;
  sectionTitle?: string;
  ctaButtonText?: string;
  url?: string;
  openInNewTab?: boolean;
  categoryId?: string | null;
}

export const getCtaSections = async (pageType: string, categoryId?: string) => {
  const url = categoryId ? `/cta-section?pageType=${pageType}&categoryId=${categoryId}` : `/cta-section?pageType=${pageType}`;
  const { data } = await axiosInstance.get(url);
  return data;
};

export const updateCtaSection = async (id: string, payload: UpdateCtaSectionDto): Promise<{ data: CtaSectionResponse }> => {
  const { data } = await axiosInstance.patch(`/cta-section/${id}`, payload);
  return data;
};
