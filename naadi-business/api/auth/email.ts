import { 
  emailSignup as apiEmailSignup,
  emailLogin as apiEmailLogin 
} from '@naadi/api/src/auth/providers';
import { AuthResponse } from '@naadi/types/src/api';
import { User } from '@naadi/types/src/firestore';

/**
 * Handles business signup with email/password
 */
export async function businessSignup(
  email: string, 
  password: string, 
  businessName: string,
  contactInfo: {
    phone: string;
    address: string;
  }
): Promise<AuthResponse> {
  try {
    return await apiEmailSignup(email, password, { 
      businessName, 
      role: 'business',
      contactInfo
    });
  } catch (error: any) {
    console.error('Business signup error:', error);
    throw new Error(error.message || 'Failed to sign up business');
  }
}

/**
 * Handles business login with email/password
 */
export async function loginWithEmail(
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    const response = await apiEmailLogin(email, password);
    
    // Verify this is a business account
    if (response.user.role !== 'business') {
      throw new Error('This account is not registered as a business');
    }
    
    return response;
  } catch (error: any) {
    console.error('Business login error:', error);
    throw new Error(error.message || 'Failed to login business account');
  }
} 