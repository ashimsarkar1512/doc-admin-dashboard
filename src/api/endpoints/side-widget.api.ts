import { axiosInstance } from '../axiosInstance';
import type { Attachment } from './websitemanagement.api';

export interface SideWidget {
  id: string;
  page: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  isBlank: boolean;
  imageId: string | null;
  image: Attachment | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetSideWidgetResponse {
  success: boolean;
  message: string;
  data: SideWidget[];
}

export interface UpdateSideWidgetResponse {
  success: boolean;
  message: string;
  data: SideWidget;
}

export interface UpdateSideWidgetRequest {
  page: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  isBlank: boolean;
  imageId: string | null;
}

/**
 * Get side widgets filtered by pageType
 * GET /api/v1/side-widget?pageType={pageType}
 */
export async function getSideWidgetByPage(pageType: string): Promise<SideWidget[]> {
  const { data } = await axiosInstance.get<GetSideWidgetResponse>('/side-widget', {
    params: { pageType },
  });
  return data.data;
}

/**
 * Update a side widget by ID
 * PATCH /api/v1/side-widget/{id}
 */
export async function updateSideWidget(
  id: string,
  params: UpdateSideWidgetRequest
): Promise<SideWidget> {
  const { data } = await axiosInstance.patch<UpdateSideWidgetResponse>(
    `/side-widget/${id}`,
    params
  );
  return data.data;
}
