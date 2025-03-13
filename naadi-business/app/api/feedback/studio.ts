import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById, getDocument } from '@naadi/api';
import { Studio, Feedback } from '@naadi/types';

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
    const studioId = url.searchParams.get('studioId');
    
    if (!studioId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the studio belongs to this business
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (studio.businessId !== userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'You do not have permission to access this studio' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For now, return mock feedback data
    // In a real implementation, we would query Firestore for feedback
    const mockFeedback: Feedback[] = [
      {
        id: '1',
        userId: 'user1',
        classId: 'class1',
        studioId: studioId,
        rating: 5,
        comment: 'Great studio!',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        classId: 'class2',
        studioId: studioId,
        rating: 4,
        comment: 'Very good facilities',
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
    console.error('Get studio feedback error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get studio feedback' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 