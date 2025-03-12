import { AuthResponse } from '@naadi/types';
import { User } from '@naadi/types';

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
    const response = await fetch('/api/auth/businessSignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, businessName, role: 'business', contactInfo })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign up business');
    }
    
    return await response.json();
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to login business account');
    }
    
    const responseData = await response.json();
    // Verify this is a business account
    if (responseData.user.role !== 'business') {
      throw new Error('This account is not registered as a business');
    }
    
    return responseData;
  } catch (error: any) {
    console.error('Business login error:', error);
    throw new Error(error.message || 'Failed to login business account');
  }
} 