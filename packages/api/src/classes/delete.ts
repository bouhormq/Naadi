import { Class, Studio } from '@naadi/types';
import { getDocument, deleteDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Deletes a class
 * @param classId ID of the class to delete
 * @param businessId ID of the partner deleting the class
 * @returns Success message
 */
export async function deleteClass(classId: string, businessId: string) {
  try {
    // Validate input
    if (!classId) {
      throw new ApiError('Class ID is required', 400);
    }
    
    if (!businessId) {
      throw new ApiError('Partner ID is required', 400);
    }
    
    // Check if the class exists
    const classData = await getDocument<Class>('classes', classId);
    
    if (!classData) {
      throw new ApiError('Class not found', 404);
    }
    
    // Verify that the class belongs to one of this partner's studios
    const studio = await getDocument<Studio>('studios', classData.studioId);
    
    if (!studio) {
      throw new ApiError('Studio not found', 404);
    }
    
    if (studio.businessId !== businessId) {
      throw new ApiError('You do not have permission to delete this class', 403);
    }
    
    // In a real application, we would:
    // 1. Check if there are any existing bookings for this class
    // 2. Handle cancellations or prevent deletion
    
    // Delete the class
    await deleteDocument('classes', classId);
    
    return {
      success: true,
      message: 'Class deleted successfully'
    };
  } catch (error) {
    console.error('Class deletion error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to delete class', 500);
  }
} 