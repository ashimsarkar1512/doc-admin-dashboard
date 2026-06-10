import { axiosInstance } from '@/api/axiosInstance';
import type {
  ContactLeadsResponse,
  ContactLead,
  ContactLeadsParams,
  UpdateContactLeadPayload,
} from '@/types/contactLeads.types';

export const getContactLeads = async (params?: ContactLeadsParams): Promise<ContactLeadsResponse> => {
  const response = await axiosInstance.get<ContactLeadsResponse>('/admin/contact-leads', { params });
  return response.data;
};

export const getContactLeadById = async (id: string): Promise<ContactLead> => {
  const response = await axiosInstance.get<ContactLead>(`/admin/contact-leads/${id}`);
  return response.data;
};

export const updateContactLead = async ({ id, formData }: UpdateContactLeadPayload): Promise<ContactLead> => {
  const response = await axiosInstance.patch<ContactLead>(`/admin/contact-leads/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteContactLead = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/contact-leads/${id}`);
};
