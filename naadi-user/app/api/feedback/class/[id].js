/**
 * GET /api/feedback/class/[id]
 * 
 * Endpoint to get all feedback for a specific class
 */
import { getDocuments, getDocument } from '@naadi/api';

export async function GET(request, response) {
  try {
    // Extract the class ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const classId = pathParts[pathParts.length - 1];
    
    if (!classId) {
      // Support both Response.json and response parameter patterns
      if (response) {
        return response.status(400).json({ error: 'Class ID is required' });
      } else {
        return Response.json(
          { error: 'Class ID is required' },
          { status: 400 }
        );
      }
    }
    
    // Verify the class exists
    try {
      await getDocument('classes', classId);
    } catch (error) {
      // Support both Response.json and response parameter patterns
      if (response) {
        return response.status(404).json({ error: 'Class not found' });
      } else {
        return Response.json(
          { error: 'Class not found' },
          { status: 404 }
        );
      }
    }
    
    // Get all feedback for this class
    const allFeedback = await getDocuments('feedback', { classId });
    
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
    console.error('Error getting class feedback:', error);
    
    // Support both Response.json and response parameter patterns
    if (response) {
      return response.status(500).json({ error: 'Failed to get class feedback' });
    } else {
      return Response.json(
        { error: 'Failed to get class feedback' },
        { status: 500 }
      );
    }
  }
} 