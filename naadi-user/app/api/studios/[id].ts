import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getDocument } from '@naadi/api';
import { Studio } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get the studio ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const studioId = pathParts[pathParts.length - 1];
    
    if (!studioId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the studio document using the utility function
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Studio not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the studio data
    return new ExpoResponse(
      JSON.stringify(studio),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get studio error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get studio' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 