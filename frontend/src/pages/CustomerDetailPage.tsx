import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  Copy,
  Check,
  CalendarDays,
  AlertCircle,
} from 'lucide-react';
import { Customer, CustomerFormData, CustomerStatus } from '../types/customer';
import { fetchCustomer, updateCustomer, deleteCustomer } from '../lib/api';
import { AppHeader } from '../components/AppHeader';
import { CustomerModal } from '../components/CustomerModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from '../components/Toast';

const STATUS_STYLES: Record<CustomerStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lead: 'bg-sky-50 text-sky-700 border-sky-200',
  VIP: 'bg-amber-50 text-amber-700 border-amber-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const tid = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id: tid, type, title, description }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== tid)), 4000);
  };
  const dismissToast = (tid: string) => setToasts((prev) => prev.filter((t) => t.id !== tid));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await fetchCustomer(id as string);
        if (!cancelled) setCustomer(data);
      } catch (err) {
        if (!cancelled) setLoadError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async (formData: CustomerFormData) => {
    if (!customer) return;
    const updated: Customer = {
      ...customer,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      status: formData.status || 'Active',
    };
    setCustomer(updated);
    setIsEditOpen(false);
    try {
      await updateCustomer(customer.id, formData);
      addToast('success', 'Customer Updated', `${updated.name} updated successfully.`);
    } catch (err) {
      addToast('error', 'Update Failed', (err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    const { id: cid, name } = customer;
    setIsDeleteOpen(false);
    try {
      await deleteCustomer(cid);
      addToast('success', 'Customer Deleted', `${name} deleted successfully.`);
      navigate('/', { replace: true });
    } catch (err) {
      addToast('error', 'Delete Failed', (err as Error).message);
    }
  };

  const handleCopy = () => {
    if (!customer) return;
    const text = `Customer: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nCity: ${customer.city}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials =
    customer?.name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'CU';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <AppHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to customers</span>
        </Link>

        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 flex items-center justify-center text-sm text-slate-500">
            <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mr-3" />
            Loading customer…
          </div>
        )}

        {!loading && loadError && (
          <div className="bg-white rounded-xl border border-rose-200 p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Customer not found</h2>
              <p className="text-xs text-slate-500 mt-1">{loadError}</p>
              <Link
                to="/"
                className="inline-block mt-3 text-xs font-semibold text-slate-900 hover:underline"
              >
                Return to the customer list
              </Link>
            </div>
          </div>
        )}

        {!loading && customer && (
          <>
            {/* Header card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-semibold text-lg flex items-center justify-center shadow-xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 truncate">{customer.name}</h1>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{customer.city}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${
                    STATUS_STYLES[customer.status] || STATUS_STYLES.Active
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              {/* Details grid */}
              <div className="p-6 grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </div>
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline break-all"
                  >
                    {customer.email}
                  </a>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </div>
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-sm font-medium font-mono tabular-nums text-slate-900 hover:text-blue-600 hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{customer.city}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date Added</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(customer.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy contact info'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Customer</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <CustomerModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        customerToEdit={customer}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        customer={customer}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
