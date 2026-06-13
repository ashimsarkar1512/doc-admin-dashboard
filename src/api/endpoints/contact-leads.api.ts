import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

export interface ContactLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  responded: boolean;
  attachments?: string;
  responseSubject?: string;
  responseMessage?: string;
  responseAttachments?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetContactLeadsParams {
  page?: number;
  limit?: number;
  read?: boolean;
  responded?: boolean;
}

export const getContactLeads = async (
  params?: GetContactLeadsParams
): Promise<PaginatedResponse<ContactLead>> => {
  const response = await axiosInstance.get<PaginatedResponse<ContactLead>>('/admin/contact-leads', {
    params,
  });
  return response.data;
};

export const getContactLeadById = async (id: string): Promise<ContactLead> => {
  const response = await axiosInstance.get<ContactLead>(`/admin/contact-leads/${id}`);
  return response.data;
};

export const respondContactLead = async (
  id: string,
  formData: FormData
): Promise<ContactLead> => {
  const response = await axiosInstance.post<ContactLead>(`/admin/contact-leads/${id}/respond`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteContactLead = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/contact-leads/${id}`);
};
