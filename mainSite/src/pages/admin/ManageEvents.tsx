import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: string;
  image: string;
  logo: string;
}

const ManageEvents = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'workshop',
    status: 'upcoming',
    image: '',
    logo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('Creating event:', formData);
    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: 'workshop',
      status: 'upcoming',
      image: '',
      logo: '',
    });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Events</h1>
            <p className="text-gray-600">Create, edit, and manage your GDG events</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            {isAdding ? <FaTimes /> : <FaPlus />}
            {isAdding ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {/* Add Event Form */}
        {isAdding && (
          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 mb-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="e.g., Salesforce AI Builders Day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="https://... (16:9 aspect ratio recommended)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="https://... (Square logo recommended)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="e.g., Gurugram University, Main Auditorium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="talk">Talk</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <FaSave />
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Guide</h3>
          <div className="space-y-3 text-gray-600">
            <p>• <strong>Add Event:</strong> Click the "Add Event" button to create a new event</p>
            <p>• <strong>Event Cards:</strong> All cards have a fixed 16:9 aspect ratio for consistency</p>
            <p>• <strong>Layout:</strong> Cards are aligned to 1400px max-width, matching the GDG GUG logo alignment</p>
            <p>• <strong>Spacing:</strong> 32px (gap-8) between cards for a clean, uncluttered look</p>
            <p>• <strong>Backend Integration:</strong> Connect this form to your Spring Boot API endpoints</p>
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-xl">
            <p className="text-sm font-semibold text-blue-900">
              💡 Tip: Image URLs should be from a CDN or cloud storage for best performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
