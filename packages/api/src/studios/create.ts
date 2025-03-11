import { CreateStudioRequest, Studio } from '@naadi/types';
import { createDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Creates a new studio
 * @param data CreateStudioRequest data from client
 * @param businessId ID of the business creating the studio
 * @returns Created studio object
 */
export async function createStudio(data: CreateStudioRequest, businessId: string) {
  try {
    const { name, location, address, description, photos = [], healthSafetyInfo = '' } = data;
    
    // Validate input
    if (!name || !location || !address || !description) {
      throw new ApiError('Name, location, address, and description are required', 400);
    }
    
    if (!businessId) {
      throw new ApiError('Business ID is required', 400);
    }
    
    // Validate location
    if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      throw new ApiError('Location must include valid latitude and longitude', 400);
    }
    
    // Create the studio
    const studioData: Omit<Studio, 'id'> = {
      businessId,
      name,
      location,
      address,
      description,
      photos,
      healthSafetyInfo,
      createdAt: new Date().toISOString()
    };
    
    const studioId = await createDocument<Studio>('studios', studioData);
    
    return {
      id: studioId,
      ...studioData
    };
  } catch (error) {
    console.error('Studio creation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to create studio', 500);
  }
} 