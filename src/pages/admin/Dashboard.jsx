import React, { useState } from 'react';
import {
  Users, CheckCircle2, BadgeCheck, CreditCard, Calendar,
  TrendingUp, TrendingDown, Loader2, ChevronDown, ChevronRight,
  Mail, Briefcase, DollarSign, Download
} from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import financeApplicationsApi from '../../api/financeApplications';
import { getInterestRateHistory } from '../../api/adminConfig';
import { convertToCSV, downloadCSV } from '../../utils/csvExport';
import DashboardOverview from '../../components/admin/DashboardOverview';

const PAGE_SIZES = [10, 20, 50];

const formatY = (v) => `${v / 1000}k`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
        {`${Math.round(payload[0].value / 1000)}k`}
      </div>
    );
  }
  return null;
};

const stats = [ /* unchanged */ ];

const Dashboard = () => {
  const [period, setPeriod] = useState('This year');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('This year');
  const [showChartPicker, setShowChartPicker] = useState(false);
  const [barPeriod, setBarPeriod] = useState('This year');
  const [showBarPicker, setShowBarPicker] = useState(false);

  return (
    <div className="p-8 min-w-0 w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-sm md:text-lg font-bold text-gray-900">Dashboard Overview</h1>
        </div>
      </div>
      <DashboardOverview />
      <RecentApplications />
    </div>
  );
};

