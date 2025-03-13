import { AuthResponse } from '@naadi/types';
import { storeUserData, storeAuthToken } from './session';

/**
 * Sends a verification code to the user's phone
 */
export async function sendPhoneVerification(phoneNumber: string): Promise<{ verificationId: string }> {
  try {
    const response = await fetch('/api/auth/phone/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send verification code');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Phone verification error:', error);
    throw new Error(error.message || 'Failed to send verification code');
  }
}

/**
 * Verifies the phone number with the code sent to the user
 */
export async function verifyPhone(
  verificationId: string, 
  verificationCode: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/phone/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ verificationId, verificationCode })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify phone number');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse;
  } catch (error: any) {
    console.error('Phone verification error:', error);
    throw new Error(error.message || 'Failed to verify phone number');
  }
} 