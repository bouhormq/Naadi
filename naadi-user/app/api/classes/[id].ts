import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getDocument } from '@naadi/api';
import { Class } from '@naadi/types';

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
    
    // Fetch the class
    const classData = await getDocument<Class>('classes', classId);
    
    if (!classData) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the class
    return new ExpoResponse(
      JSON.stringify(classData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get class error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 