import { PartnerSignupRequest, User, AuthResponse } from '@naadi/types';
import { createDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getApp } from 'firebase/app';

/**
 * Handles partner signup
 * @param data PartnerSignupRequest data from client
 * @returns User object with auth token
 */
export async function businessSignup(data: PartnerSignupRequest): Promise<AuthResponse> {
  try {
    const { email, password, businessName, contactInfo } = data;
    
    // Validate input
    if (!email || !password || !businessName || !contactInfo) {
      throw new ApiError('All fields are required', 400);
    }
    
    if (!contactInfo.phone || !contactInfo.address) {
      throw new ApiError('Phone and address are required', 400);
    }
    
    // Get Firebase Auth instance
    const auth = getAuth(getApp());
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create partner user document in Firestore
    const userData: Omit<User, 'id'> = {
      uid,
      email,
      role: 'partner',
      businessName,
      contactInfo,
      createdAt: new Date().toISOString()
    };
    
    await createDocument<User>('users', userData);
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid,
        email,
        role: 'partner',
        businessName: userData.businessName,
      },
      token
    };
  } catch (error) {
    console.error('Partner signup error:', error);
    
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
    
    throw new ApiError('Failed to create partner account', 500);
  }
} 