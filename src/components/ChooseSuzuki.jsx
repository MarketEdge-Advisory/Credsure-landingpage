import React, { useState } from 'react';
import { ArrowDown, Bookmark, ChevronDown, MoveDown } from 'lucide-react';
import { useCarContext } from '../context/CarContext';

const ChooseSuzuki = () => {
  const [visibleCars, setVisibleCars] = useState(9);
  const { selectCar } = useCarContext();

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${(price / 1000).toFixed(0)}K`;
  };

  const calculateMonthly = (price, downPayment = 500000, months = 12) => {
    const loanAmount = price - downPayment;
    const monthly = loanAmount / months;
    if (monthly >= 1000000) {
      return `₦${(monthly / 1000000).toFixed(1)}M`;
    }
    return `₦${(monthly / 1000).toFixed(0)}K`;
  };

  const cars = [
    {
      id: 1,
      name: 'New Dzire',
      description: 'Updated design with modern features & comfort.',
      image: '/Dzire.svg',
      priceValue: 12500000,
    },
    {
      id: 2,
      name: 'New Swift',
      description: 'Sporty hatchback perfect for city driving.',
      image: '/Swift.svg',
      priceValue: 15000000,
    },
    {
      id: 3,
      name: 'Alto',
      description: 'Affordable and reliable everyday car.',
      image: '/Alto.svg',
      priceValue: 8500000,
    },
    {
      id: 4,
      name: 'Grand Vitara',
      description: 'Premium SUV with hybrid technology.',
      image: '/Grandvitara.svg',
      priceValue: 24300250,
    },
    {
      id: 5,
      name: 'Jimny (5-Doors)',
      description: 'More space with legendary off-road DNA.',
      image: '/Jimny.svg',
      priceValue: 18000000,
    },
    {
      id: 6,
      name: 'Grand Vitara 1.5L',
      description: 'Reliable commercial vehicle for business.',
      image: '/Grandvitara.svg',
      priceValue: 22500000,
    },
    {
      id: 7,
      name: 'S-Presso',
      description: 'Bold design with enhanced performance.',
      image: '/presso.jpeg',
      priceValue: 9800000,
    },
    {
      id: 8,
      name: 'Ertiga',
      description: 'More space with legendary off-road DNA.',
      image: '/Ertiga.svg',
      priceValue: 16500000,
    },
    {
      id: 9,
      name: 'Celerio',
      description: 'Reliable commercial vehicle for business.',
      image: '/Ertiga1.svg',
      priceValue: 10200000,
    }
  ].map(car => ({
    ...car,
    price: formatPrice(car.priceValue),
    monthly: calculateMonthly(car.priceValue),
  }));

  const handleLoadMore = () => {
    setVisibleCars(cars.length);
  };

  return (
    <section id="vehicles" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 bg-[#ECF2F9] justify-center items-center rounded-full inline-flex px-4 py-2">
            <span className="bg-white text-gray-600 text-sm md:text-base font-medium px-2 rounded-full">Step 1</span>
            <span className="ml-4 text-cyan-500 text-sm md:text-base font-medium cursor-pointer hover:underline">
              Browse and select vehicle <ArrowDown className="w-4 h-4 inline-block ml-1" />
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose your perfect suzuki
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-[620px] mx-auto">
            Build purchase intent through visual discovery. Each vehicle card should feel aspirational yet accessible, with clear CTAs leading to the calculator.
          </p>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cars.slice(0, visibleCars).map((car) => (
            <div
              key={car.id}
              className="group relative rounded-none overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[400px]"
              style={{
                backgroundImage: `url(${car.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

              {/* Bookmark Icon */}
              <button className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md">
                <Bookmark className="w-5 h-5 text-gray-700" />
              </button>

              {/* Price Info Box */}
              <div className="absolute top-4 right-4 z-10 bg-[#1a2942] rounded-lg px-4 py-3 shadow-lg">
                <p className="text-white text-sm font-normal mb-1">
                  From: <span className='text-sm font-bold text-white'>{car.price}</span>
                </p>
                <p className="text-white text-sm font-normal">
                  Monthly From: <span className='text-sm font-bold text-white'>{car.monthly}</span>
                </p>
              </div>

              {/* Car Info - Bottom Section */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-slate-400/30 backdrop-blur-sm">
                <h3 className="text-white text-2xl font-bold mb-2">{car.name}</h3>
                <p className="text-gray-200 text-sm mb-4">{car.description}</p>

                {/* CTA Button */}
                <button 
                  onClick={() => {
                    selectCar(car);
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="group/btn flex items-center justify-between w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
                >
                  <span className="text-xs">Calculate Monthly Payment</span>
                  <ChevronDown className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCars < cars.length && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Load More vehicles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChooseSuzuki;
