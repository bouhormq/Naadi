// Remove old imports
// import auth from '@react-native-firebase/auth';
// import functions from '@react-native-firebase/functions';
// import firestore from '@react-native-firebase/firestore';

// Use the initialized services from your config file
import { auth as firebaseAuth, db, functions as firebaseFunctions } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { PhoneInfo, User } from '../../types';

// --- Role Definitions ---
export type UserRole = 'admin' | 'partner' | 'user' | null;

export interface AuthUserResult {
    user: User; // Changed from 'any' to 'User' to hold Firestore user data
    role: UserRole;
}

export interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: PhoneInfo;
    agreeToMarketing: boolean;
}

// --- Role Check Functions ---

// Helper function to check partner status
async function checkPartnerStatus(uid: string, email: string): Promise<{ exists: boolean; enabled: boolean }> {
    try {
        console.log(`Checking partner status for email: ${email}`);
        // Query PartnerAccounts collection where email matches
        const partnerQuery = query(
            collection(db, 'PartnerAccounts'),
            where('email', '==', email.toLowerCase()),
            limit(1)
        );
        
        const querySnapshot = await getDocs(partnerQuery);
        console.log(`Found ${querySnapshot.size} partner documents`);
        
        if (querySnapshot.empty) {
            console.log(`No partner document found for email: ${email}`);
            return { exists: false, enabled: false };
        }
        
        const partnerDoc = querySnapshot.docs[0];
        const data = partnerDoc.data();
        console.log(`Partner document data:`, data);
        console.log(`Partner status: ${data?.status}`);
        
        return { 
            exists: true, 
            enabled: data?.status === 'enabled' 
        };
    } catch (error) {
        console.error("Error checking partner status:", error);
        return { exists: false, enabled: false };
    }
}

/**
 * Checks if a user exists in the Firestore 'Users' collection by email.
 * @param email The email to check.
 * @returns True if a user with that email exists, false otherwise.
 */
export const checkIfUserExists = async (email: string): Promise<boolean> => {
    try {
        const userQuery = query(
            collection(db, 'Users'),
            where('email', '==', email.toLowerCase()),
            where('authMethod', '==', 'email'),
            limit(1)
        );
        const querySnapshot = await getDocs(userQuery);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking user existence in Firestore:", error);
        return false;
    }
};

// --- Authentication Functions ---

export const loginWithEmail = async (email: string, password: string): Promise<AuthUserResult> => {
    try {
        console.log(`Attempting login for email: ${email}`);
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const authUser = userCredential.user;

        if (!authUser || !authUser.email) {
             console.error("Login succeeded but user object or email is missing.");
             throw new Error("Login failed, user data missing.");
        }

        console.log(`User logged in successfully. UID: ${authUser.uid}`);

        // Fetch user data from Firestore
        const userDocRef = doc(db, "Users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error(`CRITICAL: User ${authUser.email} is authenticated but has no document in 'Users' collection!`);
            await firebaseSignOut(firebaseAuth);
            throw new Error("User data not found. Please contact support.");
        }

        const userData = userDoc.data() as User;

        // Force refresh to get latest claims
        const tokenResult = await authUser.getIdTokenResult(true); 
        const claims = tokenResult.claims;
        let userRole: UserRole = claims.role === 'partner' ? 'partner' : 'user'; // Default to user if no/other claim

        console.log("User Claims:", claims); // For debugging

        // Specific checks based on role
        if (authUser.email === "bouhormq@gmail.com") { // Explicit admin check
            userRole = 'admin';
            console.log(`Admin user ${authUser.email} logged in.`);
            // Admin users always have onboarding completed
            return { user: { ...userData, role: 'admin', onboardingCompleted: true }, role: userRole };
        }
        
        if (userRole === 'partner') {
            // If identified as partner via claim, double-check Firestore status
            console.log(`Checking partner status for ${authUser.email} (UID: ${authUser.uid})`);
            const partnerStatus = await checkPartnerStatus(authUser.uid, authUser.email);
            console.log(`Partner status check result:`, partnerStatus);
            
            if (partnerStatus.exists && partnerStatus.enabled) {
                console.log(`Enabled partner ${authUser.email} logged in.`);
                 return { user: userData, role: userRole };
            } else {
                 console.warn(`Partner login denied for ${authUser.email}. Status exists: ${partnerStatus.exists}, enabled: ${partnerStatus.enabled}`);
                await firebaseSignOut(firebaseAuth); // Log out user if partner checks fail
                 throw new Error("Partner account is disabled or not found.");
            }
        } else {
             // Assume normal user if no partner claim
             console.log(`Normal user ${authUser.email} logged in.`);
            // Check if they accidentally exist in PartnerAccounts (shouldn't happen)
            const partnerCheck = await checkPartnerStatus(authUser.uid, authUser.email);
             if (partnerCheck.exists) {
                 console.error(`CRITICAL: User ${authUser.email} logged in as normal user but exists in PartnerAccounts!`);
                await firebaseSignOut(firebaseAuth);
                 throw new Error("Account configuration error. Please contact support.");
             }
             return { user: userData, role: 'user' };
        }

    } catch (error: any) {
        console.error("Login error:", error);
        // Let the UI handle specific error codes from Firebase Auth
        throw error; 
    }
};

