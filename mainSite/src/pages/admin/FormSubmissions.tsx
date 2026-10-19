import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaDownload, FaEye, FaUpload } from 'react-icons/fa';
import formService, { RegistrationForm, FormSubmission } from '../../services/formService';
import { DeleteConfirm } from '../../components/admin/DeleteConfirm';

const FormSubmissions: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSubmission, setDeletingSubmission] = useState<FormSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadFormAndSubmissions();
    }
  }, [id]);

  const loadFormAndSubmissions = async () => {
    setLoading(true);
    try {
      const [formData, submissionsData] = await Promise.all([
        formService.getFormById(Number(id)),
        formService.getSubmissionsByFormId(Number(id))
      ]);
      setForm(formData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading form and submissions:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubmission?.id) return;
    setIsDeleting(true);
    try {
      await formService.deleteSubmission(deletingSubmission.id);
      await loadFormAndSubmissions();
      setDeletingSubmission(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    // Get all field labels
    const headers = ['Submitted At', 'Name', 'Email', ...form.formFields.map(f => f.label)];
    
    // Build CSV rows
    const rows = submissions.map(sub => {
      const row = [
        new Date(sub.submittedAt || '').toLocaleString(),
        sub.submitterName || '',
        sub.submitterEmail || '',
        ...form.formFields.map(field => {
          const value = sub.submissionData[field.id];
          if (Array.isArray(value)) return value.join('; ');
          if (typeof value === 'object' && value?.name) return value.name; // Handle file uploads
          return value || '';
        })
      ];
      return row.map(cell => `"${cell}"`).join(',');
    });

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        
        if (lines.length < 2) {
          alert('CSV file is empty or invalid');
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        // Verify headers match form fields
        const expectedHeaders = ['Submitted At', 'Name', 'Email', ...form.formFields.map(f => f.label)];
        const headerMismatch = expectedHeaders.some((h, i) => headers[i] !== h);
        
        if (headerMismatch) {
          if (!confirm('CSV headers don\'t match form fields. Continue anyway?')) {
            return;
          }
        }

        // Parse rows
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
          
          if (values.length < 3) continue;

          // Build submission data
          const submissionData: Record<string, any> = {};
          const submitterName = values[1];
          const submitterEmail = values[2];

          // Map remaining values to form fields
          form.formFields.forEach((field, index) => {
            const value = values[index + 3];
            if (value) {
              if (field.type === 'checkbox' || field.type === 'radio') {
                submissionData[field.id] = field.type === 'checkbox' ? value.split('; ') : value;
              } else {
                submissionData[field.id] = value;
              }
            }
          });

          // Submit
          try {
            await formService.submitForm({
              formId: form.id!,
              submissionData,
              submitterName: submitterName || undefined,
              submitterEmail: submitterEmail || undefined,
            });
            successCount++;
          } catch (error) {
            console.error('Error importing row:', error);
            errorCount++;
          }
        }

        alert(`Import complete!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
        await loadFormAndSubmissions();
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Form not found</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{form.title}</h1>
              <p className="text-gray-600">
                {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
              </p>
            </div>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
                id="csv-import"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                <FaUpload />
                Import CSV
              </button>
              {submissions.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                >
                  <FaDownload />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-600">No submissions yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(submission.submittedAt || '').toLocaleDateString()} at{' '}
                        {new Date(submission.submittedAt || '').toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {submission.submitterName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {submission.submitterEmail || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewingSubmission(submission)}
                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingSubmission(submission)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Submission Modal */}
      {viewingSubmission && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={() => setViewingSubmission(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Submission Details</h3>
              <button
                onClick={() => setViewingSubmission(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">Submitted At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(viewingSubmission.submittedAt || '').toLocaleString()}
                </p>
              </div>

              {form.formFields.map(field => {
                const value = viewingSubmission.submissionData[field.id];
                return (
                  <div key={field.id} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                    <p className="font-semibold text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : value || '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={deletingSubmission !== null}
        onClose={() => setDeletingSubmission(null)}
        onConfirm={handleDelete}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FormSubmissions;

