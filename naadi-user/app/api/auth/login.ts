import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { login } from '@naadi/api';
import { LoginRequest } from '@naadi/types';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json() as LoginRequest;
    
    // Validate request data
    if (!body.email || !body.password) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Call the shared API logic
    const response = await login(body);
    
    // Return success response
    return new ExpoResponse(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors
    console.error('Login error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to login' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 