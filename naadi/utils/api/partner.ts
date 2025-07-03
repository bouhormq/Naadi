import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { PartnerSignupRequest } from '@naadi/types'; // Assuming types are correctly located
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