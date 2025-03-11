import { UpdateUserRequest } from '@naadi/types/src/api';
import { User, Studio } from '@naadi/types/src/firestore';
import { getCurrentUser, getIdToken } from './session';

/**
 * Gets the current business profile
 */
export async function getBusinessProfile(): Promise<User | null> {
  // TODO: Implement actual API call with Firestore
  try {
    const user = getCurrentUser();
    if (!user) return null;
    
    // Make API call to get business profile
    // For now, return a placeholder
    return {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      role: 'business',
      displayName: user.displayName || '',
      businessName: 'My Business',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Get business profile error:', error);
    return null;
  }
}

/**
 * Updates the business profile
 */
export async function updateBusinessProfile(data: UpdateUserRequest): Promise<User> {
  // TODO: Implement actual API call with Firestore
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Make API call to update business profile
    // For now, return a placeholder with updated data
    return {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      role: 'business',
      displayName: data.displayName || user.displayName || '',
      businessName: data.businessName || 'My Business',
      contactInfo: {
        phone: data.contactInfo?.phone || '',
        address: data.contactInfo?.address || ''
      },
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Update business profile error:', error);
    throw new Error(error.message || 'Failed to update business profile');
  }
}

/**
 * Gets all studios for the business
 */
export async function getBusinessStudios(): Promise<Studio[]> {
  // TODO: Implement actual API call with Firestore
  // For now, return placeholder data
  return [];
} 