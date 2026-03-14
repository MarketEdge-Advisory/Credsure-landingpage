import React from 'react';

const EasySteps = () => {
  const steps = [
    {
      number: 1,
      title: 'Browse and select vehicle',
    },
    {
      number: 2,
      title: 'Calculate your monthly payment',
    },
    {
      number: 3,
      title: 'Get Approved',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#0FAFFF] to-[#0B2947] py-6 sm:py-8 md:py-10 z-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">
          Get Approved in 3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="max-w-5xl mx-auto z-0">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-4">
            {/* Connecting Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/80 hidden sm:block" style={{ left: '16.5%', right: '16.5%' }} />

            {/* Step Items */}
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex flex-col items-center relative z-0 w-full">
                {/* Circle with Number */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                  <span className="text-base font-bold text-[#000]">{step.number}</span>
                </div>

                {/* Step Title */}
                <p className="text-white text-xs sm:text-sm font-medium text-center">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EasySteps;
