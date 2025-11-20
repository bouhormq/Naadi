import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from '@naadi/config/firebase/firebase';

interface PlacesSuggestionsResponse {
    success: boolean;
    predictions: any[];
    status?: string;
    error_message?: string;
}

interface PlaceDetailsResponse {
    success: boolean;
    address?: string;
    location?: { lat: number; lng: number };
    status?: string;
    error_message?: string;
}

export const getPlacesSuggestions = async (input: string): Promise<PlacesSuggestionsResponse> => {
    try {
        const func = httpsCallable<{ input: string }, PlacesSuggestionsResponse>(functions, 'getPlacesSuggestions');
        const result = await func({ input });
        return result.data;
    } catch (error: any) {
        console.error("Error calling getPlacesSuggestions:", error);
        throw new Error(error.message || "Failed to get place suggestions.");
    }
};

export const getPlaceDetails = async (placeId?: string, address?: string): Promise<PlaceDetailsResponse> => {
    try {
        const func = httpsCallable<{ placeId?: string; address?: string }, PlaceDetailsResponse>(functions, 'getPlaceDetails');
        const result = await func({ placeId, address });
        return result.data;
    } catch (error: any) {
        console.error("Error calling getPlaceDetails:", error);
        throw new Error(error.message || "Failed to get place details.");
    }
};
