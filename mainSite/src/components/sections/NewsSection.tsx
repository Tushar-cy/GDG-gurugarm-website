import React, { useMemo, useState } from 'react';

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

interface NewsSectionProps {
  title: string;
  subtitle: string;
  articles: NewsArticle[];
  showSearch?: boolean;
  showCategories?: boolean;
}

const categories = [
  { id: 'all', label: 'All Posts', color: '#1a1a1a', icon: '✦' },
  { id: 'tech-insights', label: 'Tech Insights', color: '#2563eb', icon: '💡' },
  { id: 'gdg-events', label: 'GDG Events', color: '#16a34a', icon: '🎯' },
  { id: 'success-stories', label: 'Success Stories', color: '#dc2626', icon: '🌟' },
  { id: 'developer-news', label: 'Developer News', color: '#ea580c', icon: '🔥' }
];

export const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  subtitle,
  articles,
  showSearch = true,
  showCategories = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-blue-500/5" />
        <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-purple-500/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <header className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        </header>

        {showSearch && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-10 text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
            </div>
          </div>
        )}

        {showCategories && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article key={article._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img
                  src={article.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop'}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
                      {categories.find((c) => c.id === article.category)?.label || article.category}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(article.createdAt)}</span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{article.content}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="h-7 w-7 overflow-hidden rounded-full bg-slate-100" />
                      <span>{article.author?.name || 'GDG Team'}</span>
                    </div>
                    <a className="text-sm font-semibold text-blue-600 hover:text-blue-700" href="#">Read more →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-3xl">📰</div>
            <div className="text-xl font-semibold text-slate-600 mb-2">No articles found</div>
            <div className="text-slate-500">Try adjusting your search or category filters.</div>
          </div>
        )}
      </div>
    </section>
  );
}; 