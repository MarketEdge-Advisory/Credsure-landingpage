import React, { useState, useEffect } from 'react'
import { ChevronDown, CloudDownload } from "lucide-react";
import TrendChart from './TrendChart';
import {locations, loadLocationData, getLocationData}  from './data'
import RevenueCard from './RevenueCard'
import ResponsiveTrendChart from './RevenueTrendChart';
import AvgTicketTrendChart from './AvgTicketTrendChart';
import TransactionCount from './TransactionCount';
import AverageTickectCount from './AverageTicketCount';
import CustomerCaptureData from './CustomerCaptureCard';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Omole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await loadLocationData();
        setDataLoaded(true);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from server. Using default data.');
        setDataLoaded(true); // Still show UI with default data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-10'>
    {error && (
      <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800 text-sm"> {error}</p>
      </div>
    )}
    <div className="flex items-center justify-between px-6 py-4 bg-white">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          A consolidated view of key metrics from the Chicken Republic pilot program.
        </p>
      </div>
      <div className="flex items-center gap-3">

       <div className="relative inline-block text-left">
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
        <div className="absolute z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-md">
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
        <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <CloudDownload className="h-4 w-4" />
          Export Report
        </button>
      </div>
    </div>
        <RevenueCard selectedLocation={selected} />
        <ResponsiveTrendChart selectedLocation={selected} />
        <TransactionCount selectedLocation={selected} />
        <TrendChart selectedLocation={selected} />
        <AverageTickectCount selectedLocation={selected} />
        <AvgTicketTrendChart selectedLocation={selected} />
        <CustomerCaptureData selectedLocation={selected} />
    </div>
  )
}

export default Dashboard