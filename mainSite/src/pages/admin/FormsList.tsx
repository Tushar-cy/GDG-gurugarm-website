import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import formService, { RegistrationForm } from '../../services/formService';
import { DeleteConfirm } from '../../components/admin/DeleteConfirm';

const FormsList: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<RegistrationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingForm, setDeletingForm] = useState<RegistrationForm | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const data = await formService.getAllForms();
      setForms(data);
    } catch (error) {
      console.error('Error loading forms:', error);
      alert('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingForm?.id) return;
    setIsDeleting(true);
    try {
      await formService.deleteForm(deletingForm.id);
      await loadForms();
      setDeletingForm(null);
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Registration Forms</h1>
            <p className="text-gray-600">Manage event registration forms and submissions</p>
          </div>
          <button
            onClick={() => navigate('/admin/forms/new')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            <FaPlus />
            Create New Form
          </button>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">No forms created yet</p>
            <button
              onClick={() => navigate('/admin/forms/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              <FaPlus />
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                {/* Form Header */}
                {form.headerImage && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={form.headerImage}
                      alt={form.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {/* Form Info */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                      {form.title}
                    </h3>
                    <div className="ml-2">
                      {form.isActive ? (
                        <FaToggleOn className="text-green-600" size={24} title="Active" />
                      ) : (
                        <FaToggleOff className="text-gray-400" size={24} title="Inactive" />
                      )}
                    </div>
                  </div>
                  {form.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <FaUsers size={14} />
                      <span className="text-xs font-semibold">Submissions</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {form.submissionCount || 0}
                      {form.maxSubmissions && ` / ${form.maxSubmissions}`}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <FaEdit size={14} />
                      <span className="text-xs font-semibold">Fields</span>
                    </div>
                    <div className="text-lg font-bold text-purple-900">
                      {form.formFields?.length || 0}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/forms/${form.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                    title="View Form"
                  >
                    <FaEye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/admin/forms/${form.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all"
                    title="Edit Form"
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/forms/${form.id}/submissions`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-all"
                    title="View Submissions"
                  >
                    <FaUsers size={14} />
                    {form.submissionCount || 0}
                  </button>
                  <button
                    onClick={() => setDeletingForm(form)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                    title="Delete Form"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={deletingForm !== null}
        onClose={() => setDeletingForm(null)}
        onConfirm={handleDelete}
        title="Delete Form"
        message={`Are you sure you want to delete "${deletingForm?.title}"? All submissions will also be deleted. This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FormsList;

