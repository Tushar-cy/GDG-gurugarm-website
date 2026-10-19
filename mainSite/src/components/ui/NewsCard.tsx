import React from 'react';
import { FaCalendar, FaTag } from 'react-icons/fa';

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
}

interface NewsCardProps {
  article: NewsArticle;
  onClick?: (article: NewsArticle) => void;
  delay?: number;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'tech-insights':
      return '#2563eb';
    case 'gdg-events':
      return '#16a34a';
    case 'success-stories':
      return '#dc2626';
    case 'developer-news':
      return '#ea580c';
    default:
      return '#7c3aed';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'tech-insights':
      return 'Tech Insights';
    case 'gdg-events':
      return 'GDG Events';
    case 'success-stories':
      return 'Success Stories';
    case 'developer-news':
      return 'Developer News';
    default:
      return category;
  }
};

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onClick,
  delay = 0
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 h-full flex flex-col cursor-pointer"
      onClick={handleClick}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=200&fit=crop'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {getCategoryLabel(article.category)}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize mb-2">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendar className="text-blue-600" />
              {formatDate(article.createdAt)}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {article.content}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {article.author.name.charAt(0)}
            </div>
            <span className="font-medium text-gray-900">{article.author.name}</span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                #{article.tags[0]}{article.tags.length > 1 ? ` +${article.tags.length - 1}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 