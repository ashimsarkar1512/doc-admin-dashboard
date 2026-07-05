import { axiosInstance } from '@/api/axiosInstance';

export interface LabTestingHero {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  isBlank: boolean;
  imageId: string | null;
  image?: { fileUrl: string; fileName: string } | null;
}

export interface LabTestingTest {
  name: string;
  duration: string;
  description: string;
}

export interface LabTestingService {
  title: string;
  description: string;
  imageId: string | null;
  image?: { fileUrl: string; fileName: string } | null;
  tests: LabTestingTest[];
}

export interface LabTestingSection {
  id?: string;
  sectionTitle: string;
  sectionDescription: string;
  services: LabTestingService[];
}

interface HeroResponse {
  success: boolean;
  message: string;
  data: LabTestingHero;
}

interface SectionResponse {
  success: boolean;
  message: string;
  data: LabTestingSection;
}

export const getLabTestingHero = async (): Promise<LabTestingHero> => {
  const response = await axiosInstance.get<HeroResponse>('/website-manage/lab-testing/hero');
  return response.data.data;
};

export const updateLabTestingHero = async (data: Partial<LabTestingHero>): Promise<LabTestingHero> => {
  const response = await axiosInstance.patch<HeroResponse>('/website-manage/lab-testing/hero', data);
  return response.data.data;
};

export const getLabTestingSection = async (): Promise<LabTestingSection> => {
  const response = await axiosInstance.get<SectionResponse>('/website-manage/lab-testing/section');
  return response.data.data;
};

export const updateLabTestingSection = async (data: Partial<LabTestingSection>): Promise<LabTestingSection> => {
  const response = await axiosInstance.patch<SectionResponse>('/website-manage/lab-testing/section', data);
  return response.data.data;
};
