import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { signInWithGoogle } from '@naadi/api';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json();
    
    // Optional: Get code from body for OAuth flow
    const { code } = body;
    
    // Call the API to sign in with Google
    // In a real implementation, we would use the code to get a Google access token
    // and then use that to authenticate with Firebase
    const authResponse = await signInWithGoogle();
    
    // Return the authentication response
    return new ExpoResponse(
      JSON.stringify(authResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Google authentication error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to authenticate with Google' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 