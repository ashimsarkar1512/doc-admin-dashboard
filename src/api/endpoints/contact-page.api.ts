import { axiosInstance } from '@/api/axiosInstance';
import type { AttachmentResponse } from './attachments.api';

// --- Contact Side Widget ---
export interface ContactSideWidgetResponse {
  id: string;
  title: string;
  opening: string;
  offDay: string;
  phone: string;
  email: string;
  imageId: string | null;
  image: AttachmentResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactSideWidgetDto {
  title: string;
  opening: string;
  offDay: string;
  phone: string;
  email: string;
  imageId?: string | null;
}

export const getContactSideWidget = async (): Promise<{ data: ContactSideWidgetResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/contact-side-widget');
  return data;
};

export const updateContactSideWidget = async (payload: UpdateContactSideWidgetDto): Promise<{ data: ContactSideWidgetResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/contact-side-widget', payload);
  return data;
};

// --- Contact Partner Section ---
export interface ContactPartner {
  id: string;
  sectionId: string;
  imageId: string;
  image: AttachmentResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPartnerSectionResponse {
  id: string;
  sectionTitle: string;
  partners: ContactPartner[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactPartnerSectionDto {
  sectionTitle: string;
  imageIds: string[];
}

export const getContactPartnerSection = async (): Promise<{ data: ContactPartnerSectionResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/contact-partner-section');
  return data;
};

export const updateContactPartnerSection = async (payload: UpdateContactPartnerSectionDto): Promise<{ data: ContactPartnerSectionResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/contact-partner-section', payload);
  return data;
};
