/**
 * GET /api/feedback/studio/[id]
 * 
 * Endpoint to get all feedback for a specific studio
 */
import { getDocuments, getDocument } from '@naadi/api';

export async function GET(request, response) {
  try {
    // Extract the studio ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const studioId = pathParts[pathParts.length - 1];
    
    if (!studioId) {
      // Support both Response.json and response parameter patterns
      if (response) {
        return response.status(400).json({ error: 'Studio ID is required' });
      } else {
        return Response.json(
          { error: 'Studio ID is required' },
          { status: 400 }
        );
      }
    }
    
    // Verify the studio exists
    try {
      await getDocument('studios', studioId);
    } catch (error) {
      // Support both Response.json and response parameter patterns
      if (response) {
        return response.status(404).json({ error: 'Studio not found' });
      } else {
        return Response.json(
          { error: 'Studio not found' },
          { status: 404 }
        );
      }
    }
    
    // Get all feedback for this studio
    const allFeedback = await getDocuments('feedback', { studioId, classId: null });
    
    if (!allFeedback || allFeedback.length === 0) {
      const result = {
        feedback: [],
        averageRating: 0,
        count: 0
      };
      
      // Support both Response.json and response parameter patterns
      if (response) {
        return response.status(200).json(result);
      } else {
        return Response.json(result, { status: 200 });
      }
    }
    
    // Calculate the average rating
    const totalRating = allFeedback.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / allFeedback.length;
    
    const result = {
      feedback: allFeedback,
      averageRating: parseFloat(averageRating.toFixed(1)),
      count: allFeedback.length
    };
    
    // Support both Response.json and response parameter patterns
    if (response) {
      return response.status(200).json(result);
    } else {
      return Response.json(result, { status: 200 });
    }
  } catch (error) {
    console.error('Error getting studio feedback:', error);
    
    // Support both Response.json and response parameter patterns
    if (response) {
      return response.status(500).json({ error: 'Failed to get studio feedback' });
    } else {
      return Response.json(
        { error: 'Failed to get studio feedback' },
        { status: 500 }
      );
    }
  }
} 