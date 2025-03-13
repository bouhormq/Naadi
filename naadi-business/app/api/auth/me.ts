import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument } from '@naadi/api';

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
    
    if (!userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the user data
    const user = await getUserById(userId);
    
    // Check if this is a business account
    if (user.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get business data
    let business = null;
    try {
      // In the mock API, there's a direct relationship between user-123 and business-123
      // For testing purposes, we'll derive the business ID from the user ID
      const businessId = `business-${userId.split('-')[1]}`;
      business = await getDocument('businesses', businessId);
    } catch (error) {
      // Business not found, continue without business details
      console.warn(`Business not found for owner ID ${userId}`);
    }
    
    // Return the user and business data
    return new ExpoResponse(
      JSON.stringify({ user, business }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get business profile error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get business profile' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 