import React, { useState, useEffect } from 'react';
import {
  Users, BadgeCheck, Banknote,
  TrendingUp, TrendingDown, Calendar, ChevronDown,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import financeApplicationsApi from '../../api/financeApplications';
import { getCars } from '../../api/cars';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

// Static visitor data — no analytics API available
const VISITOR_MOCK = [10500, 11200, 12000, 13500, 15000, 17000, 18500, 19000, 20000, 21500, 23000, 27000];

// Static pre-approval trends mock (matching Figma)
const APPROVAL_MOCK = [5000, 11000, 7000, 3000, 16000, 9000, 13000, 15000, 5000, 10000, 7000, 10000];

const formatCurrency = (val) => {
  if (val == null) return '₦—';
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `₦${(val / 1_000).toFixed(1)}K`;
  return `₦${val.toLocaleString()}`;
};

const formatYAxis = (v) => `${(v / 1000).toFixed(0)}k`;

const DarkTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const val = payload[0].value + (payload[1]?.value ?? 0);
    return (
      <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
        {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
      </div>
    );
  }
  return null;
};

const PeriodDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const options = ['This year', 'Last 6 months', 'This month'];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap"
      >
        <Calendar size={13} className="text-gray-400" />
        {value}
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[130px]">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${value === o ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom bar with solid base + hatched top
const HatchedBar = (props) => {
  const { x, y, width, height, index } = props;
  if (!height || height <= 0) return null;
  const solidH = Math.round(height * 0.55);
  const hatchH = height - solidH;
  const patternId = `hatch-${index}`;
  return (
    <g>
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(-45)">
          <rect width="6" height="6" fill="#bfdbfe" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#3b82f6" strokeWidth="2.5" />
        </pattern>
      </defs>
      {/* hatched top portion */}
      <rect x={x} y={y} width={width} height={hatchH + 4} fill={`url(#${patternId})`} rx={4} ry={4} />
      {/* solid blue bottom portion — overlaps hatch by 4px to eliminate gap */}
      <rect x={x} y={y + hatchH} width={width} height={solidH} fill="#3b82f6" rx={0} />
      {/* rounded bottom corners cover */}
      <rect x={x} y={y + hatchH} width={width} height={4} fill="#3b82f6" />
    </g>
  );
};

const DashboardOverview = () => {
  const [activeCars, setActiveCars] = useState(null);
  const [totalApprovals, setTotalApprovals] = useState(null);
  const [avgDownPayment, setAvgDownPayment] = useState(null);
  const [globalPeriod, setGlobalPeriod] = useState('This year');
  const [chartPeriod, setChartPeriod] = useState('This year');
  const [barPeriod, setBarPeriod] = useState('This year');

  useEffect(() => {
    getCars()
      .then((data) => {
        const cars = Array.isArray(data) ? data : (data?.data ?? data?.cars ?? []);
        setActiveCars(cars.length);
      })
      .catch(() => {});

    financeApplicationsApi.getAll({ page: 1, limit: 500 })
      .then((res) => {
        const items = Array.isArray(res?.items) ? res.items
          : Array.isArray(res?.data?.items) ? res.data.items
          : Array.isArray(res?.data) ? res.data
          : [];
        const total = res?.total ?? res?.data?.total ?? null;
        setTotalApprovals(total != null ? total : items.length);

        const withDP = items.filter((a) => a.downPayment != null && a.downPayment > 0);
        const avg = withDP.length
          ? withDP.reduce((sum, a) => sum + Number(a.downPayment), 0) / withDP.length
          : 0;
        setAvgDownPayment(avg);
      })
      .catch(() => {});
  }, []);

  const visitorData = MONTHS.map((m, i) => ({ month: m, value: VISITOR_MOCK[i] }));
  const approvalData = MONTHS.map((m, i) => ({ month: m, value: APPROVAL_MOCK[i] }));

  const cards = [
    {
      label: 'Total Visitors',
      value: (12847).toLocaleString(),
      icon: <Users size={20} className="text-white" />,
      iconBg: 'bg-white/20',
      bgColor: '#3FA9F5',
      isBlue: true,
      labelColor: 'text-blue-100',
      valueColor: 'text-white',
      trendColor: 'text-blue-100',
      trend: { dir: 'up', pct: '10%', label: 'Vs Last year' },
    },
    {
      label: 'Active Listings',
      value: activeCars ?? '—',
      icon: <BadgeCheck size={20} className="text-white" />,
      iconBg: 'bg-green-500',
      bgColor: '#ECFEF8B2',
      isBlue: false,
      labelColor: 'text-gray-500',
      valueColor: 'text-gray-900',
      trendColor: 'text-gray-400',
      trend: { dir: 'down', pct: '01%', label: 'Vs Last Year' },
    },
    {
      label: 'Pre-Approvals',
      value: totalApprovals != null ? totalApprovals.toLocaleString() : '—',
      icon: <BadgeCheck size={20} className="text-white" />,
      iconBg: 'bg-fuchsia-600',
      bgColor: '#F5ECFEB2',
      isBlue: false,
      labelColor: 'text-gray-500',
      valueColor: 'text-gray-900',
      trendColor: 'text-gray-400',
      trend: { dir: 'up', pct: '07%', label: 'Vs Last year' },
    },
    {
      label: 'Average Down Payment',
      value: avgDownPayment != null ? formatCurrency(avgDownPayment) : '—',
      icon: <Banknote size={20} className="text-white" />,
      iconBg: 'bg-orange-500',
      bgColor: '#FEF6ECB2',
      isBlue: false,
      labelColor: 'text-gray-500',
      valueColor: 'text-gray-900',
      trendColor: 'text-gray-400',
      trend: { dir: 'down', pct: '01%', label: 'Vs Last Year' },
    },
  ];

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-start justify-between mb-5">
        <p className="text-xs text-gray-500">
          This overview provides a comprehensive snapshot of website activities.
        </p>
        <PeriodDropdown value={globalPeriod} onChange={setGlobalPeriod} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 border border-gray-100 shadow-sm"
            style={{ backgroundColor: card.bgColor }}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${card.iconBg}`}>
              {card.icon}
            </div>
            <p className={`text-xs font-medium mb-1 ${card.labelColor}`}>{card.label}</p>
            <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  card.trend.dir === 'up'
                    ? card.isBlue ? 'text-green-300 bg-blue-500/30' : 'text-green-600 bg-green-100'
                    : card.isBlue ? 'text-red-300 bg-blue-500/30' : 'text-red-500 bg-red-100'
                }`}
              >
                {card.trend.dir === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {card.trend.pct}
              </span>
              <span className={`text-xs ${card.trendColor}`}>{card.trend.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-6">
        {/* Website Visitors */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-semibold text-gray-900">Website Vistors</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shows the total amount of customers that visited Credsure website.
              </p>
            </div>
            <PeriodDropdown value={chartPeriod} onChange={setChartPeriod} />
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2} fill="url(#visitorGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pre-Approval Application Trends */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-semibold text-gray-900">Pre-Approval Application Trends</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shows the trends of customers that applied for car loan
              </p>
            </div>
            <PeriodDropdown value={barPeriod} onChange={setBarPeriod} />
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={approvalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={58} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="value" shape={<HatchedBar />} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
