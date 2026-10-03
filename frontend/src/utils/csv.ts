import { Customer } from '../types/customer';

export function exportCustomersToCSV(customers: Customer[], filename = 'customers.csv') {
  const headers = ['Customer Name', 'Phone', 'Email', 'City', 'Status', 'Date Added'];
  const rows = customers.map(c => [
    escapeCSV(c.name),
    escapeCSV(c.phone),
    escapeCSV(c.email),
    escapeCSV(c.city),
    escapeCSV(c.status),
    escapeCSV(new Date(c.createdAt).toLocaleDateString()),
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(val: string): string {
  if (val == null) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function parseCSVToCustomers(text: string): { imported: Partial<Customer>[]; errors: string[] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return { imported: [], errors: ['CSV file is empty or missing data rows'] };
  }

  // Parse header
  const headerLine = parseCSVLine(lines[0]);
  const colMap: { [key: string]: number } = {};
  headerLine.forEach((col, idx) => {
    const clean = col.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.includes('name')) colMap['name'] = idx;
    else if (clean.includes('phone') || clean.includes('tel')) colMap['phone'] = idx;
    else if (clean.includes('email') || clean.includes('mail')) colMap['email'] = idx;
    else if (clean.includes('city') || clean.includes('location')) colMap['city'] = idx;
    else if (clean.includes('status')) colMap['status'] = idx;
  });

  if (colMap['name'] === undefined || colMap['email'] === undefined) {
    return {
      imported: [],
      errors: ['CSV must have columns for at least Name and Email (e.g. "Customer Name", "Email", "Phone", "City")'],
    };
  }

  const results: Partial<Customer>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;
    const values = parseCSVLine(rawLine);
    const name = values[colMap['name']]?.trim();
    const email = values[colMap['email']]?.trim();
    const phone = colMap['phone'] !== undefined ? values[colMap['phone']]?.trim() : '';
    const city = colMap['city'] !== undefined ? values[colMap['city']]?.trim() : 'Unspecified';

    if (!name || !email) {
      errors.push(`Row ${i + 1}: Skipped (missing Name or Email)`);
      continue;
    }

    results.push({
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      city: city || 'Unspecified',
      status: 'Active',
      createdAt: new Date().toISOString(),
    });
  }

  return { imported: results, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
