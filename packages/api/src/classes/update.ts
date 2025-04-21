import { UpdateClassRequest, Class, Studio } from '@naadi/types';
import { getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Updates an existing class
 * @param data UpdateClassRequest data from client
 * @param businessId ID of the partner updating the class
 * @returns Updated class object
 */
export async function updateClass(data: UpdateClassRequest, businessId: string) {
  try {
    const { classId, ...updateData } = data;
    
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
      throw new ApiError('You do not have permission to update this class', 403);
    }
    
    // Validate time format and logic if new times are provided
    if (updateData.startTime && updateData.endTime) {
      const start = new Date(updateData.startTime);
      const end = new Date(updateData.endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError('Invalid time format', 400);
      }
      
      if (start >= end) {
        throw new ApiError('End time must be after start time', 400);
      }
    } else if (updateData.startTime && !updateData.endTime) {
      const start = new Date(updateData.startTime);
      const end = new Date(classData.endTime);
      
      if (isNaN(start.getTime())) {
        throw new ApiError('Invalid time format', 400);
      }
      
      if (start >= end) {
        throw new ApiError('End time must be after start time', 400);
      }
    } else if (!updateData.startTime && updateData.endTime) {
      const start = new Date(classData.startTime);
      const end = new Date(updateData.endTime);
      
      if (isNaN(end.getTime())) {
        throw new ApiError('Invalid time format', 400);
      }
      
      if (start >= end) {
        throw new ApiError('End time must be after start time', 400);
      }
    }
    
    // Validate capacity and price if provided
    if (updateData.capacity !== undefined && updateData.capacity <= 0) {
      throw new ApiError('Capacity must be greater than 0', 400);
    }
    
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new ApiError('Price cannot be negative', 400);
    }
    
    // Update the class
    await updateDocument<Class>('classes', classId, updateData);
    
    // Return the updated class
    return {
      ...classData,
      ...updateData
    };
  } catch (error) {
    console.error('Class update error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to update class', 500);
  }
} 