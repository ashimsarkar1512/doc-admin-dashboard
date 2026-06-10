export interface ContactLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  responded: boolean;
  attachments: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactLeadsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactLeadsResponse {
  data: ContactLead[];
  meta: ContactLeadsMeta;
}

export interface ContactLeadsParams {
  search?: string;
  service?: string;
  read?: boolean;
  responded?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateContactLeadPayload {
  id: string;
  formData: FormData;
}
