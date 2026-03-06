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
  const [totalEntries, setTotalEntries] = useState(0);

  // Fetch history with pagination parameters
  const fetchHistory = (pageNum, size) => {
    setLoading(true);
    setError('');
    getInterestRateHistory(pageNum, size)
      .then((res) => {
        console.log('API response:', res); // Debug: see the structure

        // Extract items and total from the response
        const items = res?.data?.items || [];
        const total = res?.data?.pagination?.total || items.length;

        const mapped = items.map((item, idx) => ({
          id: item.id || idx,
          date: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
          prevRate: item.previousRatePct !== null ? `${item.previousRatePct}%` : '',
          updatedRate: item.newRatePct !== null ? `${item.newRatePct}%` : '',
        }));

        setHistoryData(mapped);
        setTotalEntries(total);
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

  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);

  // Ensure page stays within bounds when totalPages changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

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
      <h1 className="text-2xl font-bold text-gray-900">Interest Rate Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Set, modify, and track interest rates for car products in one centralized dashboard.
      </p>

      {/* Update Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <form
          className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4"
          onSubmit={handleUpdateSubmit}
        >
          <div>
            <p className="font-semibold text-gray-900">Update Interest Rate</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify interest rate</p>
          </div>
          {/* Update button for desktop */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={updateLoading}
            >
              {updateLoading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-blue-600 rounded-full inline-block"></span>}
              {updateLoading ? 'Updating...' : 'Update Rate'}
            </button>
            {(updateError || updateSuccess) && (
              <div className={`mt-4 text-sm font-medium ${updateError ? 'text-red-600' : 'text-green-600'}`}>{updateError || updateSuccess}</div>
            )}
          </div>
          {/* Input and mobile button inside form */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
            <p className="text-sm font-medium text-gray-700 pt-2">Input rate details</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="text"
                min="1"
                max="100"
                step="0.01"
                placeholder="Input interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 ${updateError ? 'border-red-500' : 'border-gray-200'}`}
              />
              {/* Update button for mobile (bottom, full width) */}
              <button
                type="submit"
                disabled={updateLoading}
                className={`md:hidden w-full mt-4 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-center transition-colors
                  ${updateLoading ? 'bg-blue-400 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                  ${updateError ? 'border-red-500' : 'border-gray-200'}`}
              >
                {updateLoading && (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-blue-600 rounded-full inline-block"></span>
                )}
                {updateLoading ? 'Updating...' : 'Update Rate'}
              </button>
              {/* Feedback messages for mobile */}
              <div className="block md:hidden">
                {(updateError || updateSuccess) && (
                  <div className={`mt-4 text-sm font-medium ${updateError ? 'text-red-600' : 'text-green-600'}`}>{updateError || updateSuccess}</div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* History Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div>
            <p className="font-semibold text-gray-900">Interest Rate Update History</p>
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
        <div className="w-full">
          {/* Table Head */}
          <div className="grid grid-cols-3 border-b border-gray-100 pb-3 mb-1">
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
              Date Modified <ArrowDownUp size={12} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
              Previous Rate <ArrowDownUp size={12} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
              Updated Rate <ArrowDownUp size={12} className="text-gray-400" />
            </button>
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-gray-50">
            {loading ? (
              <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500 text-sm">{error}</div>
            ) : historyData.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No history found.</div>
            ) : (
              historyData.map((row) => (
                <div key={row.id} className="grid grid-cols-3 py-4">
                  <span className="text-sm text-gray-700">{row.date}</span>
                  <span className="text-sm text-gray-700">{row.prevRate}</span>
                  <span className="text-sm text-gray-700">{row.updatedRate}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {totalEntries === 0
              ? 'Showing 0 entries'
              : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalEntries)} of ${totalEntries} entries`}
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

export default InterestRateManagement;