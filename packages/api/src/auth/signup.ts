import { SignupRequest, AuthResponse } from '@naadi/types';
import { ApiError } from '../../utils/apiError';
import { emailSignup } from './providers';

/**
 * Handles user signup with email and password
 * @param data SignupRequest data from client
 * @returns User object with auth token
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  try {
    const { email, password, displayName } = data;
    
    // Validate input
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }
    
    // Use the email provider for signup
    return await emailSignup(email, password, { displayName });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to create account', 500);
  }
} 