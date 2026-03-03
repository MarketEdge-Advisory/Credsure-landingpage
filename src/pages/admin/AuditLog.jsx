import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../api/adminConfig';
import { ChevronLeft, ChevronRight, ChevronDown, Download, CalendarDays, Eye } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import Swal from 'sweetalert2';

const PAGE_SIZES = [10, 20, 50];

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

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
      setLogs(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, dateRange]);

  const totalEntries = logs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = logs.slice(startIdx, startIdx + pageSize);

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
    Swal.fire({
      title: 'Activity Details',
      html: `
        <div class="text-left space-y-2">
          <div class="flex border-b pb-1">
            <span class="font-semibold w-24">User:</span>
            <span>${log.actorEmail || 'System'}</span>
          </div>
          <div class="flex border-b pb-1">
            <span class="font-semibold w-24">Role:</span>
            <span>${log.actorRole || '—'}</span>
          </div>
          <div class="flex border-b pb-1">
            <span class="font-semibold w-24">Action:</span>
            <span>${formatAction(log.action)}</span>
          </div>
          <div class="flex border-b pb-1">
            <span class="font-semibold w-24">Entity:</span>
            <span>${log.entityType || '—'}</span>
          </div>
          <div class="flex border-b pb-1">
            <span class="font-semibold w-24">Timestamp:</span>
            <span>${new Date(log.createdAt).toLocaleString()}</span>
          </div>
          <div class="flex pt-1">
            <span class="font-semibold w-24">Details:</span>
            <span class="flex-1 break-words">${detailsText}</span>
          </div>
        </div>
      `,
      confirmButtonText: 'Close',
      width: '500px',
      heightAuto: true,
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
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Export
            </button>
            <div className="relative">
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
                onApply={(range) => setDateRange(range)}
              />
            </div>
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
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {startIdx + 1}–{Math.min(startIdx + pageSize, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Show</span>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((o) => !o)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {pageSize}
                <ChevronDown size={13} />
              </button>
              {pageSizeOpen && (
                <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-md shadow-md z-10 min-w-full">
                  {PAGE_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
                      className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                        s === pageSize ? 'text-blue-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">entries</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-sm text-gray-700 font-medium bg-white">
                {safePage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;