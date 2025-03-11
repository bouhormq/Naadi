import { AuthResponse } from '@naadi/types';
import { ApiError } from '../../utils/apiError';
import { phoneAuth, verifyPhoneCode } from './providers';

/**
 * Sends verification code to the provided phone number
 * @param phoneNumber User's phone number (with country code, e.g. +1234567890)
 * @param recaptchaVerifier reCAPTCHA verifier instance
 * @returns Confirmation result to be used with verifyPhone
 */
export async function sendPhoneVerification(phoneNumber: string, recaptchaVerifier: any) {
  try {
    if (!phoneNumber) {
      throw new ApiError('Phone number is required', 400);
    }
    
    // Validate phone number format
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new ApiError('Invalid phone number format. Use format: +1234567890', 400);
    }
    
    return await phoneAuth(phoneNumber, recaptchaVerifier);
  } catch (error) {
    console.error('Phone verification error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to send verification code', 500);
  }
}

/**
 * Completes phone authentication with verification code
 * @param confirmationResult Confirmation result from sendPhoneVerification
 * @param verificationCode Verification code received via SMS
 * @returns Authentication response with user info and token
 */
export async function verifyPhone(
  confirmationResult: any, 
  verificationCode: string
): Promise<AuthResponse> {
  try {
    if (!confirmationResult) {
      throw new ApiError('Confirmation result is required', 400);
    }
    
    if (!verificationCode) {
      throw new ApiError('Verification code is required', 400);
    }
    
    return await verifyPhoneCode(confirmationResult, verificationCode);
  } catch (error) {
    console.error('Phone code verification error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to verify phone number', 500);
  }
} 