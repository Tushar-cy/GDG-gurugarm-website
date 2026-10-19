export interface GalleryFolder {
  id: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  createdAt?: string;
}

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  return '';
};

const API_BASE_URL = `${getApiBaseUrl()}/api`;
const MEDIA_BASE_URL = getApiBaseUrl();

export const galleryService = {
  async getAllFolders(): Promise<GalleryFolder[]> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders`);
    if (!response.ok) throw new Error('Failed to fetch folders');
    return response.json();
  },

  async getFolder(id: number): Promise<GalleryFolder> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch folder');
    return response.json();
  },

  async createFolder(name: string, description?: string): Promise<GalleryFolder> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to create folder');
    return response.json();
  },

  async updateFolder(id: number, name: string, description?: string): Promise<GalleryFolder> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to update folder');
    return response.json();
  },

  async deleteFolder(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete folder');
  },

  async getFolderImages(folderId: number): Promise<GalleryImage[]> {
    const response = await fetch(`${API_BASE_URL}/gallery/folders/${folderId}/images`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },

  async uploadImages(folderId: number, files: File[]): Promise<{ success: boolean; count: number; images: GalleryImage[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/gallery/folders/${folderId}/images`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Failed to upload images: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  async deleteImage(imageId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/gallery/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete image');
  },
};

