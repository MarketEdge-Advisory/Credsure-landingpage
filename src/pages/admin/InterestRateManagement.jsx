import React, { useState, useEffect } from 'react';
import { getInterestRateHistory, updateInterestRate } from '../../api/adminConfig';
import Swal from 'sweetalert2';
import { Download, CalendarDays, ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { convertToCSV, downloadCSV } from '../../utils/csvExport';

const PAGE_SIZES = [10, 20, 50];

const InterestRateManagement = () => {
  const [interestRate, setInterestRate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalEntries, setTotalEntries] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Fetch history with pagination parameters
  const fetchHistory = (pageNum, size) => {
    setLoading(true);
    setError('');
    getInterestRateHistory(pageNum, size)
      .then((res) => {
        console.log('API response:', res); // Debug: see the structure

        // Backends often return { status, message, data: { items, pagination } }
        const payload = res?.data ?? res;
        const items = payload?.items || [];
        const totalFromApi = payload?.pagination?.total ?? payload?.total ?? null;

        const mapped = items.map((item, idx) => ({
          id: item.id || idx,
          date: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
          prevRate: item.previousRatePct !== null ? `${item.previousRatePct}%` : '',
          updatedRate: item.newRatePct !== null ? `${item.newRatePct}%` : '',
        }));

        setHistoryData(mapped);
        setTotalEntries(totalFromApi);
        setHasMore(items.length === pageSize);
      })
      .catch((e) => setError(e.message || 'Failed to load history'))
      .finally(() => setLoading(false));
  };

  // Initial fetch and fetch on page/pageSize change
  useEffect(() => {
    fetchHistory(page, pageSize);
  }, [page, pageSize]);

  // After updating interest rate, refetch the current page
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    try {
      await updateInterestRate(Number(interestRate));
      Swal.fire({
        icon: 'success',
        title: 'Interest Rate Updated!',
        text: 'Interest rate updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });
      fetchHistory(page, pageSize); // Refresh current page
      setInterestRate(''); // Clear input
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: e.message || 'Failed to update.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const totalPages = totalEntries != null
    ? Math.max(1, Math.ceil(totalEntries / pageSize))
    : hasMore
    ? page + 1
    : 1;

  const canGoNext = totalEntries != null ? page < totalPages : hasMore;
  const canGoPrev = page > 1;
  const safePage = Math.min(page, totalPages);

  // Ensure page stays within bounds when totalPages changes
  useEffect(() => {
    if (totalEntries != null && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page, totalEntries]);

  const handleDownload = () => {
    const headers = ['Date Modified', 'Previous Rate', 'Updated Rate'];
    const dataForExport = historyData.map(row => ({
      'Date Modified': row.date,
      'Previous Rate': row.prevRate,
      'Updated Rate': row.updatedRate,
    }));
    const csv = convertToCSV(dataForExport, headers);
    downloadCSV(csv, 'interest-rate-history.csv');
  };

  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <h1 className="text-sm md:text-lg font-bold text-gray-900">Interest Rate Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Set, modify, and track interest rates for car products in one centralized dashboard.
      </p>

      {/* Update Card */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <form onSubmit={handleUpdateSubmit}>
          {/* Top row: title + button (button hidden on mobile) */}
          <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5">
            <div>
              <p className="font-semibold text-gray-900 text-sm md:text-sm">Update Interest Rate</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Input the details below to modify interest rate</p>
            </div>
            <button
              type="submit"
              className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 items-center gap-2 shrink-0"
              disabled={updateLoading}
            >
              {updateLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>}
              {updateLoading ? 'Updating...' : 'Update Rates'}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Centered input */}
          <div className="flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6">
            <div className="w-full max-w-lg">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 text-center">
                Input rate details Interest Rate (%)
              </label>
              <input
                type="text"
                placeholder="Input interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 ${updateError ? 'border-red-500' : 'border-gray-200'}`}
              />
              {/* Mobile submit button */}
              <button
                type="submit"
                disabled={updateLoading}
                className="md:hidden w-full mt-4 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
              >
                {updateLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>}
                {updateLoading ? 'Updating...' : 'Update Rates'}
              </button>
              {(updateError || updateSuccess) && (
                <p className={`mt-3 text-sm font-medium text-center ${updateError ? 'text-red-600' : 'text-green-600'}`}>
                  {updateError || updateSuccess}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* History Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-xs md:text-sm">Interest Rate Update History</p>
            <p className="text-sm text-gray-400 mt-0.5">View and track all previous interest rate changes</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 border cursor-pointer border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleDownload}
            >
              <Download size={15} />
              Download
            </button>
            {/* Optional Date Picker – uncomment if needed */}
            {/* <div className="relative">
              <button
                onClick={() => setShowDatePicker((o) => !o)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <CalendarDays size={15} />
                Custom Date
              </button>
              <DateRangePicker
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={(range) => setDateRange(range)}
              />
            </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="w-full -mx-6 overflow-x-auto" style={{width: 'calc(100% + 3rem)'}}>
          <div className="min-w-[480px]">
          {/* Table Head */}
          <div className="grid border-b border-gray-100 pb-3 mb-1 px-6" style={{gridTemplateColumns: '3rem 1fr 1fr 1fr'}}>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left whitespace-nowrap">
              S/N
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left whitespace-nowrap">
              Date Modified <ArrowDownUp size={12} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left whitespace-nowrap px-6">
              Previous Rate <ArrowDownUp size={12} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left whitespace-nowrap">
              Updated Rate <ArrowDownUp size={12} className="text-gray-400" />
            </button>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {loading ? (
              <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500 text-sm">{error}</div>
            ) : historyData.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No history found.</div>
            ) : (
              historyData.map((row) => (
                <div key={row.id} className={`grid py-4 px-6 border-b border-gray-50 ${historyData.indexOf(row) % 2 !== 0 ? 'bg-[#F8F9FC]' : 'bg-white'}`} style={{gridTemplateColumns: '3rem 1fr 1fr 1fr'}}>
                  <span className="text-sm text-gray-700 whitespace-nowrap">{(page - 1) * pageSize + historyData.indexOf(row) + 1}</span>
                  <span className="text-sm text-gray-700 whitespace-nowrap">{row.date}</span>
                  <span className="text-sm text-gray-700 whitespace-nowrap px-6">{row.prevRate}</span>
                  <span className="text-sm text-gray-700 whitespace-nowrap">{row.updatedRate}</span>
                </div>
              ))
            )}
          </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {historyData.length === 0
              ? 'Showing 0 entries'
              : `Showing ${(page - 1) * pageSize + 1}–${(page - 1) * pageSize + historyData.length} of ${totalEntries != null ? totalEntries : 'many'} entries${totalEntries == null ? ' (approx.)' : ''}`}
          </p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-500">Show</span>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((o) => !o)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
              >
                {pageSize}
                <ChevronDown size={13} />
              </button>
              {pageSizeOpen && (
                <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-md shadow-md z-10 min-w-full">
                  {PAGE_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setPageSize(s);
                        setPage(1);
                        setPageSizeOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${s === pageSize ? 'text-blue-500 font-medium' : 'text-gray-700'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">entries</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canGoPrev || loading}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-xs sm:text-sm text-gray-700 font-medium bg-white">
                {safePage}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!canGoNext || loading}
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

export default InterestRateManagement;