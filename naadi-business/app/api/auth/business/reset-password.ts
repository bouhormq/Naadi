import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate request data
    if (!body.email) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Send password reset email
    const auth = getAuth();
    await sendPasswordResetEmail(auth, body.email);
    
    // Return success
    return new ExpoResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Password reset error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to send password reset email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 