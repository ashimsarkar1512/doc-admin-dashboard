import { axiosInstance } from '@/api/axiosInstance';

export interface HeroSection {
  id: string;
  title: string;
  description: string;
  page: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetHeroSectionsResponse {
  success: boolean;
  message: string;
  data: HeroSection[];
}

export interface UpdateHeroSectionResponse {
  success: boolean;
  message: string;
  data: HeroSection;
}

export interface UpdateHeroSectionRequest {
  page: string;
  title: string;
  description: string;
}

/**
 * Get hero sections filtered by pageType
 * GET /api/v1/hero-section?pageType={pageType}
 */
export async function getHeroSectionByPage(pageType: string): Promise<HeroSection[]> {
  const { data } = await axiosInstance.get<GetHeroSectionsResponse>('/hero-section', {
    params: { pageType },
  });
  return data.data;
}

export const getHeroSections = getHeroSectionByPage;

/**
 * Update a hero section by ID
 * PATCH /api/v1/hero-section/{id}
 */
export async function updateHeroSection(
  id: string,
  params: UpdateHeroSectionRequest
): Promise<HeroSection> {
  const { data } = await axiosInstance.patch<UpdateHeroSectionResponse>(
    `/hero-section/${id}`,
    params
  );
  return data.data;
}
