import React, { useState, useEffect } from 'react';
import { Customer, CustomerFormData, FormErrors } from '../types/customer';
import { validateCustomerField, validateCustomerForm } from '../utils/validation';
import { X, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormData) => void;
  customerToEdit?: Customer | null;
}

const INITIAL_FORM: CustomerFormData = {
  name: '',
  phone: '',
  email: '',
  city: '',
  status: 'Active',
};

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        name: customerToEdit.name,
        phone: customerToEdit.phone,
        email: customerToEdit.email,
        city: customerToEdit.city,
        status: customerToEdit.status || 'Active',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
    setTouched({});
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateCustomerField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof CustomerFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateCustomerField(field, formData[field] as string);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      email: true,
      city: true,
    });

    const validation = validateCustomerForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    onSave(formData);
  };

  const isEditing = Boolean(customerToEdit);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-slate-900">
              {isEditing ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update customer details and contact information.'
                : 'Enter customer name, phone, email, and city.'}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., Muhammad Ali"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.name && touched.name
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                }`}
                autoFocus
              />
            </div>
            {errors.name && touched.name && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="e.g., ali.khan@gmail.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.email && touched.email
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="e.g., 0300-1234567 or +92 300 1234567"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.phone && touched.phone
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                }`}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              City <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="e.g., Lahore"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.city && touched.city
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                }`}
              />
            </div>
            {errors.city && touched.city && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
