import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ChevronDown, X } from 'lucide-react';
import { useCarContext } from '../context/CarContext';
import Swal from 'sweetalert2';

const LoanCalculator = () => {
  const { selectedCar } = useCarContext();
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [loanTenure, setLoanTenure] = useState('12');
  const [downPayment, setDownPayment] = useState(0);
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const employmentDropdownRef = useRef(null);

  // Finance config states
  const [tenures, setTenures] = useState([]);
  const [interestRate, setInterestRate] = useState(10);
  const [calculatorConfig, setCalculatorConfig] = useState({
    downPaymentPct: 10,
    processingFeePct: 5,
    insuranceCost: 1000000,
  });

  // Loan tenure validation
  const [loanTenureError, setLoanTenureError] = useState('');

  // Auto‑correct tenure when options load
  useEffect(() => {
    if (tenures.length > 0) {
      const isValid = tenures.some(t => String(t.value) === String(loanTenure));
      if (!isValid) {
        setLoanTenure(String(tenures[0].value));
        setLoanTenureError('');
      }
    }
  }, [tenures]);

  const validateLoanTenure = (value) => {
    if (!value) {
      setLoanTenureError('Please select a loan tenure');
      return false;
    }
    if (tenures.length > 0 && !tenures.some(t => String(t.value) === String(value))) {
      setLoanTenureError('Selected tenure is not available');
      return false;
    }
    setLoanTenureError('');
    return true;
  };

  // Fetch finance config
  useEffect(() => {
    const fetchFinanceConfig = async () => {
      try {
        const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/public/finance');
        const json = await res.json();
        const data = json?.data || {};
        setTenures(
          Array.isArray(data.loanTenuresInMonths)
            ? data.loanTenuresInMonths.map(m => ({ label: `${m} months`, value: m }))
            : []
        );
        setInterestRate(data.interestRate?.annualRatePct || 10);
        setCalculatorConfig({
          downPaymentPct: data.calculatorConfig?.downPaymentPct ?? 10,
          processingFeePct: data.calculatorConfig?.processingFeePct ?? 5,
          insuranceCost: data.calculatorConfig?.insuranceCost ?? 1000000,
        });
      } catch (err) {
        setTenures([]);
        setInterestRate(10);
        setCalculatorConfig({ downPaymentPct: 10, processingFeePct: 5, insuranceCost: 1000000 });
      }
    };
    fetchFinanceConfig();
  }, []);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { getCars } = await import('../api/cars');
        const res = await getCars();
        const carsArr = Array.isArray(res?.data) ? res.data : [];
        setCars(carsArr);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCars();
  }, []);

  // Auto‑populate when a car is selected from context
  useEffect(() => {
    if (selectedCar) {
      setSelectedVehicle(selectedCar.name || '');
      const price = selectedCar.basePrice || selectedCar.price || 0;
      setVehiclePrice(price);
      setDownPayment(price * (calculatorConfig.downPaymentPct / 100));
      setCarId(selectedCar.id || '');
    }
  }, [selectedCar, calculatorConfig.downPaymentPct]);

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Calculate monthly payment
  useEffect(() => {
    if (vehiclePrice && loanTenure && tenures.some(t => String(t.value) === String(loanTenure))) {
      const loanAmount = vehiclePrice - (downPayment || 0);
      const months = parseInt(loanTenure, 10);
      const rate = interestRate / 100;
      if (months > 0 && loanAmount >= 0) {
        let payment = 0;
        if (months <= 6) {
          payment = (loanAmount * (1 + rate)) / months;
        } else {
          const monthlyInterest = rate / 12;
          payment =
            (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
            (Math.pow(1 + monthlyInterest, months) - 1);
        }
        setMonthlyPayment(Math.round(payment));
      } else {
        setMonthlyPayment(0);
      }
    } else {
      setMonthlyPayment(0);
    }
  }, [vehiclePrice, downPayment, loanTenure, interestRate, tenures]);

  // Click outside handler for employment dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employmentDropdownRef.current && !employmentDropdownRef.current.contains(event.target)) {
        setShowEmploymentDropdown(false);
      }
    };
    if (showEmploymentDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmploymentDropdown]);

  const minDownPayment = vehiclePrice * 0.1;
  const maxDownPayment = vehiclePrice;

  const handleDownPaymentChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, '')) || 0;
    if (value >= minDownPayment && value <= maxDownPayment) {
      setDownPayment(value);
    } else if (value < minDownPayment) {
      setDownPayment(minDownPayment);
    }
  };

  const handleSliderChange = (e) => {
    const percentage = parseFloat(e.target.value);
    const value = (vehiclePrice * percentage) / 100;
    if (value < minDownPayment) {
      setDownPayment(minDownPayment);
    } else {
      setDownPayment(value);
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num) || num === null || num === undefined) return '0.00';
    return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const downPaymentPercentage = vehiclePrice ? ((downPayment / vehiclePrice) * 100).toFixed(0) : 0;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Basic per‑field validation to clear errors on change
    let valid = true;
    if (name === 'fullName' && !value.trim()) valid = false;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (!digits || !/^0[789]\d{9}$/.test(digits)) valid = false;
    }
    if (name === 'email' && (!value.trim() || !/^\S+@\S+\.\S+$/.test(value.trim()))) valid = false;
    if (name === 'employmentStatus' && !value) valid = false;
    if (name === 'monthlyIncome' && (!value.trim() || isNaN(Number(value)) || Number(value) <= 0)) valid = false;

    setFormErrors({ ...formErrors, [name]: valid ? undefined : formErrors[name] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const digits = formData.phone.replace(/\D/g, '');
      if (!/^0[789]\d{9}$/.test(digits)) {
        errors.phone = 'Enter a valid Nigerian phone number (e.g., 08031234567)';
      }
    }
    if (!formData.email.trim()) errors.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) errors.email = 'Enter a valid email address';
    if (!formData.employmentStatus) errors.employmentStatus = 'Employment status is required';
    if (!formData.monthlyIncome.trim()) errors.monthlyIncome = 'Monthly income is required';
    else if (isNaN(Number(formData.monthlyIncome)) || Number(formData.monthlyIncome) <= 0)
      errors.monthlyIncome = 'Enter a valid income';
    if (!carId) errors.carId = 'Could not determine the selected vehicle.';
    if (!formData.agreeToContact) errors.agreeToContact = 'You must consent to be contacted.';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Please correct the highlighted fields.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });
      return;
    }

    const payload = {
      fullName: formData.fullName,
      phoneNumber: formData.phone,
      email: formData.email,
      employmentStatus: formData.employmentStatus,
      estimatedNetMonthlyIncome: Number(formData.monthlyIncome),
      selectedVehicle,
      carId,
      vehicleAmount: vehiclePrice,
      downPayment,
      monthlyPayment,
      consentGiven: !!formData.agreeToContact,
    };

    try {
      const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/public/finance-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      Swal.fire({
        icon: 'success',
        title: 'Submission Received!',
        text: 'Our representative will contact you shortly.',
        confirmButtonText: 'Got it',
        confirmButtonColor:'#1e3f6e'
      });

      setShowModal(false);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        employmentStatus: '',
        monthlyIncome: '',
        agreeToContact: false,
      });
      setFormErrors({});
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'An error occurred. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor:'#1e3f6e'
      });
    }
    setIsSubmitting(false);
  };

  return (
    <section id="calculator" className="bg-[#0B2947] py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-[#ECF2F9] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base bg-white rounded-full px-3 sm:px-4">
              Step 2
            </span>
            <span className="text-[#3FA9F5] font-medium text-xs sm:text-sm md:text-base flex items-center gap-1">
              Calculate your monthly payment <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4" />
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
            Calculate your monthly payment
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto lg:w-[620px] px-4">
            Adjust your Advance Payment (₦) and loan term to find a plan that works for your budget. No commitment required.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Form */}
          <div className="bg-[#FFFFFF0D] rounded-none p-4 sm:p-6 md:p-8 shadow-xl">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider">
              Loan Calculator
            </h3>

            {/* Vehicle Select */}
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
                    const carObj = cars.find(
                      (c) => c.name.trim().toLowerCase() === e.target.value.trim().toLowerCase()
                    );
                    setCarId(carObj?.id || '');
                    const price = carObj?.basePrice || carObj?.price || 0;
                    setVehiclePrice(price);
                    setDownPayment(price * 0.1);
                  }}
                  className="w-full overflow-auto scrollbar-hide bg-gray-100 text-gray-700 px-3 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {cars.map((car) => (
                    <option key={car.id} value={car.name}>
                      {`${car.name} ${car.variant}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Loan Tenure with Validation */}
            <div className="mb-4 sm:mb-6">
              <label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">
                Loan Tenure <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={loanTenure}
                  onChange={(e) => {
                    setLoanTenure(e.target.value);
                    validateLoanTenure(e.target.value);
                  }}
                  onBlur={() => validateLoanTenure(loanTenure)}
                  className={`w-full bg-gray-100 text-gray-700 px-3 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 ${
                    loanTenureError ? 'ring-2 ring-red-500' : 'focus:ring-cyan-500'
                  }`}
                >
                  {/* <option value="" disabled>
                    Select tenure
                  </option> */}
                  {tenures.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
              {loanTenureError && <p className="text-red-500 text-xs mt-1">{loanTenureError}</p>}
            </div>

            {/* Down Payment */}
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
              {/* Slider */}
              <div className="mb-6 relative pt-0">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={downPaymentPercentage}
                  onChange={handleSliderChange}
                  className="absolute top-0 w-full h-1 bg-[#374151] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${downPaymentPercentage}%, #374151 ${downPaymentPercentage}%, #374151 100%)`,
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs m-0 bg-[#0D2A46] rounded-full px-3 py-2">
                Slider Range: 10% - 100% of vehicle price
              </p>
            </div>
          </div>

          {/* Right Column - Payment Display */}
          <div className="rounded-none p-4 sm:p-6 md:p-8 shadow-xl flex flex-col justify-between bg-gradient-to-t from-[#0b2947] to-[#091c30]">
            <div className="flex flex-col items-center justify-start text-center mb-4">
              <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
                Estimated Monthly Payment
              </p>
              <h3 className="text-cyan-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                ₦{monthlyPayment.toLocaleString('en-NG')}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">for {loanTenure} months</p>
            </div>

            {/* Vehicle Price Disclaimers */}
            <div className="mt-1 bg-[#0D2A46] rounded-lg p-3">
              <ul className="space-y-1">
                <li className="text-gray-300 text-xs flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    1 Year Free Maintenance Service Plan or 15,000 Km, whichever comes first
                  </span>
                </li>
                <li className="text-gray-300 text-xs flex items-start">
                  <span className="mr-2">•</span>
                  <span>Free Vehicle Registration</span>
                </li>
                <li className="text-gray-300 text-xs flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    New Vehicle purchase comes with a 3-Year Warranty or 100,000 Km, whichever
                    comes first
                  </span>
                </li>
              </ul>
            </div>

            {/* Get Approved Button */}
            <div className="mt-2 sm:mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-semibold py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !selectedVehicle ||
                  !vehiclePrice ||
                  Number(downPayment) < vehiclePrice * 0.1 ||
                  !loanTenure ||
                  tenures.length === 0 || // wait for tenures to load
                  (tenures.length > 0 && !tenures.some(t => String(t.value) === String(loanTenure)))
                }
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
              className="bg-white rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Vehicle & Payment */}
              <div className="bg-[#1a3a52] text-white px-6 py-4 flex justify-between items-center rounded-none mt-12">
                <div className="flex items-center gap-3">
                  <p className="text-gray-300 text-sm mb-1">Selected Vehicle:</p>
                  <h3 className="text-lg font-bold">{selectedVehicle || 'N/A'}</h3>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-gray-300 text-sm mb-1">Monthly Payment:</p>
                  <h3 className="text-lg font-bold">₦{monthlyPayment.toLocaleString('en-NG')}</h3>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
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
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      autoComplete="off"
                    />
                    {formErrors.fullName && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.fullName}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone number*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      autoComplete="off"
                      maxLength="11"
                    />
                    {formErrors.phone && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                    {formErrors.email && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>

                  {/* Employment Status */}
                  <div ref={employmentDropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Employment status*
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowEmploymentDropdown(!showEmploymentDropdown)}
                      className={`w-full px-4 py-3 text-base text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white flex justify-between items-center ${
                        formErrors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <span className={formData.employmentStatus ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.employmentStatus || 'Select employment status'}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          showEmploymentDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {formErrors.employmentStatus && (
                      <span className="text-xs text-red-500 mt-1 block">
                        {formErrors.employmentStatus}
                      </span>
                    )}
                    {showEmploymentDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {['Salaried Employee', 'Business Owner', 'Self Employed', 'Corporate'].map(
                          (option) => (
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
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Estimated net monthly income*
                    </label>
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={formData.monthlyIncome ? Number(formData.monthlyIncome).toLocaleString() : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        const syntheticEvent = {
                          target: {
                            name: 'monthlyIncome',
                            value: rawValue,
                          },
                        };
                        handleFormChange(syntheticEvent);
                      }}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 ${
                        formErrors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your monthly income"
                      autoComplete="off"
                    />
                    {formErrors.monthlyIncome && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.monthlyIncome}</span>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="agreeToContact"
                      checked={formData.agreeToContact}
                      onChange={(e) => {
                        setFormData({ ...formData, agreeToContact: e.target.checked });
                        if (e.target.checked && formErrors.agreeToContact) {
                          setFormErrors({ ...formErrors, agreeToContact: undefined });
                        }
                      }}
                      className={`h-4 w-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 ${
                        formErrors.agreeToContact ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    <label className="text-gray-600 text-sm">
                      I consent to be contacted regarding this loan application.
                    </label>
                  </div>
                  {formErrors.agreeToContact && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.agreeToContact}</span>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-semibold py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg text-base sm:text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  {formErrors.carId && (
                    <span className="text-xs text-red-500 mt-2 block text-center">{formErrors.carId}</span>
                  )}
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