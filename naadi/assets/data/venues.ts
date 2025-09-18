import { EstablishmentData } from "@naadi/types";

export const venues: EstablishmentData[] = [
  {
    id: '1',
    name: 'Prestige Fitness Club',
    rating: 4.8,
    numberReviews: 620,
    reviews: [],
    address: 'Centre Ville, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5785, longitude: -5.3684 },
    type: 'Fitness',
    price: 350,
    gender: 'Everyone',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.',
    about: 'Founded in 2015 by Ahmed Benali, Prestige Fitness Club has swiftly risen as Tetouan\'s most trusted fitness services provider. Situated in the heart of the city, we offer an all-in-one fitness experience, ensuring that every client feels motivated and supported.\n\nWith a zealous team of 4 professionals, we\'ve successfully catered to the unique needs of over 2,200 clients. Our expertise doesn\'t stop at just meeting expectations; it\'s about exceeding them with knowledge and professionalism in every service we provide.',
    openingHours: {
      monday: 'Closed',
      tuesday: '10:00 AM - 5:00 PM',
      wednesday: '10:00 AM - 5:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '10:00 AM - 5:00 PM',
      sunday: 'Closed',
    },
  },
  {
    id: '2',
    name: 'Belle Femme Salon',
    rating: 4.9,
    numberReviews: 710,
    reviews: [],
    address: 'Wilaya, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5731, longitude: -5.3619 },
    type: 'Beauty',
    price: 250,
    gender: 'Female only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.',
    about: 'Founded in 2018 by Fatima Alaoui, Belle Femme Salon has become Tetouan\'s premier beauty destination. Our skilled team provides exceptional hair, nail, and beauty services in a luxurious and welcoming environment.\n\nWith a zealous team of 6 professionals, we\'ve successfully catered to the unique needs of over 3,500 clients. Our expertise doesn\'t stop at just meeting expectations; it\'s about exceeding them with knowledge and professionalism in every service we provide.',
    openingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed',
    },
  },
  {
    id: '3',
    name: 'Tetouan Marine',
    rating: 4.5,
    numberReviews: 150,
    reviews: [],
    address: "M'diq, Tetouan",
    location: "M'diq",
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6819, longitude: -5.3254 },
    type: 'Motors & Watercraft',
    price: 1200,
    gender: 'Everyone',
    services: [
        {
            name: 'Jet Ski',
            items: [
                { name: '30-Min Rental', duration: '30min', price: 'from $80' },
                { name: '1-Hour Tour', duration: '1hr', price: 'from $150' },
            ]
        },
        {
            name: 'Boat',
            items: [
                { name: 'Half-Day Charter', duration: '4hr', price: 'from $500' },
                { name: 'Sunset Cruise', duration: '2hr', price: 'from $300' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '4',
    name: 'Serenity Spa & Wellness',
    rating: 4.7,
    numberReviews: 450,
    reviews: [],
    address: 'Martil, Tetouan',
    location: 'Martil',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6167, longitude: -5.2667 },
    type: 'Wellness',
    price: 500,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '5',
    name: 'Powerhouse Gym',
    rating: 4.6,
    numberReviews: 800,
    reviews: [],
    address: 'Cabo Negro, Tetouan',
    location: 'Cabo Negro',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6500, longitude: -5.3000 },
    type: 'Fitness',
    price: 400,
    gender: 'Everyone',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '6',
    name: 'Glamour Touch Beauty Center',
    rating: 5.0,
    numberReviews: 950,
    reviews: [],
    address: 'Centre Ville, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5760, longitude: -5.3690 },
    type: 'Beauty',
    price: 300,
    gender: 'Female only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '7',
    name: 'Nautica Jet Ski',
    rating: 4.3,
    numberReviews: 95,
    reviews: [],
    address: 'Marina Smir, Tetouan',
    location: 'Marina Smir',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.7167, longitude: -5.3167 },
    type: 'Motors & Watercraft',
    price: 1500,
    gender: 'Everyone',
    services: [
        {
            name: 'Jet Ski',
            items: [
                { name: '30-Min Rental', duration: '30min', price: 'from $80' },
                { name: '1-Hour Tour', duration: '1hr', price: 'from $150' },
            ]
        },
        {
            name: 'Boat',
            items: [
                { name: 'Half-Day Charter', duration: '4hr', price: 'from $500' },
                { name: 'Sunset Cruise', duration: '2hr', price: 'from $300' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '8',
    name: 'The Wellness Hub',
    rating: 4.8,
    numberReviews: 380,
    reviews: [],
    address: 'Wilaya, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5710, longitude: -5.3650 },
    type: 'Wellness',
    price: 450,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '9',
    name: 'Iron Temple Gym',
    rating: 4.9,
    numberReviews: 1100,
    reviews: [],
    address: 'Martil, Tetouan',
    location: 'Martil',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6200, longitude: -5.2750 },
    type: 'Fitness',
    price: 300,
    gender: 'Male only',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '10',
    name: 'Elegance Beauty Clinic',
    rating: 4.7,
    numberReviews: 550,
    reviews: [],
    address: 'Cabo Negro, Tetouan',
    location: 'Cabo Negro',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6525, longitude: -5.3050 },
    type: 'Beauty',
    price: 400,
    gender: 'Female only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '11',
    name: 'Zenith Yoga & Pilates',
    rating: 4.9,
    numberReviews: 250,
    reviews: [],
    address: 'Centre Ville, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5795, longitude: -5.3675 },
    type: 'Wellness',
    price: 200,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '12',
    name: "Athlete's Corner",
    rating: 4.5,
    numberReviews: 680,
    reviews: [],
    address: 'Wilaya, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5742, longitude: -5.3601 },
    type: 'Fitness',
    price: 250,
    gender: 'Everyone',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '13',
    name: 'La Belleza Salon',
    rating: 4.6,
    numberReviews: 480,
    reviews: [],
    address: 'Martil, Tetouan',
    location: 'Martil',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6182, longitude: -5.2693 },
    type: 'Beauty',
    price: 200,
    gender: 'Female only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '14',
    name: 'Ocean Breeze Spa',
    rating: 4.8,
    numberReviews: 320,
    reviews: [],
    address: "M'diq, Tetouan",
    location: "M'diq",
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6835, longitude: -5.3240 },
    type: 'Wellness',
    price: 600,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '15',
    name: 'Fit Factory Tetouan',
    rating: 4.7,
    numberReviews: 900,
    reviews: [],
    address: 'Centre Ville, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5770, longitude: -5.3660 },
    type: 'Fitness',
    price: 320,
    gender: 'Everyone',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '16',
    name: 'The Nail Bar',
    rating: 4.9,
    numberReviews: 850,
    reviews: [],
    address: 'Wilaya, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5720, longitude: -5.3630 },
    type: 'Beauty',
    price: 150,
    gender: 'Female only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '17',
    name: 'Marina Bay Boats',
    rating: 4.2,
    numberReviews: 80,
    reviews: [],
    address: 'Marina Smir, Tetouan',
    location: 'Marina Smir',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.7180, longitude: -5.3150 },
    type: 'Motors & Watercraft',
    price: 2500,
    gender: 'Everyone',
    services: [
        {
            name: 'Jet Ski',
            items: [
                { name: '30-Min Rental', duration: '30min', price: 'from $80' },
                { name: '1-Hour Tour', duration: '1hr', price: 'from $150' },
            ]
        },
        {
            name: 'Boat',
            items: [
                { name: 'Half-Day Charter', duration: '4hr', price: 'from $500' },
                { name: 'Sunset Cruise', duration: '2hr', price: 'from $300' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '18',
    name: 'Holistic Harmony Center',
    rating: 4.9,
    numberReviews: 410,
    reviews: [],
    address: 'Cabo Negro, Tetouan',
    location: 'Cabo Negro',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6550, longitude: -5.3080 },
    type: 'Wellness',
    price: 550,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '19',
    name: 'CrossFit Tetouan',
    rating: 4.8,
    numberReviews: 750,
    reviews: [],
    address: 'Martil, Tetouan',
    location: 'Martil',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.6215, longitude: -5.2780 },
    type: 'Fitness',
    price: 450,
    gender: 'Everyone',
    services: [
      {
        name: 'Featured',
        items: [
          { name: 'Personal Training Session', duration: '1hr', price: 'from $50' },
          { name: 'Full Day Pass', duration: 'All day', price: '$25' },
        ]
      },
      {
        name: 'Classes',
        items: [
          { name: 'Yoga', duration: '1hr', price: 'from $20' },
          { name: 'HIIT', duration: '45min', price: 'from $20' },
          { name: 'Martial Arts', duration: '1hr 30min', price: 'from $30' },
          { name: 'Pilates', duration: '1hr', price: 'from $20' },
          { name: 'Dance', duration: '1hr', price: 'from $18' },
          { name: 'Boxing', duration: '1hr', price: 'from $25' },
        ]
      },
      {
        name: 'Gym Access',
        items: [
          { name: 'Gym Time', duration: 'per hour', price: '$10' },
          { name: 'Rowing Machine', duration: '30min', price: '$5' },
          { name: 'Running Treadmill', duration: '30min', price: '$5' },
          { name: 'Cycling Bike', duration: '30min', price: '$5' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '20',
    name: "Gentlemen's Barber Club",
    rating: 4.9,
    numberReviews: 600,
    reviews: [],
    address: 'Centre Ville, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5755, longitude: -5.3695 },
    type: 'Beauty',
    price: 100,
    gender: 'Male only',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Deluxe Manicure & Pedicure', duration: '2hr', price: 'from $70' },
                { name: 'Bridal Hair & Makeup', duration: '3hr', price: 'from $200' },
            ]
        },
        {
            name: 'Nails',
            items: [
                { name: 'Gel Manicure', duration: '1hr', price: 'from $40' },
                { name: 'Basic Pedicure', duration: '45min', price: 'from $30' },
            ]
        },
        {
            name: 'Hair',
            items: [
                { name: 'Haircut & Style', duration: '1hr', price: 'from $50' },
                { name: 'Coloring', duration: '2hr - 3hr', price: 'from $100' },
            ]
        },
        {
            name: 'Lashes & Brows',
            items: [
                { name: 'Lash Extensions', duration: '1hr 30min', price: 'from $109' },
                { name: 'Brow Shaping', duration: '30min', price: 'from $25' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  },
  {
    id: '21',
    name: 'Mind & Body Studio',
    rating: 4.7,
    numberReviews: 300,
    reviews: [],
    address: 'Wilaya, Tetouan',
    location: 'Tetouan',
    images: [
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/0569ede1c6424966af2fd6f01e8a41-luxman-barbershop-bcn-biz-photo-f64a1836eaec48dc82a82750f554a0-booksy.jpeg?size=640x427',
      'https://d375139ucebi94.cloudfront.net/region2/es/54708/biz_photo/68e488ac1859485ab24480fd6dc39f-luxman-barbershop-bcn-biz-photo-4c90160be0644935a0364a5007cc95-booksy.jpeg?size=640x427'
    ],
    coordinate: { latitude: 35.5705, longitude: -5.3645 },
    type: 'Wellness',
    price: 280,
    gender: 'Everyone',
    services: [
        {
            name: 'Featured',
            items: [
                { name: 'Full-Day Spa Package', duration: '5hr', price: 'from $300' },
                { name: 'Couples Massage', duration: '1hr', price: 'from $180' },
            ]
        },
        {
            name: 'Massage',
            items: [
                { name: 'Swedish Massage', duration: '1hr', price: 'from $90' },
                { name: 'Deep Tissue Massage', duration: '1hr', price: 'from $110' },
            ]
        },
        {
            name: 'Facial',
            items: [
                { name: 'Hydrating Facial', duration: '1hr', price: 'from $80' },
                { name: 'Anti-Aging Treatment', duration: '1hr 15min', price: 'from $120' },
            ]
        },
        {
            name: 'Hammam',
            items: [
                { name: 'Traditional Hammam Ritual', duration: '1hr 30min', price: 'from $150' },
            ]
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment.'
  }
];

// Export subCategoriesData for use in other files
export const subCategoriesData = [
  {
    category: 'Motors & Watercraft',
    emoji: '🚤',
    items: [
      { name: 'Scooter', emoji: '🛴' },
      { name: 'Motorbike', emoji: '🏍️' },
      { name: 'Quad', emoji: '🚜' },
      { name: 'Buggy', emoji: '🚙' },
      { name: 'Jet Ski', emoji: '🛥️' },
      { name: 'Boat', emoji: '⛵' },
      { name: 'Kayak', emoji: '🛶' },
      { name: 'Paddleboard', emoji: '🏄‍♀️' },
    ],
  },
  {
    category: 'Fitness',
    emoji: '🏋️‍♀️' ,
    items: [
      { name: 'Yoga', emoji: '🧘‍♀️' },
      { name: 'HIIT', emoji: '🏊🏼‍♂️' },
      { name: 'Martial Arts', emoji: '🥋' },
      { name: 'Rowing', emoji: '🚣‍♀️' },
      { name: 'Running', emoji: '🏃‍♀️' },
      { name: 'Cycling', emoji: '🚴‍♀️' },
      { name: 'Pilates', emoji: '🤸‍♀️' },
      { name: 'Dance', emoji: '💃' },
      { name: 'Boxing', emoji: '🥊' },
      { name: 'Outdoors', emoji: '🌳' },
      { name: 'Gym Time', emoji: '💪' },
      { name: 'Sports', emoji: '🏀' },
      { name: 'Golf', emoji: '🏌🏼‍♀️' },
      { name: 'Paintball', emoji: '🔫' },
    ],
  },
  {
    category: 'Wellness',
    emoji: '🫧',
    items: [
      { name: 'Massage', emoji: '💆‍♀️' },
      { name: 'Facial', emoji: '🧖‍♀️' },
      { name: 'Sports Recovery', emoji: '🧊' },
      { name: 'Hammam', emoji: '🛁' },
      { name: 'Meditation', emoji: '🧘' },
      { name: 'Acupuncture', emoji: '📌' },
      { name: 'Cupping', emoji: '💨' },
    ],
  },
  {
    category: 'Beauty',
    emoji: '💈',
    items: [
      { name: 'Nails', emoji: '💅' },
      { name: 'Hair', emoji: '💇‍♀️' },
      { name: 'Lashes', emoji: '👁️' },
      { name: 'Brows', emoji: '✏️' },
    ],
  },
];
