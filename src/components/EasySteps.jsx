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
    <section className="bg-gradient-to-b from-[#0FAFFF] to-[#0B2947] py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-8 md:mb-10">
          Get Approved in 3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-4">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/80 hidden sm:block" style={{ left: '20%', right: '20%' }} />

            {/* Step Items */}
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex flex-col items-center relative z-10 w-full">
                {/* Circle with Number */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 sm:mb-6">
                  <span className="text-lg sm:text-xl font-bold text-[#000]">{step.number}</span>
                </div>

                {/* Step Title */}
                <p className="text-white text-sm sm:text-base md:text-lg font-medium text-center">
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
