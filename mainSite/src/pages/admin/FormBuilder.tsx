import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaPlus,
  FaTimes,
  FaGripVertical,
  FaSave,
  FaArrowLeft,
  FaFont,
  FaEnvelope,
  FaPhone,
  FaAlignLeft,
  FaCheckCircle,
  FaDotCircle,
  FaCaretDown,
  FaImage,
  FaCalendar,
  FaHashtag, 
} from 'react-icons/fa';
import formService, { FormField, RegistrationForm } from '../../services/formService';
import { eventService } from '../../services/eventService';

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: FaFont },
  { type: 'email', label: 'Email', icon: FaEnvelope },
  { type: 'phone', label: 'Phone', icon: FaPhone },
  { type: 'number', label: 'Number', icon: FaHashtag },
  { type: 'textarea', label: 'Long Text', icon: FaAlignLeft },
  { type: 'radio', label: 'Radio Buttons', icon: FaDotCircle },
  { type: 'checkbox', label: 'Checkboxes', icon: FaCheckCircle },
  { type: 'select', label: 'Dropdown', icon: FaCaretDown },
  { type: 'date', label: 'Date', icon: FaCalendar },
  { type: 'file', label: 'File Upload', icon: FaImage },
] as const;

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id, eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form metadata
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [linkedEventId, setLinkedEventId] = useState<number | undefined>(undefined);
  const [maxSubmissions, setMaxSubmissions] = useState<number | undefined>(undefined);
  const [closeDate, setCloseDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Form fields
  const [fields, setFields] = useState<FormField[]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
    if (id) {
      loadForm();
    } else if (eventId) {
      setLinkedEventId(Number(eventId));
      loadEventDetails(Number(eventId));
    }
  }, [id, eventId]);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadEventDetails = async (evtId: number) => {
    try {
      const event = await eventService.getEventById(evtId);
      if (event) {
        setFormTitle(`${event.title} - Registration`);
        setHeaderImage(event.image || '');
      }
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  const loadForm = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const form = await formService.getFormById(Number(id));
      setFormTitle(form.title);
      setFormDescription(form.description || '');
      setHeaderImage(form.headerImage || '');
      setLinkedEventId(form.eventId);
      setMaxSubmissions(form.maxSubmissions);
      setCloseDate(form.closeDate || '');
      setIsActive(form.isActive);
      setFields(form.formFields);
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'select' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
    setEditingFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (editingFieldId === id) setEditingFieldId(null);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };

  const saveForm = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field to the form');
      return;
    }

    setSaving(true);
    try {
      const formData: RegistrationForm = {
        title: formTitle,
        description: formDescription,
        eventId: linkedEventId,
        headerImage,
        formFields: fields,
        isActive,
        maxSubmissions,
        closeDate: closeDate || undefined,
      };

      if (id) {
        await formService.updateForm(Number(id), formData);
        alert('Form updated successfully!');
      } else {
        await formService.createForm(formData);
        alert('Form created successfully!');
      }
      navigate('/admin/forms');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/forms')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Back to Forms
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {id ? 'Edit Form' : 'Create New Form'}
          </h1>
          <p className="text-gray-600">
            Build a custom registration form with drag-and-drop fields
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Form Metadata */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Form Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event Registration Form"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Tell users about this form"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Header Image URL
                  </label>
                  <input
                    type="text"
                    value={headerImage}
                    onChange={(e) => setHeaderImage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Link to Event
                  </label>
                  <select
                    value={linkedEventId || ''}
                    onChange={(e) => setLinkedEventId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No event linked</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Max Submissions
                  </label>
                  <input
                    type="number"
                    value={maxSubmissions || ''}
                    onChange={(e) => setMaxSubmissions(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Close Date
                  </label>
                  <input
                    type="date"
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-900">
                    Form is active
                  </label>
                </div>
              </div>
            </div>

            {/* Field Types */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Fields</h3>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_TYPES.map((fieldType) => (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type as FormField['type'])}
                    className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 transition-all"
                  >
                    <fieldType.icon size={14} />
                    <span className="text-xs">{fieldType.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Form Preview</h3>
                <button
                  onClick={saveForm}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Form'}
                </button>
              </div>

              {/* Header Image Preview */}
              {headerImage && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img src={headerImage} alt="Form header" className="w-full h-48 object-cover" />
                </div>
              )}

              {/* Form Title & Description */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {formTitle || 'Untitled Form'}
                </h2>
                {formDescription && (
                  <p className="text-gray-600">{formDescription}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-2">No fields added yet</p>
                    <p className="text-sm">Click on a field type from the left to add it to your form</p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <FieldEditor
                      key={field.id}
                      field={field}
                      index={index}
                      isEditing={editingFieldId === field.id}
                      onEdit={() => setEditingFieldId(field.id)}
                      onUpdate={(updates) => updateField(field.id, updates)}
                      onRemove={() => removeField(field.id)}
                      onMoveUp={() => moveField(index, 'up')}
                      onMoveDown={() => moveField(index, 'down')}
                      canMoveUp={index > 0}
                      canMoveDown={index < fields.length - 1}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field Editor Component
interface FieldEditorProps {
  field: FormField;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  isEditing,
  onEdit,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const renderFieldInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || field.label}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="radio" name={field.id} disabled className="w-4 h-4" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" disabled className="w-4 h-4" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          >
            <option>Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
            <FaImage className="mx-auto mb-2" size={24} />
            <span>Click to upload or drag and drop</span>
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || field.label}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        );
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="flex flex-col gap-1 pt-2">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            ▲
          </button>
          <FaGripVertical className="text-gray-400" />
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            ▼
          </button>
        </div>

        {/* Field Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3 mb-3">
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                placeholder={`Enter ${field.type} field label (e.g., "Full Name", "Email Address")`}
              />
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Placeholder text (optional)"
              />
              {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'select') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Options (one per line)</label>
                  <textarea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(o => o.trim()) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">Required field</span>
              </label>
            </div>
          ) : (
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {field.label || <span className="text-gray-400 italic">Enter field label...</span>}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
            </div>
          )}
          {renderFieldInput()}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={onRemove}
            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;

