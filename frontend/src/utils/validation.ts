import { CustomerFormData, FormErrors } from '../types/customer';

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,15}$/;

export function validateCustomerField(field: keyof CustomerFormData, value: string): string | undefined {
  const trimmed = (value || '').trim();

  switch (field) {
    case 'name':
      if (!trimmed) {
        return 'Customer name is required';
      }
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters long';
      }
      if (trimmed.length > 70) {
        return 'Name cannot exceed 70 characters';
      }
      return undefined;

    case 'email':
      if (!trimmed) {
        return 'Email address is required';
      }
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address (e.g., ali.khan@gmail.com)';
      }
      return undefined;

    case 'phone':
      if (!trimmed) {
        return 'Phone number is required';
      }
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        return 'Phone number must contain at least 7 digits';
      }
      if (digitsOnly.length > 15) {
        return 'Phone number is too long (maximum 15 digits)';
      }
      if (!phoneRegex.test(trimmed)) {
        return 'Please enter a valid phone number (e.g., +92 300 1234567 or 0300-1234567)';
      }
      return undefined;

    case 'city':
      if (!trimmed) {
        return 'City is required';
      }
      if (trimmed.length < 2) {
        return 'City must be at least 2 characters long';
      }
      if (trimmed.length > 50) {
        return 'City name cannot exceed 50 characters';
      }
      return undefined;

    default:
      return undefined;
  }
}

export function validateCustomerForm(data: CustomerFormData): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  const nameError = validateCustomerField('name', data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateCustomerField('email', data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateCustomerField('phone', data.phone);
  if (phoneError) errors.phone = phoneError;

  const cityError = validateCustomerField('city', data.city);
  if (cityError) errors.city = cityError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
