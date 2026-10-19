import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/news`;

export interface News {
  id?: number;
  _id?: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedDate?: string;
  isFeatured?: boolean;
  tags?: string;
  readTime?: number;
}

export const newsService = {
  async getAllNews(): Promise<News[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched news:', data);
      
      return data.map((news: any) => ({
        ...news,
        id: news._id ? parseInt(news._id) : news.id
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  async createNews(news: News): Promise<News> {
    try {
      console.log('Creating news:', news);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(news),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create news error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Created news:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  async updateNews(id: number, news: News): Promise<News> {
    try {
      console.log('Updating news:', id, news);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(news),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update news error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Updated news:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  async deleteNews(id: number): Promise<void> {
    try {
      console.log('Deleting news:', id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete news error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('Deleted news successfully');
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },
};
