import React, { useMemo, useState, useEffect } from 'react';
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaGlobe,
  FaUsers,
  FaCrown,
  FaCode,
  FaRocket,
  FaGraduationCap,
  FaHeart,
  FaFilter,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { AdminWrapper } from '../components/admin/AdminWrapper';
import { EditModal } from '../components/admin/EditModal';
import { DeleteConfirm } from '../components/admin/DeleteConfirm';
import { ImageUpload } from '../components/admin/ImageUpload';
import { teamService, TeamMember } from '../services/teamService';

type TeamFilter = 'all' | 'core' | 'tech' | 'data' | 'sponsorship' | 'events' | 'social' | 'content' | 'graphics' | 'video' | 'community';

const Team = () => {
  const { isEditMode } = useAuth();
  const [filter, setFilter] = useState<TeamFilter>('core');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollFilter, setShowScrollFilter] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Edit/Delete state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  // Fetch members from backend
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle scroll to show/hide filter bar (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setShowScrollFilter(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (editingMember || isAddingNew || deletingMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingMember, isAddingNew, deletingMember]);

  const fetchMembers = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const data = await teamService.getAllTeamMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredMembers = useMemo(() => {
    let filtered = members;

    if (filter !== 'all') {
      filtered = filtered.filter((member) =>
        member.category?.toLowerCase().includes(filter.toLowerCase()) ||
        member.role?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return filtered;
  }, [members, filter]);

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      ...member,
      tags: member.tags || '',
    });
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      role: '',
      description: '',
      avatar: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      tags: '',
      isLeader: false,
      displayOrder: 0,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role || !formData.description) {
      alert('Please fill in all required fields (Name, Role, Description)');
      return;
    }

    setIsLoading(true);
    try {
      const memberData: TeamMember = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        avatar: formData.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name) + '&background=2563eb&color=fff&size=200',
        linkedin: formData.linkedin || '',
        twitter: formData.twitter || '',
        github: formData.github || '',
        website: formData.website || '',
        tags: formData.tags || '',
        isLeader: formData.isLeader || false,
        displayOrder: formData.displayOrder || 0,
      };

      if (isAddingNew) {
        await teamService.createTeamMember(memberData);
      } else if (editingMember && editingMember.id) {
        await teamService.updateTeamMember(editingMember.id, memberData);
      }

      await fetchMembers();
      setEditingMember(null);
      setIsAddingNew(false);
      setFormData({});
    } catch (err) {
      console.error('Error saving team member:', err);
      alert(`Failed to save team member. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember || !deletingMember.id) return;
    setIsLoading(true);
    try {
      await teamService.deleteTeamMember(deletingMember.id);
      await fetchMembers();
      setDeletingMember(null);
    } catch (err) {
      console.error('Error deleting team member:', err);
      alert(`Failed to delete team member. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate dynamic accent color from avatar URL or name
  const getAccentColor = (member: TeamMember) => {
    const colors = [
      { from: 'blue-900', to: 'blue-600', ring: 'blue-500' },
      { from: 'purple-900', to: 'purple-600', ring: 'purple-500' },
      { from: 'pink-900', to: 'pink-600', ring: 'pink-500' },
      { from: 'indigo-900', to: 'indigo-600', ring: 'indigo-500' },
      { from: 'violet-900', to: 'violet-600', ring: 'violet-500' },
      { from: 'fuchsia-900', to: 'fuchsia-600', ring: 'fuchsia-500' },
    ];
    
    // Use member ID or name to consistently assign colors
    const hash = (member.id || member.name).toString().split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const teamStats = [
    { icon: FaUsers, value: members.length, label: 'Team Members', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: FaCrown, value: members.filter(m => m.isLeader).length, label: 'Leaders', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { icon: FaCode, value: members.filter(m => m.role?.toLowerCase().includes('tech')).length, label: 'Developers', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: FaHeart, value: members.filter(m => m.role?.toLowerCase().includes('community')).length, label: 'Community', color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 md:py-20 overflow-hidden">
        {/* Subtle Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10 text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 border border-blue-200 rounded-full">
              <FaUsers size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Our Amazing Team</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 animate-fade-in-up">
            Meet The Team
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Passionate developers, designers, and community builders working together to create impact
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon size={28} className={stat.color} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
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
              {/* Search Bar - iOS style rounded rectangle */}
              <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-gray-100/80 rounded-xl">
                <FaSearch className="text-gray-400" size={16} />
                <span className="text-sm text-gray-500 font-semibold">Search team members...</span>
              </div>
              
              {/* Filter Button - Pill shape */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-5 py-3 bg-purple-600 text-white rounded-xl flex items-center gap-2 font-bold shadow-sm active:scale-95 transition-all"
              >
                <FaFilter size={14} />
                <span className="text-sm">Filter</span>
              </button>
            </div>

            {/* Active Filter Pill - Show when filter is not 'all' */}
            {filter !== 'all' && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full">
                  <span className="text-sm font-bold text-purple-700">
                    {filter === 'core' ? 'GDG Core Team' :
                     filter === 'tech' ? 'Tech Team' :
                     filter === 'sponsorship' ? 'Sponsorship' :
                     filter === 'events' ? 'Events Management' :
                     filter === 'social' ? 'Social Media' :
                     filter === 'content' ? 'Content Team' :
                     filter === 'graphics' ? 'Graphics Design' :
                     filter === 'video' ? 'Video Editing' :
                     filter === 'data' ? 'Data Management' :
                     filter === 'community' ? 'Community' : filter}
                  </span>
                  <button
                    onClick={() => setFilter('all')}
                    className="w-4 h-4 flex items-center justify-center rounded-full bg-purple-200 hover:bg-purple-300 transition-colors"
                  >
                    <FaTimes size={8} className="text-purple-700" />
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
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="p-6 space-y-6">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Category</h4>
                  <span className="text-sm text-gray-500">
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                </div>
                <div className="space-y-2">
                  {([
                    { label: 'All Teams', value: 'all' },
                    { label: 'GDG Core Team', value: 'core' },
                    { label: 'Tech Team', value: 'tech' },
                    { label: 'Data Management', value: 'data' },
                    { label: 'Sponsorship', value: 'sponsorship' },
                    { label: 'Events Management', value: 'events' },
                    { label: 'Social Media', value: 'social' },
                    { label: 'Content Team', value: 'content' },
                    { label: 'Graphics Design', value: 'graphics' },
                    { label: 'Video Editing', value: 'video' },
                    { label: 'Community', value: 'community' },
                  ] as { label: string; value: TeamFilter }[]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                        filter === option.value
                          ? 'bg-purple-50 border-2 border-purple-600 text-purple-600'
                          : 'bg-gray-50 border-2 border-transparent text-gray-700 active:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                      {filter === option.value && <FaCheck size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setFilter('all');
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-gray-900 text-2xl font-bold">Our Team</div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {([
                // { label: 'All', value: 'all' },
                { label: 'Core', value: 'core' },
                { label: 'Tech', value: 'tech' },
                { label: 'Data', value: 'data' },
                { label: 'Sponsor', value: 'sponsorship' },
                { label: 'Events', value: 'events' },
                { label: 'Social', value: 'social' },
                { label: 'Content', value: 'content' },
                { label: 'Graphics', value: 'graphics' },
                { label: 'Video', value: 'video' },
                { label: 'Community', value: 'community' },
              ] as { label: string; value: TeamFilter }[]).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={
                    `px-6 py-3 rounded-full text-sm font-semibold transition-all ` +
                    (filter === tab.value
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'}
            </h2>

            <AdminWrapper>
              <button
                onClick={handleAdd}
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <FaPlus size={18} />
                <span>Add Team Member</span>
              </button>
            </AdminWrapper>
          </div>

          {isLoadingData ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <button onClick={fetchMembers} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Retry
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No team members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {filteredMembers.map((member, index) => {
                const accentColor = getAccentColor(member);
                return (
                <div
                  key={member.id}
                  className={`group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-${accentColor.ring} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up flex flex-col`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    ['--accent-from' as any]: accentColor.from,
                    ['--accent-to' as any]: accentColor.to,
                  }}
                >
                  {/* Admin Controls */}
                  <AdminWrapper>
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(member)}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingMember(member)}
                        className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </AdminWrapper>

                  {/* Avatar Section with Gradient Overlay */}
                  <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                        src={member.avatar}
                        alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                    
                    {/* Gradient Overlay with Dynamic Color */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent group-hover:from-${accentColor.from}/90 group-hover:via-${accentColor.to}/30 transition-all duration-500`}></div>
                    
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* Leader Badge */}
                      {member.isLeader && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-yellow-500/95 text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-yellow-400/30">
                          <FaCrown size={12} />
                          <span>Leader</span>
                        </div>
                      </div>
                    )}

                    {/* Name Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-10">
                      <h3 className="text-base md:text-2xl font-bold text-white mb-1 drop-shadow-lg">
                          {member.name}
                      </h3>
                      <div className="px-2 md:px-3 py-0.5 md:py-1 inline-block rounded-full bg-white/90 backdrop-blur-md text-blue-700 text-[10px] md:text-xs font-bold">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex flex-col flex-1 bg-white relative">
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* Description */}
                    <div className="relative z-10 mb-4">
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 min-h-[2.5rem] md:min-h-[3.75rem]">
                      {member.description}
                      </p>
                    </div>

                    {/* Social Links - Always at bottom with consistent spacing */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 min-h-[2.25rem]">
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaLinkedin size={14} className="md:w-4 md:h-4" />
                          </a>
                        )}
                        {member.twitter && (
                          <a 
                            href={member.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaTwitter size={14} className="md:w-4 md:h-4" />
                          </a>
                        )}
                        {member.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGithub size={14} className="md:w-4 md:h-4" />
                          </a>
                        )}
                        {member.website && (
                          <a 
                            href={member.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGlobe size={14} className="md:w-4 md:h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={editingMember !== null || isAddingNew}
        onClose={() => {
          setEditingMember(null);
          setIsAddingNew(false);
          setFormData({});
        }}
        onSave={handleSave}
        title={isAddingNew ? 'Add Team Member' : 'Edit Team Member'}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter member name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Role *</label>
            <input
              type="text"
              value={formData.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Tech Lead, Event Coordinator"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description about the member"
            />
          </div>

          <ImageUpload
            label="Avatar Photo"
            value={formData.avatar || ''}
            onChange={(value) => handleInputChange('avatar', value)}
            placeholder="Enter avatar URL or upload photo"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">LinkedIn</label>
              <input
                type="text"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LinkedIn URL"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Twitter</label>
              <input
                type="text"
                value={formData.twitter || ''}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Twitter URL"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">GitHub</label>
              <input
                type="text"
                value={formData.github || ''}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="GitHub URL"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Personal website"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. React, Node.js, UI/UX (comma separated)"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="leader"
                checked={formData.isLeader || false}
                onChange={(e) => handleInputChange('isLeader', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="leader" className="text-sm font-semibold text-gray-900">
                Mark as Leader
              </label>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </EditModal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={deletingMember !== null}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message={`Are you sure you want to remove "${deletingMember?.name}" from the team? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Team;
