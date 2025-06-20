
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'client' | 'admin';
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  image_url?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  stylist_id?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  service?: Service;
  stylist?: Stylist;
}

export interface Stylist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialties: string[];
  bio?: string;
  image_url?: string;
  rating?: number;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface WorkingHours {
  day: string;
  start_time: string;
  end_time: string;
  is_working: boolean;
}
