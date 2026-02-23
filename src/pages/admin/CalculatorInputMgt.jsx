import React, { useState } from 'react';
import { Download, CalendarDays, ArrowDown, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';

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

const CalculatorInputMgt = () => {
  const [downPayment, setDownPayment] = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');
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
      <h1 className="text-2xl font-bold text-gray-900">Calculator Input Management</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Set, modify, and track calculator input management.</p>

      {/* Update Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Update Calculator Input</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify calculator input</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Update Details
          </button>
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-8">
          <p className="text-sm font-medium text-gray-700 pt-2">Input calculator details</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update down payment (%)</label>
              <input
                type="text"
                placeholder="Enter down payment"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update processing fee (%)</label>
              <input
                type="text"
                placeholder="Enter processing fee"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update insurance cost</label>
              <input
                type="text"
                placeholder="Enter insurance cost"
                value={insuranceCost}
                onChange={(e) => setInsuranceCost(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Calculator Input Update History</p>
            <p className="text-sm text-gray-400 mt-0.5">View and track all previous calculator input details</p>
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
          {/* Head */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 pb-3 mb-1">
            {[
              'Date Modified',
              'Previous Down Payment',
              'Updated Down Payment',
              'Previous Processing Fee',
              'Updated Processing Fee',
              'Previous Insurance Cost',
              'Updated Insurance Cost',
            ].map((col) => (
              <button
                key={col}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 text-left leading-tight pr-2"
              >
                {col} <ArrowDown size={11} className="text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-gray-50">
            {pageItems.map((row) => (
              <div key={row.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr] py-4">
                <span className="text-sm text-gray-700">{row.date}</span>
                <span className="text-sm text-gray-700">{row.prev}</span>
                <span className="text-sm text-gray-700">{row.upd}</span>
                <span className="text-sm text-gray-700">{row.prevFee}</span>
                <span className="text-sm text-gray-700">{row.updFee}</span>
                <span className="text-sm text-gray-700">{row.prevIns}</span>
                <span className="text-sm text-gray-700">{row.updIns}</span>
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

export default CalculatorInputMgt;
