import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  signInWithCredential,
  linkWithCredential,
  User as FirebaseUser,
  AuthCredential
} from 'firebase/auth';
import { getApp } from 'firebase/app';
import { getDocument, createDocument, updateDocument } from '../../utils/firestore';
import { User, AuthResponse } from '@naadi/types';
import { ApiError } from '../../utils/apiError';

// Helper to get Firebase Auth instance
const getFirebaseAuth = () => getAuth(getApp());

/**
 * Creates a Firestore user document after successful authentication
 * @param firebaseUser Firebase authenticated user object
 * @param additionalData Any additional user data to store
 * @returns Created user document
 */
export async function createUserDocument(firebaseUser: FirebaseUser, additionalData: Partial<User> = {}): Promise<User> {
  try {
    // Check if user document already exists
    const existingUser = await getDocument<User>('users', firebaseUser.uid);
    
    if (existingUser) {
      // Update with new login information if needed
      await updateDocument<User>('users', firebaseUser.uid, {
        lastLoginAt: new Date().toISOString(),
        ...additionalData
      });
      
      return {
        ...existingUser,
        ...additionalData,
        lastLoginAt: new Date().toISOString()
      };
    }
    
    // Determine authentication method
    let authMethod = 'email';
    if (firebaseUser.providerData.length > 0) {
      const provider = firebaseUser.providerData[0].providerId;
      if (provider.includes('facebook')) authMethod = 'facebook';
      else if (provider.includes('google')) authMethod = 'google';
      else if (provider.includes('phone')) authMethod = 'phone';
    }
    
    // Create new user document
    const userData: Omit<User, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || additionalData.displayName || '',
      photoURL: firebaseUser.photoURL || additionalData.photoURL || '',
      phoneNumber: firebaseUser.phoneNumber || additionalData.phoneNumber || '',
      role: 'user',
      authMethod: authMethod as 'email' | 'phone' | 'google' | 'facebook' | 'apple',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ...additionalData
    };
    
    await createDocument<User>('users', userData);
    
    return userData as User;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new ApiError('Failed to create user profile', 500);
  }
}

/**
 * Handles email/password signup
 * @param email User email
 * @param password User password
 * @param additionalData Additional user data
 * @returns Authentication response with user info and token
 */
export async function emailSignup(
  email: string, 
  password: string, 
  additionalData: Partial<User> = {}
): Promise<AuthResponse> {
  try {
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = await createUserDocument(userCredential.user, additionalData);
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      token
    };
  } catch (error) {
    console.error('Email signup error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('email-already-in-use')) {
        throw new ApiError('Email already in use', 400);
      }
      if (error.message.includes('invalid-email')) {
        throw new ApiError('Invalid email format', 400);
      }
      if (error.message.includes('weak-password')) {
        throw new ApiError('Password is too weak', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to create account', 500);
  }
}

/**
 * Handles email/password login
 * @param email User email
 * @param password User password
 * @returns Authentication response with user info and token
 */
export async function emailLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const auth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update user document with login time
    await createUserDocument(userCredential.user, { lastLoginAt: new Date().toISOString() });
    
    // Get user document from Firestore
    const user = await getDocument<User>('users', userCredential.user.uid);
    
    if (!user) {
      throw new ApiError('User profile not found', 404);
    }
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      token
    };
  } catch (error) {
    console.error('Email login error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('user-not-found')) {
        throw new ApiError('No user found with this email', 400);
      }
      if (error.message.includes('wrong-password')) {
        throw new ApiError('Invalid password', 400);
      }
      if (error.message.includes('invalid-email')) {
        throw new ApiError('Invalid email format', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to log in', 500);
  }
}

/**
 * Handles Google authentication (signup or login)
 * @returns Authentication response with user info and token
 */
export async function googleAuth(): Promise<AuthResponse> {
  try {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const userCredential = await signInWithPopup(auth, provider);
    
    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    
    // Create or update user document
    const user = await createUserDocument(userCredential.user);
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      token
    };
  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('popup-closed-by-user')) {
        throw new ApiError('Authentication cancelled by user', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to authenticate with Google', 500);
  }
}

/**
 * Handles Facebook authentication (signup or login)
 * @returns Authentication response with user info and token
 */
export async function facebookAuth(): Promise<AuthResponse> {
  try {
    const auth = getFirebaseAuth();
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');
    
    const userCredential = await signInWithPopup(auth, provider);
    
    // This gives you a Facebook Access Token
    const credential = FacebookAuthProvider.credentialFromResult(userCredential);
    
    // Create or update user document
    const user = await createUserDocument(userCredential.user);
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      token
    };
  } catch (error) {
    console.error('Facebook auth error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('popup-closed-by-user')) {
        throw new ApiError('Authentication cancelled by user', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to authenticate with Facebook', 500);
  }
}

/**
 * Initiates phone number authentication
 * @param phoneNumber User's phone number (with country code, e.g. +1234567890)
 * @param recaptchaVerifier reCAPTCHA verifier instance
 * @returns Confirmation result for completing the phone auth
 */
export async function phoneAuth(phoneNumber: string, recaptchaVerifier: any) {
  try {
    const auth = getFirebaseAuth();
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    console.error('Phone auth error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('invalid-phone-number')) {
        throw new ApiError('Invalid phone number format', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to send verification code', 500);
  }
}

/**
 * Completes phone authentication with verification code
 * @param confirmationResult Confirmation result from phoneAuth
 * @param verificationCode Verification code sent to the user's phone
 * @returns Authentication response with user info and token
 */
export async function verifyPhoneCode(
  confirmationResult: any, 
  verificationCode: string
): Promise<AuthResponse> {
  try {
    // Verify the code
    const userCredential = await confirmationResult.confirm(verificationCode);
    
    // Create or update user document
    const user = await createUserDocument(userCredential.user, { 
      authMethod: 'phone',
      phoneNumber: userCredential.user.phoneNumber 
    });
    
    // Get ID token for authentication
    const token = await userCredential.user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email || '',
        role: user.role,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber
      },
      token
    };
  } catch (error) {
    console.error('Phone verification error:', error);
    
    if (error instanceof Error) {
      // Handle Firebase auth errors
      if (error.message.includes('invalid-verification-code')) {
        throw new ApiError('Invalid verification code', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to verify phone number', 500);
  }
}

/**
 * Links a phone number to an existing account
 * @param user Current Firebase user
 * @param phoneCredential Phone auth credential
 * @returns Updated user
 */
export async function linkPhoneToAccount(
  user: FirebaseUser, 
  phoneCredential: AuthCredential
): Promise<User> {
  try {
    const result = await linkWithCredential(user, phoneCredential);
    return await createUserDocument(result.user, { phoneNumber: result.user.phoneNumber || '' });
  } catch (error) {
    console.error('Link phone error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('credential-already-in-use')) {
        throw new ApiError('Phone number already linked to another account', 400);
      }
      
      throw new ApiError(error.message, 400);
    }
    
    throw new ApiError('Failed to link phone number to account', 500);
  }
} 