import React, { useState } from 'react';
import { Customer } from '../types/customer';
import { parseCSVToCustomers } from '../utils/csv';
import { X, UploadCloud, AlertCircle, FileText } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (customers: Customer[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [csvText, setCsvText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<Partial<Customer>[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      const parsed = parseCSVToCustomers(content);
      setPreview(parsed.imported);
      setErrors(parsed.errors);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCsvText(val);
    if (val.trim()) {
      const parsed = parseCSVToCustomers(val);
      setPreview(parsed.imported);
      setErrors(parsed.errors);
    } else {
      setPreview([]);
      setErrors([]);
    }
  };

  const handleConfirmImport = () => {
    if (preview.length === 0) return;

    const customersToSave: Customer[] = preview.map((p, idx) => ({
      id: `cust_${Date.now()}_${idx}`,
      name: p.name || 'Unknown',
      phone: p.phone || '+1 (555) 000-0000',
      email: p.email || 'customer@example.com',
      city: p.city || 'Unspecified',
      status: p.status || 'Active',
      createdAt: new Date().toISOString(),
    }));

    onImport(customersToSave);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Import Customers from CSV</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a .csv file or paste formatted CSV content below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* File drag/drop upload zone */}
          <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/30">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700">Choose CSV File or drag here</span>
            <span className="text-xs text-slate-400 mt-1">Accepts CSV files with headers: Name, Phone, Email, City</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Paste CSV text area */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Or Paste CSV Text
              </span>
              <button
                type="button"
                onClick={() => {
                  const sample = `Customer Name,Phone,Email,City\nMuhammad Ali,+92 300 1234567,ali@example.com,Lahore\nFatima Zahra,0321-7654321,fatima@example.com,Karachi`;
                  setCsvText(sample);
                  const parsed = parseCSVToCustomers(sample);
                  setPreview(parsed.imported);
                  setErrors(parsed.errors);
                }}
                className="text-blue-600 hover:underline normal-case text-xs font-normal"
              >
                Insert sample CSV
              </button>
            </div>
            <textarea
              rows={4}
              value={csvText}
              onChange={handleTextChange}
              placeholder="Customer Name,Phone,Email,City..."
              className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Parsing notices:
              </div>
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Preview ({preview.length} valid customer{preview.length > 1 ? 's' : ''} detected)
              </h4>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
                {preview.map((p, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div>
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <span className="text-slate-500 ml-2">({p.city})</span>
                    </div>
                    <div className="text-slate-500 font-mono">{p.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={preview.length === 0}
            onClick={handleConfirmImport}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            Import {preview.length} Customer{preview.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
};
