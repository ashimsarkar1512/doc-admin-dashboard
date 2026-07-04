import { axiosInstance } from '../axiosInstance';

export interface PolicyPageContent {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPolicyPageResponse {
  success: boolean;
  message: string;
  data: PolicyPageContent;
}

export interface UpdatePolicyPageResponse {
  success: boolean;
  message: string;
  data: PolicyPageContent;
}

export interface UpdatePolicyPageRequest {
  content: string;
}

/**
 * Get policy page content by slug
 * GET /api/v1/website-manage/{slug}
 */
export async function getPolicyPageContent(slug: string): Promise<PolicyPageContent> {
  const { data } = await axiosInstance.get<GetPolicyPageResponse>(
    `/website-manage/${slug}`
  );
  return data.data;
}

/**
 * Update policy page content by slug
 * PATCH /api/v1/website-manage/{slug}
 */
export async function updatePolicyPageContent(
  slug: string,
  params: UpdatePolicyPageRequest
): Promise<PolicyPageContent> {
  const { data } = await axiosInstance.patch<UpdatePolicyPageResponse>(
    `/website-manage/${slug}`,
    params
  );
  return data.data;
}
