import React from 'react';
import { Customer } from '../types/customer';
import { Users, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

interface StatsBarProps {
  customers: Customer[];
  filteredCount: number;
  isFiltered: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  customers,
  filteredCount,
  isFiltered,
}) => {
  const total = customers.length;
  const uniqueCities = new Set(customers.map((c) => c.city.trim().toLowerCase())).size;
  const activeCount = customers.filter((c) => c.status === 'Active' || c.status === 'VIP').length;
  const vipCount = customers.filter((c) => c.status === 'VIP').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Total Customers */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Customers</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {total}
          </span>
          {isFiltered && (
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({filteredCount} matching)
            </span>
          )}
        </div>
      </div>

      {/* Cities Count */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Cities Represented</span>
          <MapPin className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {uniqueCities}
          </span>
          <span className="text-xs text-slate-500">locations</span>
        </div>
      </div>

      {/* Active Accounts */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Active Accounts</span>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {activeCount}
          </span>
          <span className="text-xs text-slate-500">
            {total > 0 ? `${Math.round((activeCount / total) * 100)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* VIP Clients */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">VIP Clients</span>
          <ShieldCheck className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {vipCount}
          </span>
          <span className="text-xs text-slate-500">priority tier</span>
        </div>
      </div>
    </div>
  );
};
