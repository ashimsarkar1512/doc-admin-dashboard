import { axiosInstance } from '@/api/axiosInstance';
import type { 
  LoginCredentials, 
  LoginResponse, 
  SendOtpPayload, 
  SendOtpResponse, 
  VerifyOtpPayload, 
  VerifyOtpResponse,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyForgotPasswordOtpResponse,
  GetUserProfileResponse,
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
  UploadAvatarResponse,
  ToggleMfaResponse,
  GetUserPreferencesResponse,
  UpdateUserPreferencesPayload,
  UpdateUserPreferencesResponse,
  GetSessionsResponse,
  ChangePasswordPayload,
  ChangePasswordResponse
} from "@/types/auth.types";

export const requestLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const requestSendOtp = async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
  const response = await axiosInstance.post<SendOtpResponse>('/auth/send-otp', payload);
  return response.data;
};

export const requestResendOtp = async (payload: ResendOtpPayload): Promise<{ message: string; data?: { challengeId?: string } }> => {
  const response = await axiosInstance.post<{ message: string; data?: { challengeId?: string } }>('/auth/resend-otp', payload);
  return response.data;
};

export const verifyLoginOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  const response = await axiosInstance.post<VerifyOtpResponse>('/auth/verify-otp', payload);
  return response.data;
};

export const verifyForgotPasswordOtp = async (payload: VerifyOtpPayload): Promise<VerifyForgotPasswordOtpResponse> => {
  const response = await axiosInstance.post<VerifyForgotPasswordOtpResponse>('/auth/verify-otp', payload);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>('/auth/logout');
  return response.data;
};

export const requestForgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post<ForgotPasswordResponse>('/auth/forgot-password', payload);
  return response.data;
};

export const requestResetPassword = async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>('/auth/reset-password', payload);
  return response.data;
};

// ===============================
// ACCOUNT SETTINGS ENDPOINTS
// ===============================

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await axiosInstance.get<GetUserProfileResponse>('/auth/me');
  return response.data;
};

export const updateUserProfile = async (payload: UpdateUserProfilePayload): Promise<UpdateUserProfileResponse> => {
  const response = await axiosInstance.patch<UpdateUserProfileResponse>('/auth/me', payload);
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await axiosInstance.post<UploadAvatarResponse>('/auth/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const toggleMfa = async (): Promise<ToggleMfaResponse> => {
  const response = await axiosInstance.post<ToggleMfaResponse>('/auth/me/toggle-mfa');
  return response.data;
};

export const getUserPreferences = async (): Promise<GetUserPreferencesResponse> => {
  const response = await axiosInstance.get<GetUserPreferencesResponse>('/auth/me/preferences');
  return response.data;
};

export const updateUserPreferences = async (payload: UpdateUserPreferencesPayload): Promise<UpdateUserPreferencesResponse> => {
  const response = await axiosInstance.patch<UpdateUserPreferencesResponse>('/auth/me/preferences', payload);
  return response.data;
};

export const getSessions = async (): Promise<GetSessionsResponse> => {
  const response = await axiosInstance.get<GetSessionsResponse>('/auth/sessions');
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.post<ChangePasswordResponse>('/auth/change-password', payload);
  return response.data;
};
