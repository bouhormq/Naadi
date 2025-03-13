import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { sendPhoneVerification } from '@naadi/api';
import { PhoneVerifyRequest } from '@naadi/types';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json() as PhoneVerifyRequest;
    
    // Validate request data
    if (!body.phoneNumber) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get reCAPTCHA verifier (this would come from the client in a real implementation)
    // Here we pass null as we're mocking it for the server-side implementation
    const recaptchaVerifier = null;
    
    // Call the API to send verification code
    const result = await sendPhoneVerification(body.phoneNumber, recaptchaVerifier);
    
    // Return the verification ID
    return new ExpoResponse(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Phone verification error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to send verification code' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 