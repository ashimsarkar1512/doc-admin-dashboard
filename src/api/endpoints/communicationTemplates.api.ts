import { axiosInstance } from '../axiosInstance';

/* ─── Global Layout ──────────────────────────────────────────────── */
export interface GlobalLayout {
  id: string;
  name: string;
  isActive: boolean;
  logoId: string | null;
  isBlack: boolean;
  brandName: string;
  headerTitle: string;
  headerSubtitle: string;
  footerCompanyName: string;
  footerEmail: string;
  footerTagline: string;
  createdAt: string;
  updatedAt: string;
  logo: string | null;
}

export interface GlobalLayoutResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GlobalLayout;
}

export interface UpdateGlobalLayoutPayload {
  logoId?: string | null;
  brandName?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  footerCompanyName?: string;
  footerEmail?: string;
  footerTagline?: string;
  isBlack?: boolean;
  isActive?: boolean;
}

export const getGlobalLayout = async (): Promise<GlobalLayoutResponse> => {
  const response = await axiosInstance.get<GlobalLayoutResponse>(
    '/admin/communication-templates/layout'
  );
  return response.data;
};

export const updateGlobalLayout = async (
  payload: UpdateGlobalLayoutPayload
): Promise<GlobalLayoutResponse> => {
  const response = await axiosInstance.patch<GlobalLayoutResponse>(
    '/admin/communication-templates/layout',
    payload
  );
  return response.data;
};

/* ─── Communication Templates ────────────────────────────────────── */
export interface CommunicationTemplate {
  id: string;
  action: string;
  channel: string;
  subject: string | null;
  headerTitle: string;
  headerSubtitle: string;
  content: string;
  infoCard1Title: string | null;
  infoCard1Text: string | null;
  infoCard2Title: string | null;
  infoCard2Text: string | null;
  showInfoCards: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTemplatesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CommunicationTemplate[];
}

export interface UpdateTemplatePayload {
  subject?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  content?: string;
  infoCard1Title?: string | null;
  infoCard1Text?: string | null;
  infoCard2Title?: string | null;
  infoCard2Text?: string | null;
  showInfoCards?: boolean;
  isActive?: boolean;
}

export interface UpdateTemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CommunicationTemplate;
}

export const getTemplates = async (
  channel?: string,
  action?: string
): Promise<GetTemplatesResponse> => {
  const params: Record<string, string> = {};
  if (channel) params.channel = channel;
  if (action) params.action = action;
  const response = await axiosInstance.get<GetTemplatesResponse>(
    '/admin/communication-templates',
    { params }
  );
  return response.data;
};

export const updateTemplate = async (
  id: string,
  payload: UpdateTemplatePayload,
): Promise<UpdateTemplateResponse> => {
  const response = await axiosInstance.patch<UpdateTemplateResponse>(
    `/admin/communication-templates/${id}`,
    payload,
  );
  return response.data;
};

export interface GetTemplateByIdResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CommunicationTemplate;
}

/** GET /admin/communication-templates/:id */
export const getTemplateById = async (
  id: string,
): Promise<GetTemplateByIdResponse> => {
  const response = await axiosInstance.get<GetTemplateByIdResponse>(
    `/admin/communication-templates/${id}`,
  );
  return response.data;
};

/* ─── Template Variables ─────────────────────────────────────────── */
export interface TemplateVariablesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, string[]>;
}

export const getTemplateVariables = async (
  channel: string,
  action: string
): Promise<TemplateVariablesResponse> => {
  const response = await axiosInstance.get<TemplateVariablesResponse>(
    '/admin/communication-templates/variables',
    { params: { channel, action } }
  );
  return response.data;
};
