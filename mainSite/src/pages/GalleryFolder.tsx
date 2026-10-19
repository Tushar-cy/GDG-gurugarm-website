import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { galleryService, GalleryFolder, GalleryImage } from '../services/galleryService';
import { FaImages, FaDownload, FaTrash, FaTimes, FaUpload } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { AdminWrapper } from '../components/admin/AdminWrapper';
import { FaArrowLeft } from 'react-icons/fa';
import { Toast } from '../components/Toast';

const GalleryFolderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isEditMode } = useAuth();
  const [folder, setFolder] = useState<GalleryFolder | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadFolderData();
    }
  }, [id]);

  const loadFolderData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const folderData = await galleryService.getFolder(parseInt(id));
      const imagesData = await galleryService.getFolderImages(parseInt(id));
      setFolder(folderData);
      setImages(imagesData);
    } catch (e) {
      console.error(e);
      setError('Failed to load folder');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;

    const fileArray = Array.from(files);
    setToast({ message: `Uploading ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}...`, type: 'info' });

    try {
      const result = await galleryService.uploadImages(parseInt(id), fileArray);
      setToast({ message: `Successfully uploaded ${result.count} image${result.count > 1 ? 's' : ''}`, type: 'success' });
      loadFolderData();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setToast({ message: 'Failed to upload images', type: 'error' });
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryService.deleteImage(imageId);
      setToast({ message: 'Image deleted successfully', type: 'success' });
      loadFolderData();
    } catch (err) {
      setToast({ message: 'Failed to delete image', type: 'error' });
    }
  };

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = encodeURI(image.imageUrl);
    link.download = image.fileName || 'image';
    link.click();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === 'Escape') {
      setSelectedIndex(null);
    } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, images.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">{error || 'Folder not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="sticky top-24 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/gallery')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft /> Back to Gallery
            </button>
            <AdminWrapper>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg"
              >
                <FaUpload /> Upload Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </AdminWrapper>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{folder.name}</h1>
          {folder.description && (
            <p className="text-gray-600 mt-2">{folder.description}</p>
          )}
          <p className="text-gray-600 text-sm mt-1">{images.length} {images.length === 1 ? 'photo' : 'photos'}</p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        {images.length === 0 ? (
          <div className="text-center text-gray-500 py-32">
            <FaImages className="text-6xl mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold text-gray-900">No photos yet</p>
            {isEditMode && (
              <p className="text-sm mt-2">Upload images to get started</p>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative bg-gray-100 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all break-inside-avoid mb-6"
                onClick={() => setSelectedIndex(idx)}
              >
                <img
                  src={encodeURI(img.imageUrl)}
                  alt={img.fileName || 'Image'}
                  className="w-full h-auto object-cover rounded-2xl"
                  loading="lazy"
                  onLoad={() => console.log('Image loaded:', img.imageUrl)}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    console.error('Image failed to load:', img.imageUrl, 'Encoded:', encodeURI(img.imageUrl));
                    target.style.display = 'none';
                  }}
                />
                
                {/* Admin Actions */}
                <AdminWrapper>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg backdrop-blur-sm"
                    >
                      <FaDownload size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img.id);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg backdrop-blur-sm"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </AdminWrapper>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all z-50"
          >
            <FaTimes className="text-white text-xl" />
          </button>

          {/* Navigation Arrows */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
              className="absolute left-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all z-50"
            >
              <ChevronLeftIcon className="text-white w-8 h-8" />
            </button>
          )}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
              className="absolute right-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all z-50"
            >
              <ChevronRightIcon className="text-white w-8 h-8" />
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(images[selectedIndex]);
            }}
            className="absolute bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all z-50"
          >
            <FaDownload className="text-white text-xl" />
          </button>

          {/* Image */}
          <div className="max-w-[95vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={encodeURI(images[selectedIndex].imageUrl)}
              alt={images[selectedIndex].fileName || 'Photo'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-full text-white text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryFolderPage;

