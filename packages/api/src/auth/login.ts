import { LoginRequest, AuthResponse } from '@naadi/types';
import { ApiError } from '../../utils/apiError';
import { emailLogin } from './providers';

/**
 * Handles user login with email and password
 * @param data LoginRequest data from client
 * @returns User object with auth token
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const { email, password } = data;
    
    // Validate input
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }
    
    // Use the email provider for login
    return await emailLogin(email, password);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to log in', 500);
  }
} 