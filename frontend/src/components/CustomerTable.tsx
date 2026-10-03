import React from 'react';
import { Customer, SortField, SortOrder } from '../types/customer';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  SearchX,
} from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onAddClick: () => void;
  onClearSearch: () => void;
  searchQuery: string;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  onClearSearch,
  searchQuery,
}) => {
  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-slate-900 ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-slate-900 ml-1" />
    );
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        {searchQuery ? (
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No matching customers</h3>
            <p className="text-sm text-slate-500 mt-1">
              No customers found matching &quot;{searchQuery}&quot;. Try a different search term.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={onClearSearch}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No customers yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Your customer directory is empty. Click below to add your first customer.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={onAddClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all"
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 w-4 h-4 cursor-pointer"
                />
              </th>

              {/* Customer Name */}
              <th className="py-3.5 px-4 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="group flex items-center hover:text-slate-900 transition-colors uppercase tracking-wider text-xs font-semibold text-left cursor-pointer"
                >
                  <span>Customer Name</span>
                  {renderSortIndicator('name')}
                </button>
              </th>

              {/* Phone */}
              <th className="py-3.5 px-4 min-w-[160px]">
                <span>Phone</span>
              </th>

              {/* Email */}
              <th className="py-3.5 px-4 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => onSort('email')}
                  className="group flex items-center hover:text-slate-900 transition-colors uppercase tracking-wider text-xs font-semibold text-left cursor-pointer"
                >
                  <span>Email</span>
                  {renderSortIndicator('email')}
                </button>
              </th>

              {/* City */}
              <th className="py-3.5 px-4 min-w-[160px]">
                <button
                  type="button"
                  onClick={() => onSort('city')}
                  className="group flex items-center hover:text-slate-900 transition-colors uppercase tracking-wider text-xs font-semibold text-left cursor-pointer"
                >
                  <span>City</span>
                  {renderSortIndicator('city')}
                </button>
              </th>

              {/* Actions */}
              <th className="py-3.5 pr-4 pl-2 text-right min-w-[120px]">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.map((customer) => {
              const isSelected = selectedIds.has(customer.id);
              const initials = customer.name
                .split(' ')
                .map((n) => n[0])
                .filter(Boolean)
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'CU';

              return (
                <tr
                  key={customer.id}
                  className={`group transition-colors ${
                    isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(customer.id)}
                      aria-label={`Select ${customer.name}`}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Customer Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onView(customer)}
                          className="font-medium text-slate-900 hover:text-blue-600 transition-colors truncate block text-left cursor-pointer"
                        >
                          {customer.name}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <a
                      href={`tel:${customer.phone}`}
                      className="inline-flex items-center gap-1.5 font-mono tabular-nums hover:text-slate-900 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.phone}</span>
                    </a>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-600 max-w-[220px] truncate">
                    <a
                      href={`mailto:${customer.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </a>
                  </td>

                  {/* City */}
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.city}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onView(customer)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                        aria-label={`View ${customer.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit customer"
                        aria-label={`Edit ${customer.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(customer)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete customer"
                        aria-label={`Delete ${customer.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
