import React, { useState, useEffect } from 'react';
import { getLoanTenures, addLoanTenure, deleteLoanTenure, getActivityLogs } from '../../api/adminConfig';
import { Plus, Trash2, X, CalendarDays, History, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { MdWarning } from 'react-icons/md';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const LoanTermManagement = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState('');

  // Edit state: maps original id → new month value string
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const safeTerms = Array.isArray(terms) ? terms : [];
  const safeHistoryLogs = Array.isArray(historyLogs) ? historyLogs : [];

  const refreshTenures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLoanTenures();
      console.log('Loan tenures response:', data); // Debug: check structure
      let tenuresArray = [];
      if (data && Array.isArray(data)) {
        tenuresArray = data;
      } else if (data && Array.isArray(data.tenures)) {
        tenuresArray = data.tenures;
      } else {
        tenuresArray = [];
      }
      setTerms(tenuresArray);
      // Initialise edit values from freshly loaded terms
      const initialEdits = {};
      tenuresArray.forEach(t => {
        const id = t?.id ?? t?._id ?? t?.months ?? t;
        const mv = t?.months ?? t?.duration ?? (typeof t === 'number' ? t : t?.id);
        initialEdits[String(id)] = String(mv ?? '');
      });
      setEditValues(initialEdits);
    } catch (e) {
      setError(e.message || 'Failed to load loan tenures');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const data = await getActivityLogs({ page: 1, pageSize: 500 });
      const items = Array.isArray(data?.items) ? data.items : [];
      // Debug: log all unique actions to identify exact delete action string
      const uniqueActions = [...new Set(items.map(l => l?.action).filter(Boolean))];
      console.log('[LoanTermManagement] All activity actions:', uniqueActions);
      const tenureLogs = items.filter(log =>
        typeof log?.action === 'string' && log.action.toUpperCase().includes('TENURE')
      );
      console.log('[LoanTermManagement] Filtered tenure logs:', tenureLogs);
      setHistoryLogs(tenureLogs);
    } catch (e) {
      setHistoryError(e.message || 'Failed to load history');
      setHistoryLogs([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    refreshTenures();
    fetchHistory();
  }, []);

  const handleCancel = () => {
    setShowModal(false);
    setDuration('');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const changed = safeTerms.filter(term => {
        const id = String(term?.id ?? term?._id ?? term?.months ?? term);
        const originalVal = String(term?.months ?? term?.duration ?? (typeof term === 'number' ? term : term?.id));
        return editValues[id] !== undefined && editValues[id] !== originalVal;
      });

      if (changed.length === 0) {
        Swal.fire({ icon: 'info', title: 'No Changes', text: 'No loan terms were modified.', confirmButtonColor: '#1e3f6e' });
        setSaving(false);
        return;
      }

      // Validate all changed values first
      for (const term of changed) {
        const id = String(term?.id ?? term?._id ?? term?.months ?? term);
        const newMonths = parseInt(editValues[id], 10);
        if (isNaN(newMonths) || newMonths < 1) {
          Swal.fire({ icon: 'error', title: 'Invalid Value', text: `Please enter a valid number greater than 0.`, confirmButtonColor: '#1e3f6e' });
          setSaving(false);
          return;
        }
        // Duplicate check against unchanged terms
        const alreadyExists = safeTerms.some(t => {
          const tId = String(t?.id ?? t?._id ?? t?.months ?? t);
          const tVal = t?.months ?? t?.duration ?? (typeof t === 'number' ? t : t?.id);
          return tId !== id && tVal === newMonths;
        });
        if (alreadyExists) {
          Swal.fire({ icon: 'warning', title: 'Duplicate Term', text: `${newMonths} months already exists.`, confirmButtonColor: '#1e3f6e' });
          setSaving(false);
          return;
        }
      }

      // Backend has no PATCH: delete the old value then add the new one
      for (const term of changed) {
        const id = term?.id ?? term?._id ?? term?.months ?? term;
        const newMonths = parseInt(editValues[String(id)], 10);
        await deleteLoanTenure(id);
        await addLoanTenure(newMonths);
      }

      await refreshTenures();
      await fetchHistory();
      Swal.fire({ icon: 'success', title: 'Saved!', text: 'Loan terms updated successfully.', confirmButtonColor: '#1e3f6e', timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: e.message || 'Failed to update loan terms.', confirmButtonColor: '#1e3f6e' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteLoanTenure(id);
      await refreshTenures();
      await fetchHistory();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Loan tenure deleted successfully.',
        confirmButtonColor: '#1e3f6e',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (e) {
      setError(null);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: e.message || 'Failed to delete loan tenure.',
        confirmButtonColor: '#1e3f6e'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const months = parseInt(duration.trim(), 10);
      if (!duration.trim() || isNaN(months) || months < 1) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Please enter a valid integer greater than or equal to 1 for months.',
          confirmButtonColor: '#1e3f6e'
        });
        return;
      }
      // Duplicate check – adjust field name based on your data
      const monthValue = term => term.months ?? term.duration ?? term.id;
      if (safeTerms.some(term => monthValue(term) === months)) {
        setLoading(false);
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Term',
          text: `A loan term for ${months} months already exists.`,
          confirmButtonColor: '#1e3f6e'
        });
        return;
      }
      await addLoanTenure(months);
      await refreshTenures();
      await fetchHistory();
      Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'Loan tenure added successfully.',
        confirmButtonColor: '#1e3f6e',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (e) {
      setError(null);
      Swal.fire({
        icon: 'error',
        title: 'Create Failed',
        text: e.message || 'Failed to add loan tenure.',
        confirmButtonColor: '#1e3f6e'
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Pagination (client-side on the full filtered dataset)
  const totalEntries = safeHistoryLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const pageItems = safeHistoryLogs.slice((safePage - 1) * pageSize, safePage * pageSize);

  const showTermsWarning = !loading && !error && safeTerms.length === 0 && safeHistoryLogs.length > 0;

  // Helper to extract the month value from a term object (works for different shapes)
  const getMonthValue = (term) => {
    return term?.months ?? term?.duration ?? (typeof term === 'number' ? term : term?.id);
  };

  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Term Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and delete loan terms.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors md:text-left text-center w-full md:w-auto justify-center md:justify-start"
        >
          <Plus size={16} />
          Add New Tenure
        </button>
      </div>

      {/* Terms Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        {/* Top row */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5">
          <div>
            <p className="font-semibold text-gray-900">Update Loan Term</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify loan term</p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="hidden md:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
          >
            {saving ? 'Saving...' : 'Save Details'}
          </button>
        </div>

        <div className="border-t border-gray-100" />

        {/* Body */}
        <div className="px-6 py-6">
          {showTermsWarning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ The list of terms is empty, but history shows that terms have been created.
              This may indicate a problem with the API response. Check the browser console for details.
            </div>
          )}

          <p className="text-sm font-medium text-gray-700 mb-4">Edit loan term</p>

          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : safeTerms.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No loan terms found. Add one using the button above.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeTerms.map((term) => {
                const itemId = term?.id ?? term?._id ?? term?.months ?? term;
                const key = String(itemId);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white relative">
                      <input
                        type="number"
                        min="1"
                        value={editValues[key] ?? ''}
                        onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full pl-4 pr-20 py-2.5 text-sm text-gray-700 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-4 text-sm text-gray-500 whitespace-nowrap pointer-events-none">Months</span>
                    </div>
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile save button */}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="md:hidden mt-5 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Details'}
          </button>
        </div>
      </div>

      {/* History Card (unchanged) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <History size={20} className="text-gray-500" />
          <p className="font-semibold text-gray-900">Creation History</p>
        </div>
        <p className="text-sm text-gray-400 mt-0.5 mb-6">Timeline of when loan terms were created or deleted.</p>

        <div className="-mx-6 overflow-x-auto" style={{ width: 'calc(100% + 3rem)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">S/N</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">Date Created/deleted</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">Action</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">Duration (months)</th>
                <th className="text-left py-3 px-4 font-semibold tracking-wide whitespace-nowrap">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyLoading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading history...</td></tr>
              ) : historyError ? (
                <tr><td colSpan="5" className="py-8 text-center text-red-500">{historyError}</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">No creation history found.</td></tr>
              ) : (
                pageItems.map((log, index) => {
                  const serial = (safePage - 1) * pageSize + index + 1;
                  const actionRaw = (log.action || log.type || '').toUpperCase();
                  const isCreated = actionRaw.includes('ADD') || actionRaw.includes('CREATE');
                  const isDeleted = actionRaw.includes('DELETE') || actionRaw.includes('REMOVE');
                  const actionLabel = isCreated ? 'Created' : isDeleted ? 'Deleted' : actionRaw || '-';
                  const actionClass = isCreated
                    ? 'bg-green-100 text-green-700'
                    : isDeleted
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600';

                  return (
                    <tr key={log.id} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'}`}>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{serial}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {actionRaw ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${actionClass}`}>
                            {actionLabel}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        {log.metadata?.months || log.entityId || '—'} months
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{log.actorEmail || 'System'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!historyLoading && !historyError && safeHistoryLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-3">
            <p className="text-sm text-gray-500">
              {`Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, totalEntries)} of ${totalEntries} entries`}
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
                  disabled={!canGoPrev || historyLoading}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-sm text-gray-700 font-medium bg-white">
                  {safePage}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!canGoNext || historyLoading}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 relative">
            <button onClick={handleCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-4">
              <CalendarDays size={20} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add a New Tenure</h2>
            <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-3 mb-5">
              Input the tenure duration in the field below
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 12"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:border-blue-400 mb-6"
            />
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleCancel} className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreate} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTermManagement;