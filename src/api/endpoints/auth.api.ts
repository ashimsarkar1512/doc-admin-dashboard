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