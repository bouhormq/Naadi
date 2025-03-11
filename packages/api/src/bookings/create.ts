import { CreateBookingRequest, Booking, Class } from '@naadi/types';
import { createDocument, getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Creates a new booking
 * @param data CreateBookingRequest data from client
 * @returns Booking object
 */
export async function createBooking(data: CreateBookingRequest) {
  try {
    const { userId, classId } = data;
    
    // Validate input
    if (!userId || !classId) {
      throw new ApiError('User ID and Class ID are required', 400);
    }
    
    // Check if the class exists and has availability
    const classData = await getDocument<Class>('classes', classId);
    
    if (!classData) {
      throw new ApiError('Class not found', 404);
    }
    
    // Check if class has reached capacity
    // We'd need to count existing bookings for this class
    // For now, simplified version:
    const bookingCount = 0; // This would be a real query in production
    
    if (bookingCount >= classData.capacity) {
      throw new ApiError('Class is at full capacity', 400);
    }
    
    // Create the booking
    const bookingData: Omit<Booking, 'id'> = {
      userId,
      classId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const bookingId = await createDocument<Booking>('bookings', bookingData);
    
    return {
      id: bookingId,
      ...bookingData
    };
  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to create booking', 500);
  }
} 