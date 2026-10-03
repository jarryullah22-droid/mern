export type CustomerStatus = 'Active' | 'Lead' | 'VIP' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  status: CustomerStatus;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
}

export type SortField = 'name' | 'city' | 'email' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  city: string;
  status: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

/* ----------------------------- Auth ---------------------------------- */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
