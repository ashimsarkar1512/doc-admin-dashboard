import { axiosInstance } from '@/api/axiosInstance';

export type AttachmentContext =
  | 'DOCTOR_AVATAR'
  | 'PRODUCT_IMAGE'
  | 'ASSESSMENT_THUMBNAIL'
  | 'CATEGORY_IMAGE'
  | string;

export interface AttachmentResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  context: AttachmentContext;
  uploadedById: string | null;
  sideEffectReportId: string | null;
  productId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadAttachmentResponse {
  success: boolean;
  message: string;
  data: AttachmentResponse;
}

export interface UploadMultipleAttachmentsResponse {
  success: boolean;
  message: string;
  data: AttachmentResponse[];
}

/**
 * Upload a single file with a given context.
 * POST /api/v1/attachments/upload
 * multipart/form-data: { context, files[] }
 */
export async function uploadAttachment(
  file: File,
  context: AttachmentContext
): Promise<AttachmentResponse> {
  const formData = new FormData();
  formData.append('context', context);
  formData.append('files', file);

  const { data } = await axiosInstance.post<UploadAttachmentResponse>(
    '/attachments/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data.data;
}

/**
 * Upload multiple files with a given context.
 * POST /api/v1/attachments/upload
 * multipart/form-data: { context, files[] }
 */
export async function uploadMultipleAttachments(
  files: File[],
  context: AttachmentContext
): Promise<AttachmentResponse[]> {
  const formData = new FormData();
  formData.append('context', context);
  files.forEach((file) => formData.append('files', file));

  const { data } = await axiosInstance.post<UploadMultipleAttachmentsResponse>(
    '/attachments/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return Array.isArray(data.data) ? data.data : [data.data as unknown as AttachmentResponse];
}

/**
 * Delete an attachment by ID.
 * DELETE /api/v1/attachments/{id}
 */
export async function deleteAttachment(id: string): Promise<void> {
  await axiosInstance.delete(`/attachments/${id}`);
}