const statusStyle = {
  Approved:     'border border-green-400 text-green-600 bg-green-50',
  Pending:      'border border-yellow-400 text-yellow-600 bg-yellow-50',
  'Under Review': 'border border-pink-400 text-pink-600 bg-pink-50',
};

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [rateHistory, setRateHistory] = useState([]); // sorted ascending by createdAt
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [status, setStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [expandedRows, setExpandedRows] = useState(new Set());   // track expanded rows

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (status) params.status = status;

      const res = await financeApplicationsApi.getAll(params);
      const items = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setApplications(items);

      // Use a backend-provided total if available (avoid treating items.length as the full count)
      const totalFromApi = res?.total ?? res?.data?.total ?? res?.meta?.total ?? null;
      setTotalEntries(totalFromApi);

      // If API doesn't supply total, allow next page when we got a full page back.
      setHasMore(items.length === pageSize);
    } catch (e) {
      setApplications([]);
      setTotalEntries(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, [page, pageSize, status]);

  // Fetch ALL interest rate history pages (backend max is 50 per page)
  React.useEffect(() => {
    const fetchAllRateHistory = async () => {
      const LIMIT = 50;
      let currentPage = 1;
      let allItems = [];
      while (true) {
        try {
          const res = await getInterestRateHistory(currentPage, LIMIT);
          const items = Array.isArray(res?.data?.items) ? res.data.items
            : Array.isArray(res?.items) ? res.items
            : [];
          allItems = allItems.concat(items);
          if (items.length < LIMIT) break; // last page
          currentPage++;
        } catch {
          break;
        }
      }
      const sorted = [...allItems].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setRateHistory(sorted);
    };
    fetchAllRateHistory();
  }, []);

  // Returns the interest rate that was active at a given ISO date string
  const getRateAtTime = (createdAt) => {
    if (!rateHistory.length || !createdAt) return null;
    const appTime = new Date(createdAt).getTime();
    // The rate before any recorded change
    let activeRate = rateHistory[0].previousRatePct;
    for (const entry of rateHistory) {
      if (new Date(entry.createdAt).getTime() <= appTime) {
        activeRate = entry.newRatePct;
      } else {
        break;
      }
    }
    return activeRate;
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // Map backend fields
  const mapped = applications.map((a) => ({
    id: a.id,
    name: a.fullName,
    email: a.email,
    phone: a.phoneNumber,
    income: a.estimatedNetMonthlyIncome ? `₦${Number(a.estimatedNetMonthlyIncome).toLocaleString()}` : '',
    employment: a.employmentStatus,
    vehicle: a.selectedVehicle,
    amount: a.vehicleAmount ? `₦${Number(a.vehicleAmount).toLocaleString()}` : '',
    down: a.downPayment != null ? `₦${Number(a.downPayment).toLocaleString()}` : '',
    interestRate: getRateAtTime(a.createdAt),
    createdAt: a.createdAt,
    status: a.status === 'PENDING' ? 'Pending' : a.status === 'APPROVED' ? 'Approved' : a.status === 'UNDER_REVIEW' ? 'Under Review' : a.status,
  }));

  // Apply search filter only (backend provides pagination already)
  let filtered = mapped.filter((r) =>
    `${r.name} ${r.status} ${r.vehicle}`.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      })
    : filtered;

  // Backend handles pagination; we still need UI controls for page number and enabling next/prev
  const paginated = sorted;
  const fetchedCount = Array.isArray(paginated) ? paginated.length : 0;
  const effectiveTotal = totalEntries != null ? totalEntries : fetchedCount;

  const totalPages = totalEntries != null
    ? Math.max(1, Math.ceil(effectiveTotal / pageSize))
    : hasMore
    ? page + 1
    : 1;

  const canGoNext = totalEntries != null ? page < totalPages : hasMore;
  const canGoPrev = page > 1;

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = startIndex + fetchedCount - 1;

  const displayStart = fetchedCount === 0 ? 0 : startIndex;
  const displayEnd = fetchedCount === 0 ? 0 : endIndex;
  const displayTotal = totalEntries != null
    ? effectiveTotal
    : hasMore
    ? `${displayEnd}+`
    : effectiveTotal;
  const showApprox = totalEntries == null && hasMore;

  const SortIcon = ({ k }) => (
    <span className={`ml-1 text-gray-400 ${sortKey === k ? 'text-gray-700' : ''}`}>↓</span>
  );

  const handleDownload = async () => {
    // Fetch rate history fresh at download time to ensure it's available
    let history = rateHistory;
    if (!history.length) {
      try {
        const LIMIT = 50;
        let currentPage = 1;
        let allItems = [];
        while (true) {
          const res = await getInterestRateHistory(currentPage, LIMIT);
          const items = Array.isArray(res?.data?.items) ? res.data.items
            : Array.isArray(res?.items) ? res.items
            : [];
          allItems = allItems.concat(items);
          if (items.length < LIMIT) break;
          currentPage++;
        }
        history = [...allItems].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setRateHistory(history);
      } catch {
        history = [];
      }
    }

    const resolveRate = (createdAt) => {
      if (!history.length || !createdAt) return '';
      const appTime = new Date(createdAt).getTime();
      let activeRate = history[0].previousRatePct;
      for (const entry of history) {
        if (new Date(entry.createdAt).getTime() <= appTime) {
          activeRate = entry.newRatePct;
        } else {
          break;
        }
      }
      return activeRate != null ? `${activeRate}%` : '';
    };

    const headers = [
      'Full Name',
      'Email',
      'Employment Status',
      'Monthly Income',
      'Phone Number',
      'Vehicle Selected',
      'Vehicle Amount',
      'Down Payment',
      'Interest Rate (%)',
    ];

    const dataForExport = paginated.map(row => ({
      'Full Name': row.name,
      'Email': row.email,
      'Employment Status': row.employment,
      'Monthly Income': row.income,
      'Phone Number': row.phone,
      'Vehicle Selected': row.vehicle,
      'Vehicle Amount': row.amount,
      'Down Payment': row.down,
      'Interest Rate (%)': resolveRate(row.createdAt),
    }));

    const csv = convertToCSV(dataForExport, headers);
    downloadCSV(csv, 'dashboard-applications.csv');
  };;

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="mt-6 bg-white rounded-sm border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-gray-900">Recent Pre-Approval Applications</h2>
          {/* <p className="text-gray-400 text-sm mt-0.5">Latest processed pre-approval applications</p> */}
        </div>
        <div className="w-full flex items-center justify-between flex-wrap gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search name, vehicle..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:border-blue-400 bg-gray-50"
            />
          </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      {/* Table + footer */}
      <div className="overflow-x-auto">
        <div>
          <table className="w-full text-xs table-fixed min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-2 py-4 text-left text-xs font-semibold text-gray-500 w-8">{/* Expand column */}</th>
                {[
                  { label: 'Full Name',        key: 'name',    cls: 'w-1/4' },
                  { label: 'Phone Number',     key: 'phone',   cls: 'w-36' },
                  { label: 'Vehicle Selected', key: 'vehicle', cls: '' },
                  { label: 'Vehicle Amount',   key: 'amount',  cls: 'w-32' },
                  { label: 'Down Payment',     key: 'down',    cls: 'w-32' },
                ].map(({ label, key, cls }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-800 select-none whitespace-nowrap ${cls}`}
                  >
                    {label}<SortIcon k={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 size={48} className="text-gray-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    No results found.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main row */}
                    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="px-2 py-4 text-gray-500">
                        <button
                          onClick={() => toggleRow(row.id)}
                          className="focus:outline-none hover:text-gray-700 transition-colors"
                        >
                          {expandedRows.has(row.id) ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-blue-500 font-medium">
                        <span className="block text-xs" title={row.name}>{row.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{row.phone}</td>
                      <td className="px-6 py-4 text-gray-700">{row.vehicle}</td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{row.amount}</td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{row.down}</td>
                    </tr>
                    {/* Expanded row - aligned under columns */}
                    {expandedRows.has(row.id) && (
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <td className="px-2 py-3" />
                        <td className="px-6 py-3">
                          <p className="text-xs font-normal text-gray-500 tracking-wider">Email</p>
                          <p className="text-gray-800 font-normal break-all">{row.email || '—'}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-xs font-normal text-gray-500 tracking-wider">Employment</p>
                          <p className="text-gray-800 font-normal">{row.employment || '—'}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-xs font-normal text-gray-500 tracking-wider">Monthly Income</p>
                          <p className="text-gray-800 font-normal">{row.income || '—'}</p>
                        </td>
                        <td colSpan={2} />
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-wrap gap-3 w-full">
            <p className="text-sm text-gray-500">
              Showing {displayStart}–{displayEnd} of {displayTotal} entries{showApprox ? ' (approx.)' : ''}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none"
              >
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span>entries</span>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canGoPrev || loading}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded bg-white font-medium text-gray-700">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!canGoNext || loading}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>{/* /div */}
      </div>{/* /div */}
    </div>
  );
};

export default Dashboard;