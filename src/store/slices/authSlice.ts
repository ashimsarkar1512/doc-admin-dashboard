import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi } from '@/api/endpoints/auth.api';
import type { LoginResponse, LoginCredentials } from '@/types/auth.types';

interface AuthState {
  user: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Login failed'
    );
  }
});

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear local storage, cookies, etc.
  localStorage.removeItem('token');
  // Add any additional cleanup logic here
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset auth state (useful for logout)
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
        state.user = action.payload;
        state.isAuthenticated = true;
        // Store token or user data if needed
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
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