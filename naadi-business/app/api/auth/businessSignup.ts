import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { BusinessSignupRequest } from '@naadi/types/src/api';
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
    // Get request body
    const body = await request.json() as BusinessSignupRequest;
    
    // Validate request data
    if (!body.email || !body.password || !body.businessName || !body.contactInfo) {
      return new ExpoResponse(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email: body.email,
      password: body.password,
      displayName: body.businessName
    });
    
    // Create user document in Firestore
    const db = getFirestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: body.email,
      role: 'business',
      businessName: body.businessName,
      contactInfo: body.contactInfo,
      createdAt: new Date().toISOString()
    });
    
    // Create custom token for initial authentication
    const token = await getAuth().createCustomToken(userRecord.uid);
    
    // Return success response
    return new ExpoResponse(
      JSON.stringify({
        user: {
          uid: userRecord.uid,
          email: body.email,
          role: 'business',
          businessName: body.businessName
        },
        token
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors
    console.error('Business signup error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to sign up business' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 