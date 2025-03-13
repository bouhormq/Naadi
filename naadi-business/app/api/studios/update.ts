import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument, updateDocument } from '@naadi/api';
import { Studio, UpdateStudioRequest } from '@naadi/types';

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
    
    // Get the user to verify it's a business account
    const user = await getUserById(userId);
    
    // Verify this is a business account
    if (user.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get update data from request body
    const updateData = await request.json() as UpdateStudioRequest;
    
    // Validate studio ID
    if (!updateData.studioId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the studio to verify ownership
    const studio = await getDocument<Studio>('studios', updateData.studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the business owns this studio
    if (studio.businessId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'You do not have permission to update this studio' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Remove studioId from update data
    const { studioId, ...dataToUpdate } = updateData;
    
    // Update the studio
    await updateDocument<Studio>('studios', studioId, dataToUpdate);
    
    // Get the updated studio
    const updatedStudio = await getDocument<Studio>('studios', studioId);
    
    // Return the updated studio
    return new ExpoResponse(
      JSON.stringify(updatedStudio),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Update studio error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to update studio' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 