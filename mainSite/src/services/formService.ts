import { API_BASE_URL } from '../config/api';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'file' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For radio, checkbox, select
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface RegistrationForm {
  id?: number;
  _id?: string;
  title: string;
  description?: string;
  eventId?: number;
  headerImage?: string;
  formFields: FormField[];
  isActive: boolean;
  maxSubmissions?: number;
  submissionCount?: number;
  closeDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormSubmission {
  id?: number;
  _id?: string;
  formId: number;
  submissionData: Record<string, any>;
  submitterEmail?: string;
  submitterName?: string;
  submittedAt?: string;
}

const formService = {
  // Get all forms
  getAllForms: async (): Promise<RegistrationForm[]> => {
    const response = await fetch(`${API_BASE_URL}/forms`);
    if (!response.ok) throw new Error('Failed to fetch forms');
    const data = await response.json();
    return data.map((form: any) => ({
      ...form,
      formFields: typeof form.formFields === 'string' ? JSON.parse(form.formFields) : form.formFields
    }));
  },

  // Get form by ID
  getFormById: async (id: number): Promise<RegistrationForm> => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch form');
    const data = await response.json();
    return {
      ...data,
      formFields: typeof data.formFields === 'string' ? JSON.parse(data.formFields) : data.formFields
    };
  },

  // Get form by event ID
  getFormByEventId: async (eventId: number): Promise<RegistrationForm | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/forms/event/${eventId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch form');
      }
      const data = await response.json();
      return {
        ...data,
        formFields: typeof data.formFields === 'string' ? JSON.parse(data.formFields) : data.formFields
      };
    } catch (error) {
      console.error('Error fetching form by event ID:', error);
      return null;
    }
  },

  // Create form
  createForm: async (form: RegistrationForm): Promise<RegistrationForm> => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        formFields: JSON.stringify(form.formFields)
      })
    });
    if (!response.ok) throw new Error('Failed to create form');
    const data = await response.json();
    return {
      ...data,
      formFields: typeof data.formFields === 'string' ? JSON.parse(data.formFields) : data.formFields
    };
  },

  // Update form
  updateForm: async (id: number, form: RegistrationForm): Promise<RegistrationForm> => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        formFields: JSON.stringify(form.formFields)
      })
    });
    if (!response.ok) throw new Error('Failed to update form');
    const data = await response.json();
    return {
      ...data,
      formFields: typeof data.formFields === 'string' ? JSON.parse(data.formFields) : data.formFields
    };
  },

  // Delete form
  deleteForm: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete form');
  },

  // Submit form
  submitForm: async (submission: FormSubmission): Promise<FormSubmission> => {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        submissionData: JSON.stringify(submission.submissionData)
      })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to submit form');
    }
    const data = await response.json();
    return {
      ...data,
      submissionData: typeof data.submissionData === 'string' ? JSON.parse(data.submissionData) : data.submissionData
    };
  },

  // Get submissions for a form
  getSubmissionsByFormId: async (formId: number): Promise<FormSubmission[]> => {
    const response = await fetch(`${API_BASE_URL}/submissions/form/${formId}`);
    if (!response.ok) throw new Error('Failed to fetch submissions');
    const data = await response.json();
    return data.map((sub: any) => ({
      ...sub,
      submissionData: typeof sub.submissionData === 'string' ? JSON.parse(sub.submissionData) : sub.submissionData
    }));
  },

  // Delete submission
  deleteSubmission: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete submission');
  },

  // Get submission count
  getSubmissionCount: async (formId: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/submissions/form/${formId}/count`);
    if (!response.ok) throw new Error('Failed to fetch submission count');
    return await response.json();
  }
};

export default formService;

