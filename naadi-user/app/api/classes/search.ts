import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { query, collection, getDocs, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@naadi/api';
import { Class } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const studioId = url.searchParams.get('studioId');
    const classType = url.searchParams.get('type') || undefined;
    const instructorId = url.searchParams.get('instructorId') || undefined;
    const dateStr = url.searchParams.get('date') || undefined;
    const limitParam = url.searchParams.get('limit') || '20';
    
    // Parse parameters
    const limit = parseInt(limitParam, 10);
    
    // Build query
    let classesQuery = query(collection(db, 'classes'));
    
    // Apply filters
    if (studioId) {
      classesQuery = query(classesQuery, where('studioId', '==', studioId));
    }
    
    if (classType) {
      classesQuery = query(classesQuery, where('type', '==', classType));
    }
    
    if (instructorId) {
      classesQuery = query(classesQuery, where('instructorId', '==', instructorId));
    }
    
    if (dateStr) {
      // Convert date string to timestamp range for the day
      const date = new Date(dateStr);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      classesQuery = query(
        classesQuery, 
        where('startTime', '>=', startOfDay),
        where('startTime', '<=', endOfDay)
      );
    } else {
      // If no date specified, only show future classes
      const now = new Date();
      classesQuery = query(classesQuery, where('startTime', '>=', now));
      
      // Order by start time
      classesQuery = query(classesQuery, orderBy('startTime', 'asc'));
    }
    
    // Apply limit
    classesQuery = query(classesQuery, firestoreLimit(limit));
    
    // Execute query
    const classesSnapshot = await getDocs(classesQuery);
    
    // Process results
    const classes: Class[] = [];
    classesSnapshot.forEach((doc) => {
      classes.push({
        id: doc.id,
        ...doc.data()
      } as Class);
    });
    
    // Return the classes
    return new ExpoResponse(
      JSON.stringify(classes),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Search classes error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to search classes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 