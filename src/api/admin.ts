import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { PartnerAccount, PartnerSignupRequest } from '@naadi/types'; // Assuming types/index.ts exports this

// Import the configured functions instance from firebase config
import { functions } from '../config/firebase';

// --- Types for Function Responses (match return structure) ---
interface AdminDashboardData {
    pendingRequests: (PartnerSignupRequest & { id: string })[];
    partnerAccounts: (PartnerAccount & { id: string })[];
}

interface BasicSuccessResponse {
    success: boolean;
    message: string;
}

interface ToggleStatusResponse extends BasicSuccessResponse {
    newStatus: 'enabled' | 'disabled';
}

// --- Callable Function Invokers ---

/**
 * Fetches pending requests and partner accounts for the admin dashboard.
 * Requires admin privileges.
 */
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
    try {
        const func = httpsCallable<void, AdminDashboardData>(functions, 'getAdminDashboardData');
        const result: HttpsCallableResult<AdminDashboardData> = await func();
        return result.data;
    } catch (error: any) {
        console.error("Error fetching admin dashboard data:", error);
        // Rethrow or handle error appropriately for the UI
        throw new Error(error.message || "Failed to fetch admin data.");
    }
};

/**
 * Approves a partner registration request.
 * Requires admin privileges.
 * @param requestId The ID of the document in PartnerRegistrationRequest.
 */
export const approvePartnerRequest = async (requestId: string): Promise<BasicSuccessResponse> => {
    try {
        const func = httpsCallable<{ requestId: string }, BasicSuccessResponse>(functions, 'approvePartnerRequest');
        const result = await func({ requestId });
        return result.data;
    } catch (error: any) {
        console.error(`Error approving partner request ${requestId}:`, error);
        throw new Error(error.message || "Failed to approve partner.");
    }
};

/**
 * Toggles the status (enabled/disabled) of a partner account.
 * Requires admin privileges.
 * @param accountId The ID of the document in PartnerAccounts.
 */
export const togglePartnerAccountStatus = async (accountId: string): Promise<ToggleStatusResponse> => {
    try {
        const func = httpsCallable<{ accountId: string }, ToggleStatusResponse>(functions, 'togglePartnerAccountStatus');
        const result = await func({ accountId });
        return result.data;
    } catch (error: any) {
        console.error(`Error toggling status for account ${accountId}:`, error);
        throw new Error(error.message || "Failed to toggle account status.");
    }
}; 