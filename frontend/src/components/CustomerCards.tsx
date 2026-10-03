import React from 'react';
import { Customer } from '../types/customer';
import { Eye, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface CustomerCardsProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerCards: React.FC<CustomerCardsProps> = ({
  customers,
  selectedIds,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="md:hidden space-y-3">
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
          <div
            key={customer.id}
            className={`p-4 bg-white rounded-xl border transition-colors ${
              isSelected ? 'border-slate-900 bg-slate-50/50' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(customer.id)}
                  aria-label={`Select ${customer.name}`}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 w-4 h-4 cursor-pointer shrink-0"
                />
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h4
                    onClick={() => onView(customer)}
                    className="font-semibold text-slate-900 truncate cursor-pointer hover:text-blue-600"
                  >
                    {customer.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onView(customer)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                  aria-label="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                  aria-label="Edit customer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(customer)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  aria-label="Delete customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono tabular-nums">{customer.phone}</span>
              </a>

              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 truncate"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
