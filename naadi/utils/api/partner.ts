import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { PartnerSignupRequest, Location } from '@naadi/types'; // Assuming types are correctly located
import { PartnerContactFormData } from '@naadi/types'; // Import type from component
import { functions } from '@naadi/config/firebase/firebase'; // Import configured functions instance

// Interface for the expected success response from the callable functions
interface BasicSuccessResponse {
    success: boolean;
    message: string;
}

/**
 * Calls the partnerRegisterRequest Cloud Function.
 * @param formData The partner signup form data.
 * @returns Promise resolving to the success response or throwing an error.
 */
export const submitPartnerRegistrationRequest = async (
    formData: PartnerSignupRequest
): Promise<BasicSuccessResponse> => {
    try {
        console.log("Calling partnerRegisterRequest with data:", formData);
        const func = httpsCallable<PartnerSignupRequest, BasicSuccessResponse>(functions, 'partnerRegisterRequest');
        const result: HttpsCallableResult<BasicSuccessResponse> = await func(formData);
        console.log("partnerRegisterRequest response:", result.data);
        // Ensure the response has the expected structure
        if (result.data && typeof result.data.success === 'boolean') {
            return result.data;
        } else {
            throw new Error("Invalid response structure received from function.");
        }
    } catch (error: any) {
        console.error("Error calling partnerRegisterRequest function:", error);
        // Rethrow a standardized error message 
        throw new Error(error.message || "Failed to submit registration request via callable function.");
    }
};

/**
 * Calls the partnerContactRequest Cloud Function.
 * @param formData The partner contact form data.
 * @returns Promise resolving to the success response or throwing an error.
 */
export const submitPartnerContactRequest = async (
    formData: PartnerContactFormData
): Promise<BasicSuccessResponse> => {
    try {
        console.log("Calling partnerContactRequest with data:", formData);
        const func = httpsCallable<PartnerContactFormData, BasicSuccessResponse>(functions, 'partnerContactRequest');
        const result: HttpsCallableResult<BasicSuccessResponse> = await func(formData);
        console.log("partnerContactRequest response:", result.data);
        // Ensure the response has the expected structure
        if (result.data && typeof result.data.success === 'boolean') {
            return result.data;
        } else {
            throw new Error("Invalid response structure received from function.");
        }
    } catch (error: any) {
        console.error("Error calling partnerContactRequest function:", error);
        // Rethrow a standardized error message
        throw new Error(error.message || "Failed to submit contact request via callable function.");
    }
};

// Import db and other necessary modules for finalizeOnboarding
import { db } from '@naadi/config/firebase/firebase';
import { OnboardingData } from '@naadi/types';
import { deleteDraftFromFirestore } from '@naadi/utils/onboarding/onboardingService';

const ONBOARDING_DATA_COLLECTION = 'OnboardingData';

interface FinalizeOnboardingPayload {
    userId: string;
    data: OnboardingData;
    email?: string;
}

interface FinalizeOnboardingResponse {
    success: boolean;
    message: string;
}

/**
 * Finalize onboarding - save all data to permanent location
 * This is called when onboarding is completed
 */
export const finalizeOnboarding = async (
    userId: string,
    data: OnboardingData,
    email?: string
): Promise<void> => {
    try {
        console.log("Calling finalizeOnboarding Cloud Function for user:", userId);
        const func = httpsCallable<FinalizeOnboardingPayload, FinalizeOnboardingResponse>(functions, 'finalizeOnboarding');

        const result = await func({
            userId,
            data,
            email
        });

        console.log("finalizeOnboarding response:", result.data);

        if (!result.data.success) {
            throw new Error(result.data.message || "Failed to finalize onboarding.");
        }

        // 3. Delete the draft (Client side cleanup is fine for draft)
        await deleteDraftFromFirestore(userId);

    } catch (error: any) {
        console.error('Error finalizing onboarding:', error);
        throw error;
    }
};

interface OnboardingStatus {
    address: boolean;
    website: boolean;
    services: boolean;
    team: boolean;
    hours: boolean;
}

