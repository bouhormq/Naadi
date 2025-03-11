import { ConfirmPaymentRequest, Booking } from '@naadi/types';
import { getDocument, updateDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Confirms payment for a booking
 * @param data ConfirmPaymentRequest data from client
 * @returns Updated booking object
 */
export async function confirmPayment(data: ConfirmPaymentRequest) {
  try {
    const { bookingId, paymentMethod } = data;
    
    // Validate input
    if (!bookingId || !paymentMethod) {
      throw new ApiError('Booking ID and payment method are required', 400);
    }
    
    // Check if the booking exists
    const booking = await getDocument<Booking>('bookings', bookingId);
    
    if (!booking) {
      throw new ApiError('Booking not found', 404);
    }
    
    // Check if the booking can have a payment confirmed
    if (booking.status === 'cancelled') {
      throw new ApiError('Cannot confirm payment for a cancelled booking', 400);
    }
    
    if (booking.paymentStatus === 'paid') {
      throw new ApiError('Payment is already confirmed for this booking', 400);
    }
    
    // In a real implementation, we would process the payment here
    // For example, using a payment gateway like Stripe
    
    // For now, we'll just simulate a successful payment
    
    // Update the booking status
    await updateDocument<Booking>('bookings', bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid'
    });
    
    // Return the updated booking
    return {
      ...booking,
      status: 'confirmed',
      paymentStatus: 'paid'
    };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to confirm payment', 500);
  }
} 