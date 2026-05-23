import type { LoginCredentials, LoginResponse } from "@/types/auth.types";

// Mock API function for login - replace with actual API call
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login response
  // In a real app, this would be an actual API call to your backend
  if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
    return {
      id: '1',
      email: credentials.email,
      name: 'Admin User',
      role: 'admin',
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
    };
  }
  
  // Throw error for invalid credentials
  throw new Error('Invalid email or password');
};

// Mock API function for logout
export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would call your backend to invalidate the token
};