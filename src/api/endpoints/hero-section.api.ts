import { axiosInstance } from '@/api/axiosInstance';

export interface HeroSectionResponse {
  id: string;
  title: string;
  description: string;
  page: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateHeroSectionDto {
  page: string;
  title: string;
  description: string;
}

export const getHeroSections = async (pageType: string): Promise<{ data: HeroSectionResponse[] }> => {
  const { data } = await axiosInstance.get(`/hero-section?pageType=${pageType}`);
  return data;
};

export const updateHeroSection = async (id: string, payload: UpdateHeroSectionDto): Promise<{ data: HeroSectionResponse }> => {
  const { data } = await axiosInstance.patch(`/hero-section/${id}`, payload);
  return data;
};
