import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { verifyPhone } from '@naadi/api';
import { PhoneConfirmRequest } from '@naadi/types';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json() as PhoneConfirmRequest;
    
    // Validate request data
    if (!body.verificationId || !body.verificationCode) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Verification ID and code are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Call the API to verify the code
    const authResponse = await verifyPhone(body.verificationId, body.verificationCode);
    
    // Return the authentication response
    return new ExpoResponse(
      JSON.stringify(authResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Phone verification error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to verify phone number' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 