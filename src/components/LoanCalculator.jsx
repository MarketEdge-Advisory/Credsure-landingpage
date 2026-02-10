import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { useCarContext } from '../context/CarContext';

const LoanCalculator = () => {
  const { selectedCar } = useCarContext();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState(24300250);
  const [loanTenure, setLoanTenure] = useState('');
  const [downPayment, setDownPayment] = useState(500000);
  const [monthlyPayment, setMonthlyPayment] = useState(1229167);

  const vehicles = [
    { name: 'New Dzire', price: 12500000 },
    { name: 'New Swift', price: 15000000 },
    { name: 'Alto', price: 8500000 },
    { name: 'Grand Vitara', price: 24300250 },
    { name: 'Jimny (5-Doors)', price: 18000000 },
    { name: 'Grand Vitara 1.5L', price: 22500000 },
    { name: 'S-Presso', price: 9800000 },
    { name: 'Ertiga', price: 16500000 },
    { name: 'Celerio', price: 10200000 },
  ];

  const tenures = [
    { label: '6 months', value: 6 },
    { label: '12 months', value: 12 },
    { label: '18 months', value: 18 },
    { label: '24 months', value: 24 },
    { label: '36 months', value: 36 },
  ];

  const minDownPayment = 0;
  const maxDownPayment = vehiclePrice;

  const handleDownPaymentChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, '')) || 0;
    if (value >= minDownPayment && value <= maxDownPayment) {
      setDownPayment(value);
    }
  };

  const handleSliderChange = (e) => {
    const percentage = parseFloat(e.target.value);
    const value = (vehiclePrice * percentage) / 100;
    setDownPayment(value);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (loanTenure) {
      const loanAmount = vehiclePrice - downPayment;
      const months = parseInt(loanTenure);
      const interestRate = 0.05; // 5% annual interest rate
      const monthlyInterest = interestRate / 12;
      const payment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
                      (Math.pow(1 + monthlyInterest, months) - 1);
      setMonthlyPayment(Math.round(payment));
    }
  }, [vehiclePrice, downPayment, loanTenure]);

  // Auto-populate calculator when a car is selected
  useEffect(() => {
    if (selectedCar) {
      setSelectedVehicle(selectedCar.name);
      setVehiclePrice(selectedCar.priceValue);
      setDownPayment(500000);
      if (!loanTenure) {
        setLoanTenure('12'); // Default to 12 months if not set
      }
    }
  }, [selectedCar]);

  const downPaymentPercentage = ((downPayment / vehiclePrice) * 100).toFixed(0);

  return (
    <section id="calculator" className="bg-[#0B2947] py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-[#ECF2F9] rounded-full px-6 py-3 mb-6">
            <span className="text-gray-900 font-semibold text-sm md:text-base bg-white rounded-full px-4">Step 2</span>
            <span className="text-[#3FA9F5] font-medium text-sm md:text-base flex items-center gap-1">
              Calculate your monthly payment <ArrowDown className="w-4 h-4" />
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Calculate your monthly payment
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto lg:w-[620px]">
            See exactly what you'll pay each month. Adjust your down payment and loan term to find a plan that works for your budget. No commitment required.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Loan Calculator Form */}
          <div className="bg-[#FFFFFF0D] rounded-none p-8 shadow-xl">
            <h3 className="text-white text-xl font-bold mb-6 uppercase tracking-wider">
              Loan Calculator
            </h3>

            {/* Vehicle Model Select */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-300 text-sm font-medium">
                  Select Vehicle Model
                </label>
                <span className="text-cyan-400 text-sm font-semibold">
                  Vehicle Price : ₦{formatCurrency(vehiclePrice)}
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedVehicle}
                  onChange={(e) => {
                    setSelectedVehicle(e.target.value);
                    const vehicle = vehicles.find(v => v.name === e.target.value);
                    if (vehicle) {
                      setVehiclePrice(vehicle.price);
                      setDownPayment(500000);
                    }
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-3 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select vehicle model</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Loan Tenure Select */}
            <div className="mb-6">
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Loan Tenure
              </label>
              <div className="relative">
                <select
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  className="w-full bg-gray-100 text-gray-700 px-3 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select loan tenure</option>
                  {tenures.map((tenure) => (
                    <option key={tenure.value} value={tenure.value}>
                      {tenure.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Down Payment Input */}
            <div className="mb-0">
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Down Payment(₦)
              </label>
              <input
                type="text"
                value={formatCurrency(downPayment)}
                onChange={handleDownPaymentChange}
                className="w-full bg-gradient-to-br from-gray-200 to-gray-300 text-cyan-500 text-xl font-bold px-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border-2 border-gray-700"
              />
            </div>

            {/* Slider with Ruler Marks */}
            <div className="mb-6 relative pt-0">
              {/* Ruler tick marks */}
              <div className="absolute top-0 left-0 right-0 flex justify-between items-start h-4">
                {Array.from({ length: 101 }).map((_, index) => {
                  const isEnd = index === 0 || index === 100;
                  return (
                    <div
                      key={index}
                      className={`${
                        isEnd 
                          ? 'h-4 w-0.5 bg-gray-300' 
                          : 'h-2 w-px bg-gray-500'
                      }`}
                    />
                  );
                })}
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={downPaymentPercentage}
                onChange={handleSliderChange}
                className="absolute top-0 w-full h-1 bg-[#374151] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${downPaymentPercentage}%, #374151 ${downPaymentPercentage}%, #374151 100%)`
                }}
              />
            </div>
            <p className="text-gray-400 text-xs m-0 bg-[#0D2A46] rounded-full px-3 py-2">
              Slider Range: 0% - 100% of vehicle price
            </p>
          </div>

          {/* Right Column - Payment Display */}
          <div className="rounded-none p-8 shadow-xl flex flex-col justify-between bg-gradient-to-t from-[#0b2947] to-[#091c30]">
            <div className="flex-1 flex flex-col items-center justify-start text-center">
              <p className="text-gray-300 text-base mb-4">Estimated Monthly Payment</p>
              <h3 className="text-cyan-400 text-2xl md:text-3xl lg:text-5xl font-bold mb-2">
                ₦{monthlyPayment.toLocaleString('en-NG')}
              </h3>
              <p className="text-gray-400 text-sm">
                for {loanTenure || '12'} months
              </p>
            </div>

            {/* Get Approved Section */}
            <div className="mt-8 gap-0 ">
              <div className="w-full inline-flex items-center gap-3 bg-[#ECF2F9] rounded-full px-6 py-3 mb-4">
                <span className="text-gray-900 font-semibold text-xs bg-white rounded-full px-2 py-1">Step 3</span>
                <span className="text-cyan-500 font-medium text-xs flex">
                  Click the button below to get approved <ArrowDown className="w-4 h-4" />
                </span>
              </div>
              
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 rounded-full transition-all duration-300 hover:shadow-lg text-xs md:text-xs">
                Get pre-approved now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
