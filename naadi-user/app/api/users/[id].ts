import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById } from '@naadi/api';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
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
    
    // Verify token
    await getUserIdFromToken(token);
    
    // Get the user ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];
    
    if (!userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the user data
    const user = await getUserById(userId);
    
    // Return the user data
    return new ExpoResponse(
      JSON.stringify(user),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get user' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 