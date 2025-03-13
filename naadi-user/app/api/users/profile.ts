import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, updateUser, getUserById } from '@naadi/api';
import { UpdateUserRequest } from '@naadi/types';

// GET handler - Get current user profile
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
    const userId = await getUserIdFromToken(token);
    
    // Get the user data
    const user = await getUserById(userId);
    
    // Return the user data
    return new ExpoResponse(
      JSON.stringify(user),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get user profile' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// PUT handler - Update user profile
export async function PUT(request: ExpoRequest): Promise<ExpoResponse> {
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
    
    // Get the update data from the request body
    const updateData = await request.json() as UpdateUserRequest;
    
    // Update the user profile
    const updatedUser = await updateUser(userId, updateData);
    
    // Return the updated user data
    return new ExpoResponse(
      JSON.stringify(updatedUser),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to update user profile' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 