import { venues } from '@naadi/assets/data/venues';
import { EstablishmentData } from '@naadi/types';

// Mock data for reviews and services, as it's not in the main venues object
const mockReviews = [
    { id: '1', author: 'Jessie T.', rating: 5, text: 'Amazing service and friendly staff! Highly recommend.' },
    { id: '2', author: 'Alex P.', rating: 4, text: 'Great results, but the wait was a bit long.' },
];

const mockServices = [
    { id: 's1', name: 'Gel Manicure', duration: '1hr - 1hr, 45min', price: 'from $40' },
    { id: 's2', name: 'Russian Volume Lashes', duration: '1hr - 2hr', price: 'from $109' },
    { id: 's3', name: 'Classic Lashes', duration: '1hr - 1hr, 15min', price: 'from $79' },
];

/**
 * Fetches detailed information for a single venue.
 * @param venueId The ID of the venue to fetch.
 */
export const getVenueDetails = async (venueId: string): Promise<EstablishmentData | null> => {
    console.log(`Fetching details for venue: ${venueId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const venue = venues.find((v) => v.id === venueId);
            resolve(venue ? (venue as EstablishmentData) : null);
        }, 300);
    });
};

/**
 * Fetches services offered by a venue.
 * @param venueId The ID of the venue.
 */
export const getVenueServices = async (venueId: string): Promise<any[]> => {
    console.log(`Fetching services for venue: ${venueId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockServices);
        }, 300);
    });
};

/**
 * Fetches reviews for a venue.
 * @param venueId The ID of the venue.
 */
export const getVenueReviews = async (venueId: string): Promise<any[]> => {
    console.log(`Fetching reviews for venue: ${venueId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockReviews);
        }, 300);
    });
};
