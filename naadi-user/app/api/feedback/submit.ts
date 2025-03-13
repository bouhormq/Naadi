import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken } from '@naadi/api';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@naadi/api';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get auth token from headers
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Authentication token is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify token to get user ID
    const userId = await getUserIdFromToken(token);
    
    if (!userId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get feedback data from request body
    const feedbackData = await request.json();
    
    // Validate required fields
    if (!feedbackData.classId || !feedbackData.rating) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class ID and rating are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create feedback object
    const feedback = {
      userId,
      classId: feedbackData.classId,
      studioId: feedbackData.studioId,
      rating: feedbackData.rating,
      comment: feedbackData.comment || '',
      createdAt: new Date().toISOString()
    };
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'feedback'), feedback);
    
    // Return success with the created feedback
    return new ExpoResponse(
      JSON.stringify({
        id: docRef.id,
        ...feedback
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to submit feedback' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 