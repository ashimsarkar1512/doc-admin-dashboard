import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Extract error message from API error response
 * Returns a user-friendly error message based on status code and response
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle axios errors
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    // Handle specific status codes with friendly messages
    switch (status) {
      case 409: // Conflict
        if (data?.message?.toLowerCase().includes('already exists')) {
          return `This ${extractResourceType(data.message)} already exists. Please use a different name.`;
        }
        return data?.message || 'A conflict occurred. Please check your input and try again.';

      case 400: // Bad Request
        return data?.message || 'Invalid input. Please check your entries and try again.';

      case 401: // Unauthorized
        return 'Your session has expired. Please log in again.';

      case 403: // Forbidden
        return 'You do not have permission to perform this action.';

      case 404: // Not Found
        return 'The resource was not found. It may have been deleted.';

      case 500: // Internal Server Error
        return 'Server error occurred. Please try again later.';

      case 503: // Service Unavailable
        return 'The service is temporarily unavailable. Please try again later.';

      default:
        return data?.message || error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract resource type from error message (e.g., "category" from "Category name already exists")
 */
const extractResourceType = (message: string): string => {
  if (message.toLowerCase().includes('category')) return 'category';
  if (message.toLowerCase().includes('user')) return 'user';
  if (message.toLowerCase().includes('product')) return 'product';
  return 'item';
};

/**
 * Check if error is due to duplicate/conflict
 */
export const isConflictError = (error: unknown): boolean => {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 409;
  }
  return false;
};

/**
 * Check if error is due to authentication failure
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401 || axiosError.response?.status === 403;
  }
  return false;
};
