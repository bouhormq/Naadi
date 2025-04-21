import { Studio, CreateStudioRequest, UpdateStudioRequest } from '@naadi/types';
import { getFirestore } from 'firebase/firestore';
import { getAuthToken } from '../auth/session';

/**
 * Creates a new studio for the partner
 */
export async function createStudio(data: CreateStudioRequest): Promise<Studio> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/studios/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create studio');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Create studio error:', error);
    throw new Error(error.message || 'Failed to create studio');
  }
}

/**
 * Gets all studios for the partner
 */
export async function getBusinessStudios(): Promise<Studio[]> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return [];
    }
    
    const response = await fetch('/api/studios/partner', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get studios');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Get studios error:', error);
    return [];
  }
}

/**
 * Gets a studio by ID
 */
export async function getStudioById(studioId: string): Promise<Studio | null> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }
    
    const response = await fetch(`/api/studios/${studioId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get studio');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Get studio error:', error);
    return null;
  }
}

/**
 * Updates a studio
 */
export async function updateStudio(data: UpdateStudioRequest): Promise<Studio> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Make sure we have a studio ID
    if (!data.studioId) {
      throw new Error('Studio ID is required');
    }
    
    const response = await fetch(`/api/studios/${data.studioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update studio');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Update studio error:', error);
    throw new Error(error.message || 'Failed to update studio');
  }
}

/**
 * Deletes a studio
 */
export async function deleteStudio(studioId: string): Promise<boolean> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`/api/studios/${studioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete studio');
    }
    
    return true;
  } catch (error: any) {
    console.error('Delete studio error:', error);
    throw new Error(error.message || 'Failed to delete studio');
  }
} 