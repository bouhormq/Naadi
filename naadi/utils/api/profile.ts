import { EstablishmentData } from '@naadi/types';
import { venues } from '@naadi/assets/data/venues';

/**
 * Fetches the favorite establishments for a user.
 * 
 * @param userId The ID of the user whose favorites to fetch.
 * @returns A promise that resolves to an array of establishment data.
 */
export const getFavorites = async (userId: string): Promise<EstablishmentData[]> => {
  console.log(`Fetching favorites for user: ${userId}`);
  
  // Mock implementation: return a random subset of venues
  // In the future, this will call Firebase to get the actual favorite IDs
  // and then fetch the corresponding establishment data.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const shuffled = [...venues].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 5) + 1); // Math.floor(Math.random() * 5) + 1
      console.log('Fetched favorites:', selected);
      resolve(selected);
    }, 500); // Simulate network delay
  });
};
