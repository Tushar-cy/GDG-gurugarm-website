import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaUser, FaClock, FaTag, FaStar, FaFilter, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { AdminWrapper } from '../components/admin/AdminWrapper';
import { EditModal } from '../components/admin/EditModal';
import { DeleteConfirm } from '../components/admin/DeleteConfirm';
import { ImageUpload } from '../components/admin/ImageUpload';
import { newsService, News as NewsArticle } from '../services/newsService';

type CategoryFilter = 'all' | 'Tech News' | 'Events' | 'Tutorials' | 'Community';

const NewsPage = () => {
  const { isEditMode } = useAuth();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollFilter, setShowScrollFilter] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Edit/Delete state
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [deletingNews, setDeletingNews] = useState<NewsArticle | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({});

  // Fetch news from backend
  useEffect(() => {
    fetchNews();
  }, []);

  // Handle scroll to show/hide filter bar
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollFilter(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (selectedNews || editingNews || isAddingNew || deletingNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews, editingNews, isAddingNew, deletingNews]);

  const fetchNews = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredNews = useMemo(() => {
    let filtered = news;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((article) => article.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [news, searchQuery, categoryFilter]);

  const featuredNews = useMemo(() => {
    return filteredNews.filter((article) => article.isFeatured);
  }, [filteredNews]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData(article);
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      category: 'Tech News',
      author: '',
      isFeatured: false,
      tags: '',
      readTime: 5,
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      alert('Please fill in all required fields (Title, Content, Excerpt)');
      return;
    }

    setIsLoading(true);
    try {
      const newsData: NewsArticle = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        image: formData.image || '',
        category: formData.category || 'Tech News',
        author: formData.author || '',
        isFeatured: formData.isFeatured || false,
        tags: formData.tags || '',
        readTime: formData.readTime || 5,
      };

      if (isAddingNew) {
        await newsService.createNews(newsData);
      } else if (editingNews && editingNews.id) {
        await newsService.updateNews(editingNews.id, newsData);
      }

      await fetchNews();
      setEditingNews(null);
      setIsAddingNew(false);
      setFormData({});
    } catch (err) {
      console.error('Error saving news:', err);
      alert(`Failed to save news. ${err instanceof Error ? err.message : 'Please try again.'}`);
      } finally {
        setIsLoading(false);
      }
    };

  const handleDelete = async () => {
    if (!deletingNews || !deletingNews.id) return;
    setIsLoading(true);
    try {
      await newsService.deleteNews(deletingNews.id);
      await fetchNews();
      setDeletingNews(null);
    } catch (err) {
      console.error('Error deleting news:', err);
      alert(`Failed to delete news. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof NewsArticle, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 md:py-20 overflow-hidden">
        {/* Subtle Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10 text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-purple-50 border border-purple-200 rounded-full">
              <FaStar size={16} className="text-purple-600" />
              <span className="text-sm font-bold text-purple-700">Latest Updates</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 animate-fade-in-up">
            News & Updates
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Stay updated with the latest news, announcements, and insights from the GDG community
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <div
                  key={article.id}
                  className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedNews(article)}
                >
                  <AdminWrapper>
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(article); }}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingNews(article); }}
                        className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </AdminWrapper>

                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{article.category}</span>
                      <FaStar size={14} className="text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaUser size={12} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt size={12} />
                        <span>{formatDate(article.publishedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scroll-triggered Filter Bar - Only on mobile */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showScrollFilter ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white/98 backdrop-blur-2xl border-b border-gray-200/80 shadow-md">
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-gray-100/80 rounded-xl">
                <FaSearch className="text-gray-400" size={16} />
                <span className="text-sm text-gray-500 font-semibold">Search news...</span>
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-bold shadow-sm active:scale-95 transition-all"
              >
                <FaFilter size={14} />
                <span className="text-sm">Filter</span>
              </button>
            </div>
            {categoryFilter !== 'all' && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                  <span className="text-sm font-bold text-blue-700">{categoryFilter}</span>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                  >
                    <FaTimes size={10} className="text-blue-700" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      {showFilterModal && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[100] flex items-end overflow-hidden" onClick={() => setShowFilterModal(false)}>
          <div 
            className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Filter News</h3>
              <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Category</h4>
                  <span className="text-sm text-gray-500">{categoryFilter === 'all' ? 'All' : categoryFilter}</span>
                </div>
                <div className="space-y-2">
                  {(['all', 'Tech News', 'Events', 'Tutorials', 'Community'] as CategoryFilter[]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                        categoryFilter === category ? 'bg-blue-50 border-2 border-blue-600 text-blue-600' : 'bg-gray-50 border-2 border-transparent text-gray-700 active:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{category}</span>
                      {categoryFilter === category && <FaCheck size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setShowFilterModal(false);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold active:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold active:bg-gray-800 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters & Search */}
      <section className="hidden lg:block bg-white border-b border-gray-200 py-12">
        <div className="max-w-[1400px] mx-auto px-3 md:px-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-stretch md:items-center">
            {/* Search - Hidden on mobile */}
            <div className="relative flex-1 max-w-xl hidden md:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {(['all', 'Tech News', 'Events', 'Tutorials', 'Community'] as CategoryFilter[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 md:px-6 py-1.5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                    categoryFilter === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {filteredNews.length} {filteredNews.length === 1 ? 'Article' : 'Articles'}
            </h2>

            <AdminWrapper>
              <button
                onClick={handleAdd}
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <FaPlus size={18} />
                <span>Add News</span>
              </button>
            </AdminWrapper>
          </div>

          {isLoadingData ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <button onClick={fetchNews} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Retry
              </button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedNews(article)}
                >
                  <AdminWrapper>
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(article); }}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingNews(article); }}
                        className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </AdminWrapper>

                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <div className="p-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{article.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaClock size={10} />
                        <span>{article.readTime} min</span>
                      </div>
                      <span>{formatDate(article.publishedDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={editingNews !== null || isAddingNew}
        onClose={() => {
          setEditingNews(null);
          setIsAddingNew(false);
          setFormData({});
        }}
        onSave={handleSave}
        title={isAddingNew ? 'Add News Article' : 'Edit News Article'}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Content *</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full article content"
            />
          </div>

          <ImageUpload
            label="Cover Image"
            value={formData.image || ''}
            onChange={(value) => handleInputChange('image', value)}
            placeholder="Enter image URL"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={formData.category || 'Tech News'}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Tech News</option>
                <option>Events</option>
                <option>Tutorials</option>
                <option>Community</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time (min)</label>
              <input
                type="number"
                value={formData.readTime || 5}
                onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags || ''}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comma separated"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.isFeatured || false}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-900">
              Mark as Featured
            </label>
          </div>
        </div>
      </EditModal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={deletingNews !== null}
        onClose={() => setDeletingNews(null)}
        onConfirm={handleDelete}
        title="Delete News Article"
        message={`Are you sure you want to delete "${deletingNews?.title}"? This action cannot be undone.`}
        isLoading={isLoading}
      />

      {/* Article Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full my-8 flex flex-col animate-scale-in overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Mobile only, top left */}
            <button
              onClick={() => setSelectedNews(null)}
              className="lg:hidden absolute top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
            >
              <FaTimes size={18} className="text-gray-900" />
            </button>

            <div 
              className="overflow-y-auto scrollbar-hide flex-1" 
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 overflow-hidden">
                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold">{selectedNews.category}</span>
                  <h2 className="text-4xl font-bold mt-4 mb-3">{selectedNews.title}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>{selectedNews.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{formatDate(selectedNews.publishedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{selectedNews.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-12">
                <p className="text-xl text-gray-700 font-medium mb-6 leading-relaxed">{selectedNews.excerpt}</p>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedNews.content}</p>
                </div>
                {selectedNews.tags && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3 flex-wrap">
                      <FaTag className="text-gray-400" />
                      {selectedNews.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 bg-white rounded-b-3xl">
              <button
                onClick={() => setSelectedNews(null)}
                className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;

