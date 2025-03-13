import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument, createClass } from '@naadi/api';
import { CreateClassRequest, Studio } from '@naadi/types';

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
    
    // Get class data from request body
    const classData = await request.json() as CreateClassRequest;
    
    // Validate required fields
    if (!classData.studioId || !classData.name || !classData.description || 
        !classData.instructor || !classData.startTime || !classData.endTime || 
        !classData.capacity || classData.price === undefined) {
      return new ExpoResponse(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the studio belongs to this business
    const studio = await getDocument<Studio>('studios', classData.studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (studio.businessId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'You do not have permission to create classes for this studio' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the class
    const newClass = await createClass(classData, userId);
    
    // Return the created class
    return new ExpoResponse(
      JSON.stringify(newClass),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create class error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to create class' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 