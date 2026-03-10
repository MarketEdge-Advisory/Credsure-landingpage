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

  const [processingFeeError, setProcessingFeeError] = useState('');
  const [insuranceCostError, setInsuranceCostError] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helpers
  const formatNumberWithCommas = (value) => {
    const str = String(value || '');
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleProcessingFeeChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');

    if (!digits) {
      setProcessingFee('');
      setProcessingFeeError('');
      return;
    }

    const num = Number(digits);
    if (Number.isNaN(num)) {
      setProcessingFee('');
      setProcessingFeeError('Invalid number');
      return;
    }

    setProcessingFee(formatNumberWithCommas(num));
    setProcessingFeeError('');
  };

  const handleInsuranceCostChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');

    if (!digits) {
      setInsuranceCost('');
      setInsuranceCostError('');
      return;
    }

    const num = Number(digits);
    setInsuranceCost(digits);

    if (num < 1 || num > 100) {
      setInsuranceCostError('Insurance cost must be between 1 and 100.');
    } else {
      setInsuranceCostError('');
    }
  };

  // History state
  const [historyItems, setHistoryItems] = useState([]);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [historyHasMore, setHistoryHasMore] = useState(false);
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
        const feeAmount = config?.processingFee ?? config?.processingFeePct ?? '';
        setProcessingFee(feeAmount !== '' ? formatNumberWithCommas(feeAmount) : '');
        setInsuranceCost(String(config?.insuranceCost ?? ''));
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Config',
          text: e.message || 'Unable to fetch calculator configuration.',
          confirmButtonText: 'OK',
         confirmButtonColor:'#1e3f6e'
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

        const response = await getCalculatorHistory({ page, limit: pageSize });
        const responseData = response?.data ?? response;

        // Support multiple potential response shapes from the backend.
        // e.g. { data: { items: [...], pagination: { ... } } }
        // or    { items: [...], pagination: { ... } }
        // or    { data: [...], total: 50 }
        const items = responseData?.items ?? responseData?.data ?? response?.items ?? [];
        const pagination = responseData?.pagination ?? response?.pagination;

        const total =
          pagination?.total ??
          responseData?.total ??
          response?.total ??
          (Array.isArray(items) ? items.length : 0);

        const totalPages =
          pagination?.totalPages ??
          (pageSize ? Math.max(1, Math.ceil(total / pageSize)) : undefined);

        setHistoryItems(Array.isArray(items) ? items : []);
        setHistoryPagination({ page, limit: pageSize, total, totalPages });
        setHistoryHasMore(Array.isArray(items) ? items.length === pageSize : false);
      } catch (e) {
        setHistoryError(e.message || 'Failed to load history.');
        setHistoryItems([]);
        setHistoryPagination({ page, limit: pageSize, total: 0, totalPages: 0 });
        setHistoryHasMore(false);
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
    setProcessingFeeError('');
    setInsuranceCostError('');

    const downPaymentValue = Number(downPayment);
    const processingFeeValue = Number(processingFee.replace(/,/g, ''));
    const insuranceCostValue = Number(insuranceCost);

    let hasError = false;

    if (Number.isNaN(downPaymentValue)) {
      setError('Down payment must be a number.');
      hasError = true;
    }

    if (Number.isNaN(processingFeeValue) || processingFeeValue < 0) {
      setProcessingFeeError('Processing fee must be a valid positive number.');
      hasError = true;
    }


    if (Number.isNaN(insuranceCostValue) || insuranceCostValue < 1 || insuranceCostValue > 100) {
      setInsuranceCostError('Insurance cost must be between 1 and 100.');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        downPaymentPct: downPaymentValue,
        processingFeePct: processingFeeValue,
        insuranceCost: insuranceCostValue,
      };

      await updateCalculatorConfig(payload);
      Swal.fire({
        icon: 'success',
        title: 'Calculator Updated!',
        text: 'Calculator input updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });
      setSuccess(null);
      setPage(1); // refresh first page to see latest update
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: e.message || 'Failed to update.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });

      console.error('Calculator update error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ─── Pagination helpers ──────────────────────────────────────────────────
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const totalEntries = historyPagination.total;
  const totalPages = historyPagination.totalPages;
  const safePage = totalPages ? Math.min(page, totalPages) : page;
  const startIdx = (safePage - 1) * pageSize;
  const canGoPrev = safePage > 1;
  const canGoNext = totalPages ? safePage < totalPages : historyHasMore;

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (totalPages) {
      setPage((p) => Math.min(totalPages, p + 1));
    } else {
      setPage((p) => p + 1);
    }
  };

  const Spinner = () => (
  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
);

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-900">Calculator Input Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Set, modify, and track calculator input management.</p>
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      {/* ── Update Card ── (unchanged) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
  <div className="bg-white rounded-xl  p-6 mb-6">
  <form onSubmit={handleSubmit} className="space-y-4 justify-center items-center flex flex-col"> 
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Down Payment (%)
        </label>
        <input
          type="text"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Processing Fee (₦)
        </label>
        <input
          type="text"
          value={processingFee}
          onChange={handleProcessingFeeChange}
          className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {processingFeeError && (
          <p className="mt-1 text-sm text-red-600">{processingFeeError}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Insurance Cost (%)
        </label>
        <input
          type="text"
          value={insuranceCost}
          onChange={handleInsuranceCostChange}
          className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {insuranceCostError && (
          <p className="mt-1 text-sm text-red-600">{insuranceCostError}</p>
        )}
      </div>
    </div>
    <div className="flex justify-start"> {/* Align button to the left as well */}
      <button
        type="submit"
        disabled={loading}
        className="relative bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading && <Spinner />}
        Update Calculator
      </button>
    </div>
  </form>
</div>
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
                  <th className="py-3 px-4 font-medium">Processing Fee (₦)</th>
                  <th className="py-3 px-4 font-medium">Insurance Cost (%)</th>
                  <th className="py-3 px-4 font-medium">Changed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyItems.map((item, index) => {
                  const serial = startIdx + index + 1;
                  const date = formatDate(item.createdAt);
                  // Format values
                  const downPct = item.downPaymentPct != null ? `${item.downPaymentPct}%` : '-';
                  const feeAmount = item.processingFee ?? item.processingFeePct ?? null;
                  const feeDisplay = feeAmount != null ? `₦${Number(feeAmount).toLocaleString()}` : '-';
                  const insurance =
                    item.insuranceCost != null
                      ? `${item.insuranceCost.toLocaleString()}%`
                      : '-';
                  const changedBy = item.changedByEmail || item.changedByRole || 'System';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{serial}</td>
                      <td className="py-3 px-4 text-gray-700">{date}</td>
                      <td className="py-3 px-4 text-gray-700">{downPct}</td>
                      <td className="py-3 px-4 text-gray-700">{feeDisplay}</td>
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