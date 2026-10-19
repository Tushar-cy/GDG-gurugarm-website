import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaFilter, FaEdit, FaTrash, FaPlus, FaImage, FaCheck, FaTimes, FaExternalLinkAlt, FaWpforms } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { AdminWrapper } from '../components/admin/AdminWrapper';
import { EditModal } from '../components/admin/EditModal';
import { DeleteConfirm } from '../components/admin/DeleteConfirm';
import { eventService, Event } from '../services/eventService';

type StatusFilter = 'all' | 'UPCOMING' | 'ONGOING' | 'PAST';
type CategoryFilter = 'all' | 'Workshop' | 'Hackathon' | 'Meetup' | 'Conference';

const Events = () => {
  const { isEditMode } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollFilter, setShowScrollFilter] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Edit/Delete state
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({});

  // View Details state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle scroll to show/hide filter bar
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollFilter(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (editingEvent || isAddingNew || deletingEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingEvent, isAddingNew, deletingEvent]);

  const fetchEvents = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter.toUpperCase());
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [events, searchQuery, statusFilter, categoryFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData(event);
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: 'Workshop',
      status: 'UPCOMING',
      image: '',
      logo: '',
      link: '',
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      alert('Please fill in all required fields (Title, Description, Date, Location)');
      return;
    }

    setIsLoading(true);
    try {
      const eventData: Event = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        category: formData.category || 'Workshop',
        status: formData.status || 'UPCOMING',
        image: formData.image || '',
        logo: formData.logo || '',
        link: formData.link || '',
      };

      if (isAddingNew) {
        await eventService.createEvent(eventData);
      } else if (editingEvent && editingEvent.id) {
        await eventService.updateEvent(editingEvent.id, eventData);
      }
      
      await fetchEvents();
      setEditingEvent(null);
      setIsAddingNew(false);
      setFormData({});
    } catch (err) {
      console.error('Error saving event:', err);
      alert(`Failed to save event. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent || !deletingEvent.id) return;
    setIsLoading(true);
    try {
      await eventService.deleteEvent(deletingEvent.id);
      await fetchEvents();
      setDeletingEvent(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Failed to delete event. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float-medium"></div>

        <div className="max-w-[1400px] mx-auto px-8 py-20 lg:py-24 relative z-10">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-purple-100/50 backdrop-blur-sm rounded-full text-purple-600 text-sm font-medium mb-6 animate-fade-in">
              Upcoming Events
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Join Our Events
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-lg lg:text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Discover workshops, hackathons, and meetups designed to help you grow as a developer.
            </p>
          </div>
        </div>
      </section>

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
                <span className="text-sm text-gray-500 font-semibold">Search events...</span>
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-bold shadow-sm active:scale-95 transition-all"
              >
                <FaFilter size={14} />
                <span className="text-sm">Filter</span>
              </button>
            </div>
            {(statusFilter !== 'all' || categoryFilter !== 'all') && (
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                {statusFilter !== 'all' && (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full">
                    <span className="text-sm font-bold text-purple-700">{statusFilter}</span>
                    <button onClick={() => setStatusFilter('all')} className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-200 hover:bg-purple-300 transition-colors">
                      <FaTimes size={10} className="text-purple-700" />
                    </button>
                  </div>
                )}
                {categoryFilter !== 'all' && (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                    <span className="text-sm font-bold text-blue-700">{categoryFilter}</span>
                    <button onClick={() => setCategoryFilter('all')} className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors">
                      <FaTimes size={10} className="text-blue-700" />
                    </button>
                  </div>
                )}
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
              <h3 className="text-xl font-bold text-gray-900">Filter Events</h3>
              <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Status</h4>
                  <span className="text-sm text-gray-500">{statusFilter === 'all' ? 'All' : statusFilter}</span>
                </div>
                <div className="space-y-2">
                  {(['all', 'UPCOMING', 'ONGOING', 'PAST'] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all capitalize ${
                        statusFilter === status ? 'bg-purple-50 border-2 border-purple-600 text-purple-600' : 'bg-gray-50 border-2 border-transparent text-gray-700 active:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{status}</span>
                      {statusFilter === status && <FaCheck size={16} />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Category</h4>
                  <span className="text-sm text-gray-500">{categoryFilter === 'all' ? 'All' : categoryFilter}</span>
                </div>
                <div className="space-y-2">
                  {(['all', 'Workshop', 'Hackathon', 'Meetup', 'Conference'] as CategoryFilter[]).map((category) => (
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
                  setStatusFilter('all');
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

      {/* Desktop Filter - Hidden on mobile */}
      <section className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-10">
          <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaSearch size={18} className="text-blue-600" />
                </div>
                <div className="text-gray-900 text-lg font-bold">Search Events</div>
              </div>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaFilter size={18} className="text-purple-600" />
                  </div>
                  <div className="text-gray-900 text-lg font-bold">Status</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(['all', 'UPCOMING', 'ONGOING', 'PAST'] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={
                        `px-6 py-3 rounded-full text-sm font-semibold transition-all capitalize ` +
                        (statusFilter === status ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaFilter size={18} className="text-blue-600" />
                  </div>
                  <div className="text-gray-900 text-lg font-bold">Category</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(['all', 'Workshop', 'Hackathon', 'Meetup', 'Conference'] as CategoryFilter[]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={
                        `px-6 py-3 rounded-full text-sm font-semibold transition-all ` +
                        (categoryFilter === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
            </h2>
            
            {/* Add New Button */}
            <AdminWrapper>
              <button
                onClick={handleAdd}
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <FaPlus size={18} />
                <span>Add New Event</span>
              </button>
            </AdminWrapper>
          </div>

          {isLoadingData ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up flex flex-col h-full cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Admin Controls Overlay */}
                <AdminWrapper>
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(event)}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingEvent(event)}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </AdminWrapper>

                {/* Image Section */}
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      // Fallback to a neutral GDG image once
                      const fallback = 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/GDG%20Cloud.png';
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  {/* Event Logo */}
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-xl p-2 shadow-lg z-10 flex items-center justify-center">
                    <img
                      src={event.logo}
                      alt="Event Logo"
                      loading="lazy"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        // Small neutral fallback icon
                        const fallbackLogo = 'https://www.gstatic.com/images/branding/product/2x/google_developers_64dp.png';
                        if (target.src !== fallbackLogo) {
                          target.src = fallbackLogo;
                        }
                      }}
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-4 py-2 rounded-full backdrop-blur-md bg-white/90 text-gray-900 text-xs font-bold shadow-lg capitalize">
                      {event.status}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col gap-4 flex-1 relative min-h-[260px]">
                  <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  <div className="relative z-10">
                    <div className="mb-2">
                      <div className="px-4 py-1.5 inline-block rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-xs font-bold">
                        {event.category}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 min-h-[64px] line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="mt-1 text-gray-600 leading-relaxed text-[15px] line-clamp-2 md:line-clamp-3 min-h-[48px] md:min-h-[72px]">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt size={14} className="text-blue-600" />
                        </div>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt size={14} className="text-purple-600" />
                        </div>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - pinned at bottom */}
                  <div className="relative z-10 mt-auto pt-4">
                    {event.status === 'PAST' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/gallery'); }}
                        className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all"
                      >
                        View Gallery
                      </button>
                    ) : event.registrationFormId ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/forms/${event.registrationFormId}`); }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Enroll
                      </button>
                    ) : event.link ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
                      >
                        Register Now
                        <FaExternalLinkAlt size={14} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Details Bottom Sheet / Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end lg:items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div
            className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FaTimes size={14} className="text-gray-700" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              <div className="relative h-64 overflow-hidden">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 text-gray-900 text-xs font-bold shadow capitalize">
                  {selectedEvent.status}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt /> <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt /> <span>{selectedEvent.location}</span>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-gray-200 bg-white">
              {selectedEvent.status === 'PAST' ? (
                <button onClick={() => navigate('/gallery')} className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">View Gallery</button>
              ) : selectedEvent.registrationFormId ? (
                <button onClick={() => navigate(`/forms/${selectedEvent.registrationFormId}`)} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors">Enroll</button>
              ) : selectedEvent.link ? (
                <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Register Now <FaExternalLinkAlt size={14} />
                </a>
              ) : (
                <button disabled className="w-full px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">Coming Soon</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={editingEvent !== null || isAddingNew}
        onClose={() => {
          setEditingEvent(null);
          setIsAddingNew(false);
        }}
        onSave={handleSave}
        title={isAddingNew ? 'Add New Event' : 'Edit Event'}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
              <select
                value={formData.category || 'Workshop'}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
              <select
                value={formData.status || 'UPCOMING'}
                onChange={(e) => handleInputChange('status', e.target.value as Event['status'])}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="PAST">Past</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaImage size={16} className="text-blue-600" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaImage size={16} className="text-purple-600" />
              Event Logo URL
            </label>
            <input
              type="url"
              value={formData.logo || ''}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="https://example.com/logo.svg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Registration Link</label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => handleInputChange('link', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="https://gdg.community.dev/..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaImage size={16} className="text-green-600" />
              Gallery Images (URLs, comma-separated)
            </label>
            <textarea
              value={(formData.images || []).join(', ')}
              onChange={(e) => setFormData((prev) => ({ ...prev, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">These images show in the event detail and the sitewide Gallery.</p>
          </div>
        </div>
      </EditModal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={deletingEvent !== null}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDelete}
        title="Delete Event?"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Events; 
