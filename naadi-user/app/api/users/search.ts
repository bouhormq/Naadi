import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, queryUsers } from '@naadi/api';

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
    
    // Verify token and get user ID
    await getUserIdFromToken(token);
    
    // Get query parameters
    const url = new URL(request.url);
    const displayName = url.searchParams.get('displayName') || undefined;
    const email = url.searchParams.get('email') || undefined;
    const isBusiness = url.searchParams.get('isBusiness') === 'true' ? true : 
                       url.searchParams.get('isBusiness') === 'false' ? false : undefined;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Query users based on parameters
    const users = await queryUsers({
      displayName,
      email,
      isBusiness,
      limit
    });
    
    // Return the users
    return new ExpoResponse(
      JSON.stringify(users),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Query users error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to query users' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 