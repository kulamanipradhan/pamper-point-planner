
import { Service, Booking, Stylist } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    description: 'Professional haircut with styling',
    duration: 45,
    price: 50,
    category: 'Hair',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    duration: 30,
    price: 25,
    category: 'Grooming',
    image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Deep Cleansing Facial',
    description: 'Relaxing facial with deep pore cleansing',
    duration: 60,
    price: 80,
    category: 'Skincare',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Hair Color',
    description: 'Full hair coloring service',
    duration: 120,
    price: 120,
    category: 'Hair',
    image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Manicure',
    description: 'Professional nail care and polish',
    duration: 45,
    price: 35,
    category: 'Nails',
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Hair Wash & Blow Dry',
    description: 'Luxurious hair wash with professional blow dry',
    duration: 30,
    price: 30,
    category: 'Hair',
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
    created_at: new Date().toISOString(),
  },
];

export const mockStylists: Stylist[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@salon.com',
    phone: '+1234567891',
    specialties: ['Hair Cutting', 'Coloring', 'Styling'],
    bio: 'Expert stylist with 10+ years of experience',
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Michael Brown',
    email: 'michael@salon.com',
    phone: '+1234567892',
    specialties: ['Beard Trimming', 'Hair Cutting', 'Facial'],
    bio: 'Specialized in men\'s grooming and traditional barbering',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 4.8,
    created_at: new Date().toISOString(),
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: '1',
    service_id: '1',
    stylist_id: '1',
    date: '2024-06-25',
    time: '10:00',
    status: 'confirmed',
    notes: 'Please trim the sides shorter',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    service_id: '3',
    stylist_id: '2',
    date: '2024-06-27',
    time: '14:00',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const generateTimeSlots = (date: string) => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 18 && minute === 30) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3, // 70% availability rate
      });
    }
  }
  return slots;
};
