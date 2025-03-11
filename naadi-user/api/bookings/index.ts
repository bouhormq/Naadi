import { Booking } from '@naadi/types/src/firestore';
import { CreateBookingRequest, CancelBookingRequest } from '@naadi/types/src/api';
import { getAuthToken } from '../auth/session';

/**
 * Gets all bookings for the current user
 */
export async function getUserBookings(): Promise<Booking[]> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/bookings/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get bookings');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return [];
  }
}

/**
 * Creates a new booking
 */
export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create booking');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Create booking error:', error);
    throw new Error(error.message || 'Failed to create booking');
  }
}

/**
 * Cancels an existing booking
 */
export async function cancelBooking(data: CancelBookingRequest): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel booking');
    }
    
    return;
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    throw new Error(error.message || 'Failed to cancel booking');
  }
} 