import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import formService, { RegistrationForm, FormField } from '../services/formService';

const FormSubmission: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    setLoading(true);
    try {
      const data = await formService.getFormById(Number(id));
      if (!data.isActive) {
        alert('This form is no longer accepting submissions');
        navigate('/events');
        return;
      }
      setForm(data);
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Failed to load form');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }

    if (field.validation) {
      if (field.validation.min && value && value.length < field.validation.min) {
        return field.validation.message || `Minimum ${field.validation.min} characters required`;
      }
      if (field.validation.max && value && value.length > field.validation.max) {
        return field.validation.message || `Maximum ${field.validation.max} characters allowed`;
      }
      if (field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return field.validation.message || 'Invalid format';
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate all fields
    const newErrors: Record<string, string> = {};
    form.formFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Extract email and name from form data
      let submitterEmail = '';
      let submitterName = '';
      
      form.formFields.forEach(field => {
        const value = formData[field.id];
        if (field.type === 'email' && value) {
          submitterEmail = value;
        }
        if ((field.label.toLowerCase().includes('name') || field.type === 'text') && value && !submitterName) {
          submitterName = value;
        }
      });

      await formService.submitForm({
        formId: form.id!,
        submissionData: formData,
        submitterEmail: submitterEmail || undefined,
        submitterName: submitterName || undefined,
      });
      setSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.id];
    const errorClass = hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <textarea
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-3 border ${errorClass} rounded-xl focus:ring-2 focus:border-transparent transition-all`}
            />
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData[field.id]?.includes(option) || false}
                    onChange={(e) => {
                      const current = formData[field.id] || [];
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((v: string) => v !== option);
                      handleInputChange(field.id, newValue);
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`w-full px-4 py-3 border ${errorClass} rounded-xl focus:ring-2 focus:border-transparent transition-all`}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className={`w-full px-4 py-8 border-2 border-dashed ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-xl text-center hover:border-blue-400 transition-all cursor-pointer`}>
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Convert to base64 for storage
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      handleInputChange(field.id, {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: base64String
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id={field.id}
                accept="image/*,.pdf"
              />
              <label htmlFor={field.id} className="cursor-pointer">
                <div className="text-gray-500">
                  {formData[field.id] ? (
                    <div>
                      <p className="font-semibold text-blue-600">{formData[field.id].name}</p>
                      <p className="text-xs text-gray-500">{(formData[field.id].size / 1024).toFixed(2)} KB</p>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className="text-sm">PNG, JPG, PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border ${errorClass} rounded-xl focus:ring-2 focus:border-transparent transition-all`}
            />
            {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );
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

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. We'll get back to you soon.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Image */}
          {form.headerImage && (
            <div className="w-full h-64 overflow-hidden">
              <img
                src={form.headerImage}
                alt={form.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Form Content */}
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{form.title}</h1>
            {form.description && (
              <p className="text-lg text-gray-600 mb-8">{form.description}</p>
            )}

            {/* Submission Info */}
            {form.maxSubmissions && form.submissionCount !== undefined && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>{form.maxSubmissions - form.submissionCount}</strong> spots remaining out of {form.maxSubmissions}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {form.formFields.map(field => renderField(field))}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmission;

