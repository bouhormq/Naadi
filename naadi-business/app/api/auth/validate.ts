import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById } from '@naadi/api';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get the authentication token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Authentication token is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify token and get user ID
    const userId = await getUserIdFromToken(token);
    
    // Get the user to verify it's a business account
    const user = await getUserById(userId);
    
    // Verify this is a business account
    if (user.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ valid: false, error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If the token is valid, return success
    return new ExpoResponse(
      JSON.stringify({ valid: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Validate token error:', error);
    return new ExpoResponse(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 