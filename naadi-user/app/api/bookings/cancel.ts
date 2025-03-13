import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, cancelBooking, getDocument } from '@naadi/api';
import { Booking, CancelBookingRequest } from '@naadi/types';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
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
    
    // Get request data
    const requestData = await request.json();
    const { bookingId } = requestData;
    
    if (!bookingId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the booking belongs to the current user
    const booking = await getDocument<Booking>('bookings', bookingId);
    
    if (!booking) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (booking.userId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Unauthorized to cancel this booking' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare cancel request
    const cancelRequest: CancelBookingRequest = {
      bookingId
    };
    
    // Cancel the booking
    const updatedBooking = await cancelBooking(cancelRequest);
    
    // Return the updated booking
    return new ExpoResponse(
      JSON.stringify(updatedBooking),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to cancel booking' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 