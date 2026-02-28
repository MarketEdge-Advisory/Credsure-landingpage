import React, { useState, useEffect } from "react";
import { X, Images, ArrowDown } from "lucide-react";
import { useCarContext } from "../context/CarContext";

// Helper to optimize Cloudinary URLs
const optimizeImageUrl = (url, width = 400) => {
  if (!url) return "";
  // Only transform Cloudinary URLs
  if (url.includes("cloudinary.com")) {
    // Insert transformation right after '/upload/'
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url; // fallback for local images
};

const ChooseSuzuki = () => {
  const { selectCar } = useCarContext();

  const [visibleCars, setVisibleCars] = useState(6);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState(null);

  // Format price
  const formatPrice = (price) => {
    if (!price) return "₦0";
    return `₦${Number(price).toLocaleString()}`;
  };

  // Monthly calculation
  const calculateMonthly = (price, months = 60) => {
    if (!price) return "₦0";

    const downPayment = price * 0.1;
    const loanAmount = price - downPayment;
    const rate = 0.08 / 12;

    const payment =
      (loanAmount * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    return formatPrice(Math.round(payment));
  };

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { getCars } = await import("../api/cars");
        const res = await getCars();

        const formatted = res.data.map((car) => {
          const price = car.basePrice || car.price || 0;

          // Get variant images and prices
          let variantImages = [];
          let variantPrices = [];

          if (car.variants && car.variants.length > 0) {
            variantImages = car.variants
              .map(
                (variant) =>
                  variant.images?.[0]?.url ||
                  variant.images?.[0] ||
                  variant.image
              )
              .filter(Boolean)
              .slice(0, 3);

            variantPrices = car.variants.map(
              (variant) => variant.price || variant.basePrice || price
            );
          } else if (car.images && car.images.length > 0) {
            variantImages = [car.images[0]?.url || car.images[0]];
            variantPrices = [price];
          }

          // Determine if "From" should show (only if variant prices differ)
          const showFrom =
            variantPrices.length > 1 &&
            new Set(variantPrices).size > 1;

          // Monthly payment: use first price as default
          const monthlyPayment = calculateMonthly(variantPrices[0]);

          // Optimize main image URL (width ~400px for card)
          const mainImage = car.images?.[0]?.url || car.images?.[0] || "/empty-cars.svg";
          const optimizedMainImage = optimizeImageUrl(mainImage, 400);

          return {
            ...car,
            id: car._id || car.id,
            image: optimizedMainImage, // store optimized URL
            images: variantImages.map(img => optimizeImageUrl(img, 200)), // popup thumbnails
            showFrom,
            priceFormatted: formatPrice(Math.min(...variantPrices)),
            monthlyFormatted: monthlyPayment,
          };
        });

        setCars(formatted);
      } catch (err) {
        console.error(err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleLoadMore = () => {
    setVisibleCars(cars.length);
  };

  const togglePopup = (carId) => {
    setSelectedCarId((prev) => (prev === carId ? null : carId));
  };

  if (loading) {
    return (
      <p className="text-center py-20">Loading vehicles...</p>
    );
  }

  return (
    <section id="vehicles" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-[#ECF2F9] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base bg-white rounded-full px-3 sm:px-4">Step 1</span>
            <span className="text-[#3FA9F5] font-medium text-xs sm:text-sm md:text-base flex items-center gap-1">
              Browse and Select Vehicle <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4" />
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 px-4">
            Choose your perfect Suzuki
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto lg:w-[620px] px-4">
            Explore our range and choose the Suzuki that fits your lifestyle. From sleek city cruisers to refined family sedans, start with the one that feels right.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.slice(0, visibleCars).map((car) => {
            const isOpen = selectedCarId === car.id;

            return (
              <div
                key={car.id}
                className="relative z-0 h-[380px] rounded-lg overflow-hidden shadow-lg"
              >
                {/* Image - now as <img> for lazy loading */}
                <img
                  src={car.image}
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20"></div>

                {/* Image icon */}
                {car.images?.length > 0 && (
                  <button
                    onClick={() => togglePopup(car.id)}
                    className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full hover:scale-110 transition"
                  >
                    <Images className="w-5 h-5 text-cyan-500" />
                  </button>
                )}

                {/* Price */}
                <div className="absolute top-4 right-4 z-10 bg-[#1a2942] text-white p-3 rounded ">
                  {car.showFrom && (
                    <p>
                      From: <strong>{car.priceFormatted}</strong>
                    </p>
                  )}
                  <p>
                    Monthly: <strong>{car.monthlyFormatted}</strong>
                  </p>
                </div>

                {/* Bottom */}
                <div className="absolute bottom-0 z-10 p-4 text-white w-full">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <button
                     onClick={() => {
                    selectCar(car);
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                    className="mt-2 w-full bg-cyan-500 py-2 rounded-full hover:bg-slate-200 hover:text-black transition "
                  >
                    Calculate Monthly Payment
                  </button>
                </div>

                {/* POPUP INSIDE CARD */}
                {isOpen && (
                  <div className="absolute inset-0 z-10 bg-black/20 flex flex-col p-4">
                    {/* Close */}
                    <button
                      onClick={() => setSelectedCarId(null)}
                      className="self-end bg-white p-2 rounded-full mb-4 hover:scale-110 transition z-10"
                    >
                      <X size={18} />
                    </button>

                    <h3 className="text-white text-xl font-bold mb-4">
                      {car.name}
                    </h3>

                    <div className="bg-white rounded-lg p-2 w-full">
                      {/* Images */}
                      {car.images?.length > 1 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {car.images.slice(0, 3).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${car.name} variant ${index + 1}`}
                              className="rounded-lg object-cover w-full h-24"
                              loading="lazy"
                              decoding="async"
                            />
                          ))}
                        </div>
                      ) : (
                        <img
                          src={car.images?.[0]}
                          alt={car.name}
                          className="rounded-lg object-cover w-full h-40"
                          loading="lazy"
                          decoding="async"
                        />
                      )}

                      {/* Car details */}
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {car.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {car.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        selectCar(car);
                        setSelectedCarId(null);
                      }}
                      className="mt-auto bg-cyan-500 text-white py-2 rounded-full hover:bg-slate-200 hover:text-black transition"
                    >
                      Select vehicle
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {visibleCars < cars.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-slate-200 hover:text-black transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChooseSuzuki;