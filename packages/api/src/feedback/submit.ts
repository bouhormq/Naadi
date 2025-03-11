import { SubmitFeedbackRequest, Feedback } from '@naadi/types';
import { createDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Submits user feedback
 * @param userId ID of the user submitting feedback
 * @param data SubmitFeedbackRequest data from client
 * @returns Created feedback object
 */
export async function submitFeedback(userId: string, data: SubmitFeedbackRequest) {
  try {
    const { content, rating } = data;
    
    // Validate input
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    
    if (!content) {
      throw new ApiError('Feedback content is required', 400);
    }
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new ApiError('Rating must be a number between 1 and 5', 400);
    }
    
    // Create the feedback
    const feedbackData: Omit<Feedback, 'id'> = {
      userId,
      content,
      rating,
      createdAt: new Date().toISOString()
    };
    
    const feedbackId = await createDocument<Feedback>('feedback', feedbackData);
    
    return {
      id: feedbackId,
      ...feedbackData
    };
  } catch (error) {
    console.error('Feedback submission error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to submit feedback', 500);
  }
} 