import React from 'react';
import { Zap, FileText, Calendar, Truck, ShieldCheck } from 'lucide-react';
import { IoIosFlash } from "react-icons/io";
import { IoFlashSharp } from "react-icons/io5";

const CFAO = () => {
  const features = [
    {
      icon: <img src='/cert.svg' alt='certificate'  className="w-12 h-12 text-blue-600"/>,
      title: 'Authorized Suzuki Dealer',
      description: 'Official Suzuki partner in Nigeria. Every vehicle comes with manufacturer warranty and certification.',
      bgColor: '#EDF5FC',
    },
    {
      icon: <img src='/Group-1.svg' alt='group' className="w-12 h-12 text-blue-600" strokeWidth={2} />,
      title: '100% Genuine Vehicles',
      description: 'Brand-new Suzuki cars imported directly from the manufacturer. No refurbished or used vehicles.',
      bgColor: '#FFEDEB',
    },
    {
      icon: <img src='/maintenance.svg' className="w-12 h-12 text-blue-600" strokeWidth={2} />,
      title: 'Flexible Payment Terms',
      description: 'Choose payment plans from 6 to 24 months that fit your budget and lifestyle.',
      bgColor: '#EBFFFC',
    },
    {
      icon: <img src='/award.svg' alt='award' className="w-12 h-12 text-blue-600" strokeWidth={2} />,
      title: 'Decades of Automotive Excellence',
      description: 'CFAO has served Nigeria\'s automotive market for generations. Experience you can trust.',
      bgColor: '#FFFCF2',
    },
    {
      icon: <img src='/car-wash.svg' alt='car wash' className="w-12 h-12 text-blue-600" strokeWidth={2} />,
      title: 'Wide Vehicle Selection',
      description: 'From compact city cars to adventure SUVs and commercial vehicles — find your perfect Suzuki.',
      bgColor: '#EBFFF9',
    },
  ];

  return (
    <section className="bg-[#0B2947] py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-cyan-500 text-sm md:text-lg font-semibold mb-3">
            The CFAO Suzuki Advantage
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why buy from CFAO (Suzuki)
          </h2>
          <p className="text-white text-base md:text-lg max-w-[720px] mx-auto">
            CFAO Suzuki combines authentic Suzuki models with expert guidance and reliable after-sales service for a smooth ownership experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 justify-items-start">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{ backgroundColor: feature.bgColor }}
              className="w-full max-w-[230px] min-h-[240px] rounded-none p-4 text-start shadow-sm hover:shadow-sm transition-shadow duration-300 flex flex-col items-center"
            >
              {/* Icon */}
              <div className="flex justify-flex-start w-full mb-4">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-gray-900 text-sm font-bold mb-3 text-start">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed m-0">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CFAO;
