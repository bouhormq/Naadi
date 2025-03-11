import { Studio } from '@naadi/types';
import { getDocument, deleteDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Deletes a studio
 * @param studioId ID of the studio to delete
 * @param businessId ID of the business deleting the studio
 * @returns Success message
 */
export async function deleteStudio(studioId: string, businessId: string) {
  try {
    // Validate input
    if (!studioId) {
      throw new ApiError('Studio ID is required', 400);
    }
    
    if (!businessId) {
      throw new ApiError('Business ID is required', 400);
    }
    
    // Check if the studio exists
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      throw new ApiError('Studio not found', 404);
    }
    
    // Check if the business owns this studio
    if (studio.businessId !== businessId) {
      throw new ApiError('You do not have permission to delete this studio', 403);
    }
    
    // In a real application, we would:
    // 1. Check if there are any future classes or bookings
    // 2. Either prevent deletion or handle cascading deletes
    
    // Delete the studio
    await deleteDocument('studios', studioId);
    
    return {
      success: true,
      message: 'Studio deleted successfully'
    };
  } catch (error) {
    console.error('Studio deletion error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to delete studio', 500);
  }
} 