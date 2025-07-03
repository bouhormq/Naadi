import { venues } from '@naadi/assets/data/venues'; // Adjust the import path as necessary
import { EstablishmentData } from '@naadi/types'; // Adjust the import path as necessary

// Helper to map venue to EstablishmentData
const mapVenueToEstablishment = (venue: any): EstablishmentData => ({
  id: venue.id,
  name: venue.name,
  rating: venue.rating,
  numberReviews: venue.numberReviews,
  reviews: venue.reviews,
  address: venue.address,
  type: venue.type,
  images: venue.images,
  coordinate: venue.coordinate,
  createdAt: venue.createdAt,
  updatedAt: venue.updatedAt,
  activities: venue.activities?.map((a: any) => a.name),
  gender: venue.gender,
  location: venue.location,
});

export const getRecommendedData = async (): Promise<EstablishmentData[]> => {
  // Top 8 by rating, then by numberReviews
  const sorted = [...venues].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.numberReviews - a.numberReviews;
  });
  return sorted.slice(0, 8).map(mapVenueToEstablishment);
};

export const getNewToNaadiData = async (): Promise<EstablishmentData[]> => {
  // Top 8 by most recent createdAt
  const sorted = [...venues].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return sorted.slice(0, 8).map(mapVenueToEstablishment);
};

export const getTrendingData = async (): Promise<EstablishmentData[]> => {
  // Top 8 by numberReviews, then by rating
  const sorted = [...venues].sort((a, b) => {
    if (b.numberReviews !== a.numberReviews) return b.numberReviews - a.numberReviews;
    return b.rating - a.rating;
  });
  return sorted.slice(0, 8).map(mapVenueToEstablishment);
};
