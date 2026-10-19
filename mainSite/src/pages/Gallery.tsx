import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryService, GalleryFolder } from '../services/galleryService';
import { FaImages, FaFolder, FaPlus, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { AdminWrapper } from '../components/admin/AdminWrapper';

const Gallery: React.FC = () => {
  const { isEditMode } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [editingFolder, setEditingFolder] = useState<GalleryFolder | null>(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryService.getAllFolders();
      setFolders(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await galleryService.createFolder(newFolderName, newFolderDesc);
      setShowCreateModal(false);
      setNewFolderName('');
      setNewFolderDesc('');
      loadFolders();
    } catch (e) {
      alert('Failed to create folder');
    }
  };

  const handleEditFolder = async (folder: GalleryFolder) => {
    try {
      await galleryService.updateFolder(folder.id, folder.name, folder.description);
      setEditingFolder(null);
      loadFolders();
    } catch (e) {
      alert('Failed to update folder');
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this folder and all its images?')) return;
    try {
      await galleryService.deleteFolder(id);
      loadFolders();
    } catch (e) {
      alert('Failed to delete folder');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Hero Header */}
      <div className="sticky top-24 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Gallery</h1>
              <p className="text-gray-600 text-sm mt-1">{folders.length} {folders.length === 1 ? 'folder' : 'folders'}</p>
            </div>
            <AdminWrapper>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FaPlus size={16} /> Create Folder
              </button>
            </AdminWrapper>
          </div>
        </div>
      </div>

      {/* Folders Grid - Google Photos Style */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        {folders.length === 0 ? (
          <div className="text-center text-gray-500 py-32">
            <FaFolder className="text-6xl mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold text-gray-900">No folders yet</p>
            <p className="text-sm mt-2">{isEditMode ? 'Create a folder to get started' : 'Check back later for photo folders'}</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-3 gap-8">
            {folders.map((folder) => (
              <div key={folder.id} className="group relative bg-gray-100 rounded-2xl overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all break-inside-avoid mb-6">
                <div 
                  onClick={() => navigate(`/gallery/${folder.id}`)}
                  className="relative"
                >
                  {folder.coverImageUrl ? (
                    <img
                      src={folder.coverImageUrl}
                      alt={folder.name}
                      className="w-full h-auto object-cover rounded-t-xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <FaFolder className="text-6xl text-white/80" />
                    </div>
                  )}
                  <div className="p-4 bg-white">
                    <h3 className="text-gray-900 font-bold text-lg mb-1">{folder.name}</h3>
                    {folder.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{folder.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Admin Actions */}
                <AdminWrapper>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolder(folder);
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </AdminWrapper>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={newFolderDesc}
              onChange={(e) => setNewFolderDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {editingFolder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingFolder(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Edit Folder</h2>
            <input
              type="text"
              value={editingFolder.name}
              onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editingFolder.description || ''}
              onChange={(e) => setEditingFolder({ ...editingFolder, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setEditingFolder(null)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditFolder(editingFolder)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
