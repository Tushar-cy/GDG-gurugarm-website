import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = '200px',
  disabled = false,
  readOnly = false,
}) => {
  // Quill modules to attach to editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill editor formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'clean',
  ];

  return (
    <div>
      <div className="text-sm font-medium text-gray-900 mb-2">
        Content Editor
      </div>
      <div
        className={`border rounded-lg overflow-hidden transition-all duration-200 ${
          disabled ? 'border-gray-300' : 'border-gray-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-200'
        }`}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{
            height: height,
            fontSize: '14px',
          }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Use the toolbar above to format your content. You can add links, images, and videos.
      </div>
    </div>
  );
};

export default RichTextEditor; 