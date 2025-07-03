// Remove old import
// import functions from '@react-native-firebase/functions';
import { functions } from '@naadi/config/firebase/firebase'; // Adjust the import path as necessary
import { httpsCallable } from 'firebase/functions';
import { auth, app } from '@naadi/config/firebase/firebase'; // Ensure firebase app is initialized and exported
import { Business, PhoneInfo } from '@naadi/types'; // Use alias
import { getAuth, User } from 'firebase/auth';

// Use the functions instance from config/firebase
// Example usage:
// const myFunction = httpsCallable(functions, 'myFunctionName');

// Type for the data sent TO the setMyBusinessProfile Cloud Function
// Include optional businessId for updates
// Omit server-managed fields 
type SetBusinessProfilePayload = Partial<Pick<Business, 'id'>> & Omit<Business, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>;
// Rename 'id' to 'businessId' to match Cloud Function expectation
type SetBusinessProfileCFPayload = { businessId?: string } & Omit<Business, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>;

/**
 * Fetches the business profile for the currently logged-in partner via Cloud Function.
 * DEPRECATED? Use getMyBusinesses instead to get the list, and potentially select one.
 * Or change this to getBusinessProfileById if needed.
 * Keeping old logic for now, but it assumes docId === user.uid which is likely wrong for multi-business.
 */
export const getMyBusinessProfile = async (): Promise<Business | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("getMyBusinessProfile: No user logged in.");
        throw new Error("User not authenticated.");
    }
    console.warn("getMyBusinessProfile API function may be deprecated or incorrect for multi-business scenarios.");
    try {
        // This function name likely refers to the OLD CF that assumes docId === uid
        // If a new CF `getBusinessProfileById` exists, this should call that instead
        const getProfileFunction = httpsCallable(functions, 'getBusinessProfileById'); // Assuming CF was renamed
        // Call requires passing the ID now. Which ID? This function doesn't know.
        // This function needs to be removed or fundamentally changed.
        // Temporarily call with a placeholder or remove call:
        // const result = await getProfileFunction({ businessId: '????' }); 
        console.error("getMyBusinessProfile function needs rework for multi-business ID handling.");
        return null; // Return null as it cannot function correctly anymore

        // --- Old logic assuming CF returns single profile based on UID --- 
        // const data = result.data as any; 
        // if (!data) {
        //     console.log(`getMyBusinessProfile: No business profile found for user ${user.uid}`);
        //     return null;
        // }
        // if (data.createdAt) data.createdAt = new Date(data.createdAt);
        // if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
        // console.log(`getMyBusinessProfile: Received business data for user ${user.uid}`);
        // return data as Business; 
        // --- End Old logic --- 

    } catch (error: any) {
        console.error(`Error calling getMyBusinessProfile function for user ${user.uid}:`, error);
        throw new Error(error.message || "Failed to fetch business profile via Cloud Function.");
    }
};

/**
 * Creates or updates the business profile for the currently logged-in partner via Cloud Function.
 * Pass the business ID in the businessData object for updates.
 * @param businessData The data, including an optional 'id' field for updates.
 * @returns An object indicating success and the business ID.
 */
export const setMyBusinessProfile = async (businessData: SetBusinessProfilePayload): Promise<{ success: boolean, message: string, businessId: string }> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("setMyBusinessProfile: No user logged in.");
        throw new Error("User not authenticated.");
    }

    // Rename 'id' to 'businessId' for the Cloud Function call
    const { id, ...restData } = businessData;
    const payload: SetBusinessProfileCFPayload = {
        ...restData,
        ...(id && { businessId: id }), // Add businessId only if id exists
    };

    try {
        const setProfileFunction = httpsCallable(functions, 'setMyBusinessProfile');
        
        console.log(`setMyBusinessProfile: Calling function for user ${user.uid} with payload:`, payload);
        
        const result = await setProfileFunction(payload);
        
        console.log(`setMyBusinessProfile: Function call successful for user ${user.uid}`, result.data);
        return result.data as { success: boolean, message: string, businessId: string }; 

    } catch (error: any) {
        console.error(`Error calling setMyBusinessProfile function for user ${user.uid} (Business ID: ${payload.businessId || 'New'}):`, error);
        // Rethrow or handle specific HttpsError codes
        throw new Error(error.message || "Failed to save business profile via Cloud Function.");
    }
};

/**
 * Fetches all business profiles associated with the currently logged-in partner.
 * @returns An array of Business objects (with ISO date strings potentially converted to Date objects).
 */
export const getMyBusinesses = async (): Promise<Business[]> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("getMyBusinesses: No user logged in.");
        throw new Error("User not authenticated.");
    }

    try {
        const getBusinessesFunction = httpsCallable(functions, 'getMyBusinesses');
        const result = await getBusinessesFunction();
        const data = result.data as any[]; 
        if (!Array.isArray(data)) {
            console.error("getMyBusinesses: Expected an array but received:", data);
            throw new Error("Invalid data format received from server.");
        }
        const businesses = data.map(item => {
            if (item.createdAt) item.createdAt = new Date(item.createdAt);
            if (item.updatedAt) item.updatedAt = new Date(item.updatedAt);
            return item as Business;
        });
        console.log(`getMyBusinesses: Received ${businesses.length} businesses for user ${user.uid}`);
        return businesses; 
    } catch (error: any) {
        console.error(`Error calling getMyBusinesses function for user ${user.uid}:`, error);
        throw new Error(error.message || "Failed to fetch businesses via Cloud Function.");
    }
}; 