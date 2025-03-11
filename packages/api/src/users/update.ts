import { UpdateUserRequest, User } from '@naadi/types';
import { getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Updates a user's profile
 * @param userId ID of the user to update
 * @param data UpdateUserRequest data from client
 * @returns Updated user object
 */
export async function updateUser(userId: string, data: UpdateUserRequest) {
  try {
    // Validate input
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    
    // Check if user exists
    const user = await getDocument<User>('users', userId);
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Process the update data specifically for contactInfo
    let processedData: any = { ...data };
    
    // If contactInfo is being updated, ensure it has the required fields
    if (data.contactInfo) {
      // Fill in missing fields with existing values or empty strings
      processedData.contactInfo = {
        phone: data.contactInfo.phone ?? user.contactInfo?.phone ?? '',
        address: data.contactInfo.address ?? user.contactInfo?.address ?? ''
      };
    }
    
    // Update the user document - use type assertion to bypass type checking
    await updateDocument('users', userId, processedData);
    
    // Return the updated user
    return {
      ...user,
      ...processedData
    };
  } catch (error) {
    console.error('User update error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to update user', 500);
  }
} 