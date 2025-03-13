import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument } from '@naadi/api';
import { query, collection, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@naadi/api';
import { Studio, Class } from '@naadi/types';

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
    
    // Get the user to verify it's a business account
    const user = await getUserById(userId);
    
    // Verify this is a business account
    if (user.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const studioId = url.searchParams.get('studioId');
    
    if (!studioId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the studio belongs to this business
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (studio.businessId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'You do not have permission to access this studio' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For now, return mock data
    // In a real implementation, we would query the classes for this studio
    const mockClasses: Class[] = [];
    
    // Return the classes
    return new ExpoResponse(
      JSON.stringify(mockClasses),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('List classes error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to list classes' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 