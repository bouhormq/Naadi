import { venues } from '@naadi/assets/data/venues';
import { EstablishmentData, Service } from '@naadi/types';

// Mock data for reviews and services, as it's not in the main venues object
const mockReviews = [
    { id: '1', author: 'Jessie T.', rating: 5, text: 'Amazing service and friendly staff! Highly recommend.' },
    { id: '2', author: 'Alex P.', rating: 4, text: 'Great results, but the wait was a bit long.' },
];

const mockServices: Service[] = [
    { id: 's1', name: 'Gel Manicure', duration: '1hr - 1hr, 45min', price: 'from $40', category: 'Nails' },
    { id: 's2', name: 'Russian Volume Lashes', duration: '1hr - 2hr', price: 'from $109', category: 'Lash extensions' },
    { id: 's3', name: 'Classic Lashes', duration: '1hr - 1hr, 15min', price: 'from $79', category: 'Lash extensions' },
    { id: 's4', name: 'Hybrid classic Lashes', duration: '1hr - 1hr, 45 min', price: 'from $89', category: 'Lash extensions' },
    { id: 's5', name: 'Facial Treatment', duration: '1hr', price: 'from $80', category: 'Facial' },
    { id: 's6', name: 'Basic Pedicure', duration: '45min', price: 'from $30', category: 'Nails' },
    { id: 's7', name: 'Featured Service 1', duration: '1hr', price: 'from $99', category: 'Featured' },
    { id: 's8', name: 'Featured Service 2', duration: '1.5hr', price: 'from $120', category: 'Featured' },
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
            resolve(venue ? (venue as unknown as EstablishmentData) : null);
        }, 500);
    });
};

/**
 * Fetches services offered by a venue.
 * @param venueId The ID of the venue.
 */
export const getVenueServices = async (venueId: string): Promise<Service[]> => {
    console.log(`Fetching services for venue: ${venueId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, you'd fetch this from an API
            resolve(mockServices);
        }, 500);
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
            // In a real app, you'd fetch this from an API
            resolve(mockReviews);
        }, 500);
    });
};
