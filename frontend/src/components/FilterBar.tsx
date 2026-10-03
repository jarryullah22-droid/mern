import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CustomerStatus } from '../types/customer';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  cities: string[];
  status: string;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  isFiltered: boolean;
  /** Rendered under the search row, e.g. the bulk-selection bar. */
  children?: React.ReactNode;
}

const STATUSES: CustomerStatus[] = ['Active', 'Lead', 'VIP', 'Inactive'];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  city,
  onCityChange,
  cities,
  status,
  onStatusChange,
  onClear,
  isFiltered,
  children,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
      {/* Search + filters row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, phone, email, or city..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 pl-0.5">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Filter</span>
          </div>

          {/* City filter */}
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            aria-label="Filter by city"
            className="py-2.5 pl-3 pr-8 text-sm bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors text-slate-800 max-w-[10rem]"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
            className="py-2.5 pl-3 pr-8 text-sm bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors text-slate-800"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-2.5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
