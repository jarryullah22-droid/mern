import React from 'react';
import { Customer } from '../types/customer';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customer?: Customer | null;
  count?: number;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customer,
  count,
}) => {
  if (!isOpen) return null;

  const isBulk = count !== undefined && count > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 id="delete-title" className="text-base font-semibold text-slate-900">
            {isBulk ? `Delete ${count} Selected Customers?` : 'Delete Customer Record?'}
          </h3>

          <p className="text-sm text-slate-600 mt-2">
            {isBulk ? (
              <>
                Are you sure you want to permanently remove all <strong className="font-semibold text-slate-900">{count}</strong> selected customers? This action cannot be undone.
              </>
            ) : customer ? (
              <>
                Are you sure you want to remove <strong className="font-semibold text-slate-900">{customer.name}</strong> from your customer database?
              </>
            ) : (
              'Are you sure you want to delete this customer record? This action cannot be undone.'
            )}
          </p>

          {customer && !isBulk && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="text-slate-700"><span className="font-medium text-slate-500">Email:</span> {customer.email}</div>
              <div className="text-slate-700"><span className="font-medium text-slate-500">Phone:</span> {customer.phone}</div>
              <div className="text-slate-700"><span className="font-medium text-slate-500">City:</span> {customer.city}</div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isBulk ? 'Delete Selected' : 'Delete Customer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