export const signupNormalUser = async (data: SignupData): Promise<any> => {
    const { email, password, firstName, lastName, phone, agreeToMarketing } = data;
    try {
        // IMPORTANT: Ensure this flow DOES NOT add to PartnerAccounts or set partner claim
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        console.log("Normal user created:", user.uid);

        const newUser: Omit<User, 'createdAt' | 'lastLoginAt'> = {
            uid: user.uid,
            email: email.toLowerCase(),
            role: 'user',
            firstName,
            lastName,
            phone,
            agreeToMarketing,
            authMethod: 'email',
            onboardingCompleted: false, // New users haven't completed onboarding
        };

        // Create a user profile document in a 'users' collection
        // Assumes db is an initialized Firestore instance and doc, setDoc, serverTimestamp are imported
        await setDoc(doc(db, "Users", user.uid), {
            ...newUser,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        });
        console.log("User profile created in Firestore for UID:", user.uid);

        return user;
    } catch (error: any) {
        console.error("Normal user signup error:", error);
        throw error;    
    }
}

export const logout = async () => {
    try {
        await firebaseSignOut(firebaseAuth);
        console.log("User signed out");
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

// --- Partner Registration with Code (Verification and Completion) ---

interface VerifyCodePayload {
    email: string;
    code: string;
}

interface VerifyCodeResponse {
    success: boolean;
    message: string;
}

/**
 * Attempts to verify a partner registration code.
 * Calls the `verifyPartnerRegistrationCode` Cloud Function.
 */
export const verifyPartnerRegistrationCode = async ({ email, code }: VerifyCodePayload): Promise<VerifyCodeResponse> => {
    try {
        const func = httpsCallable(firebaseFunctions, 'verifyPartnerRegistrationCode');
        const result = await func({ email, code });
        return result.data as VerifyCodeResponse;
    } catch (error: any) {
        console.error("Error verifying partner registration code:", error);
        throw error;
    }
};

// Payload for the completion step
interface CompleteRegistrationPayload {
    email: string;
    code: string;
    password: string; // Password is required here
}

// Response for the completion step
interface CompleteRegistrationResponse {
    success: boolean;
    message: string;
}

/**
 * Completes partner registration by setting the password.
 * Calls the `completePartnerRegistration` Cloud Function.
 */
export const completePartnerRegistration = async ({ email, code, password }: CompleteRegistrationPayload): Promise<CompleteRegistrationResponse> => {
    try {
        const func = httpsCallable(firebaseFunctions, 'completePartnerRegistration');
        const result = await func({ email, code, password });
        return result.data as CompleteRegistrationResponse;
    } catch (error: any) {
        console.error("Error completing partner registration:", error);
        throw error;
    }
};

export const setupAuthListener = (callback: (user: any) => void) => {
    return firebaseAuth.onAuthStateChanged(callback);
};

/**
 * Marks onboarding as completed for the current user
 */
export const completeOnboarding = async (userId: string): Promise<void> => {
    try {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, {
            onboardingCompleted: true,
        });
        console.log(`Onboarding completed for user ${userId}`);
    } catch (error: any) {
        console.error("Error completing onboarding:", error);
        throw error;
    }
};

// Remove or update isPartnerEnabled if check is done directly in loginWithEmail
// export const isPartnerEnabled = async (user: User | null): Promise<boolean> => { ... }