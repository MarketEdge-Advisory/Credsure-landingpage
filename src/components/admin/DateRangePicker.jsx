import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const PRESETS = [
  'Today', 'Yesterday', 'This Week', 'Last Week',
  'This Month', 'Last Month', 'This Year', 'Last Year', 'All Time',
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getPresetRange(preset) {
  const today = startOfDay(new Date());
  switch (preset) {
    case 'Today':
      return { start: new Date(today), end: new Date(today) };
    case 'Yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { start: y, end: new Date(y) };
    }
    case 'This Week': {
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const start = new Date(today);
      start.setDate(today.getDate() + diff);
      return { start, end: new Date(today) };
    }
    case 'Last Week': {
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const end = new Date(today);
      end.setDate(today.getDate() + diff - 1);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return { start, end };
    }
    case 'This Month':
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today),
      };
    case 'Last Month': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start, end };
    }
    case 'This Year':
      return { start: new Date(today.getFullYear(), 0, 1), end: new Date(today) };
    case 'Last Year':
      return {
        start: new Date(today.getFullYear() - 1, 0, 1),
        end: new Date(today.getFullYear() - 1, 11, 31),
      };
    case 'All Time':
    default:
      return { start: null, end: null };
  }
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isStrictlyBetween(date, a, b) {
  if (!date || !a || !b) return false;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return date > lo && date < hi;
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining && cells.length < 42; d++) {
    cells.push({ date: new Date(year, month + 1, d), current: false });
  }
  return cells;
}

const DateRangePicker = ({ isOpen, onClose, onApply, align = 'right' }) => {
  const today = startOfDay(new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cells = buildCalendarCells(viewYear, viewMonth);

  const effectiveEnd = selectingEnd && hoverDate ? hoverDate : endDate;

  const handleDayClick = (date) => {
    if (!selectingEnd || !startDate) {
      setStartDate(startOfDay(date));
      setEndDate(null);
      setSelectingEnd(true);
      setSelectedPreset(null);
    } else {
      const clicked = startOfDay(date);
      if (clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      setSelectingEnd(false);
      setSelectedPreset(null);
    }
  };

  const handlePreset = (preset) => {
    setSelectedPreset(preset);
    const { start, end } = getPresetRange(preset);
    setStartDate(start);
    setEndDate(end);
    setSelectingEnd(false);
    if (start) {
      setViewMonth(start.getMonth());
      setViewYear(start.getFullYear());
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div
      ref={pickerRef}
      className={`absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 flex ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
      style={{ minWidth: 540 }}
    >
      {/* Left: Presets */}
      <div className="flex flex-col py-5 px-3 border-r border-gray-100 min-w-[148px]">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedPreset === p
                ? 'bg-blue-50 text-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Right: Calendar + controls */}
      <div className="flex flex-col flex-1 px-5 py-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-gray-900 text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-700 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map(({ date, current }, idx) => {
            const isStart = isSameDay(date, startDate);
            const isEnd = isSameDay(date, effectiveEnd);
            const inRange = isStrictlyBetween(date, startDate, effectiveEnd);
            const isToday = isSameDay(date, today);
            const isSelected = isStart || isEnd;
            const hasRange = startDate && effectiveEnd;

            // Range highlight shape
            let rangeClass = '';
            if (inRange) rangeClass = 'bg-blue-50';
            if (isStart && hasRange && !isSameDay(startDate, effectiveEnd)) rangeClass = 'bg-gradient-to-r from-white to-blue-50 rounded-l-full';
            if (isEnd && hasRange && !isSameDay(startDate, effectiveEnd)) rangeClass = 'bg-gradient-to-l from-white to-blue-50 rounded-r-full';

            return (
              <div
                key={idx}
                className={`relative flex items-center justify-center py-0.5 cursor-pointer ${rangeClass}`}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => selectingEnd && setHoverDate(startOfDay(date))}
                onMouseLeave={() => setHoverDate(null)}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors select-none
                    ${isSelected ? 'bg-blue-500 text-white font-semibold' : ''}
                    ${!isSelected && current ? 'text-gray-800 hover:bg-gray-100' : ''}
                    ${!isSelected && !current ? 'text-gray-300' : ''}
                  `}
                >
                  {date.getDate()}
                </div>
                {isToday && !isSelected && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Date input row */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white min-h-[42px]">
            {startDate ? formatDate(startDate) : <span className="text-gray-400">Start date</span>}
          </div>
          <span className="text-gray-400 font-medium">–</span>
          <div className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white min-h-[42px]">
            {endDate ? formatDate(endDate) : <span className="text-gray-400">End date</span>}
          </div>
        </div>

        {/* Cancel / Apply buttons */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onApply) onApply({ startDate, endDate });
              onClose();
            }}
            className="flex-1 bg-blue-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
