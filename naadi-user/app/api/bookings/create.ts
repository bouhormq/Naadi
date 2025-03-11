import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { CreateBookingRequest, Booking } from '@naadi/types';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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
    
    // Get request body
    const body = await request.json() as CreateBookingRequest;
    
    // Validate request data
    if (!body.classId) {
      return new ExpoResponse(
        JSON.stringify({ error: 'Class ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the booking in Firestore
    const db = getFirestore();
    const bookingRef = db.collection('bookings').doc();
    
    const booking: Booking = {
      id: bookingRef.id,
      userId: uid,
      classId: body.classId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await bookingRef.set(booking);
    
    // Return success response
    return new ExpoResponse(
      JSON.stringify(booking),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors
    console.error('Create booking error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to create booking' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 