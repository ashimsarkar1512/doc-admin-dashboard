import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyLoginOtp, logout as apiLogout } from '@/api/endpoints/auth.api';
import type { VerifyOtpResponseData, VerifyOtpPayload } from '@/types/auth.types';

// Full thunk return shape — includes the API message for the toast
interface LoginThunkResult {
  message: string;
  data: VerifyOtpResponseData;
}

interface OtpPending {
  userId: string;
  challengeId: string | null;
  method: 'EMAIL' | 'SMS';
  purpose: 'LOGIN' | 'FORGOT_PASSWORD';
  email?: string;
  phone?: string | null;
}

interface AuthState {
  user: VerifyOtpResponseData['user'] | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  otpPending: OtpPending | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
  otpPending: null,
};

// Async thunk for login via OTP
export const login = createAsyncThunk<
  LoginThunkResult,
  VerifyOtpPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await verifyLoginOtp(payload);

    const roles = response.data.user.roles;
    const role = response.data.user.role;
    const permissions = response.data.user.permissions;

    const isAdmin = (roles && roles.includes('ADMIN')) || role === 'ADMIN';
    const isEmployee = permissions && permissions.length > 0;

    // Allow login if the user is an ADMIN or has any permissions (employee)
    if (!isAdmin && !isEmployee) {
      return rejectWithValue('Access denied: You do not have permission to access this dashboard.');
    }

    return { message: response.message, data: response.data };
  } catch (error: unknown) {
    const err = error as import('axios').AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Login failed'
    );
  }
});

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiLogout();
  } catch (error) {
    console.error('Failed to logout from backend', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear the auth cookie manually if the backend didn't set it to expire
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: () => initialState,
    setOtpPending: (state, action: import('@reduxjs/toolkit').PayloadAction<OtpPending>) => {
      state.otpPending = action.payload;
    },
    clearOtpPending: (state) => {
      state.otpPending = null;
    },
    setCredentials: (
      state,
      action: import('@reduxjs/toolkit').PayloadAction<{ user: VerifyOtpResponseData['user']; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        if (action.payload.data.accessToken) {
          localStorage.setItem('token', action.payload.data.accessToken);
        }
        if (action.payload.data.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.otpPending = null;
      });
  },
});

export const { clearError, resetAuthState, setOtpPending, clearOtpPending, setCredentials } = authSlice.actions;
export default authSlice.reducer;