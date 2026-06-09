export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponseData {
  userId: string;
  status: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export interface SendOtpPayload {
  userId: string;
  purpose: "LOGIN" | "REGISTRATION";
  method: "EMAIL" | "PHONE";
}

export interface SendOtpResponseData {
  challengeId: string;
  userId: string;
  purpose: string;
  method: string;
  expiresAt: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: SendOtpResponseData;
}

export interface ResendOtpPayload {
  challengeId: string;
  userId: string;
  purpose: "LOGIN" | "REGISTRATION";
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  roles?: string[];
  status: string;
  phoneNumber?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  mfaEnabled?: boolean;
  lastLoginAt?: string | null;
}

export interface VerifyOtpResponseData {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpResponseData;
}

export interface VerifyOtpPayload {
  challengeId: string;
  otp: string;
}