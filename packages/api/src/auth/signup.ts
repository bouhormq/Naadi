import { SignupRequest, User, AuthResponse } from '@naadi/types';
import { createDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getApp } from 'firebase/app';

/**
 * Handles user signup
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
    
    // Get Firebase Auth instance
    const auth = getAuth(getApp());
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      uid,
      email,
      role: 'user',
      displayName,
      createdAt: new Date().toISOString()
    };
    
    await createDocument<User>('users', userData);
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid,
        email,
        role: 'user',
        displayName
      },
      token
    };
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('email-already-in-use')) {
        throw new ApiError('Email already in use', 400);
      }
      if (error.message.includes('invalid-email')) {
        throw new ApiError('Invalid email format', 400);
      }
      if (error.message.includes('weak-password')) {
        throw new ApiError('Password is too weak', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to create account', 500);
  }
} 