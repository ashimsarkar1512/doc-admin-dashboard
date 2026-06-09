import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyLoginOtp, logout as apiLogout } from '@/api/endpoints/auth.api';
import type { VerifyOtpResponseData, VerifyOtpPayload } from '@/types/auth.types';

interface AuthState {
  user: VerifyOtpResponseData['user'] | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

// Async thunk for login via OTP
export const login = createAsyncThunk<
  VerifyOtpResponseData,
  VerifyOtpPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await verifyLoginOtp(payload);
    
    const roles = response.data.user.roles;
    const role = response.data.user.role;
    
    if ((!roles || !roles.includes('ADMIN')) && role !== 'ADMIN') {
      return rejectWithValue('Access denied: Admins only');
    }

    return response.data;
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
    // Even if backend fails, we want to clear local state
  } finally {
    localStorage.removeItem('token');
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (action.payload.accessToken) {
          localStorage.setItem('token', action.payload.accessToken);
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
      });
  },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;