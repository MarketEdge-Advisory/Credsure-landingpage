import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../api/adminConfig';
import { getCars } from '../../api/cars';
import { ChevronLeft, ChevronRight, CalendarDays, Eye } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state (backend-driven)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [totalEntries, setTotalEntries] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // carMap: { [carId]: carName } — used to resolve car names in activity logs
  const [carMap, setCarMap] = useState({});

  useEffect(() => {
    getCars()
      .then(data => {
        const cars = Array.isArray(data) ? data : (data?.data ?? data?.cars ?? []);
        const map = {};
        cars.forEach(c => { if (c?.id) map[c.id] = c.name || c.model || c.title || c.id; });
        setCarMap(map);
      })
      .catch(() => {});
  }, []);

  // Sorting is fixed: newest first (descending by createdAt)
  const sortBy = 'createdAt';
  const sortOrder = 'desc';

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getActivityLogs({
        page,
        pageSize,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const items = data.items ?? data.data ?? [];
      const total = data.total ?? data.pagination?.total ?? null;
      const itemsCount = Array.isArray(items) ? items.length : 0;

      const sorted = Array.isArray(items)
        ? items.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          })
        : [];

      setLogs(sorted);
      setTotalEntries(total);
      setHasMore(total == null ? itemsCount === pageSize : page * pageSize < total);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
      setLogs([]);
      setTotalEntries(null);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, dateRange]);

  // Pagination calculations (server-driven)
  const effectiveTotal = totalEntries != null ? totalEntries : (Array.isArray(logs) ? logs.length : 0);
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const pageItems = Array.isArray(logs) ? logs.slice(startIdx, startIdx + pageSize) : [];

  const formatAction = (action) => action.replace(/_/g, ' ');

  const getActionBadgeClass = (action) => {
    if (action.includes('INTEREST_RATE')) return 'bg-blue-100 text-blue-800';
    if (action.includes('LOAN_TENURE')) {
      if (action.includes('ADD') || action.includes('CREATE')) return 'bg-purple-100 text-purple-800';
      if (action.includes('UPDATE')) return 'bg-green-100 text-green-800';
      if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    }
    if (action.includes('CALCULATOR')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'bg-red-100 text-red-800';
    if (action.includes('CREATE') || action.includes('ADD')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE') || action.includes('TOGGLE') || action.includes('UPSERT')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Returns a short human-readable summary shown inline in the table
  const getActionSummary = (log) => {
    const action = log.action || '';
    const meta = log.metadata || {};
    const carName = meta.carName || meta.model || meta.name || meta.title
      || (log.entityId ? carMap[log.entityId] : null) || null;
    const carLabel = carName || (log.entityId ? `ID: ${log.entityId}` : null);

    if (action === 'CREATE_CAR') return `Added car${carLabel ? ': ' + carLabel : ''}`;
    if (action === 'DELETE_CAR') return `Deleted car${carLabel ? ': ' + carLabel : ''}`;
    if (action === 'UPDATE_CAR') return `Updated car${carLabel ? ': ' + carLabel : ''}`;
    if (action === 'UPSERT_CAR_IMAGES') return `Updated images${carLabel ? ' for ' + carLabel : ''}`;
    if (action === 'UPDATE_CAR_PRICE') {
      const oldP = meta.oldPrice != null ? `₦${Number(meta.oldPrice).toLocaleString()}` : null;
      const newP = meta.newPrice != null ? `₦${Number(meta.newPrice).toLocaleString()}` : (meta.price != null ? `₦${Number(meta.price).toLocaleString()}` : null);
      const car = carLabel ? carLabel + ': ' : '';
      if (oldP && newP) return `${car}${oldP} → ${newP}`;
      if (newP) return `${car}price set to ${newP}`;
      return `Updated price${carLabel ? ' for ' + carLabel : ''}`;
    }
    if (action === 'TOGGLE_CAR_AVAILABILITY') {
      const avail = meta.available ?? meta.isAvailable;
      const status = avail != null ? (avail ? 'Available' : 'Unavailable') : null;
      return `${carLabel ? carLabel + ': ' : ''}${status ? 'marked ' + status : 'availability toggled'}`;
    }
    if (action === 'UPDATE_INTEREST_RATE') {
      const oldR = meta.oldRate ?? meta.previousRate;
      const newR = meta.newRate ?? meta.rate ?? meta.annualRatePct;
      if (oldR != null && newR != null) return `${oldR}% → ${newR}%`;
      if (newR != null) return `Rate set to ${newR}%`;
      return 'Updated interest rate';
    }
    if (action.includes('LOAN_TENURE')) {
      const months = meta.months || log.entityId;
      const verb = action.includes('ADD') || action.includes('CREATE') ? 'Added' : action.includes('DELETE') ? 'Deleted' : 'Updated';
      return `${verb} tenure${months ? ': ' + months + ' months' : ''}`;
    }
    if (action === 'UPDATE_CALCULATOR_CONFIG') {
      const parts = [];
      if (meta.downPaymentPct != null) parts.push(`Down: ${meta.downPaymentPct}%`);
      if (meta.processingFeePct != null) parts.push(`Fee: ₦${Number(meta.processingFeePct).toLocaleString()}`);
      if (meta.insuranceCost != null) parts.push(`Insurance: ${meta.insuranceCost}%`);
      return parts.length ? parts.join(' · ') : 'Updated calculator config';
    }
    if (action === 'CREATE_FINANCE_APPLICATION') return 'Finance application submitted';
    return '—';
  };

  // Builds the rich HTML for the details modal
  const buildDetailsHtml = (log) => {
    const meta = log.metadata || {};
    const action = log.action || '';
    const carName = meta.carName || meta.model || meta.name || meta.title
      || (log.entityId ? carMap[log.entityId] : null) || null;

    const row = (label, value) =>
      value != null && value !== ''
        ? `<tr>
            <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:0.8125rem;white-space:nowrap;vertical-align:top">${label}</td>
            <td style="padding:6px 0;color:#111827;font-size:0.8125rem;font-weight:500;word-break:break-word">${value}</td>
           </tr>`
        : '';

    const divider = `<tr><td colspan="2" style="padding:6px 0"><hr style="border:none;border-top:1px solid #f3f4f6"/></td></tr>`;

    const rows = [];
    rows.push(row('Action', `<span style="font-weight:600">${formatAction(action)}</span>`));
    rows.push(divider);
    rows.push(row('Performed By', log.actorEmail || 'System'));
    rows.push(row('Role', log.actorRole || null));
    rows.push(row('Time', new Date(log.createdAt).toLocaleString()));
    rows.push(divider);

    // Car-specific fields
    if (carName) rows.push(row('Car', `<strong>${carName}</strong>`));
    if (log.entityId && !carName && log.entityType === 'CAR') rows.push(row('🚗 Car ID', log.entityId));
    if (log.entityType && log.entityType !== 'CAR') rows.push(row('Entity Type', log.entityType));
    if (log.entityId && log.entityType !== 'CAR') rows.push(row('Entity ID', log.entityId));

    // Action-specific details
    if (action === 'UPDATE_CAR_PRICE') {
      const oldP = meta.oldPrice ?? meta.previousPrice;
      const newP = meta.newPrice ?? meta.price;
      if (oldP != null) rows.push(row('Previous Price', `₦${Number(oldP).toLocaleString()}`));
      if (newP != null) rows.push(row('New Price', `<strong style="color:#16a34a">₦${Number(newP).toLocaleString()}</strong>`));
    } else if (action === 'TOGGLE_CAR_AVAILABILITY') {
      const avail = meta.available ?? meta.isAvailable;
      if (avail != null) rows.push(row('Status', avail
        ? '<span style="color:#16a34a;font-weight:600">✅ Available</span>'
        : '<span style="color:#dc2626;font-weight:600">❌ Unavailable</span>'));
    } else if (action === 'UPDATE_CAR') {
      Object.entries(meta).forEach(([k, v]) => {
        if (['carName','model','name','title','id','carId'].includes(k)) return;
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        rows.push(row(label, String(v)));
      });
    } else if (action === 'UPDATE_INTEREST_RATE') {
      const oldR = meta.oldRate ?? meta.previousRate;
      const newR = meta.newRate ?? meta.rate ?? meta.annualRatePct;
      if (oldR != null) rows.push(row('Previous Rate', `${oldR}%`));
      if (newR != null) rows.push(row('New Rate', `<strong style="color:#16a34a">${newR}%</strong>`));
    } else if (action.includes('LOAN_TENURE')) {
      const months = meta.months || log.entityId;
      if (months) rows.push(row('Duration', `<strong>${months} months</strong>`));
    } else if (action === 'UPDATE_CALCULATOR_CONFIG') {
      if (meta.downPaymentPct != null) rows.push(row('Down Payment', `${meta.downPaymentPct}%`));
      if (meta.processingFeePct != null) rows.push(row('Processing Fee', `₦${Number(meta.processingFeePct).toLocaleString()}`));
      if (meta.insuranceCost != null) rows.push(row('Insurance Cost', `${meta.insuranceCost}%`));
    } else if (action === 'CREATE_FINANCE_APPLICATION') {
      Object.entries(meta).forEach(([k, v]) => {
        if (v == null) return;
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        rows.push(row(label, String(v)));
      });
    } else if (action === 'UPSERT_CAR_IMAGES' || action === 'CREATE_CAR' || action === 'DELETE_CAR') {
      // show any additional metadata keys
      Object.entries(meta).forEach(([k, v]) => {
        if (['carName','model','name','title'].includes(k)) return;
        if (v == null) return;
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        rows.push(row(label, String(v)));
      });
    } else {
      // Generic fallback
      Object.entries(meta).forEach(([k, v]) => {
        if (v == null) return;
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        rows.push(row(label, String(v)));
      });
    }

    return `<table style="width:100%;text-align:left;border-collapse:collapse">${rows.join('')}</table>`;
  };

  const showDetails = (log) => {
    Swal.fire({
      title: '<span style="font-size:1.1rem;font-weight:700;">Activity Details</span>',
      html: buildDetailsHtml(log),
      confirmButtonText: 'Close',
      width: '480px',
      confirmButtonColor: '#1e3f6e',
    });
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Track all changes made to platform settings, including who changed what and when.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div>
            <p className="font-semibold text-gray-900">Change History</p>
            <p className="text-sm text-gray-400 mt-0.5">
              All modifications to interest rates, loan terms, and calculator inputs
            </p>
          </div>
          <div className="flex gap-3">
            {/* <div className="relative">
              <button
                onClick={() => setShowDatePicker((o) => !o)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <CalendarDays size={15} />
                Filter by Date
              </button>
              <DateRangePicker
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={(range) => {
                  setDateRange(range);
                  setPage(1); // reset to first page when filter changes
                }}
              />
            </div> */}
          </div>
        </div>

        <div className="-mx-6 overflow-x-auto" style={{ width: 'calc(100% + 3rem)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">S/N</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">User</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">Action</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="py-8 text-center text-red-500">{error}</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">No activity logs found.</td></tr>
              ) : (
                pageItems.map((log, index) => {
                  const serial = startIdx + index + 1;
                  return (
                    <tr key={log.id ?? index} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'}`}>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{serial}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{log.actorEmail || 'System'}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => showDetails(log)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && pageItems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-3">
            <p className="text-sm text-gray-500">
              {totalEntries != null ? (
                <>Showing {startIdx + 1}–{Math.min(startIdx + pageSize, totalEntries)} of {totalEntries} entries</>
              ) : (
                <>Showing {startIdx + 1}–{startIdx + pageItems.length} of many entries (approx.)</>
              )}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canGoPrev}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-sm text-gray-700 font-medium bg-white">
                  {safePage}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!canGoNext}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;