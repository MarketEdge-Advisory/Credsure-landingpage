import React, { useState } from 'react';
import { Download, CalendarDays, ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';

const historyData = Array.from({ length: 100 }, (_, i) => {
  const rates = [
    { prev: '50%', updated: '60%' },
    { prev: '40%', updated: '50%' },
    { prev: '20%', updated: '30%' },
    { prev: '10%', updated: '15%' },
    { prev: '40%', updated: '50%' },
    { prev: '5%',  updated: '10%' },
  ];
  const r = rates[i % rates.length];
  return { id: i + 1, date: '23/09/26, 09:11:04', prevRate: r.prev, updatedRate: r.updated };
});

const PAGE_SIZES = [10, 20, 50];

const InterestRateManagement = () => {
  const [interestRate, setInterestRate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const totalEntries = historyData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = historyData.slice(startIdx, startIdx + pageSize);

  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900">Interest Rate Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Set, modify, and track interest rates for car products in one centralized dashboard.
      </p>

      {/* Update Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Update Interest Rate</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify interest rate</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Update Rates
          </button>
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-8">
          <p className="text-sm font-medium text-gray-700 pt-2">Input rate details</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="text"
              placeholder="Input interest rate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* History Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Interest Rate Update History</p>
            <p className="text-sm text-gray-400 mt-0.5">View and track all previous interest rate changes</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Download
            </button>
            <div className="relative">
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
            </div>
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
            {pageItems.map((row) => (
              <div key={row.id} className="grid grid-cols-3 py-4">
                <span className="text-sm text-gray-700">{row.date}</span>
                <span className="text-sm text-gray-700">{row.prevRate}</span>
                <span className="text-sm text-gray-700">{row.updatedRate}</span>
              </div>
            ))}
          </div>
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
