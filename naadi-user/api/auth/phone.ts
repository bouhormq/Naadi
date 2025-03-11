import { 
  phoneAuth as apiPhoneAuth,
  verifyPhoneCode as apiVerifyPhoneCode
} from '@naadi/api';
import { AuthResponse } from '@naadi/types';

/**
 * Sends a verification code to the provided phone number
 */
export async function sendPhoneVerificationCode(
  phoneNumber: string, 
  recaptchaVerifier: any
) {
  try {
    return await apiPhoneAuth(phoneNumber, recaptchaVerifier);
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
    return await apiVerifyPhoneCode(confirmationResult, verificationCode);
  } catch (error: any) {
    console.error('Phone code verification error:', error);
    throw new Error(error.message || 'Failed to verify code');
  }
} 