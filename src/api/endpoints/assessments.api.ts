import { API_BASE_URL } from '@/api/config';
import type { Assessment, AssessmentQuestion } from '@/types';
import type { PaginatedResponse } from '@/api/endpoints/categories.api';

// ─── Assessment payloads ───────────────────────────────────────────────────

export interface GetAssessmentsParams {
  search?: string;
  status?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateAssessmentPayload {
  title: string;
  description: string;
  categoryId: string;
  status?: 'ACTIVE' | 'DRAFT' | 'DISABLED';
  thumbnail?: File | null;
}

// ─── Question payloads ─────────────────────────────────────────────────────

export interface CreateQuestionPayload {
  type: 'INFORMATION_ONLY' | 'INPUT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  assessmentId: string;
  heading?: string;
  questionText?: string;
  description?: string;
  contentAlignment?: string;
  isRequired?: boolean;
  parentOptionId?: string;
  media?: File | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
  return response.json() as Promise<T>;
}

// ─── Assessments ───────────────────────────────────────────────────────────

export const getAssessments = async (
  params?: GetAssessmentsParams
): Promise<PaginatedResponse<Assessment>> => {
  const url = new URL(`${API_BASE_URL}/admin/assessments`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString());
  return handleResponse<PaginatedResponse<Assessment>>(response);
};

export const createAssessment = async (
  payload: CreateAssessmentPayload
): Promise<Assessment> => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('categoryId', payload.categoryId);
  if (payload.status) formData.append('status', payload.status);
  if (payload.thumbnail) {
    formData.append('thumbnail', payload.thumbnail);
  }

  const response = await fetch(`${API_BASE_URL}/admin/assessments`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<Assessment>(response);
};

// ─── Questions ─────────────────────────────────────────────────────────────

export const createQuestion = async (
  payload: CreateQuestionPayload
): Promise<AssessmentQuestion> => {
  const formData = new FormData();
  formData.append('type', payload.type);
  formData.append('assessmentId', payload.assessmentId);

  if (payload.heading !== undefined) formData.append('heading', payload.heading);
  if (payload.questionText !== undefined) formData.append('questionText', payload.questionText);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.contentAlignment !== undefined)
    formData.append('contentAlignment', payload.contentAlignment);
  if (payload.isRequired !== undefined)
    formData.append('isRequired', String(payload.isRequired));
  if (payload.parentOptionId !== undefined)
    formData.append('parentOptionId', payload.parentOptionId);
  if (payload.media) formData.append('media', payload.media);

  const response = await fetch(`${API_BASE_URL}/admin/questions`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<AssessmentQuestion>(response);
};

export interface GetQuestionsParams {
  assessmentId: string;
  page?: number;
  limit?: number;
}

export const getQuestions = async (
  params: GetQuestionsParams
): Promise<PaginatedResponse<AssessmentQuestion>> => {
  const url = new URL(`${API_BASE_URL}/admin/questions`);
  url.searchParams.append('assessmentId', params.assessmentId);
  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));

  const response = await fetch(url.toString());
  return handleResponse<PaginatedResponse<AssessmentQuestion>>(response);
};
