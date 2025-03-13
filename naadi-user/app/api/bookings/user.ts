import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { getUserIdFromToken } from '@naadi/api';
import { query, collection, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@naadi/api';
import { Booking } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
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
    
    // Query bookings for this user
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    // Process results
    const bookings: Booking[] = [];
    bookingsSnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      } as Booking);
    });
    
    // Return the bookings
    return new ExpoResponse(
      JSON.stringify(bookings),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get user bookings error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to get bookings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 