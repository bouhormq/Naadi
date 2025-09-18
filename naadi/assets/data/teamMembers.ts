import { TeamMember, Review } from '@naadi/types';

// Team members data
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Anna Smith',
    role: 'Nail Technician',
    image: 'https://i.pinimg.com/736x/fc/85/34/fc853485911f3e4c7a3696d6c5fd1683.jpg',
    rating: 4.8,
    specialties: ['Gel Manicure', 'Nail Art', 'Acrylic Nails'],
    bio: 'Professional nail technician with 5+ years of experience specializing in creative nail art and gel applications.',
    experience: '5+ years',
    venueId: '1',
    serviceIds: ['service-1', 'service-2', 'service-3'],
    reviews: [
      {
        id: 'review-1',
        userId: 'user-1',
        userName: 'Sarah M.',
        userInitials: 'SM',
        rating: 5,
        comment: 'Anna did an amazing job on my gel manicure! Very professional and attention to detail.',
        date: '2024-01-20T14:30:00Z',
        teamMemberId: '1',
        serviceId: 'service-1'
      },
      {
        id: 'review-2',
        userId: 'user-2',
        userName: 'Jessica L.',
        userInitials: 'JL',
        rating: 4,
        comment: 'Great nail art! Anna is very creative and skilled.',
        date: '2024-01-18T10:15:00Z',
        teamMemberId: '1',
        serviceId: 'service-2'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Tiffany Johnson',
    role: 'Junior Lash Artist',
    rating: 4.6,
    specialties: ['Classic Lashes', 'Volume Lashes'],
    bio: 'Passionate lash artist focused on enhancing natural beauty with precision and care.',
    experience: '2 years',
    venueId: '1',
    serviceIds: ['service-4', 'service-5'],
    reviews: [
      {
        id: 'review-3',
        userId: 'user-3',
        userName: 'Maria K.',
        userInitials: 'MK',
        rating: 5,
        comment: 'Tiffany is amazing! My lashes look so natural and beautiful.',
        date: '2024-01-19T16:45:00Z',
        teamMemberId: '2',
        serviceId: 'service-4'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Esthetician / Lash Artist',
    rating: 5.0,
    specialties: ['Facial Treatments', 'Lash Extensions', 'Brow Shaping'],
    bio: 'Licensed esthetician and lash artist with expertise in skincare and beauty enhancement.',
    experience: '7 years',
    venueId: '1',
    serviceIds: ['service-6', 'service-7', 'service-8'],
    reviews: [
      {
        id: 'review-4',
        userId: 'user-4',
        userName: 'Jessie T.',
        userInitials: 'JT',
        rating: 5,
        comment: 'Emily is great! She provided very good service. I love my lash extension.',
        date: '2024-01-17T17:02:00Z',
        teamMemberId: '3',
        serviceId: 'service-7'
      },
      {
        id: 'review-5',
        userId: 'user-5',
        userName: 'Amanda R.',
        userInitials: 'AR',
        rating: 5,
        comment: 'Best facial treatment I\'ve ever had! Emily is so skilled and professional.',
        date: '2024-01-16T11:30:00Z',
        teamMemberId: '3',
        serviceId: 'service-6'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    role: 'Hair Stylist',
    rating: 4.9,
    specialties: ['Haircuts', 'Styling', 'Coloring'],
    bio: 'Creative hair stylist with a passion for transforming looks and making clients feel confident.',
    experience: '6 years',
    venueId: '2',
    serviceIds: ['service-9', 'service-10'],
    reviews: [
      {
        id: 'review-6',
        userId: 'user-6',
        userName: 'Rachel S.',
        userInitials: 'RS',
        rating: 5,
        comment: 'Sarah gave me the best haircut I\'ve ever had! She really listened to what I wanted.',
        date: '2024-01-21T13:20:00Z',
        teamMemberId: '4',
        serviceId: 'service-9'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    name: 'Michael Brown',
    role: 'Massage Therapist',
    rating: 4.7,
    specialties: ['Deep Tissue', 'Swedish', 'Hot Stone'],
    bio: 'Licensed massage therapist specializing in therapeutic and relaxation techniques.',
    experience: '8 years',
    venueId: '3',
    serviceIds: ['service-11', 'service-12'],
    reviews: [
      {
        id: 'review-7',
        userId: 'user-7',
        userName: 'David P.',
        userInitials: 'DP',
        rating: 5,
        comment: 'Michael is excellent! Very professional and skilled at deep tissue massage.',
        date: '2024-01-22T09:30:00Z',
        teamMemberId: '5',
        serviceId: 'service-11'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    role: 'Senior Nail Artist',
    rating: 4.9,
    specialties: ['Nail Art', 'Manicures', 'Pedicures'],
    bio: 'Award-winning nail artist with expertise in complex nail designs and health-focused treatments.',
    experience: '10+ years',
    venueId: '2',
    serviceIds: ['service-13', 'service-14'],
    reviews: [
      {
        id: 'review-8',
        userId: 'user-8',
        userName: 'Emma W.',
        userInitials: 'EW',
        rating: 5,
        comment: 'Lisa is absolutely amazing! Her nail art is incredible and she\'s so gentle.',
        date: '2024-01-23T14:45:00Z',
        teamMemberId: '6',
        serviceId: 'service-13'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '7',
    name: 'James Rodriguez',
    role: 'Barber',
    rating: 4.8,
    specialties: ['Beard Trim', 'Classic Cuts', 'Fades'],
    bio: 'Traditional barber with modern techniques, focused on precision and classic styling.',
    experience: '4 years',
    venueId: '3',
    serviceIds: ['service-15', 'service-16'],
    reviews: [
      {
        id: 'review-9',
        userId: 'user-9',
        userName: 'Alex M.',
        userInitials: 'AM',
        rating: 4,
        comment: 'Great fade cut! James really knows his craft.',
        date: '2024-01-24T16:00:00Z',
        teamMemberId: '7',
        serviceId: 'service-16'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '8',
    name: 'Sophie Chen',
    role: 'Makeup Artist',
    rating: 5.0,
    specialties: ['Bridal Makeup', 'Special Events', 'Airbrush'],
    bio: 'Professional makeup artist specializing in bridal and special event makeup with a focus on natural beauty enhancement.',
    experience: '6 years',
    venueId: '1',
    serviceIds: ['service-17', 'service-18'],
    reviews: [
      {
        id: 'review-10',
        userId: 'user-10',
        userName: 'Olivia B.',
        userInitials: 'OB',
        rating: 5,
        comment: 'Sophie did my wedding makeup and it was perfect! She\'s so talented.',
        date: '2024-01-25T11:15:00Z',
        teamMemberId: '8',
        serviceId: 'service-17'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Helper functions
export const getTeamMembersByVenueId = (venueId: string): TeamMember[] => {
  return teamMembers.filter(member => member.venueId === venueId);
};

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return teamMembers.find(member => member.id === id);
};

export const getTeamMemberInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

// Get all reviews for a venue (from all team members)
export const getVenueReviews = (venueId: string): Review[] => {
  const venueTeamMembers = getTeamMembersByVenueId(venueId);
  const allReviews: Review[] = [];
  
  venueTeamMembers.forEach(member => {
    allReviews.push(...member.reviews);
  });
  
  // Sort by date (newest first)
  return allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get reviews for a specific team member
export const getTeamMemberReviews = (teamMemberId: string): Review[] => {
  const member = getTeamMemberById(teamMemberId);
  return member ? member.reviews : [];
};
