import React, { useState, useEffect } from 'react';
import {
  updateCalculatorConfig,
  getAdminConfig,
  getCalculatorHistory,          // <-- new API function (adjust import as needed)
} from '../../api/adminConfig';
import Swal from 'sweetalert2';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── PAGE SIZE OPTIONS ──────────────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];

// ─── Spinner Component ──────────────────────────────────────────────────────
const Spinner = () => (
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ─── Helper: format date ────────────────────────────────────────────────────
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(',', '');
};

// ─── Main Component ─────────────────────────────────────────────────────────
const CalculatorInputMgt = () => {
  // Form state
  const [downPayment, setDownPayment] = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [historyItems, setHistoryItems] = useState([]);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ─── Prefill inputs on mount ─────────────────────────────────────────────
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setFetching(true);
        const response = await getAdminConfig();
        const config = response?.data?.calculator;

        setDownPayment(String(config?.downPaymentPct ?? ''));
        setProcessingFee(String(config?.processingFeePct ?? ''));
        setInsuranceCost(String(config?.insuranceCost ?? ''));
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Config',
          text: e.message || 'Unable to fetch calculator configuration.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#e53e3e',
        });
      } finally {
        setFetching(false);
      }
    };
    fetchConfig();
  }, []);

  // ─── Fetch history when page/pageSize changes ────────────────────────────
  useEffect(() => {
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');
      const response = await getCalculatorHistory({ page, limit: pageSize });  // ✅ correct call
      const { items, pagination } = response?.data || {};
      setHistoryItems(items || []);
      setHistoryPagination(pagination || { page, limit: pageSize, total: 0, totalPages: 0 });
    } catch (e) {
      setHistoryError(e.message || 'Failed to load history.');
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  fetchHistory();
}, [page, pageSize]);

  // ─── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateCalculatorConfig({
        downPaymentPct: Number(downPayment),
        processingFeePct: Number(processingFee),
        insuranceCost: Number(insuranceCost),
      });
      Swal.fire({
        icon: 'success',
        title: 'Calculator Updated!',
        text: 'Calculator input updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2d9de5',
      });
      setSuccess(null);
      setPage(1); // refresh first page to see latest update
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: e.message || 'Failed to update.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#e53e3e',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Pagination helpers ──────────────────────────────────────────────────
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(historyPagination.totalPages, p + 1));

  const totalEntries = historyPagination.total;
  const totalPages = historyPagination.totalPages;
  const safePage = Math.min(page, totalPages || 1);
  const startIdx = (safePage - 1) * pageSize;

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-900">Calculator Input Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Set, modify, and track calculator input management.</p>

      {/* ── Update Card ── (unchanged) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* ... keep existing update form (same as before) ... */}
      </div>

      {/* ── History Table Card ── (updated columns) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="font-semibold text-gray-900">Update History</p>
            <p className="text-sm text-gray-400 mt-0.5">All previous calculator input updates</p>
          </div>
          {/* <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={15} />
            Export
          </button> */}
        </div>

        <div className="overflow-x-auto">
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : historyError ? (
            <div className="text-center py-8 text-red-600">{historyError}</div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No history entries found.</div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="py-3 px-4 font-medium">S/N</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium">Down Payment (%)</th>
                  <th className="py-3 px-4 font-medium">Processing Fee (%)</th>
                  <th className="py-3 px-4 font-medium">Insurance Cost</th>
                  <th className="py-3 px-4 font-medium">Changed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyItems.map((item, index) => {
                  const serial = startIdx + index + 1;
                  const date = formatDate(item.createdAt);
                  // Format values
                  const downPct = item.downPaymentPct != null ? `${item.downPaymentPct}%` : '-';
                  const feePct = item.processingFeePct != null ? `${item.processingFeePct}%` : '-';
                  const insurance = item.insuranceCost != null ? item.insuranceCost.toLocaleString() : '-';
                  const changedBy = item.changedByEmail || item.changedByRole || 'System';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{serial}</td>
                      <td className="py-3 px-4 text-gray-700">{date}</td>
                      <td className="py-3 px-4 text-gray-700">{downPct}</td>
                      <td className="py-3 px-4 text-gray-700">{feePct}</td>
                      <td className="py-3 px-4 text-gray-700">{insurance}</td>
                      <td className="py-3 px-4 text-gray-600">{changedBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalEntries > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                {startIdx + 1}–{Math.min(startIdx + pageSize, totalEntries)} of {totalEntries}
              </span>
              <button
                onClick={handlePrev}
                disabled={safePage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={safePage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorInputMgt;