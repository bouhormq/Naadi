import { User } from '@naadi/types';
import { UpdateUserRequest } from '@naadi/types';

/**
 * Gets the current user's profile
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  // TODO: Implement actual API call
  return null;
}

/**
 * Updates the current user's profile
 */
export async function updateUserProfile(data: UpdateUserRequest): Promise<User> {
  // TODO: Implement actual API call
  throw new Error('Not implemented');
} 