import { User } from '@naadi/types';
import { getDocument, deleteDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';
import { getAuth } from 'firebase-admin/auth';

/**
 * Deletes a user account
 * @param userId ID of the user to delete
 * @returns Success message
 */
export async function deleteUserAccount(userId: string) {
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
    
    // In a real application, we would:
    // 1. Check if there are any bookings associated with this user
    // 2. Handle bookings (cancel, archive, etc.)
    // 3. Delete any user-specific data
    
    // Delete the user document
    await deleteDocument('users', userId);
    
    // Delete the user from Firebase Auth using Admin SDK
    try {
      const auth = getAuth();
      await auth.deleteUser(userId);
    } catch (authError) {
      console.error('Error deleting Firebase Auth user:', authError);
      // Continue even if Firebase Auth deletion fails, to at least clean up Firestore
    }
    
    return {
      success: true,
      message: 'User account deleted successfully'
    };
  } catch (error) {
    console.error('User deletion error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to delete user account', 500);
  }
} 