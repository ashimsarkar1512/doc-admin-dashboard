export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponseData {
  userId: string;
  status?: string;
  challengeId?: string;
  method?: string;
  purpose?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export interface SendOtpPayload {
  userId: string;
  purpose: "LOGIN" | "REGISTRATION" | "FORGOT_PASSWORD";
  method: "EMAIL" | "SMS";
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
  purpose: "LOGIN" | "REGISTRATION" | "FORGOT_PASSWORD";
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

export interface ResetPasswordPayload {
  challengeId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyForgotPasswordOtpResponseData {
  challengeId: string;
}

export interface VerifyForgotPasswordOtpResponse {
  success: boolean;
  message: string;
  data: VerifyForgotPasswordOtpResponseData;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponseData {
  userId: string;
  challengeId?: string | null;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: ForgotPasswordResponseData;
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  avatarId?: string;
  bio?: string;
  title?: string;
  specialty?: string;
  officeLocation?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  phone?: string;
  mfaEnabled?: boolean;
}

export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UpdateUserProfilePayload {
  avatarId?: string;
  name?: string;
  bio?: string;
  title?: string;
  specialty?: string;
  officeLocation?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatarId: string;
  };
}

export interface ToggleMfaResponse {
  success: boolean;
  message: string;
  data: {
    mfaEnabled: boolean;
  };
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface GetUserPreferencesResponse {
  success: boolean;
  message: string;
  data: UserPreferences;
}

export interface UpdateUserPreferencesPayload {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface UpdateUserPreferencesResponse {
  success: boolean;
  message: string;
  data: UserPreferences;
}

export interface Session {
  id: string;
  deviceType: string;
  deviceName: string;
  ipAddress: string;
  lastLoginAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface GetSessionsResponse {
  success: boolean;
  message: string;
  data: Session[];
}