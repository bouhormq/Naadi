import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken, getUserById } from '@naadi/api';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@naadi/api';
import { Studio } from '@naadi/types';

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
    
    // Query the studios collection for studios owned by this business
    const studiosQuery = query(
      collection(db, 'studios'),
      where('businessId', '==', userId)
    );
    
    const studiosSnapshot = await getDocs(studiosQuery);
    
    // Convert the query result to an array of studios
    const studios: Studio[] = [];
    studiosSnapshot.forEach((doc) => {
      studios.push({
        id: doc.id,
        ...doc.data()
      } as Studio);
    });
    
    // Return the studios
    return new ExpoResponse(
      JSON.stringify(studios),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get business studios error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get business studios' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 