import React, { useState } from 'react';
import { ChevronDown, Sun } from 'lucide-react';

const DreamSuzuki = () => {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#0f1e3d] mt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Dzire1.svg')`,
          backgroundSize: 'cover',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl">
            {/* Heading */}
            <h1 className="mb-6 text-2xl md:text-[55px] font-bold text-white leading-tight animate-[fade-in_1s_ease-out]">
              Drive Your Dream Suzuki Today. Pay Monthly from{' '}
              <span className="block mt-2">₦500,000</span>
            </h1>

            {/* Subheading */}
            <p className="mb-10 text-sm md:text-[18px] md:max-w-[620px] text-gray-200 leading-relaxed animate-[fade-in-delay_1s_ease-out_0.3s_both]">
              Fast pre-approval. Transparent payments. Vehicle delivery within 1 week.
              Finance your Suzuki with Credsure BNPL, Nigeria's trusted auto financing partner.
            </p>

            {/* CTA Button */}
            <div className="animate-[fade-in-delay-2_1s_ease-out_0.6s_both]">
              <button 
                className="group flex items-center justify-between gap-4 bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl min-w-[320px]"
                onClick={() => {
                  const calculator = document.querySelector('#calculator');
                  if (calculator) {
                    calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="text-base md:text-lg text-gray-700">Check Your Monthly Payment</span>
                <ChevronDown className="w-5 h-5 text-blue-500 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamSuzuki;