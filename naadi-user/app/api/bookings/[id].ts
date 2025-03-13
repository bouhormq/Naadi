import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getDocument } from '@naadi/api';
import { Booking } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get auth token from headers
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Authentication token is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify token to get user ID
    const userId = await getUserIdFromToken(token);
    
    if (!userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get booking ID from URL
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const bookingId = segments[segments.length - 1];
    
    if (!bookingId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch the booking
    const booking = await getDocument<Booking>('bookings', bookingId);
    
    if (!booking) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the booking belongs to the current user
    if (booking.userId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Unauthorized to access this booking' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the booking
    return new ExpoResponse(
      JSON.stringify(booking),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get booking error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get booking' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 