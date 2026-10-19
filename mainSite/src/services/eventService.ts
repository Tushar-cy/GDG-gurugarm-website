import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/events`;

export interface Event {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
  image?: string;
  logo?: string;
  link?: string;
  registrationFormId?: number;
  hasRegistration?: boolean;
  images?: string[]; // gallery images
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched events:', data);
      
      // Convert _id to id for frontend compatibility
      return data.map((event: any) => ({
        ...event,
        id: event._id ? parseInt(event._id) : event.id
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async getEventById(id: number): Promise<Event | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  async createEvent(event: Event): Promise<Event> {
    try {
      console.log('Creating event:', event);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create event error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Created event:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async updateEvent(id: number, event: Event): Promise<Event> {
    try {
      console.log('Updating event:', id, event);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update event error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Updated event:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(id: number): Promise<void> {
    try {
      console.log('Deleting event:', id);
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete event error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
};
