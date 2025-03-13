import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { businessSignup } from '@naadi/api';
import { BusinessSignupRequest } from '@naadi/types';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json() as BusinessSignupRequest;
    
    // Validate request data
    if (!body.email || !body.password || !body.businessName) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Email, password, and business name are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for contact info
    if (!body.contactInfo || !body.contactInfo.phone || !body.contactInfo.address) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Contact information (phone and address) is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Call the API to create a business account
    const authResponse = await businessSignup(body);
    
    // Return the authentication response
    return new ExpoResponse(
      JSON.stringify(authResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Business signup error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to sign up business account' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 