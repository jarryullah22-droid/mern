import { Customer, CustomerFormData, User, AuthResponse } from '../types/customer';

// Base URL of the backend API.
//
// In production the frontend and the Express API are two separate Vercel
// projects, so the API base MUST point at the backend deployment. Set
// VITE_API_URL in the frontend project's Vercel env vars; the value below is a
// safe fallback to the deployed backend so a missing env var never sends login
// requests to the wrong host.
const DEFAULT_API_BASE = 'https://mern-kappa-liart.vercel.app';
const RAW_BASE = ((import.meta.env.VITE_API_URL as string | undefined) || DEFAULT_API_BASE).trim();
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
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...init,
    });
  } catch {
    // Network / DNS / CORS failures land here — surface a clearer message.
    throw new ApiError(
      `Cannot reach the API at "${API_BASE}". Check VITE_API_URL and that the backend is running.`,
      0
    );
  }

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
