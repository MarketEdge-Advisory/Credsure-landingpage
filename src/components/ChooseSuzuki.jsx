import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, X, Images } from 'lucide-react';
import { useCarContext } from '../context/CarContext';

const ChooseSuzuki = () => {
  const [visibleCars, setVisibleCars] = useState(9);
  const [selectedCarImages, setSelectedCarImages] = useState(null);
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
      priceValue: 32000000,
      images: ['/Dzire.svg', '/Dzire1.svg', '/Dzire.svg'],
    },
    {
      id: 2,
      name: 'New Swift',
      description: 'Sporty hatchback perfect for city driving.',
      image: '/Swift.svg',
      priceValue: 28000000,
      images: ['/Swift.svg', '/Swift.svg', '/Swift.svg'],
    },
    {
      id: 3,
      name: 'Alto',
      description: 'Affordable and reliable everyday car.',
      image: '/Alto.svg',
      priceValue: 17000000,
      images: ['/Alto.svg', '/Alto.svg', '/Alto.svg'],
    },
    {
      id: 4,
      name: 'Grand Vitara',
      description: 'Premium SUV with hybrid technology.',
      image: '/Grandvitara.svg',
      priceValue: 36000000,
      images: ['/Grandvitara.svg', '/Grandvitara.svg', '/Grandvitara.svg'],
    },
    {
      id: 5,
      name: 'Jimny (5-Doors)',
      description: 'More space with legendary off-road DNA.',
      image: '/Jimny.svg',
      priceValue: 46000000,
      images: ['/Jimny.svg', '/Jimny.svg', '/Jimny.svg'],
    },
    {
      id: 6,
      name: 'Grand Vitara 1.5L',
      description: 'Reliable commercial vehicle for business.',
      image: '/Grand-vitara5.1L.avif',
      priceValue: 42000000,
      images: ['/Grandvitara.svg', '/Grandvitara.svg', '/Grandvitara.svg'],
    },
    {
      id: 7,
      name: 'S-Presso',
      description: 'Bold design with enhanced performance.',
      image: '/presso.jpeg',
      priceValue: 18000000,
      images: ['/presso.jpeg', '/presso.jpeg', '/presso.jpeg'],
    },
    {
      id: 8,
      name: 'Ertiga',
      description: 'More space with legendary off-road DNA.',
      image: '/Ertiga.svg',
      priceValue: 36000000,
      images: ['/Ertiga.svg', '/Ertiga1.svg', '/Ertiga.svg'],
    },
    {
      id: 9,
      name: 'Celerio',
      description: 'Reliable commercial vehicle for business.',
      image: '/celerio-suzuki.jpg',
      priceValue: null,
      images: ['/Ertiga1.svg', '/Ertiga.svg', '/Ertiga1.svg'],
    }
  ].map(car => ({
    ...car,
    price: formatPrice(car.priceValue),
    monthly: calculateMonthly(car.priceValue),
  }));

  const handleLoadMore = () => {
    setVisibleCars(cars.length);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCarImages) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCarImages]);

  return (
    <>
    <section id="vehicles" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-4 bg-[#ECF2F9] justify-center items-center rounded-full inline-flex px-3 sm:px-4 py-2 flex-wrap sm:flex-nowrap gap-2">
            <span className="bg-white text-gray-600 text-xs sm:text-sm md:text-base font-medium px-2 rounded-full">Step 1</span>
            <span className="text-cyan-500 text-xs sm:text-sm md:text-base font-medium cursor-pointer hover:underline flex items-center">
              Browse and select vehicle <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4 inline-block ml-1" />
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Choose your perfect suzuki
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-[620px] mx-auto px-4">
            Build purchase intent through visual discovery. Each vehicle card should feel aspirational yet accessible, with clear CTAs leading to the calculator.
          </p>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {cars.slice(0, visibleCars).map((car) => (
            <div
              key={car.id}
              className="group relative rounded-none overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[320px] sm:h-[360px] md:h-[400px]"
              style={{
                backgroundImage: `url(${car.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

              {/* View Images Icon */}
              <button 
                className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                onClick={() => setSelectedCarImages({ name: car.name, images: car.images })}
                title="View more images"
              >
                <Images className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </button>

              {/* Price Info Box */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-[#1a2942] rounded-lg px-2 sm:px-3 md:px-4 py-2 sm:py-3 shadow-lg">
                <p className="text-white text-xs sm:text-sm font-normal mb-1">
                  From: <span className='text-xs sm:text-sm font-bold text-white'>{car.price}</span>
                </p>
                <p className="text-white text-xs sm:text-sm font-normal">
                  Monthly From: <span className='text-xs sm:text-sm font-bold text-white'>{car.monthly}</span>
                </p>
              </div>

              {/* Car Info - Bottom Section */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 md:p-6">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{car.name}</h3>
                <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 drop-shadow-lg">{car.description}</p>

                {/* CTA Button */}
                <button 
                  onClick={() => {
                    selectCar(car);
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="group/btn flex items-center justify-between w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full transition-all duration-300"
                >
                  <span className="text-[10px] sm:text-xs md:text-sm">Calculate Monthly Payment</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCars < cars.length && (
          <div className="text-center px-4">
            <button
              onClick={handleLoadMore}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base"
            >
              Load More vehicles
            </button>
          </div>
        )}
      </div>
    </section>

    {/* Image Popup Modal */}
    {selectedCarImages && (
      <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setSelectedCarImages(null)}
        onTouchEnd={() => setSelectedCarImages(null)}
      >
        <div 
          className="bg-white rounded-lg max-w-4xl w-full p-4 sm:p-6 relative my-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedCarImages(null)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Car Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-12">{selectedCarImages.name}</h3>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedCarImages.images.map((img, index) => (
              <div 
                key={index}
                className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={img} 
                  alt={`${selectedCarImages.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* View Details Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const car = cars.find(c => c.name === selectedCarImages.name);
                if (car) {
                  selectCar(car);
                  setSelectedCarImages(null);
                  setTimeout(() => {
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 sm:px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
            >
              Calculate Monthly Payment
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ChooseSuzuki;
