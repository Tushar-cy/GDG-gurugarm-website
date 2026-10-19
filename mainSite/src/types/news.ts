export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  author?: string;
  publishedDate: string;
  isFeatured?: boolean;
  tags?: string;
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
}


