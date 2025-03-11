import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { signup } from '@naadi/api/src/auth/signup';
import { SignupRequest } from '@naadi/types/src/api';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json() as SignupRequest;
    
    // Validate request data
    if (!body.email || !body.password) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Call the shared API logic
    const response = await signup(body);
    
    // Return success response
    return new ExpoResponse(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors
    console.error('Signup error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to sign up' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 