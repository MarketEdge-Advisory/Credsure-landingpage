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
    <section className="bg-gradient-to-b from-[#0FAFFF] to-[#0B2947] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <h2 className="text-xl md:text-4xl font-bold text-white text-center mb-6 md:mb-10">
          Get Approved in 3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative flex items-start justify-between">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/80 hidden md:block" style={{ left: '20%', right: '20%' }} />

            {/* Step Items */}
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex flex-col items-center relative z-10">
                {/* Circle with Number */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                  <span className="text-xl font-bold text-[#000]">{step.number}</span>
                </div>

                {/* Step Title */}
                <p className="text-white text-lg font-medium text-center">
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
