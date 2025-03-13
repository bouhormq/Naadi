import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument } from '@naadi/api';
import { Studio, Class, Feedback } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
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
    
    // Get query parameters
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    
    if (!classId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the class
    const classData = await getDocument<Class>('classes', classId);
    
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
        JSON.stringify({ error: 'You do not have permission to access this class' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For now, return mock feedback data
    // In a real implementation, we would query Firestore for feedback
    const mockFeedback: Feedback[] = [
      {
        id: '1',
        userId: 'user1',
        classId: classId,
        studioId: classData.studioId,
        rating: 5,
        comment: 'Great class!',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        classId: classId,
        studioId: classData.studioId,
        rating: 4,
        comment: 'Very good instructor',
        createdAt: new Date().toISOString()
      }
    ];
    
    // Calculate average rating
    const totalRating = mockFeedback.reduce((sum: number, item: Feedback) => sum + item.rating, 0);
    const averageRating = totalRating / mockFeedback.length;
    
    // Return the feedback with average rating
    return new ExpoResponse(
      JSON.stringify({
        feedback: mockFeedback,
        averageRating,
        count: mockFeedback.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get class feedback error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get class feedback' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 