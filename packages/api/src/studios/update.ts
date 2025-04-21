import { UpdateStudioRequest, Studio } from '@naadi/types';
import { getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Updates an existing studio
 * @param data UpdateStudioRequest data from client
 * @param businessId ID of the partner updating the studio
 * @returns Updated studio object
 */
export async function updateStudio(data: UpdateStudioRequest, businessId: string) {
  try {
    const { studioId, ...updateData } = data;
    
    // Validate input
    if (!studioId) {
      throw new ApiError('Studio ID is required', 400);
    }
    
    if (!businessId) {
      throw new ApiError('Partner ID is required', 400);
    }
    
    // Check if the studio exists
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      throw new ApiError('Studio not found', 404);
    }
    
    // Check if the partner owns this studio
    if (studio.businessId !== businessId) {
      throw new ApiError('You do not have permission to update this studio', 403);
    }
    
    // Validate location if provided
    if (updateData.location) {
      if (typeof updateData.location.lat !== 'number' || typeof updateData.location.lng !== 'number') {
        throw new ApiError('Location must include valid latitude and longitude', 400);
      }
    }
    
    // Update the studio
    await updateDocument<Studio>('studios', studioId, updateData);
    
    // Return the updated studio
    return {
      ...studio,
      ...updateData
    };
  } catch (error) {
    console.error('Studio update error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to update studio', 500);
  }
} 