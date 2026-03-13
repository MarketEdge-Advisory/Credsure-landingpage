import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../api/adminConfig';
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
    return 'bg-gray-100 text-gray-800';
  };

  const formatDetails = (metadata, action) => {
    if (!metadata) return '—';
    if (typeof metadata === 'string') return metadata;
    if (typeof metadata === 'object') {
      const keys = Object.keys(metadata);
      if (keys.length === 1) {
        const val = metadata[keys[0]];
        return val !== null && val !== undefined ? String(val) : '—';
      }
      return keys.map(key => `${key}: ${metadata[key]}`).join(', ');
    }
    return String(metadata);
  };

  const showDetails = (log) => {

    const detailsText = formatDetails(log.metadata, log.action);
    const formatLabel = (str) => {
  if (!str) return '';
  // Replace underscores/hyphens with spaces
  let result = str.replace(/[_-]/g, ' ');
  // Insert space before each uppercase letter (handles camelCase)
  result = result.replace(/([A-Z])/g, ' $1').trim();
  // Capitalize first letter of each word
  result = result.replace(/\b\w/g, (char) => char.toUpperCase());
  // Collapse multiple spaces
  result = result.replace(/\s+/g, ' ');
  return result;
};
    Swal.fire({
      title: '<span style="font-size:1.5rem;font-weight:600;">Activity Details</span>',
      html: `
        <div class="text-left space-y-2">
          <div class="flex pb-1 font-normal text-sm">
            <span class="font-normal text-sm w-24">User:</span>
            <span>${log.actorEmail || 'System'}</span>
          </div>
          <div class="flex pb-1 font-normal text-sm">
            <span class="font-normal text-sm w-24">Role:</span>
            <span>${log.actorRole || '—'}</span>
          </div>
          <div class="flex pb-1 font-normal text-sm">
            <span class="font-normal text-sm w-24">Action:</span>
            <span class="font-normal text-sm">${formatAction(log.action)}</span>
          </div>
          <div class="flex pb-1 font-normal text-sm">
            <span class="font-normal text-sm w-24">Entity:</span>
            <span class="font-normal text-sm">${log.entityType || '—'}</span>
          </div>
          <div class="flex pb-1 font-normal text-sm">
            <span class="font-normal text-sm w-24">Timestamp:</span>
            <span>${new Date(log.createdAt).toLocaleString()}</span>
          </div>
          <div class="flex pt-1">
            <span class="font-normal text-sm w-24">Details:</span>
           <span class="flex-1 break-words font-normal text-sm word-spaced">
  ${formatLabel(detailsText)}
</span>
          </div>
        </div>
      `,
      confirmButtonText: 'Close',
      width: '500px',
      heightAuto: true,
      confirmButtonColor:'#1e3f6e'
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

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Timestamp</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">View more</th>
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
                pageItems.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-700">{log.actorEmail || 'System'}</td>
                    <td className="py-3 text-gray-700">{log.actorRole || '—'}</td>
                    <td className="py-3 text-gray-700">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 text-gray-700">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">
                      <button
                        onClick={() => showDetails(log)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
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