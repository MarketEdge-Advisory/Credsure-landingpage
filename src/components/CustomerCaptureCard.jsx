import React, { useState } from "react";
import { ChevronDown, ChevronUp} from "lucide-react";
import { getLocationData, locations } from "./data";

const CustomerCaptureCard = ({ selectedLocation }) => {
   const [open, setOpen] = useState(false);
   const [selected, setSelected] = useState(selectedLocation || "Omole");

   React.useEffect(() => {
     setSelected(selectedLocation);
   }, [selectedLocation]);

   const locationData = getLocationData();
   const data = locationData[selected] || locationData["Omole"];
   
   // Calculate customer capture metrics
   const weeklyTransactions = Math.round(data.weeklyActual / 500);
   const captureRate = 87.1; // Example capture rate
   const dataCaptured = Math.round(weeklyTransactions * (captureRate / 100));
   const targetRate = 85;
   const vsTarget = ((captureRate - targetRate) / targetRate) * 100;

   const stats = [
     {
       title: "Weekly Transactions",
       value: weeklyTransactions.toLocaleString(),
       subtitle: "Customers Served",
     },
     {
       title: "Data Captured",
       value: dataCaptured.toLocaleString(),
       subtitle: "With Contact Info",
     },
     {
       title: "Capture Rate",
       value: `${captureRate.toFixed(1)}%`,
       subtitle: "This Week",
     },
     {
       title: `Versus Target (${targetRate}%)`,
       value: `${vsTarget >= 0 ? '+' : ''}${vsTarget.toFixed(1)}%`,
       subtitle: vsTarget >= 0 ? "Target Met" : "Below Target",
       highlight: vsTarget >= 0,
     },
   ];
  return (
    <div className="p-4 md:p-6 space-y-6 bg-white shadow-lg rounded-xl mx-4 md:mx-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Customer Capture Data for {selected}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            This shows daily and weekly actual vs target with week-on-week
            average ticket value comparison.
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl border border-gray-100 p-5"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <p
              className={`mt-3 text-3xl font-semibold ${
                stat.highlight ? "text-green-600" : "text-gray-900"
              }`}
            >
              {stat.value}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CustomerCaptureCard;