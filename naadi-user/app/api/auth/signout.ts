import { ExpoRequest, ExpoResponse } from 'expo-router/server';

export async function POST(_request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Nothing to do server-side for signout as this is handled client-side
    // with Firebase Auth and clearing local storage
    
    // Return success
    return new ExpoResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Sign out error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to sign out' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 