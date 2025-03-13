import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument, updateDocument } from '@naadi/api';
import { Booking, Class, Studio } from '@naadi/types';

export async function PUT(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get the authentication token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Authentication token is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify token and get user ID
    const userId = await getUserIdFromToken(token);
    
    // Get the user to verify it's a business account
    const user = await getUserById(userId);
    
    // Verify this is a business account
    if (user.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ error: 'This account is not registered as a business' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get request data
    const requestData = await request.json();
    const { bookingId, status } = requestData;
    
    // Validate required fields
    if (!bookingId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Valid status (pending, confirmed, cancelled) is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the booking
    const booking = await getDocument<Booking>('bookings', bookingId);
    
    if (!booking) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the class to verify ownership
    const classData = await getDocument<Class>('classes', booking.classId);
    
    if (!classData) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the studio to verify ownership
    const studio = await getDocument<Studio>('studios', classData.studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the business owns this studio
    if (studio.businessId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'You do not have permission to update bookings for this studio' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update the booking status
    await updateDocument<Booking>('bookings', bookingId, {
      status,
      // Update payment status to refunded if cancelling a paid booking
      paymentStatus: status === 'cancelled' && booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus
    });
    
    // Get the updated booking
    const updatedBooking = await getDocument<Booking>('bookings', bookingId);
    
    // Return the updated booking
    return new ExpoResponse(
      JSON.stringify(updatedBooking),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Update booking status error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to update booking status' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 