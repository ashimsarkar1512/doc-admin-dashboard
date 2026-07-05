import { axiosInstance } from '../axiosInstance';

export interface FAQ {
  question: string;
  answer: string;
}

export interface AboutUsData {
  id?: string;
  heroTitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonUrl: string;
  heroTargetBlank: boolean;

  bodySection1Title: string;
  bodySection1Description: string;
  bodySection1ButtonText: string;
  bodySection1ButtonUrl: string;
  bodySection1TargetBlank: boolean;
  bodySection1ImageId: string | null;

  bodySection2Tag: string;
  bodySection2Title: string;
  bodySection2Description: string;
  bodySection2ButtonText: string;
  bodySection2ButtonUrl: string;
  bodySection2TargetBlank: boolean;
  bodySection2ImageId: string | null;

  bodySection3Tag: string;
  bodySection3Title: string;
  bodySection3Description: string;
  bodySection3Points: string[];
  bodySection3ButtonText: string;
  bodySection3ButtonUrl: string;
  bodySection3TargetBlank: boolean;
  bodySection3ImageId: string | null;

  faqSectionTitle: string;
  faqCardTitle: string;
  faqCardDescription: string;
  faqButtonText: string;
  faqButtonUrl: string;
  faqTargetBlank: boolean;
  faqCardImageId: string | null;
  faqs: FAQ[];

  bodySection1Image?: { fileUrl: string; fileName: string } | null;
  bodySection2Image?: { fileUrl: string; fileName: string } | null;
  bodySection3Image?: { fileUrl: string; fileName: string } | null;
  faqCardImage?: { fileUrl: string; fileName: string } | null;
}

export interface GetAboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsData;
}

export const getAboutUs = async (): Promise<AboutUsData> => {
  const response = await axiosInstance.get<GetAboutUsResponse>('/website-manage/about-us');
  return response.data.data;
};

export const updateAboutUs = async (data: Partial<AboutUsData>): Promise<AboutUsData> => {
  const response = await axiosInstance.patch<GetAboutUsResponse>('/website-manage/about-us', data);
  return response.data.data;
};
