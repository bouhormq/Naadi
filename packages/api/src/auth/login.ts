import { LoginRequest, User, AuthResponse } from '@naadi/types';
import { getDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getApp } from 'firebase/app';

/**
 * Handles user login
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
    
    // Get Firebase Auth instance
    const auth = getAuth(getApp());
    
    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Get user document from Firestore
    const user = await getDocument<User>('users', uid);
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    // Use a type assertion to tell TypeScript that the user is of type User
    const typedUser = user as User;
    
    return {
      user: {
        uid: typedUser.uid,
        email: typedUser.email,
        role: typedUser.role,
        displayName: typedUser.displayName,
        businessName: typedUser.businessName,
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('user-not-found')) {
        throw new ApiError('No user found with this email', 400);
      }
      if (error.message.includes('wrong-password')) {
        throw new ApiError('Invalid password', 400);
      }
      if (error.message.includes('invalid-email')) {
        throw new ApiError('Invalid email format', 400);
      }
      if (error.message.includes('too-many-requests')) {
        throw new ApiError('Too many failed login attempts, please try again later', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to log in', 500);
  }
} 