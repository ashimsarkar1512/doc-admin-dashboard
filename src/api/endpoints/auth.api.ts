import { axiosInstance } from '@/api/axiosInstance';
import type { LoginCredentials, LoginResponse, VerifyOtpPayload } from "@/types/auth.types";

export const requestLoginOtp = async (credentials: LoginCredentials): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>('/auth/login', credentials);
  return response.data;
};

export const verifyLoginOtp = async (payload: VerifyOtpPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login/verify-otp', payload);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>('/auth/logout');
  return response.data;
};