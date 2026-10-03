import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Customer,
  CustomerFormData,
  SortField,
  SortOrder,
} from '../types/customer';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteCustomersBulk,
} from '../lib/api';
import { AppHeader } from '../components/AppHeader';
import { FilterBar } from '../components/FilterBar';
import { StatsBar } from '../components/StatsBar';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerCards } from '../components/CustomerCards';
import { CustomerModal } from '../components/CustomerModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from '../components/Toast';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'customerhub_customers_live_v2';

/** Build a compact page-number list, e.g. 1 … 4 5 6 … 20 */
function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters + pagination live in the URL, so the browser back button and the
  // details page can both return to the exact same view.
  const searchQuery = searchParams.get('q') || '';
  const cityFilter = searchParams.get('city') || '';
  const statusFilter = searchParams.get('status') || '';
  const pageSize = Math.max(1, Number(searchParams.get('size')) || 10);
  const sortBy = (searchParams.get('sortBy') as SortField) || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

  const patchParams = (patch: Record<string, string | null>, resetPage = false) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    if (resetPage) next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load customers from storage:', e);
    }
    return [];
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Keep an offline cache of the last known list.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [customers]);

  // Load customers from the MongoDB-backed API on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCustomers();
        if (!cancelled) {
          setCustomers(data);
          addToast('success', 'Connected to MongoDB', `Loaded ${data.length} customer records.`);
        }
      } catch (err) {
        if (!cancelled) {
          addToast('error', 'Server Unavailable', (err as Error).message);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Distinct city list for the city filter dropdown.
  const cities = useMemo(() => {
    const set = new Set(customers.map((c) => c.city?.trim()).filter(Boolean) as string[]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [customers]);

  const isFiltered = Boolean(searchQuery || cityFilter || statusFilter);

  // Search + city + status filtering, then sorting.
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return customers
      .filter((c) => {
        if (cityFilter && c.city !== cityFilter) return false;
        if (statusFilter && c.status !== statusFilter) return false;
        if (!query) return true;
        const matchName = c.name?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        const matchPhone = c.phone?.toLowerCase().includes(query);
        const matchCity = c.city?.toLowerCase().includes(query);
        return matchName || matchEmail || matchPhone || matchCity;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name);
        else if (sortBy === 'city') comp = a.city.localeCompare(b.city);
        else if (sortBy === 'email') comp = a.email.localeCompare(b.email);
        else if (sortBy === 'createdAt')
          comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [customers, searchQuery, cityFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const validCurrentPage = Math.min(Math.max(1, Number(searchParams.get('page')) || 1), totalPages);

  const paginatedCustomers = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, validCurrentPage, pageSize]);

  const goToPage = (p: number) =>
    patchParams({ page: String(Math.min(Math.max(1, p), totalPages)) });

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      patchParams({ sortBy: field, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      patchParams({ sortBy: field, sortOrder: 'asc' });
    }
  };

  // Selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedCustomers.length && paginatedCustomers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCustomers.map((c) => c.id)));
    }
  };

  const isAllSelected =
    paginatedCustomers.length > 0 && paginatedCustomers.every((c) => selectedIds.has(c.id));

  // Add / Edit
  const handleOpenAddModal = () => {
    setCustomerToEdit(null);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (formData: CustomerFormData) => {
    if (customerToEdit) {
      const updated: Customer = {
        ...customerToEdit,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        status: formData.status || 'Active',
      };
      setCustomers((prev) => prev.map((c) => (c.id === customerToEdit.id ? updated : c)));
      try {
        await updateCustomer(customerToEdit.id, formData);
        addToast('success', 'Customer Updated', `${formData.name} updated successfully.`);
      } catch (err) {
        addToast('error', 'Update Failed', (err as Error).message);
      }
    } else {
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        status: formData.status || 'Active',
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      try {
        await createCustomer(newCustomer);
        addToast('success', 'Customer Added', `${newCustomer.name} added successfully.`);
      } catch (err) {
        addToast('error', 'Add Failed', (err as Error).message);
      }
    }
    setIsCustomerModalOpen(false);
  };

  // Delete
  const handleOpenDeleteSingle = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDeleteBulk = () => {
    if (selectedIds.size === 0) return;
    setCustomerToDelete(null);
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      const idsToDelete = Array.from(selectedIds);
      const count = idsToDelete.length;
      setCustomers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      try {
        await deleteCustomersBulk(idsToDelete);
        addToast('success', 'Customers Deleted', `Deleted ${count} customer records.`);
      } catch (err) {
        addToast('error', 'Delete Failed', (err as Error).message);
      }
    } else if (customerToDelete) {
      const { id, name } = customerToDelete;
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      try {
        await deleteCustomer(id);
        addToast('success', 'Customer Deleted', `${name} deleted successfully.`);
      } catch (err) {
        addToast('error', 'Delete Failed', (err as Error).message);
      }
    }
    setIsDeleteModalOpen(false);
  };

  // View → dedicated details page
  const handleViewCustomer = (customer: Customer) => {
    navigate(`/customers/${encodeURIComponent(customer.id)}`);
  };

  const clearFilters = () => {
    patchParams({ q: null, city: null, status: null }, true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <AppHeader>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </AppHeader>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <StatsBar
          customers={customers}
          filteredCount={filteredCustomers.length}
          isFiltered={isFiltered}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={(v) => patchParams({ q: v || null }, true)}
          city={cityFilter}
          onCityChange={(v) => patchParams({ city: v || null }, true)}
          cities={cities}
          status={statusFilter}
          onStatusChange={(v) => patchParams({ status: v || null }, true)}
          onClear={clearFilters}
          isFiltered={isFiltered}
        >
          {selectedIds.size > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                <span className="font-mono font-semibold text-slate-900">{selectedIds.size}</span>{' '}
                customer{selectedIds.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenDeleteBulk}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}
        </FilterBar>

        {/* Table (desktop / tablet) */}
        <div className="hidden md:block">
          <CustomerTable
            customers={paginatedCustomers}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={isAllSelected}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onView={handleViewCustomer}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteSingle}
            onAddClick={handleOpenAddModal}
            onClearSearch={clearFilters}
            searchQuery={searchQuery}
          />
        </div>

        {/* Cards (mobile) */}
        <CustomerCards
          customers={paginatedCustomers}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onView={handleViewCustomer}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteSingle}
        />

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => patchParams({ size: e.target.value }, true)}
                className="py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800 font-mono"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-slate-400">|</span>
              <span className="font-mono tabular-nums">
                Showing {Math.min((validCurrentPage - 1) * pageSize + 1, filteredCustomers.length)}–
                {Math.min(validCurrentPage * pageSize, filteredCustomers.length)} of{' '}
                {filteredCustomers.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => goToPage(validCurrentPage - 1)}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageWindow(validCurrentPage, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className="px-1.5 text-slate-400 select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    aria-current={p === validCurrentPage ? 'page' : undefined}
                    className={`min-w-[1.75rem] h-7 px-2 rounded-lg border font-mono tabular-nums transition-colors cursor-pointer ${
                      p === validCurrentPage
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={validCurrentPage >= totalPages}
                onClick={() => goToPage(validCurrentPage + 1)}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        customer={customerToDelete}
        count={isBulkDelete ? selectedIds.size : undefined}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
