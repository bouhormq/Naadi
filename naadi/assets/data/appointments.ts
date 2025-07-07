import { Appointment } from '@naadi/types';
import { venues } from './venues';

// Helper to generate a date string in YYYY-MM-DD format
function getDateString(offsetDays: number, year?: number) {
  const d = new Date();
  if (typeof year === 'number') d.setFullYear(year);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// Generate 10 mock appointments: 1 in 2030, 1 in 2016, 8 distributed around today
export const appointments: Appointment[] = [
  // Future (2030)
  {
    id: venues[0].id,
    venue: venues[0].name,
    date: '2030-05-10',
    time: '09:00 AM',
    duration: '1 hr',
    price: `${venues[0].price}MAD`,
    service: venues[0].activities[0]?.name || 'Service',
    address: venues[0].address,
    coordinate: venues[0].coordinate,
    status: 'Confirmed',
    bookingRef: 'BKNG-2030-XYZ',
    cancellationPolicy: venues[1].cancellationPolicy 
  },
  // Past (2016)
  {
    id: venues[1].id,
    venue: venues[1].name,
    date: '2016-03-15',
    time: '11:00 AM',
    duration: '1 hr',
    price: `${venues[1].price}MAD`,
    service: venues[1].activities[0]?.name || 'Service',
    address: venues[1].address,
    coordinate: venues[1].coordinate,
    status: 'Completed',
    bookingRef: 'BKNG-2016-ABC',
    cancellationPolicy: venues[1].cancellationPolicy 
  },
  // 8 more from venues, distributed +/- days from today
  ...venues.slice(2, 10).map((venue, idx) => {
    // 4 in the past, 4 in the future
    const offset = idx < 4 ? -(4 - idx) : idx - 3;
    const date = getDateString(offset);
    const status: Appointment['status'] = idx % 2 === 0 ? 'Confirmed' : 'Completed';
    return {
      id: venue.id,
      venue: venue.name,
      date,
      time: '10:00 AM',
      duration: '1 hr',
      price: `${venue.price}MAD`,
      service: venue.activities[0]?.name || 'Service',
      address: venue.address,
      coordinate: venue.coordinate,
      status,
      bookingRef: `BKNG-2024-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      cancellationPolicy: venue.cancellationPolicy 
    };
  })
];
