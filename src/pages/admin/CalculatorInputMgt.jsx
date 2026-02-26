import React, { useState } from 'react';
import { updateCalculatorConfig } from '../../api/adminConfig';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        <form
          className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4"
          onSubmit={async (e) => {
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
              setSuccess('Calculator input updated successfully.');
            } catch (e) {
              setError(e.message || 'Failed to update.');
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <p className="font-semibold text-gray-900">Update Calculator Input</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify calculator input</p>
          </div>
          {/* Update button for desktop */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Details'}
            </button>
            {(error || success) && (
              <div className={`mt-4 text-sm font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>{error || success}</div>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
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
            {/* Update button for mobile (bottom, full width) */}
            <button
              type="submit"
              className="block md:hidden w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Details'}
            </button>
            {/* Feedback messages for mobile */}
            <div className="block md:hidden">
              {(error || success) && (
                <div className={`mt-4 text-sm font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>{error || success}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInputMgt;
