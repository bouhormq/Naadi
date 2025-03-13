import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, createStudio } from '@naadi/api';
import { CreateStudioRequest } from '@naadi/types';

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
        JSON.stringify({ error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get studio data from request body
    const studioData = await request.json() as CreateStudioRequest;
    
    // Create the studio
    const studio = await createStudio(studioData, userId);
    
    // Return the created studio
    return new ExpoResponse(
      JSON.stringify(studio),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create studio error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to create studio' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 