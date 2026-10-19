import React, { useState } from 'react';
import { PhotoIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter image URL or upload file',
}) => {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            uploadMode === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <LinkIcon className="h-4 w-4" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            uploadMode === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <PhotoIcon className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* Input Area */}
      {uploadMode === 'url' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label}`}
          />
          <label
            htmlFor={`file-upload-${label}`}
            className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <PhotoIcon className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">
              Click to upload or drag and drop
            </span>
          </label>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">Preview</div>
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl('')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

