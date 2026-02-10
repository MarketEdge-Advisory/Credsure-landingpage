import React from 'react';
import { Zap, FileText, Calendar, Truck, ShieldCheck } from 'lucide-react';
import { IoIosFlash } from "react-icons/io";
import { IoFlashSharp } from "react-icons/io5";

const WhyCredsure = () => {
  const features = [
    {
      icon: <IoFlashSharp  className="w-12 h-12 text-blue-600"/>,
      title: 'Fast Pre-Approval',
      description: 'Get approved in as little as 24 hours. No endless paperwork or long waiting periods.',
    },
    {
      icon: <img src='/document.svg' alt='document' className="w-8 h-8 text-blue-600" strokeWidth={2} />,
      title: 'Transparent Pricing',
      description: 'Clear monthly payments with no hidden fees. What you see is what you pay.',
    },
    {
      icon: <img src='/calendar.svg' alt='calendar' className="w-8 h-8 text-blue-600" strokeWidth={2} />,
      title: 'Flexible Payment Terms',
      description: 'Choose payment plans from 6 to 24 months that fit your budget and lifestyle.',
    },
    {
      icon: <img src='/truck.svg' alt='truck' className="w-8 h-8 text-blue-600" strokeWidth={2} />,
      title: 'Quick Vehicle Delivery',
      description: 'Drive your Suzuki within 2 weeks of completing your documentation. We move fast so you can too.',
    },
    {
      icon: <img src='/shield-check.svg' alt='shield check' className="w-8 h-8 text-blue-600" strokeWidth={2} />,
      title: 'Trusted Financing Partner',
      description: 'Nigeria\'s leading Buy Now, Pay Later platform for automotive financing. Thousands of satisfied customers.',
    },
  ];

  return (
    <section id="benefits" className="bg-white py-12 sm:py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <p className="text-cyan-500 text-xs sm:text-sm md:text-lg font-semibold mb-2 sm:mb-3">
            Financing You Can Trust
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Why finance with Credsure
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-[720px] mx-auto px-4">
            Get a quick pre-approval, understand your repayments upfront, and move from calculation to delivery faster with Credsure's BNPL financing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#EDF5FCCC] w-full max-w-[230px] min-h-[200px] sm:min-h-[240px] rounded-none p-3 sm:p-4 text-center shadow-sm hover:shadow-sm transition-shadow duration-300 flex flex-col items-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-gray-900 text-xs sm:text-sm font-bold mb-2 sm:mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCredsure;
