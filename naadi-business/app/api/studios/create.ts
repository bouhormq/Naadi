import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { CreateStudioRequest } from '@naadi/types/src/api';
import { Studio } from '@naadi/types/src/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
// (This would be in a shared util file in a real app)
import { initializeApp, getApps, cert } from 'firebase-admin/app';
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Get authorization token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Verify user is a business
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'business') {
      return new ExpoResponse(
        JSON.stringify({ error: 'Only business accounts can create studios' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get request body
    const body = await request.json() as CreateStudioRequest;
    
    // Validate request data
    if (!body.name || !body.location || !body.address || !body.description) {
      return new ExpoResponse(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the studio in Firestore
    const studioRef = db.collection('studios').doc();
    
    const studio: Studio = {
      id: studioRef.id,
      businessId: uid,
      name: body.name,
      location: body.location,
      address: body.address,
      description: body.description,
      photos: body.photos || [],
      healthSafetyInfo: body.healthSafetyInfo || '',
      createdAt: new Date().toISOString()
    };
    
    await studioRef.set(studio);
    
    // Return success response
    return new ExpoResponse(
      JSON.stringify(studio),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors
    console.error('Create studio error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to create studio' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 