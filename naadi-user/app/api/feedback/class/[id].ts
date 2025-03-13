import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getDocument } from '@naadi/api';
import { Class, Feedback } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get class ID from URL
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const classId = segments[segments.length - 1];
    
    if (!classId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // First, verify the class exists
    const classData = await getDocument<Class>('classes', classId);
    
    if (!classData) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For now, return mock feedback data
    // In a real implementation, we would query the feedback collection
    const mockFeedback: Feedback[] = [
      {
        id: '1',
        userId: 'user1',
        classId: classId,
        studioId: classData.studioId || '',
        rating: 5,
        comment: 'Great class!',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        classId: classId,
        studioId: classData.studioId || '',
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
      JSON.stringify({ error: error.message || 'Failed to get feedback' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 