/**
 * Get the onboarding status for the current partner
 */
export const getPartnerOnboardingStatus = async (): Promise<OnboardingStatus> => {
    try {
        const func = httpsCallable<void, OnboardingStatus>(functions, 'getPartnerOnboardingStatus');
        const result = await func();
        return result.data;
    } catch (error: any) {
        console.error("Error calling getPartnerOnboardingStatus:", error);
        // Return all false on error to be safe, or throw
        return {
            address: false,
            website: false,
            services: false,
            team: false,
            hours: false,
        };
    }
};

// -----------------------
// Client sources helpers
// -----------------------
interface ClientSourcePayload {
    id?: string;
    name: string;
    active: boolean;
}

interface ClientSourcesResponse {
    sources: Array<{
        id: string;
        ownerUid?: string;
        name: string;
        active: boolean;
        createdAt?: string;
    }>;
}

export const getClientSources = async (): Promise<ClientSourcesResponse> => {
    try {
        const func = httpsCallable<void, ClientSourcesResponse>(functions, 'getClientSources');
        const result = await func();
        return result.data;
    } catch (error: any) {
        console.error('Error calling getClientSources:', error);
        return { sources: [] };
    }
};

export const createClientSource = async (payload: ClientSourcePayload): Promise<{ success: boolean; id?: string; message?: string }> => {
    try {
        const func = httpsCallable<ClientSourcePayload, { success: boolean; id?: string; message?: string }>(functions, 'createClientSource');
        const result = await func(payload);
        return result.data;
    } catch (error: any) {
        console.error('Error calling createClientSource:', error);
        throw error;
    }
};

export const updateClientSource = async (id: string, payload: Partial<ClientSourcePayload>): Promise<{ success: boolean; message?: string }> => {
    try {
        const func = httpsCallable<any, { success: boolean; message?: string }>(functions, 'updateClientSource');
        const result = await func({ id, ...payload });
        return result.data;
    } catch (error: any) {
        console.error('Error calling updateClientSource:', error);
        throw error;
    }
};

export const deleteClientSource = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const func = httpsCallable<{ id: string }, { success: boolean; message?: string }>(functions, 'deleteClientSource');
        const result = await func({ id });
        return result.data;
    } catch (error: any) {
        console.error('Error calling deleteClientSource:', error);
        throw error;
    }
};

// -----------------------
// Location helpers
// -----------------------
// Use the Location type from shared types, omitting server-managed fields for the payload
type LocationPayload = Omit<Location, 'createdAt' | 'updatedAt'>;

interface LocationsResponse {
    locations: Location[];
}

export const getLocations = async (): Promise<LocationsResponse> => {
    try {
        const func = httpsCallable<void, LocationsResponse>(functions, 'getLocations');
        const result = await func();
        return result.data;
    } catch (error: any) {
        console.error('Error calling getLocations:', error);
        return { locations: [] };
    }
};

export const createLocation = async (payload: LocationPayload): Promise<{ success: boolean; id?: string; message?: string }> => {
    try {
        const func = httpsCallable<LocationPayload, { success: boolean; id?: string; message?: string }>(functions, 'createLocation');
        const result = await func(payload);
        return result.data;
    } catch (error: any) {
        console.error('Error calling createLocation:', error);
        throw error;
    }
};

export const updateLocation = async (id: string, payload: Partial<LocationPayload>): Promise<{ success: boolean; message?: string }> => {
    try {
        const func = httpsCallable<any, { success: boolean; message?: string }>(functions, 'updateLocation');
        const result = await func({ id, ...payload });
        return result.data;
    } catch (error: any) {
        console.error('Error calling updateLocation:', error);
        throw error;
    }
};

export const deleteLocation = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const func = httpsCallable<{ id: string }, { success: boolean; message?: string }>(functions, 'deleteLocation');
        const result = await func({ id });
        return result.data;
    } catch (error: any) {
        console.error('Error calling deleteLocation:', error);
        throw error;
    }
};