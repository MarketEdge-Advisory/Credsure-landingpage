import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ChevronDown, X } from 'lucide-react';
import { useCarContext } from '../context/CarContext';

const LoanCalculator = () => {
  const { selectedCar } = useCarContext();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState(24300250);
  const [loanTenure, setLoanTenure] = useState('');
  const [downPayment, setDownPayment] = useState(2430025);
  const [monthlyPayment, setMonthlyPayment] = useState(1229167);
  const interestRate = 10; // 10% annual interest rate (non-editable)
  
  // Pre-approval modal state
  const [showModal, setShowModal] = useState(false);
  const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    employmentStatus: '',
    monthlyIncome: '',
    agreeToContact: false,
  });

  const employmentDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employmentDropdownRef.current && !employmentDropdownRef.current.contains(event.target)) {
        setShowEmploymentDropdown(false);
      }
    };

    if (showEmploymentDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmploymentDropdown]);

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
      const annualInterestRate = interestRate / 100; // Convert percentage to decimal
      const monthlyInterest = annualInterestRate / 12;
      const payment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
                      (Math.pow(1 + monthlyInterest, months) - 1);
      setMonthlyPayment(Math.round(payment));
    }
  }, [vehiclePrice, downPayment, loanTenure, interestRate]);

  // Auto-populate calculator when a car is selected
  useEffect(() => {
    if (selectedCar) {
      setSelectedVehicle(selectedCar.name);
      setVehiclePrice(selectedCar.priceValue);
      setDownPayment(selectedCar.priceValue * 0.1); // 10% of vehicle price
      if (!loanTenure) {
        setLoanTenure('12'); // Default to 12 months if not set
      }
    }
  }, [selectedCar]);

  // Update down payment to 10% when vehicle price changes
  useEffect(() => {
    if (vehiclePrice) {
      setDownPayment(vehiclePrice * 0.1);
    }
  }, [vehiclePrice]);

  // Close dropdown when modal is closed
  useEffect(() => {
    if (!showModal) {
      setShowEmploymentDropdown(false);
    }
  }, [showModal]);

  const downPaymentPercentage = ((downPayment / vehiclePrice) * 100).toFixed(0);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate employment status
    if (!formData.employmentStatus) {
      alert('Please select an employment status');
      return;
    }
    
    // Here you would typically send the data to both CredSure and Suzuki emails
    console.log('Pre-approval submitted:', {
      ...formData,
      vehicle: selectedVehicle,
      vehiclePrice,
      loanTenure,
      downPayment,
      monthlyPayment,
      interestRate,
    });
    alert('Your pre-approval request has been sent to both CredSure and Suzuki. We will contact you within 24-48 hours.');
    setShowModal(false);
    setShowEmploymentDropdown(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      employmentStatus: '',
      monthlyIncome: '',
      agreeToContact: false,
    });
  };

  return (
    <section id="calculator" className="bg-[#0B2947] py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-[#ECF2F9] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base bg-white rounded-full px-3 sm:px-4">Step 2</span>
            <span className="text-[#3FA9F5] font-medium text-xs sm:text-sm md:text-base flex items-center gap-1">
              Calculate your monthly payment <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4" />
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
            Calculate your monthly payment
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto lg:w-[620px] px-4">
            See exactly what you'll pay each month. Adjust your Advance Payment (N)/Down Payment (N) and loan term to find a plan that works for your budget. No commitment required.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Loan Calculator Form */}
          <div className="bg-[#FFFFFF0D] rounded-none p-4 sm:p-6 md:p-8 shadow-xl">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider">
              Loan Calculator
            </h3>

            {/* Vehicle Model Select */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
                <label className="text-gray-300 text-xs sm:text-sm font-medium">
                  Select Vehicle Model
                </label>
                <span className="text-cyan-400 text-xs sm:text-sm font-semibold">
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
                      setDownPayment(vehicle.price * 0.1); // 10% of vehicle price
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
            <div className="mb-4 sm:mb-6">
              <label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">
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

            {/* Interest Rate (Non-editable) */}
            <div className="mb-4 sm:mb-6">
              <label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">
                Interest Rate
              </label>
              <div className="w-full bg-gray-300 text-gray-700 px-3 py-3 rounded-lg font-semibold">
                {interestRate}%
              </div>
              {/* <p className="text-gray-400 text-xs mt-1">NOTE: Calculation will be impacted by this value.</p> */}
            </div>

            {/* Advance Payment/Down Payment Input */}
            <div className="mb-0">
              <label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">
                Advance Payment (₦)/Down Payment (₦)
              </label>
              <input
                type="text"
                value={formatCurrency(downPayment)}
                onChange={handleDownPaymentChange}
                className="w-full bg-gradient-to-br from-gray-200 to-gray-300 text-cyan-500 text-base sm:text-lg md:text-xl font-bold px-3 py-2 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border-2 border-gray-700"
              />
              {/* <p className="text-gray-400 text-xs mt-1">Value displayed should be 10% of vehicle value</p> */}
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
          <div className="rounded-none p-4 sm:p-6 md:p-8 shadow-xl flex flex-col justify-between bg-gradient-to-t from-[#0b2947] to-[#091c30]">
            <div className="flex flex-col items-center justify-start text-center mb-4">
              <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">Estimated Monthly Payment</p>
              <h3 className="text-cyan-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                ₦{monthlyPayment.toLocaleString('en-NG')}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                for {loanTenure || '12'} months
              </p>
            </div>
{/* Vehicle Price Disclaimers */}
              <div className="mt-1 bg-[#0D2A46] rounded-lg p-3">
                <p className="text-gray-400 text-xs font-medium mb-2">Vehicle price excludes:</p>
                <ul className="space-y-1">
                  <li className="text-gray-300 text-xs flex items-start">
                    <span className="mr-2">•</span>
                    <span>Insurance Payment</span>
                  </li>
                  <li className="text-gray-300 text-xs flex items-start">
                    <span className="mr-2">•</span>
                    <span>3 Year Warranty</span>
                  </li>
                  <li className="text-gray-300 text-xs flex items-start">
                    <span className="mr-2">•</span>
                    <span>Free Vehicle Registration</span>
                  </li>
                  <li className="text-gray-300 text-xs flex items-start">
                    <span className="mr-2">•</span>
                    <span>Free 1 Year (or 15,000 km) Vehicle Service</span>
                  </li>
                </ul>
              </div>
            {/* Get Approved Section */}
            <div className="mt-2 sm:mt-4 gap-0">
              <div className="w-full inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-[#ECF2F9] rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
                <span className="text-gray-900 font-semibold text-[10px] sm:text-xs bg-white rounded-full px-2 py-1">Step 3</span>
                <span className="text-cyan-500 font-medium text-[10px] sm:text-xs flex items-center">
                  Click the button below to get approved <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4" />
                </span>
              </div>
              
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-cyan-500 hover:bg-slate-200 hover:text-black text-white font-semibold py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg text-xs sm:text-sm md:text-base"
              >
                Get pre-approved now
              </button>
            </div>
          </div>
        </div>

        {/* Pre-Approval Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Section with Vehicle and Payment Info */}
              <div className="bg-[#1a3a52] text-white px-6 py-4 flex justify-between items-center rounded-none mt-12">
                <div className='flex items-center gap-3'>
                  <p className="text-gray-300 text-sm mb-1">Selected Vehicle:</p>
                  <h3 className="text-lg font-bold">{selectedVehicle || 'N/A'}</h3>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-gray-300 text-sm mb-1">Monthly Payment:</p>
                  <h3 className="text-lg font-bold">₦{monthlyPayment.toLocaleString('en-NG')}</h3>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Full name*
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone number*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Employment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Employment status*
                    </label>
                    <div ref={employmentDropdownRef} className="relative mt-2">
                      <button
                        type="button"
                        onClick={() => setShowEmploymentDropdown(!showEmploymentDropdown)}
                        className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white appearance-none cursor-pointer text-left flex justify-between items-center"
                      >
                        <span className={formData.employmentStatus ? 'text-gray-900' : 'text-gray-500'}>
                          {formData.employmentStatus || 'Select employment status'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showEmploymentDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showEmploymentDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {['Salaried Employee', 'Business Owner', 'Self Employed', 'Corporate'].map((option) => (
                            <div
                              key={option}
                              onClick={() => {
                                setFormData({ ...formData, employmentStatus: option });
                                setShowEmploymentDropdown(false);
                              }}
                              className="px-4 py-4 text-base text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estimated Net Monthly Income */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Estimated net monthly income*
                    </label>
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                      placeholder="Enter your monthly income"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToContact"
                      checked={formData.agreeToContact}
                      onChange={(e) => setFormData({ ...formData, agreeToContact: e.target.checked })}
                      required
                      className="mt-1 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <label className="text-sm text-gray-600 leading-relaxed">
                      I agree to be contacted by CFAO (Suzuki) and Credsure regarding my finance application. I understand that my information will be processed according to the privacy policy
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg text-base mt-6"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoanCalculator;
