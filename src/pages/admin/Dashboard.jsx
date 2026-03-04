import React, { useState } from 'react';
import { Users, CheckCircle2, BadgeCheck, CreditCard, Calendar, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
// Fetch applications from backend
import financeApplicationsApi from '../../api/financeApplications';

const PAGE_SIZES = [10, 20, 50];

const preApprovalData = [
  { month: 'Jan',  value: 7000,  remainder: 17000 },
  { month: 'Feb',  value: 11500, remainder: 12500 },
  { month: 'Mar',  value: 7500,  remainder: 16500 },
  { month: 'Apr',  value: 4000,  remainder: 20000 },
  { month: 'May',  value: 17000, remainder: 7000  },
  { month: 'Jun',  value: 9500,  remainder: 14500 },
  { month: 'Jul',  value: 15000, remainder: 9000  },
  { month: 'Aug',  value: 15500, remainder: 8500  },
  { month: 'Sept', value: 7000,  remainder: 17000 },
  { month: 'Oct',  value: 11000, remainder: 13000 },
  { month: 'Nov',  value: 9000,  remainder: 15000 },
  { month: 'Dec',  value: 10500, remainder: 13500 },
];

const visitorsData = [
  { month: 'Jan',  visitors: 11500 },
  { month: 'Feb',  visitors: 12200 },
  { month: 'Mar',  visitors: 13000 },
  { month: 'Apr',  visitors: 13800 },
  { month: 'May',  visitors: 14600 },
  { month: 'Jun',  visitors: 17000 },
  { month: 'Jul',  visitors: 18200 },
  { month: 'Aug',  visitors: 19100 },
  { month: 'Sept', visitors: 19900 },
  { month: 'Oct',  visitors: 20800 },
  { month: 'Nov',  visitors: 21900 },
  { month: 'Dec',  visitors: 23000 },
];

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

const stats = [
  {
    label: 'Total Visitors',
    value: '12,847',
    pct: '10%',
    trend: 'up',
    icon: Users,
    cardBg: 'bg-[#3eb5f1]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    textColor: 'text-white',
    subTextColor: 'text-white/80',
    badgeBg: 'bg-white',
    badgeText: 'text-gray-700',
  },
  {
    label: 'Active Listings',
    value: '14',
    pct: '01%',
    trend: 'down',
    icon: CheckCircle2,
    cardBg: 'bg-[#eaf7f0]',
    iconBg: 'bg-green-600',
    iconColor: 'text-white',
    textColor: 'text-gray-900',
    subTextColor: 'text-gray-500',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-500',
  },
  {
    label: 'Pre-Approvals',
    value: '11,00',
    pct: '07%',
    trend: 'up',
    icon: BadgeCheck,
    cardBg: 'bg-[#f3eeff]',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    textColor: 'text-gray-900',
    subTextColor: 'text-gray-500',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-600',
  },
  {
    label: 'Average Down Payment',
    value: '₦2.68M',
    pct: '01%',
    trend: 'down',
    icon: CreditCard,
    cardBg: 'bg-[#fdf3e7]',
    iconBg: 'bg-orange-400',
    iconColor: 'text-white',
    textColor: 'text-gray-900',
    subTextColor: 'text-gray-500',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-500',
  },
];

const Dashboard = () => {
  const [period, setPeriod] = useState('This year');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('This year');
  const [showChartPicker, setShowChartPicker] = useState(false);
  const [barPeriod, setBarPeriod] = useState('This year');
  const [showBarPicker, setShowBarPicker] = useState(false);

  return (
    <div className="p-8 min-w-0 w-full">
      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          {/* <p className="text-gray-500 text-sm mt-1">
            This overview provides a comprehensive snapshot of website activities.
          </p> */}
        </div>

        
      </div>

     
      <RecentApplications />
    </div>
  );
};

/* ── Recent Pre-Approval Applications ── */
const statusStyle = {
  Approved:     'border border-green-400 text-green-600 bg-green-50',
  Pending:      'border border-yellow-400 text-yellow-600 bg-yellow-50',
  'Under Review': 'border border-pink-400 text-pink-600 bg-pink-50',
};

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [showFilters, setShowFilters] = useState(false);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterEmployment, setFilterEmployment] = useState('');
  const [filterIncome, setFilterIncome] = useState('');

  React.useEffect(() => {
    setLoading(true);
    financeApplicationsApi.getAll()
      .then((res) => {
        // Extract items array from backend response
        let data = res?.data?.items;
        if (!Array.isArray(data)) data = data ? [data] : [];
        setApplications(data);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // Map backend fields to table columns
  const mapped = applications.map((a) => ({
    id: a.id,
    name: a.fullName,
    email: a.email,
    phone: a.phoneNumber,
    income: a.estimatedNetMonthlyIncome ? `₦${Number(a.estimatedNetMonthlyIncome).toLocaleString()}` : '',
    employment: a.employmentStatus,
    vehicle: a.selectedVehicle,
    amount: a.vehicleAmount ? `₦${Number(a.vehicleAmount).toLocaleString()}` : '',
    down: a.downPayment ? `₦${Number(a.downPayment).toLocaleString()}` : '',
    status: a.status === 'PENDING' ? 'Pending' : a.status === 'APPROVED' ? 'Approved' : a.status === 'UNDER_REVIEW' ? 'Under Review' : a.status,
  }));

  let filtered = mapped.filter((r) =>
    `${r.name} ${r.status} ${r.vehicle}`.toLowerCase().includes(search.toLowerCase())
  );
  // Apply advanced filters
  if (filterEmail) {
    filtered = filtered.filter((r) => r.email && r.email.toLowerCase().includes(filterEmail.toLowerCase()));
  }
  if (filterEmployment) {
    filtered = filtered.filter((r) => r.employment === filterEmployment);
  }
  if (filterIncome) {
    // Remove non-numeric chars and compare as number
    const minIncome = Number(filterIncome.replace(/[^\d]/g, ''));
    filtered = filtered.filter((r) => {
      const incomeNum = Number((r.income || '').replace(/[^\d]/g, ''));
      return !isNaN(minIncome) && incomeNum >= minIncome;
    });
  }

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ k }) => (
    <span className={`ml-1 text-gray-400 ${sortKey === k ? 'text-gray-700' : ''}`}>↓</span>
  );

  return (
    <div className="mt-6 bg-white rounded-sm border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recent Pre-Approval Applications</h2>
          <p className="text-gray-400 text-sm mt-0.5">Latest processed pre-approval applications</p>
        </div>
        <div className="w-full flex items-center justify-between flex-wrap">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search name, status, vehicle..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-64 focus:outline-none focus:border-blue-400 bg-gray-50"
            />
          </div>
          {/* Filter Button */}
          <div className="flex items-center justify-between gap-2">
          <button
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setShowFilters((v) => !v)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A2 2 0 0 0 13 14.586V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-3.414a2 2 0 0 0-.293-1.293L2.293 6.707A1 1 0 0 1 2 6V4z" />
            </svg>
            Filter
          </button>
          {/* Download */}
          <button
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => {
              // CSV export of filtered table
              const headers = ['Full Name','Phone Number','Vehicle Selected','Vehicle Amount','Down Payment','Status'];
              const rows = paginated.map(row => [row.name, row.phone, row.vehicle, row.amount, row.down, row.status]);
              let csv = headers.join(',') + '\n';
              csv += rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'dashboard-applications.csv';
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 100);
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download
          </button>
          {/* Custom Date */}
          {/* <div className="relative">
            <button
              onClick={() => setShowDatePicker((o) => !o)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Calendar size={15} className="text-gray-500" />
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
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                  Email <span className="ml-1 text-gray-400">↓</span>
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                  Employment Status <span className="ml-1 text-gray-400">↓</span>
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                  Monthly Income <span className="ml-1 text-gray-400">↓</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 text-gray-700">{row.email}</td>
                  <td className="px-4 py-2 text-gray-700">{row.employment}</td>
                  <td className="px-4 py-2 text-gray-700">{row.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table + footer in shared horizontal scroll */}
      <div className="overflow-x-auto">
      <div className="min-w-max">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {/* Only show columns: Full Name, Phone Number, Vehicle Selected, Vehicle Amount, Down Payment, Status */}
              {[
                { label: 'Full Name',        key: 'name' },
                { label: 'Phone Number',     key: 'phone' },
                { label: 'Vehicle Selected', key: 'vehicle' },
                { label: 'Vehicle Amount',   key: 'amount' },
                { label: 'Down Payment',     key: 'down' },
                { label: 'Status',           key: 'status' },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-800 select-none"
                >
                  {label}<SortIcon k={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr>
    <td colSpan={6} className="py-10 text-center">
      <div className="flex justify-center items-center">
        <Loader2 size={48} className="text-gray-500 animate-spin" />
      </div>
    </td>
  </tr>
) : paginated.length === 0 ? (
  <tr>
    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
      No results found.
    </td>
  </tr>
) : (
              paginated.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 text-blue-500 font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{row.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{row.vehicle}</td>
                  <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                  <td className="px-6 py-4 text-gray-700">{row.down}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${statusStyle[row.status] ?? ''}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-wrap gap-3 w-full">
        <p className="text-sm text-gray-500">
          Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length} entries
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
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded bg-white font-medium text-gray-700">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      </div>{/* /min-w-max */}
      </div>{/* /overflow-x-auto */}
    </div>
  );
};

export default Dashboard;
