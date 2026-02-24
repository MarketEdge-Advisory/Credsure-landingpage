import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, X, Images } from 'lucide-react';
import { useCarContext } from '../context/CarContext';
  // Removed hardcoded cars array. Fetching from backend instead.
const ChooseSuzuki = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCarImages, setSelectedCarImages] = useState(null);

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      setError(null);
      try {
        const { getCars } = await import('../api/cars');
        const data = await getCars();
        const BASE_URL = 'https://credsure-backend-1564d84ae428.herokuapp.com';
        const formatted = data.map(car => {
          const toAbsolute = (img) =>
            img && !img.startsWith('http') ? `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}` : img;
          return {
            ...car,
            image: toAbsolute(car.image),
            images: Array.isArray(car.images) ? car.images.map(toAbsolute) : [],
            price: formatPrice(car.priceValue || car.price),
            monthly: calculateMonthly(car.priceValue || car.price),
          };
        });
        setCars(formatted);
      } catch (err) {
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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
           Explore our range and choose the Suzuki that fits your lifestyle.
         From sleek city cruisers to refined family sedans, start with the one that feels right.
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
                onClick={() => setSelectedCarImages({ name: car.name, images: car.images, variants: car.variants })}
                title="View more images"
              >
                <Images className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </button>

              {/* Inventory badge */}
              {(() => {
                const stock = inventory[car.id] ?? 0;
                return (
                  <div className="absolute top-2 sm:top-4 left-12 sm:left-16 z-10 flex items-center gap-1 bg-[#1a2942] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    <span>{stock === 0 ? 'Out of stock' : `${stock} left`}</span>
                  </div>
                );
              })()}

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
                  className="group/btn flex items-center justify-between w-full bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full transition-all duration-300"
                >
                  <span className="text-[10px] sm:text-xs md:text-sm">Calculate Monthly Payment</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-y-1 transition-transform group-hover:text-black" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCars < cars.length && (
          <div className="text-center px-4 flex">
            <button
              onClick={handleLoadMore}
              className="bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-normal px-8 sm:px-12 py-4 sm:py-5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-base sm:text-lg flex items-center gap-3 mx-auto"
            >
              Load More vehicles
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}
      </div>
    </section>

    {/* Specs Modal */}
    {selectedCarImages && (
      <div 
        className="fixed inset-0 bg-black/90 z-50 flex items-start justify-center overflow-y-auto"
        onClick={() => setSelectedCarImages(null)}
      >
        <div 
          className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {selectedCarImages.name}
            </h1>
            <button
              onClick={() => setSelectedCarImages(null)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Image Gallery - show up to 3 images, one per variant if available */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, index) => {
              // Prefer image per variant if available, else fallback to first image
              const img = selectedCarImages.variants && selectedCarImages.variants[index] && selectedCarImages.images[index]
                ? selectedCarImages.images[index]
                : (index === 0 && selectedCarImages.images[0]) || null;
              // Only show image if there is a variant for this slot
              if (selectedCarImages.variants && selectedCarImages.variants[index]) {
                return img ? (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm overflow-hidden aspect-video"
                  >
                    <img
                      src={img}
                      alt={`${selectedCarImages.name} model ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm aspect-video flex items-center justify-center"
                  >
                    <span className="text-gray-300 text-sm">No image</span>
                  </div>
                );
              } else if (index === 0 && selectedCarImages.images[0]) {
                // Always show the first image for the first slot
                return (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm overflow-hidden aspect-video"
                  >
                    <img
                      src={selectedCarImages.images[0]}
                      alt={`${selectedCarImages.name} model 1`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              } else {
                // Fill empty slots
                return (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm aspect-video flex items-center justify-center"
                  >
                    <span className="text-gray-300 text-sm">No image</span>
                  </div>
                );
              }
            })}
          </div>

          {/* Specifications Grid */}
          <div className={`grid grid-cols-1 ${selectedCarImages.variants?.length > 1 ? 'md:grid-cols-2' : ''} gap-6 md:gap-8`}>
            {selectedCarImages.variants?.map((variant, variantIndex) => (
              <div key={variantIndex} className="bg-white border border-gray-200 rounded-sm p-4 sm:p-6">
                {/* Variant Title */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 bg-cyan-100 px-3 py-2 rounded">
                    {variant.name}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
                  {variant.description}
                </p>

                {/* Engine and Performance */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    Engine and Performance
                  </h3>
                  <ul className="space-y-2">
                    {variant.enginePerformance.map((item, idx) => (
                      <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dimensions and Capacities */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    Dimensions and Capacities
                  </h3>
                  <ul className="space-y-2">
                    {variant.dimensionsCapacities.map((item, idx) => (
                      <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    Key Features (2025 Model)
                  </h3>
                  <ul className="space-y-2">
                    {variant.keyFeatures.map((item, idx) => (
                      <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Calculate Button */}
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
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
                >
                  Calculate Monthly Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ChooseSuzuki;
