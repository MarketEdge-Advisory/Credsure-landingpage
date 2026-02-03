import React, { useState } from "react";
import { ChevronDown, ChevronUp} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateTrendData, locations, getLocationData } from "./data";

const formatCurrency = (value) => `₦${(value / 1_000_000).toFixed(0)}M`;

const RevenueTrendChart = ({ selectedLocation }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedLocation || "Omole");

  React.useEffect(() => {
    setSelected(selectedLocation);
  }, [selectedLocation]);

  const chartData = generateTrendData(selected);
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Trend Chart for {selected} (Revenue Performance)
          </h2>
          <p className="text-sm text-gray-500">
            Tracks how actual results in {selected} measure up against targets
          </p>
        </div>

        <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {selected}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-md right-2">
          <ul className="py-1 text-sm text-gray-700">
            {locations.map((location) => (
              <li
                key={location}
                onClick={() => {
                  setSelected(location);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  selected === location ? "font-medium" : ""
                }`}
              >
                {location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Days of the week', position: 'insideBottom', offset: -5, style: { fontSize: 14, fill: '#6B7280' } }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft', style: { fontSize: 14, fill: '#6B7280' } }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
            />
            <Legend verticalAlign="top"
              align="center"
              iconType="circle"/>

            <Line
              type="monotone"
              dataKey="actual"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />

            <Line
              type="monotone"
              dataKey="target"
              stroke="#FACC15"
              strokeWidth={2}
              dot={false}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Controls */}
      <div className="flex gap-0 mt-6">
        {["4 Weeks", "8 Weeks", "3 Months", "+ custom"].map((label, idx, arr) => (
          <button
            key={label}
            className={`px-4 py-2 text-sm border 
              ${
                idx === 0
                  ? "bg-yellow-400 text-black border-yellow-400 rounded-l-md"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }  ${idx === arr.length - 1 ? "rounded-r-md" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RevenueTrendChart