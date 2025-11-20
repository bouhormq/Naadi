// Remove old imports
// import auth from '@react-native-firebase/auth';
// import functions from '@react-native-firebase/functions';
// import firestore from '@react-native-firebase/firestore';

// Use the initialized services from your config file
import { auth as firebaseAuth, db, functions as firebaseFunctions } from '@naadi/config/firebase/firebase'; // Adjust the import path as necessary
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, limit, query, serverTimestamp, setDoc, where, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { PhoneInfo, User } from '@naadi/types'; // Adjust the import path as necessary

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

        // Force refresh to get latest claims
        const tokenResult = await authUser.getIdTokenResult(true);
        const claims = tokenResult.claims;
        let userRole: UserRole = claims.role === 'partner' ? 'partner' : 'user'; // Default to user if no/other claim

        console.log("User Claims:", claims); // For debugging

        // Specific checks based on role
        if (authUser.email === "bouhormq@gmail.com") { // Explicit admin check
            userRole = 'admin';
            console.log(`Admin user ${authUser.email} logged in.`);
        }

        let userData: any = null;

        if (userRole === 'partner') {
            // Fetch from PartnerAccounts
            console.log(`Fetching PartnerAccount for ${authUser.email} (UID: ${authUser.uid})`);
            
            // Check by querying the 'uid' field
            const partnersRef = collection(db, 'PartnerAccounts');
            const q = query(partnersRef, where('uid', '==', authUser.uid));
            const querySnapshot = await getDocs(q);

            let partnerExists = !querySnapshot.empty;
            let partnerDocSnap = querySnapshot.empty ? null : querySnapshot.docs[0];

            // Fallback: Check if the document ID matches the UID (legacy check)
            if (!partnerExists) {
                const docRef = doc(db, 'PartnerAccounts', authUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    partnerExists = true;
                    partnerDocSnap = docSnap;
                }
            }

            if (partnerExists && partnerDocSnap) {
                userData = partnerDocSnap.data();
                // Ensure status is enabled
                if (userData.status !== 'enabled') {
                    console.warn(`Partner login denied for ${authUser.email}. Status: ${userData.status}`);
                    await firebaseSignOut(firebaseAuth);
                    throw new Error("Partner account is disabled.");
                }
                userData.role = 'partner'; // Ensure role is present
                console.log(`Enabled partner ${authUser.email} logged in.`);
            } else {
                console.warn(`Partner claim found but no PartnerAccount for ${authUser.uid}`);
                // Fallback: Check if they are in Users (migration or error)
                // But request says "use partneraccount instead of user", so we might fail here.
                // Let's fail to enforce the rule.
                await firebaseSignOut(firebaseAuth);
                throw new Error("Partner account not found.");
            }
        } else {
            // Fetch user data from Firestore Users collection
            const userDocRef = doc(db, "Users", authUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                userData = userDoc.data();
                // Check if they accidentally exist in PartnerAccounts (shouldn't happen for normal user)
                // Optional check
            } else if (userRole === 'admin') {
                 // Admin might not have a doc in Users, create a mock one or handle it
                 userData = {
                     uid: authUser.uid,
                     email: authUser.email!,
                     role: 'admin',
                     firstName: 'Admin',
                     lastName: 'User',
                     onboardingCompleted: true
                 };
            }
        }

        if (!userData) {
            console.error(`CRITICAL: User ${authUser.email} is authenticated but has no document!`);
            await firebaseSignOut(firebaseAuth);
            throw new Error("User data not found. Please contact support.");
        }

        if (userRole === 'admin') {
             userData.role = 'admin';
             userData.onboardingCompleted = true;
        }

        return { user: userData as User, role: userRole };

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

export const editUser = async (uid: string, data: Partial<User>): Promise<User | null> => {
    try {
        let userRef: any = doc(db, "Users", uid);
        let userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Try PartnerAccounts (direct lookup by UID)
            const partnerRef = doc(db, 'PartnerAccounts', uid);
            const partnerDoc = await getDoc(partnerRef);
            if (partnerDoc.exists()) {
                userRef = partnerRef;
                userDoc = partnerDoc;
            } else {
                // Try querying PartnerAccounts by uid field
                const partnersCollection = collection(db, 'PartnerAccounts');
                const q = query(partnersCollection, where('uid', '==', uid));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    userRef = querySnapshot.docs[0].ref;
                    userDoc = querySnapshot.docs[0];
                } else {
                    // Not found in either
                    return null;
                }
            }
        }

        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        console.log("User profile updated in Firestore for UID:", uid);

        const updatedUserDoc = await getDoc(userRef);
        if (updatedUserDoc.exists()) {
            const userData = updatedUserDoc.data() as any;
            // Add role if missing (for PartnerAccount)
            if (!userData.role && userRef.parent.id === 'PartnerAccounts') {
                userData.role = 'partner';
            }
            return userData as User;
        }
        return null;
    } catch (error) {
        console.error("User profile update error:", error);
        throw error;
    }
};

/**
 * Fetches the user profile from Firestore by UID.
 * @param uid The user's UID.
 * @returns The User object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        // Try Users first (direct lookup)
        const userDocRef = doc(db, "Users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data() as User;
        }

        // Try PartnerAccounts (direct lookup by UID)
        const partnerDocRef = doc(db, 'PartnerAccounts', uid);
        const partnerDoc = await getDoc(partnerDocRef);
        if (partnerDoc.exists()) {
            const data = partnerDoc.data();
            return { ...data, role: 'partner' } as unknown as User;
        }

        // Try querying PartnerAccounts by uid field
        const partnersCollection = collection(db, 'PartnerAccounts');
        const q = query(partnersCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return { ...data, role: 'partner' } as unknown as User;
        }

        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

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
        let userRef: any = doc(db, "Users", userId);
        let userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
             // Try PartnerAccounts (direct lookup by UID)
             const partnerRef = doc(db, 'PartnerAccounts', userId);
             const partnerDoc = await getDoc(partnerRef);
             if (partnerDoc.exists()) {
                 userRef = partnerRef;
             } else {
                 // Try querying PartnerAccounts by uid field
                 const partnersCollection = collection(db, 'PartnerAccounts');
                 const q = query(partnersCollection, where('uid', '==', userId));
                 const querySnapshot = await getDocs(q);
                 
                 if (!querySnapshot.empty) {
                     userRef = querySnapshot.docs[0].ref;
                 } else {
                     console.warn(`User ${userId} not found for onboarding completion.`);
                     return;
                 }
             }
        }

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