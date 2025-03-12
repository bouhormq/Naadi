import { AuthResponse } from '@naadi/types';

/**
 * Sends a verification code to the provided phone number
 */
export async function sendPhoneVerificationCode(
  phoneNumber: string, 
  recaptchaVerifier: any
) {
  try {
    return await phoneAuth(phoneNumber, recaptchaVerifier);
  } catch (error: any) {
    console.error('Phone verification error:', error);
    throw new Error(error.message || 'Failed to send verification code');
  }
}

/**
 * Verifies the code sent to the phone number
 */
export async function verifyPhoneCode(
  confirmationResult: any, 
  verificationCode: string
): Promise<AuthResponse> {
  try {
    return await phoneAuth(confirmationResult, verificationCode);
  } catch (error: any) {
    console.error('Phone code verification error:', error);
    throw new Error(error.message || 'Failed to verify code');
  }
}

// Replace with fetch calls to server-side endpoints
export async function phoneAuth(
  phoneNumber: string,
  verificationCode: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber, verificationCode })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to authenticate with phone');
    }
    
    return await response.json() as AuthResponse;
  } catch (error: any) {
    console.error('Phone auth error:', error);
    throw new Error(error.message || 'Failed to authenticate with phone');
  }
} 