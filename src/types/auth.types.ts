export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponseData {
  userId?: string;
  status?: string;
  challengeId?: string;
  method?: string;
  purpose?: string;
  email?: string;
  phone?: string | null;
  accessToken?: string;
  tokenType?: string;
  user?: User;
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
  phone?: string;
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

// ============================================
// ACCOUNT SETTINGS TYPES
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  status: string;
  role?: string;
  roles?: string[];
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  mfaEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id?: string;
    avatar?: string;
    name?: string;
    bio?: string;
    title?: string;
    specialty?: string;
    officeLocation?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;
}

export interface GetUserProfileResponse {
  success: boolean;
  statusCode: number;
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
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfile;
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatarId: string;
    avatar: string; // the resolved URL
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
  statusCode: number;
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
  statusCode: number;
  message: string;
  data: UserPreferences & {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SessionDetail {
  sessionId: string;
  isCurrentSession: boolean;
  lastLogin: string;
  ipAddress: string;
  sessionDue: string;
}

export interface DeviceSession {
  deviceName: string;
  isActiveNow: boolean;
  sessionCount: number;
  sessions: SessionDetail[];
}

export interface GetSessionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DeviceSession[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
}
