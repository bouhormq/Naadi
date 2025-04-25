import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    getIdTokenResult
} from 'firebase/auth';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

// Import the initialized services from your config file
import { auth, db, functions } from '../config/firebase'; // <-- ADJUST PATH AS NEEDED

// --- Role Definitions ---
export type UserRole = 'admin' | 'partner' | 'user' | null;

export interface AuthUserResult {
    user: User;
    role: UserRole;
}

// --- Role Check Functions ---

/**
 * Checks Firestore for partner account status.
 * Assumes account ID matches Firebase Auth UID after registration.
 */
const checkPartnerStatus = async (uid: string): Promise<{ exists: boolean; enabled: boolean }> => {
    try {
        // Query for the partner account document where the 'uid' field matches the Auth uid
        const accountsRef = collection(db, "PartnerAccounts");
        const q = query(accountsRef, where("uid", "==", uid), limit(1)); 
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Get the first document found (should be only one due to limit(1))
            const accountDoc = querySnapshot.docs[0];
            const data = accountDoc.data();
            console.log(`Partner status check for uid ${uid}: Found doc ${accountDoc.id}, status: ${data.status}`);
            return { exists: true, enabled: data.status === 'enabled' };
        } else {
             console.log(`Partner status check for uid ${uid}: No account found with matching uid field.`);
            return { exists: false, enabled: false };
        }
    } catch (error) {
        console.error(`Error checking partner status for uid ${uid}:`, error);
        return { exists: false, enabled: false }; // Default to disabled on error
    }
};

// --- Authentication Functions ---

export const loginWithEmail = async (email: string, password: string): Promise<AuthUserResult | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user || !user.email) {
             console.error("Login succeeded but user object or email is missing.");
             return null; // Should not happen
        }

        // Force refresh to get latest claims
        const tokenResult = await getIdTokenResult(user, true); 
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
            const partnerStatus = await checkPartnerStatus(user.uid);
            if (partnerStatus.exists && partnerStatus.enabled) {
                console.log(`Enabled partner ${user.email} logged in.`);
                 return { user, role: userRole };
            } else {
                 console.warn(`Partner login denied for ${user.email}. Status exists: ${partnerStatus.exists}, enabled: ${partnerStatus.enabled}`);
                 await signOut(auth); // Log out user if partner checks fail
                 throw new Error("Partner account is disabled or not found.");
            }
        } else {
             // Assume normal user if no partner claim
             console.log(`Normal user ${user.email} logged in.`);
            // Check if they accidentally exist in PartnerAccounts (shouldn't happen)
             const partnerCheck = await checkPartnerStatus(user.uid);
             if (partnerCheck.exists) {
                 console.error(`CRITICAL: User ${user.email} logged in as normal user but exists in PartnerAccounts!`);
                 await signOut(auth);
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
export const signupNormalUser = async (email: string, password: string): Promise<User | null> => {
    try {
        // IMPORTANT: Ensure this flow DOES NOT add to PartnerAccounts or set partner claim
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
        await signOut(auth);
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
        // Target the renamed Cloud Function
        const func = httpsCallable<VerifyCodePayload, VerifyCodeResponse>(functions, 'verifyPartnerRegistrationCode');
        console.log(`Calling verifyPartnerRegistrationCode with email: ${email}`);
        const result = await func({ email, code });
        console.log("verifyPartnerRegistrationCode response:", result.data);
        // Add basic validation for the response structure
        if (result.data && typeof result.data.success === 'boolean') {
            return result.data;
        } else {
            throw new Error("Invalid response structure received from verify function.");
        }
    } catch (error: any) {
        console.error(`Error verifying partner code for email ${email}:`, error);
        // Rethrow with a user-friendly message if possible
        throw new Error(error.message || "Failed to verify registration code.");
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
        const func = httpsCallable<CompleteRegistrationPayload, CompleteRegistrationResponse>(functions, 'completePartnerRegistration');
        console.log(`Calling completePartnerRegistration for email: ${email}`);
        const result = await func({ email, code, password });
        console.log("completePartnerRegistration response:", result.data);
        // Add basic validation for the response structure
        if (result.data && typeof result.data.success === 'boolean') {
            return result.data;
        } else {
            throw new Error("Invalid response structure received from completion function.");
        }
    } catch (error: any) {
        console.error(`Error completing partner registration for email ${email}:`, error);
        // Rethrow with a user-friendly message if possible
        throw new Error(error.message || "Failed to complete registration and set password.");
    }
};

// Placeholder for Auth Listener setup (ideally in context)
export const setupAuthListener = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Remove or update isPartnerEnabled if check is done directly in loginWithEmail
// export const isPartnerEnabled = async (user: User | null): Promise<boolean> => { ... }