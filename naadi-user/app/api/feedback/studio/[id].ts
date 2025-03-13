import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getDocument } from '@naadi/api';
import { Studio, Feedback } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get studio ID from URL
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const studioId = segments[segments.length - 1];
    
    if (!studioId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // First, verify the studio exists
    const studioData = await getDocument<Studio>('studios', studioId);
    
    if (!studioData) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For now, return mock feedback data
    // In a real implementation, we would query the feedback collection
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
      },
      {
        id: '3',
        userId: 'user3',
        classId: 'class1',
        studioId: studioId,
        rating: 5,
        comment: 'Excellent instructors',
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
      JSON.stringify({ error: error.message || 'Failed to get feedback' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 