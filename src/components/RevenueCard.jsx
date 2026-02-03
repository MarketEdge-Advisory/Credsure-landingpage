import React, {useState } from "react";
import { ChevronDown, ChevronUp} from "lucide-react";
import { getLocationData, locations } from "./data";

const RevenueCard = ({ title, actual, target, percentage, bgColor }) => {
  return (
    <div className={`p-6 rounded-lg border ${bgColor} w-full md:w-1/3`}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">₦{actual.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-gray-500 font-normal">Actual</span></p>
      <p className="text-gray-500 mt-1">₦{target.toLocaleString(undefined, {maximumFractionDigits: 2})} Target</p>
      <button className={`mt-4 ${percentage >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white text-sm font-semibold px-3 py-1 rounded-md w-full items-center justify-center text-center`}>
        {percentage >= 0 ? '↑' : '↓'} {Math.abs(percentage).toFixed(1)}% Vs Target
      </button>
    </div>
  );
};

const RevenuePerformance = ({ selectedLocation }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedLocation || "Omole");

  React.useEffect(() => {
    setSelected(selectedLocation);
  }, [selectedLocation]);

  const locationData = getLocationData();
  const data = locationData[selected] || locationData["Omole"];
  
  // Calculate percentages
  const dailyPercentage = ((data.dailyActual - data.dailyTarget) / data.dailyTarget) * 100;
  const weeklyPercentage = ((data.weeklyActual - data.weeklyTarget) / data.weeklyTarget) * 100;
  
  // Previous week data (using 90% of current as example)
  const prevWeekActual = data.weeklyActual * 0.9;
  const weekOnWeekPercentage = ((data.weeklyActual - prevWeekActual) / prevWeekActual) * 100;
  return (
    <div className="p-4 md:p-6 space-y-6 bg-white shadow-lg rounded-xl mx-4 md:mx-6">
      <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center gap-4">
        <div className="flex flex-col">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-2">Revenue Performance for {selected}</h2>
      <p className="text-gray-500 text-xs md:text-sm mb-4">
        This shows daily and weekly actual vs target with week-on-week revenue performance comparison.
      </p>
      </div>
        <div className="relative inline-block text-left self-start md:self-auto">
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
      <div className="flex flex-col md:flex-row gap-6">
        <RevenueCard
          title="Daily (Today)"
          actual={data.dailyActual}
          target={data.dailyTarget}
          percentage={dailyPercentage}
          bgColor="bg-red-100 border-red-200"
        />
        <RevenueCard
          title="Weekly (Current)"
          actual={data.weeklyActual}
          target={data.weeklyTarget}
          percentage={weeklyPercentage}
          bgColor="bg-yellow-100 border-yellow-200"
        />
        <RevenueCard
          title="Week-On-Week"
          actual={data.weeklyActual}
          target={prevWeekActual}
          percentage={weekOnWeekPercentage}
          bgColor="bg-gray-100 border-gray-200"
        />
      </div>
    </div>
  );
};

export default RevenuePerformance;
