import React from 'react';

const FlexiblePayment = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24 w-full">
      <div className="px-2 md:px-4 lg:px-8 w-full">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 w-full max-w-7xl mx-auto">
          {/* Left: Heading */}
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
              Buy Suzuki Cars on Flexible Payment Plans | Credsure BNPL.{' '}
              <span className="text-blue-400 italic">Financing Nigeria</span>
            </h2>
          </div>

          {/* Right: Description */}
          <div className="flex items-center">
            <p className="text-base md:text-sm text-gray-600 leading-relaxed">
              Get pre-approved for Suzuki car financing in minutes. Flexible monthly payments, transparent terms, and vehicle delivery within 2 weeks. Calculate your payment now with Credsure BNPL.
            </p>
          </div>
        </div>

        {/* Car Image */}
        <div className="w-full rounded-none overflow-hidden">
          <img 
            src="/presso.jpeg" 
            alt="Suzuki S-Presso on flexible payment plan" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FlexiblePayment;
