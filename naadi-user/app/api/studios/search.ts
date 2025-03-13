import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { query, collection, getDocs, where, orderBy, limit as firestoreLimit, GeoPoint } from 'firebase/firestore';
import { db } from '@naadi/api';
import { Studio } from '@naadi/types';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || undefined;
    const cityParam = url.searchParams.get('city') || undefined;
    const studioTypeParam = url.searchParams.get('type') || undefined;
    const limitParam = url.searchParams.get('limit') || '20';
    const latParam = url.searchParams.get('lat');
    const lngParam = url.searchParams.get('lng');
    const radiusParam = url.searchParams.get('radius') || '10'; // Default 10km radius
    
    // Parse parameters
    const limit = parseInt(limitParam, 10);
    const radius = parseInt(radiusParam, 10);
    
    // Build query
    let studiosQuery = query(collection(db, 'studios'));
    
    // Apply filters
    if (name) {
      studiosQuery = query(
        studiosQuery, 
        where('name', '>=', name),
        where('name', '<=', name + '\uf8ff')
      );
    }
    
    if (cityParam) {
      studiosQuery = query(studiosQuery, where('city', '==', cityParam));
    }
    
    if (studioTypeParam) {
      studiosQuery = query(studiosQuery, where('studioType', '==', studioTypeParam));
    }
    
    // Apply limit
    studiosQuery = query(studiosQuery, firestoreLimit(limit));
    
    // Execute query
    const studiosSnapshot = await getDocs(studiosQuery);
    
    // Process results
    let studios: Studio[] = [];
    studiosSnapshot.forEach((doc) => {
      studios.push({
        id: doc.id,
        ...doc.data()
      } as Studio);
    });
    
    // If location is provided, filter by distance
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      
      // Filter studios by distance
      // This is a simplified version, in a real app you would use a geo library or Firebase Geo queries
      studios = studios.filter(studio => {
        if (!studio.location || !studio.location.lat || !studio.location.lng) return false;
        
        // Simple distance calculation
        const distance = calculateDistance(
          lat, lng,
          studio.location.lat, studio.location.lng
        );
        
        return distance <= radius;
      });
      
      // Sort by distance
      studios.sort((a, b) => {
        const distanceA = calculateDistance(
          lat, lng,
          a.location.lat, a.location.lng
        );
        const distanceB = calculateDistance(
          lat, lng,
          b.location.lat, b.location.lng
        );
        return distanceA - distanceB;
      });
    }
    
    // Return the studios
    return new ExpoResponse(
      JSON.stringify(studios),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Search studios error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to search studios' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to calculate distance between two points (using Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
} 