import { API_BASE_URL } from '@/api/config';
import type { Assessment, AssessmentQuestion, QuestionOption } from '@/types';
import type { PaginatedResponse } from '@/api/endpoints/categories.api';

// ─── Assessment payloads ───────────────────────────────────────────────────

export interface GetAssessmentsParams {
  search?: string;
  status?: string;
  categoryName?: string;
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

export interface UpdateAssessmentPayload {
  title?: string;
  description?: string;
  status?: 'ACTIVE' | 'DRAFT' | 'DISABLED';
  thumbnail?: File | null;
}

export interface AssessmentStats {
  activeAssessments: number;
  draftAssessments: number;
  disabledAssessments: number;
  assessmentTaken: number;
  approvedAssessments: number;
  declinedAssessments: number;
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

export interface UpdateQuestionPayload {
  type?: 'INFORMATION_ONLY' | 'INPUT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | string;
  assessmentId?: string;
  heading?: string;
  questionText?: string;
  description?: string;
  contentAlignment?: string;
  isRequired?: boolean;
  parentOptionId?: string | null;
  media?: File | null;
}

// ─── Question Option payloads ──────────────────────────────────────────────

export interface CreateQuestionOptionPayload {
  label: string;
  placeholder?: string;
  inputType?: string;
  questionId: string;
}

export interface UpdateQuestionOptionPayload {
  label?: string;
  placeholder?: string;
  inputType?: string;
  questionId?: string;
}

export interface GetQuestionOptionsParams {
  questionId?: string;
  page?: number;
  limit?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = localStorage.getItem('token');
  const headers = new Headers(init?.headers);
  headers.set('ngrok-skip-browser-warning', 'true');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
};

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
  const response = await customFetch(url.toString());
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

  const response = await customFetch(`${API_BASE_URL}/admin/assessments`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<Assessment>(response);
};

export const getAssessmentStats = async (): Promise<AssessmentStats> => {
  const response = await customFetch(`${API_BASE_URL}/admin/assessments/stats`);
  return handleResponse<AssessmentStats>(response);
};

export const getAssessmentById = async (id: string): Promise<Assessment> => {
  const response = await customFetch(`${API_BASE_URL}/admin/assessments/${id}`);
  return handleResponse<Assessment>(response);
};

export const updateAssessment = async (
  id: string,
  payload: UpdateAssessmentPayload
): Promise<Assessment> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.status !== undefined) formData.append('status', payload.status);
  if (payload.thumbnail !== undefined && payload.thumbnail !== null) {
    formData.append('thumbnail', payload.thumbnail);
  }

  const response = await customFetch(`${API_BASE_URL}/admin/assessments/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return handleResponse<Assessment>(response);
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const response = await customFetch(`${API_BASE_URL}/admin/assessments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
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

  const response = await customFetch(`${API_BASE_URL}/admin/questions`, {
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

  const response = await customFetch(url.toString());
  return handleResponse<PaginatedResponse<AssessmentQuestion>>(response);
};

export const getQuestionById = async (id: string): Promise<AssessmentQuestion> => {
  const response = await customFetch(`${API_BASE_URL}/admin/questions/${id}`);
  return handleResponse<AssessmentQuestion>(response);
};

export const updateQuestion = async (
  id: string,
  payload: UpdateQuestionPayload
): Promise<AssessmentQuestion> => {
  const formData = new FormData();
  if (payload.type !== undefined) formData.append('type', payload.type);
  if (payload.assessmentId !== undefined) formData.append('assessmentId', payload.assessmentId);
  if (payload.heading !== undefined) formData.append('heading', payload.heading);
  if (payload.questionText !== undefined) formData.append('questionText', payload.questionText);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.contentAlignment !== undefined)
    formData.append('contentAlignment', payload.contentAlignment);
  if (payload.isRequired !== undefined)
    formData.append('isRequired', String(payload.isRequired));
  if (payload.parentOptionId !== undefined && payload.parentOptionId !== null)
    formData.append('parentOptionId', payload.parentOptionId);
  if (payload.media !== undefined && payload.media !== null) formData.append('media', payload.media);

  const response = await customFetch(`${API_BASE_URL}/admin/questions/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return handleResponse<AssessmentQuestion>(response);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  const response = await customFetch(`${API_BASE_URL}/admin/questions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
};

// ─── Question Options ──────────────────────────────────────────────────────

export const createQuestionOption = async (
  payload: CreateQuestionOptionPayload
): Promise<QuestionOption> => {
  const response = await customFetch(`${API_BASE_URL}/admin/question-options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<QuestionOption>(response);
};

export const getQuestionOptions = async (
  params?: GetQuestionOptionsParams
): Promise<PaginatedResponse<QuestionOption>> => {
  const url = new URL(`${API_BASE_URL}/admin/question-options`);
  if (params) {
    if (params.questionId) url.searchParams.append('questionId', params.questionId);
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.limit) url.searchParams.append('limit', String(params.limit));
  }

  const response = await customFetch(url.toString());
  return handleResponse<PaginatedResponse<QuestionOption>>(response);
};

export const getQuestionOptionById = async (id: string): Promise<QuestionOption> => {
  const response = await customFetch(`${API_BASE_URL}/admin/question-options/${id}`);
  return handleResponse<QuestionOption>(response);
};

export const updateQuestionOption = async (
  id: string,
  payload: UpdateQuestionOptionPayload
): Promise<QuestionOption> => {
  const response = await customFetch(`${API_BASE_URL}/admin/question-options/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<QuestionOption>(response);
};

export const deleteQuestionOption = async (id: string): Promise<void> => {
  const response = await customFetch(`${API_BASE_URL}/admin/question-options/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }
};
