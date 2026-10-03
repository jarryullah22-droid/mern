import { Customer, CustomerFormData, User, AuthResponse } from '../types/customer';

// In production the Express server hosts both the API and the built frontend,
// so a relative path works. During local dev (Vite on :3000, API on :3001) set
// VITE_API_URL in your .env, or rely on the dev proxy in vite.config.ts.
const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '';
const API_BASE = RAW_BASE.replace(/\/$/, '');

const TOKEN_KEY = 'customerhub_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/* ------------------------------- Auth -------------------------------- */
export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function fetchMe(): Promise<User> {
  return request<User>('/api/auth/me');
}

/* ----------------------------- Customers ----------------------------- */
/** Fetch all customers from MongoDB via the Express API. */
export function fetchCustomers(): Promise<Customer[]> {
  return request<Customer[]>('/api/customers');
}

/** Fetch a single customer by id. */
export function fetchCustomer(id: string): Promise<Customer> {
  return request<Customer>(`/api/customers/${encodeURIComponent(id)}`);
}

/** Create a customer. */
export function createCustomer(customer: Customer): Promise<Customer> {
  return request<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
}

/** Update an existing customer by id. */
export function updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
  return request<Customer>(`/api/customers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Delete a single customer by id. */
export function deleteCustomer(id: string): Promise<void> {
  return request<void>(`/api/customers/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** Delete several customers at once. */
export function deleteCustomersBulk(ids: string[]): Promise<{ deleted: number }> {
  return request<{ deleted: number }>('/api/customers/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
