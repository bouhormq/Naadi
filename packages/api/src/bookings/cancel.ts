import { CancelBookingRequest, Booking } from '@naadi/types';
import { getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Cancels an existing booking
 * @param data CancelBookingRequest data from client
 * @returns Updated booking object
 */
export async function cancelBooking(data: CancelBookingRequest) {
  try {
    const { bookingId } = data;
    
    // Validate input
    if (!bookingId) {
      throw new ApiError('Booking ID is required', 400);
    }
    
    // Check if the booking exists
    const booking = await getDocument<Booking>('bookings', bookingId);
    
    if (!booking) {
      throw new ApiError('Booking not found', 404);
    }
    
    // Check if the booking can be cancelled
    if (booking.status === 'cancelled') {
      throw new ApiError('Booking is already cancelled', 400);
    }
    
    // Calculate if cancellation is allowed (e.g., cancellation policy)
    // For now, we'll just allow all cancellations
    
    // Update the booking status
    await updateDocument<Booking>('bookings', bookingId, {
      status: 'cancelled',
      // If payment was made, we'd handle refund logic here
      paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus
    });
    
    // Return the updated booking
    return {
      ...booking,
      status: 'cancelled',
      paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus
    };
  } catch (error) {
    console.error('Booking cancellation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to cancel booking', 500);
  }
} 