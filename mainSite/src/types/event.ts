export interface Event {
  _id: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  logo?: string;
  location?: string;
  link?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  category?: string;
  content?: string;
  images?: string[];
  tags?: string[];
  maxAttendees?: number;
  createdAt?: string;
  updatedAt?: string;
}