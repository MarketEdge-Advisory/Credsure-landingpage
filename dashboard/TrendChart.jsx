import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChevronDown, ChevronUp} from "lucide-react";
import { generateTransactionData, locations, getLocationData } from "./data";


const TrendChart = ({ selectedLocation, title = "Trend Chart for {location} (Transaction Count)" }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedLocation || "Omole");

  React.useEffect(() => {
    setSelected(selectedLocation);
  }, [selectedLocation]);

  const chartData = generateTransactionData(selected);
  const chartTitle = title.replace("{location}", selected);
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-lg mx-4 md:mx-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">{chartTitle}</h2>
          <p className="text-xs md:text-sm text-gray-500">
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
      <div className="h-[240px] md:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Days of the week', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#64748b' } }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Counts', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend
              verticalAlign="top"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: 11 }}
            />

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
              stroke="#facc15"
              strokeWidth={2}
              dot={false}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer controls */}
      <div className="mt-6 flex gap-0">
        {["4 Weeks", "8 Weeks", "3 Months", "Custom"].map((label, idx, arr) => (
          <button
            key={label}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium
              ${
                label === "4 Weeks"
                  ? "bg-yellow-400 text-black rounded-l-md"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              } ${idx === arr.length - 1 ? "rounded-r-md" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
