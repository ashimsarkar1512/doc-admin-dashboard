export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phoneNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  profileComplete: boolean;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}