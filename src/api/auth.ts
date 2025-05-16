// Remove old imports
// import auth from '@react-native-firebase/auth';
// import functions from '@react-native-firebase/functions';
// import firestore from '@react-native-firebase/firestore';

// Use the initialized services from your config file
import { auth as firebaseAuth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, functions as firebaseFunctions } from '../config/firebase';

// --- Role Definitions ---
export type UserRole = 'admin' | 'partner' | 'user' | null;

export interface AuthUserResult {
    user: any; // Firebase Auth User type
    role: UserRole;
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

// --- Authentication Functions ---

export const loginWithEmail = async (email: string, password: string): Promise<AuthUserResult | null> => {
    try {
        console.log(`Attempting login for email: ${email}`);
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        if (!user || !user.email) {
             console.error("Login succeeded but user object or email is missing.");
             return null; // Should not happen
        }

        console.log(`User logged in successfully. UID: ${user.uid}`);

        // Force refresh to get latest claims
        const tokenResult = await user.getIdTokenResult(true); 
        const claims = tokenResult.claims;
        let userRole: UserRole = claims.role === 'partner' ? 'partner' : 'user'; // Default to user if no/other claim

        console.log("User Claims:", claims); // For debugging

        // Specific checks based on role
        if (user.email === "bouhormq@gmail.com") { // Explicit admin check
            userRole = 'admin';
            console.log(`Admin user ${user.email} logged in.`);
            return { user, role: userRole };
        }
        
        if (userRole === 'partner') {
            // If identified as partner via claim, double-check Firestore status
            console.log(`Checking partner status for ${user.email} (UID: ${user.uid})`);
            const partnerStatus = await checkPartnerStatus(user.uid, user.email);
            console.log(`Partner status check result:`, partnerStatus);
            
            if (partnerStatus.exists && partnerStatus.enabled) {
                console.log(`Enabled partner ${user.email} logged in.`);
                 return { user, role: userRole };
            } else {
                 console.warn(`Partner login denied for ${user.email}. Status exists: ${partnerStatus.exists}, enabled: ${partnerStatus.enabled}`);
                await firebaseSignOut(firebaseAuth); // Log out user if partner checks fail
                 throw new Error("Partner account is disabled or not found.");
            }
        } else {
             // Assume normal user if no partner claim
             console.log(`Normal user ${user.email} logged in.`);
            // Check if they accidentally exist in PartnerAccounts (shouldn't happen)
            const partnerCheck = await checkPartnerStatus(user.uid, user.email);
             if (partnerCheck.exists) {
                 console.error(`CRITICAL: User ${user.email} logged in as normal user but exists in PartnerAccounts!`);
                await firebaseSignOut(firebaseAuth);
                 throw new Error("Account configuration error. Please contact support.");
             }
             return { user, role: 'user' };
        }

    } catch (error: any) {
        console.error("Login error:", error);
        // Let the UI handle specific error codes from Firebase Auth
        throw error; 
    }
};

// Placeholder for Normal User Signup
export const signupNormalUser = async (email: string, password: string): Promise<any> => {
    try {
        // IMPORTANT: Ensure this flow DOES NOT add to PartnerAccounts or set partner claim
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        console.log("Normal user created:", userCredential.user.uid);
        // Optional: Create a basic user profile document in a 'users' collection if needed
        return userCredential.user;
    } catch (error: any) {
        console.error("Normal user signup error:", error);
        throw error; // Rethrow for UI
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

// Remove or update isPartnerEnabled if check is done directly in loginWithEmail
// export const isPartnerEnabled = async (user: User | null): Promise<boolean> => { ... }