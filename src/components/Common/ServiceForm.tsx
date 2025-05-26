import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseService } from '../../types';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface ServiceFormProps<T extends BaseService> {
  title: string;
  fields: FormField[];
  initialData?: T;
  onSubmit: (data: any) => Promise<void>;
  isEdit?: boolean;
  onCancel: () => void;
}

function ServiceForm<T extends BaseService>({
  title,
  fields,
  initialData,
  onSubmit,
  isEdit = false,
  onCancel
}: ServiceFormProps<T>) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize with empty values
      const initialFormData: any = {};
      fields.forEach(field => {
        if (field.type === 'number') {
          initialFormData[field.name] = 0;
        } else if (field.type === 'date') {
          initialFormData[field.name] = '';
        } else {
          initialFormData[field.name] = '';
        }
      });
      setFormData(initialFormData);
    }
  }, [initialData, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{isEdit ? `Edit ${title}` : `New ${title}`}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || (field.type === 'number' ? 0 : '')}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                  min={field.type === 'number' ? 0 : undefined}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;