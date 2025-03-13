import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, createBooking } from '@naadi/api';
import { CreateBookingRequest } from '@naadi/types';

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
    
    // Get booking data from request body
    const requestData = await request.json();
    
    // Validate required fields
    if (!requestData.classId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create booking request with user ID from token
    const bookingRequest: CreateBookingRequest = {
      userId: userId,
      classId: requestData.classId
    };
    
    // Create the booking
    const booking = await createBooking(bookingRequest);
    
    // Return the created booking
    return new ExpoResponse(
      JSON.stringify(booking),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create booking error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to create booking' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 