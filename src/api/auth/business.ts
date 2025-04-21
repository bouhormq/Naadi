import { UpdateUserRequest } from '@naadi/types';
import { User, Studio } from '@naadi/types';
import { getIdToken, storeUserData, storeAuthToken } from './session';

/**
 * Handles partner signup with email/password and partner details
 */
export async function businessSignup(
  email: string,
  password: string,
  businessName: string,
  contactInfo: {
    phone: string;
    address: string;
  }
): Promise<User> {
  try {
    const response = await fetch('/api/auth/partners/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        businessName,
        contactInfo
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign up partner');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse.user;
  } catch (error: any) {
    console.error('Partner signup error:', error);
    throw new Error(error.message || 'Failed to sign up partner');
  }
}

/**
 * Gets the current partner profile
 */
export async function getBusinessProfile(): Promise<User | null> {
  try {
    const token = await getIdToken();
    if (!token) return null;
    
    const response = await fetch('/api/auth/partners/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get partner profile');
    }
    
    const userData = await response.json();
    await storeUserData(userData);
    return userData;
  } catch (error: any) {
    console.error('Get partner profile error:', error);
    return null;
  }
}

/**
 * Updates the partner profile
 */
export async function updateBusinessProfile(data: UpdateUserRequest): Promise<User> {
  try {
    const token = await getIdToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/auth/partners/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update partner profile');
    }
    
    const userData = await response.json();
    await storeUserData(userData);
    return userData;
  } catch (error: any) {
    console.error('Update partner profile error:', error);
    throw new Error(error.message || 'Failed to update partner profile');
  }
}

/**
 * Gets all studios for the partner
 */
export async function getBusinessStudios(): Promise<Studio[]> {
  try {
    const token = await getIdToken();
    if (!token) return [];
    
    const response = await fetch('/api/partners/studios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get partner studios');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Get partner studios error:', error);
    return [];
  }
} 