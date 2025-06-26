// /Users/salim/Desktop/Naadi/src/api/homepage.ts

// Define a generic type for the establishment data returned by the functions
export interface EstablishmentData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  type: string;
}

const recommendedData: EstablishmentData[] = [
    { id: '1', name: 'David James San Francisco', rating: 4.9, reviews: 236, address: '600 Fillmore Street, San Francis...', type: 'Hair Salon' },
    { id: '2', name: 'Creation beauty', rating: 5.0, reviews: 83, address: '7683 Thornton Avenue', type: 'Beauty Salon' },
    { id: '3', name: 'Another Place', rating: 4.8, reviews: 150, address: '123 Fake Street', type: 'Spa' },
    { id: '4', name: 'The Barber Shop', rating: 4.7, reviews: 200, address: '456 Oak Ave', type: 'Barber' },
    { id: '5', name: 'Nail Art', rating: 4.9, reviews: 300, address: '789 Pine St', type: 'Nails' },
    { id: '6', name: 'Massage Haven', rating: 4.8, reviews: 180, address: '101 Maple Dr', type: 'Massage' },
    { id: '7', name: 'Hair by Sarah', rating: 5.0, reviews: 50, address: '212 Birch Rd', type: 'Hair Salon' },
];

const newToNaadiData: EstablishmentData[] = [
    { id: '1', name: 'J. Roland Salon Sausalito', rating: 5.0, reviews: 82, address: 'Sausalito, CA', type: 'Hair Salon' },
    { id: '2', name: 'Jen Head Spa', rating: 4.9, reviews: 85, address: "Jens Place", type: 'Spa' },
    { id: '3', name: 'New Spot', rating: 4.7, reviews: 100, address: '456 New Ave', type: 'Beauty Salon' },
    { id: '4', name: 'Fresh Cuts', rating: 4.8, reviews: 90, address: '789 Fresh St', type: 'Barber' },
    { id: '5', name: 'The Nail Room', rating: 4.9, reviews: 150, address: '123 Polish Pl', type: 'Nails' },
    { id: '6', name: 'Relax & Unwind', rating: 4.7, reviews: 110, address: '456 Serene Way', type: 'Massage' },
    { id: '7', name: 'Modern Salon', rating: 5.0, reviews: 60, address: '789 Style Ave', type: 'Hair Salon' },
    { id: '8', name: 'Glow Up', rating: 4.8, reviews: 130, address: '101 Radiance Rd', type: 'Beauty Salon' },
];

const trendingData: EstablishmentData[] = [
    { id: '1', name: 'ML Hair Studio', rating: 4.9, reviews: 751, address: 'Union Street, San Francisco', type: 'Hair Salon' },
    { id: '2', name: 'Thy Spa San Francisco', rating: 4.9, reviews: 822, address: 'Mission Bay, San Francisco', type: 'Massage' },
    { id: '3', name: 'Trending Nails', rating: 4.9, reviews: 500, address: 'Downtown, SF', type: 'Nails' },
    { id: '4', name: 'Hot Cuts', rating: 4.8, reviews: 600, address: 'Market Street, SF', type: 'Barber' },
    { id: '5', name: 'Nail Palace', rating: 4.9, reviews: 700, address: 'SOMA, SF', type: 'Nails' },
    { id: '6', name: 'Zen Massage', rating: 4.8, reviews: 850, address: 'Nob Hill, SF', type: 'Massage' },
    { id: '7', name: 'Super Style', rating: 5.0, reviews: 400, address: 'Haight-Ashbury, SF', type: 'Hair Salon' },
    { id: '8', name: 'Beauty Spot', rating: 4.9, reviews: 900, address: 'Fisherman\'s Wharf, SF', type: 'Beauty Salon' },
];


export const getTrendingData = async (): Promise<EstablishmentData[]> => {
    console.log("Fetching hardcoded trending data");
    return new Promise(resolve => setTimeout(() => resolve(trendingData), 500));
};

export const getNewToNaadiData = async (): Promise<EstablishmentData[]> => {
    console.log("Fetching hardcoded new to naadi data");
    return new Promise(resolve => setTimeout(() => resolve(newToNaadiData), 500));
};

export const getRecommendedData = async (): Promise<EstablishmentData[]> => {
    console.log("Fetching hardcoded recommended data");
    return new Promise(resolve => setTimeout(() => resolve(recommendedData), 500));
};
