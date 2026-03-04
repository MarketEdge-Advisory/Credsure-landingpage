import React, { useState, useEffect } from 'react';
import { updateCalculatorConfig, getAdminConfig } from '../../api/adminConfig';
import Swal from 'sweetalert2';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const rateRows = [
  { prev: '50%', upd: '60%', prevFee: '50%', updFee: '50%', prevIns: '50%', updIns: '50%' },
  { prev: '40%', upd: '50%', prevFee: '40%', updFee: '40%', prevIns: '40%', updIns: '40%' },
  { prev: '20%', upd: '30%', prevFee: '20%', updFee: '20%', prevIns: '20%', updIns: '20%' },
  { prev: '10%', upd: '15%', prevFee: '10%', updFee: '10%', prevIns: '10%', updIns: '10%' },
  { prev: '50%', upd: '60%', prevFee: '50%', updFee: '50%', prevIns: '50%', updIns: '50%' },
  { prev: '40%', upd: '50%', prevFee: '40%', updFee: '40%', prevIns: '40%', updIns: '40%' },
  { prev: '20%', upd: '30%', prevFee: '20%', updFee: '20%', prevIns: '20%', updIns: '20%' },
  { prev: '10%', upd: '15%', prevFee: '10%', updFee: '10%', prevIns: '10%', updIns: '10%' },
  { prev: '40%', upd: '50%', prevFee: '40%', updFee: '40%', prevIns: '40%', updIns: '40%' },
  { prev: '5%',  upd: '10%', prevFee: '5%',  updFee: '5%',  prevIns: '5%',  updIns: '5%'  },
];

const historyData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  date: '23/09/26, 09:11:04',
  ...rateRows[i % rateRows.length],
}));

const PAGE_SIZES = [10, 20, 50];

// ─── Spinner Component ────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CalculatorInputMgt = () => {
  // Form state
  const [downPayment, setDownPayment]     = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');

  // UI state
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  // Pagination state
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Pagination calculations
  const totalEntries = historyData.length;
  const totalPages   = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage     = Math.min(page, totalPages);
  const startIdx     = (safePage - 1) * pageSize;
  const currentRows  = historyData.slice(startIdx, startIdx + pageSize);

  // ─── Prefill inputs on mount from API ───────────────────────────────────
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setFetching(true);
        const response = await getAdminConfig();
        // Extract calculator config from response.data.calculator
        const config = response?.data?.calculator;

        setDownPayment(String(config?.downPaymentPct   ?? ''));
        setProcessingFee(String(config?.processingFeePct ?? ''));
        setInsuranceCost(String(config?.insuranceCost    ?? ''));
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Config',
          text: e.message || 'Unable to fetch calculator configuration. Please refresh and try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#e53e3e',
        });
      } finally {
        setFetching(false);
      }
    };
    fetchConfig();
  }, []);

  // ─── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateCalculatorConfig({
        downPaymentPct:   Number(downPayment),
        processingFeePct: Number(processingFee),
        insuranceCost:    Number(insuranceCost),
      });
      Swal.fire({
        icon: 'success',
        title: 'Calculator Updated!',
        text: 'Calculator input updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2d9de5',
      });
      setSuccess(null);
    } catch (e) {
      // setError(e.message || 'Failed to update.');
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
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-8 w-full">

      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900">Calculator Input Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Set, modify, and track calculator input management.</p>

      {/* ── Update Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">

            {/* Left: title */}
            <div>
              <p className="font-semibold text-gray-900">Update Calculator Input</p>
              <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify calculator input</p>
            </div>

            {/* Desktop: submit button + feedback */}
            <div className="hidden md:flex flex-col items-end gap-2">
              <button
                type="submit"
                disabled={loading || fetching}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Details'}
              </button>
              {(error || success) && (
                <p className={`text-sm font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
                  {error || success}
                </p>
              )}
            </div>
          </div>

          {/* Input grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
            <p className="text-sm font-medium text-gray-700 pt-2">Input calculator details</p>

            <div className="flex flex-col gap-4">

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update down payment (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={fetching ? 'Loading...' : 'Enter down payment'}
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    disabled={fetching}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {fetching && <Spinner />}
                </div>
              </div>

              {/* Processing Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update processing fee (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={fetching ? 'Loading...' : 'Enter processing fee'}
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    disabled={fetching}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {fetching && <Spinner />}
                </div>
              </div>

              {/* Insurance Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update insurance cost
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={fetching ? 'Loading...' : 'Enter insurance cost'}
                    value={insuranceCost}
                    onChange={(e) => setInsuranceCost(e.target.value)}
                    disabled={fetching}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {fetching && <Spinner />}
                </div>
              </div>

              {/* Mobile: submit button */}
              <button
                type="submit"
                disabled={loading || fetching}
                className="block md:hidden w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Details'}
              </button>

              {/* Mobile: feedback */}
              <div className="block md:hidden">
                {(error || success) && (
                  <p className={`text-sm font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
                    {error || success}
                  </p>
                )}
              </div>

            </div>
          </div>
        </form>
      </div>

      {/* ── History Table Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* Table header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="font-semibold text-gray-900">Update History</p>
            <p className="text-sm text-gray-400 mt-0.5">All previous calculator input updates</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="py-3 px-4 font-medium">S/N</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Prev. Rate</th>
                <th className="py-3 px-4 font-medium">Upd. Rate</th>
                <th className="py-3 px-4 font-medium">Prev. Fee</th>
                <th className="py-3 px-4 font-medium">Upd. Fee</th>
                <th className="py-3 px-4 font-medium">Prev. Ins.</th>
                <th className="py-3 px-4 font-medium">Upd. Ins.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-500">{row.id}</td>
                  <td className="py-3 px-4 text-gray-700">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700">{row.prev}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{row.upd}</td>
                  <td className="py-3 px-4 text-gray-700">{row.prevFee}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{row.updFee}</td>
                  <td className="py-3 px-4 text-gray-700">{row.prevIns}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{row.updIns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">

          {/* Page size selector */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Entry count + nav */}
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
      </div>

    </div>
  );
};

export default CalculatorInputMgt;