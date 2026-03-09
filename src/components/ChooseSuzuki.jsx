
// import React, { useState, useEffect } from "react";
// import { X, Images, ArrowDown, ChevronDown } from "lucide-react";
// import { useCarContext } from "../context/CarContext";

// // Helper to optimize Cloudinary URLs
// const optimizeImageUrl = (url, width = 400) => {
//   if (!url) return "";
//   if (url.includes("cloudinary.com")) {
//     return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
//   }
//   return url;
// };

// const ChooseSuzuki = () => {
//   const { selectCar } = useCarContext();

//   const [visibleCars, setVisibleCars] = useState(6);
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCarId, setSelectedCarId] = useState(null);

//   // Format price
//   const formatPrice = (price) => {
//     if (!price) return "₦0";
//     return `₦${Number(price).toLocaleString()}`;
//   };

//   // Monthly calculation
//   const calculateMonthly = (price, months = 36) => {
//     if (!price) return "₦0";
//     const downPayment = price * 0.1;
//     const loanAmount = price - downPayment;
//     const rate = 0.08 / 12;
//     const payment =
//       (loanAmount * rate * Math.pow(1 + rate, months)) /
//       (Math.pow(1 + rate, months) - 1);
//     return formatPrice(Math.round(payment));
//   };

//   // Fetch cars
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const { getCars } = await import("../api/cars");
//         const res = await getCars();

//         const formatted = res.data.map((car) => {
//           const price = car.basePrice || car.price || 0;

//           // Extract variant images (from this variant only)
//           let variantImages = [];
//           let variantPrices = [];

//           if (car.variants && car.variants.length > 0) {
//             variantImages = car.variants
//               .map(
//                 (variant) =>
//                   variant.images?.[0]?.url ||
//                   variant.images?.[0] ||
//                   variant.image
//               )
//               .filter(Boolean)
//               .slice(0, 3);

//             variantPrices = car.variants.map(
//               (variant) => variant.price || variant.basePrice || price
//             );
//           } else if (car.images && car.images.length > 0) {
//             variantImages = [car.images[0]?.url || car.images[0]];
//             variantPrices = [price];
//           }

//           const showFrom =
//             variantPrices.length > 1 && new Set(variantPrices).size > 1;
//           const monthlyPayment = calculateMonthly(variantPrices[0]);

//           const mainImage = car.images?.[0]?.url || car.images?.[0] || "/empty-cars.svg";
//           const optimizedMainImage = optimizeImageUrl(mainImage, 400);

//           return {
//             ...car,
//             id: car._id || car.id,
//             image: optimizedMainImage,
//             images: variantImages.map(img => optimizeImageUrl(img, 200)),
//             showFrom,
//             priceFormatted: formatPrice(Math.min(...variantPrices)),
//             monthlyFormatted: monthlyPayment,
//           };
//         });

//         setCars(formatted);
//       } catch (err) {
//         console.error(err);
//         setCars([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCars();
//   }, []);

//   const handleLoadMore = () => {
//     setVisibleCars(cars.length);
//   };

//   const togglePopup = (carId) => {
//     setSelectedCarId((prev) => (prev === carId ? null : carId));
//   };

//   if (loading) {
//     return <p className="text-center py-20">Loading vehicles...</p>;
//   }

//   return (
//     <section id="vehicles" className="bg-white py-16">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header (unchanged) */}
//         <div className="text-center mb-8 sm:mb-12">
//           <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-[#ECF2F9] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
//             <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base bg-white rounded-full px-3 sm:px-4">Step 1</span>
//             <span className="text-[#3FA9F5] font-medium text-xs sm:text-sm md:text-base flex items-center gap-1">
//               Browse and Select Vehicle <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4" />
//             </span>
//           </div>
//           <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 px-4">
//             Choose your perfect Suzuki
//           </h2>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto lg:w-[620px] px-4">
//             Explore our range and choose the Suzuki that fits your lifestyle. From sleek city cruisers to refined family sedans, start with the one that feels right.
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {cars.slice(0, visibleCars).map((car) => {
//             const isOpen = selectedCarId === car.id;

//             return (
//               <div
//                 key={car.id}
//                 className="relative z-0 h-[380px] rounded-lg overflow-hidden shadow-lg"
//               >
//                 <img
//                   src={car.image}
//                   alt={car.name}
//                   className="absolute inset-0 w-full h-full object-cover"
//                   loading="lazy"
//                   decoding="async"
//                 />

//                 {/* Image icon */}
//                 {car.images?.length > 0 && (
//                   <button
//                     onClick={() => togglePopup(car.id)}
//                     className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full hover:scale-110 transition"
//                   >
//                     <Images className="w-5 h-5 text-cyan-500" />
//                   </button>
//                 )}

//                 {/* Price */}
//                 <div className="absolute top-4 right-4 z-10 bg-[#1a2942] text-white p-3 rounded">
//                   <p>
//                     Monthly from: <strong>{car.monthlyFormatted}</strong>
//                   </p>
//                 </div>

//                 {/* Bottom */}
//                 <div className="absolute bottom-0 z-10 p-4 text-white w-full">
//                   <h3 className="text-xl font-bold">{car.name}</h3>
//                   <button
//                     onClick={() => {
//                       selectCar(car);
//                       const calculator = document.querySelector('#calculator');
//                       if (calculator) {
//                         calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                       }
//                     }}
//                     className="group gap-4 mt-2 w-full bg-cyan-500 py-2 rounded-full hover:bg-slate-200 hover:text-black transition flex items-center justify-center"
//                   >
//                     Calculate Monthly Payment
//                     <ChevronDown className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-y-1 group-hover:text-slate-800" />
//                   </button>
//                 </div>

//                 {/* POPUP INSIDE CARD - shows each variant with its images + description */}
// {isOpen && (
//   <div className="absolute inset-0 z-10 bg-black/20 flex flex-col p-4">
//     <button
//       onClick={() => setSelectedCarId(null)}
//       className="self-end bg-white p-2 rounded-full mb-4 hover:scale-110 transition z-10"
//     >
//       <X size={18} />
//     </button>

//     <h3 className="text-white text-xl font-bold mb-4">{car.name}</h3>

//     {/* Scrollable variants container with hidden scrollbar */}
//     <div
//       className="bg-white rounded-lg p-3 w-full flex flex-col max-h-[280px] overflow-y-auto scrollbar-hide"
//       style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//     >
//       {cars
//         .filter(c => c.name === car.name)
//         .map((variant) => (
//           <div key={variant.id} className="mb-4 last:mb-0 border-b border-gray-200 pb-3 last:border-0">
//             {/* Variant images */}
//             <div className="mb-2">
//               {variant.images && variant.images.length > 1 ? (
//                 <div className="grid grid-cols-3 gap-1">
//                   {variant.images.slice(0, 3).map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`${variant.name} ${variant.variant || ''} ${idx+1}`}
//                       className="rounded-lg object-cover w-full h-20"
//                       onError={(e) => (e.target.src = '/empty-cars.svg')}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <img
//                   src={variant.images?.[0] || '/empty-cars.svg'}
//                   alt={variant.name}
//                   className="rounded-lg object-cover w-full h-28"
//                   onError={(e) => (e.target.src = '/empty-cars.svg')}
//                 />
//               )}
//             </div>
//             {/* Variant name and description */}
//             <div>
//               <p className="font-semibold text-gray-900 text-sm">
//                 {variant.variant || 'Standard'}
//               </p>
//               <p className="text-xs text-gray-600 line-clamp-3">
//                 {variant.description || 'No description available'}
//               </p>
//             </div>
//           </div>
//         ))}
//     </div>

//     {/* <button
//       onClick={() => {
//         selectCar(car);
//         setSelectedCarId(null);
//       }}
//       className="mt-2 bg-cyan-500 text-white py-2 rounded-full hover:bg-slate-200 hover:text-black transition"
//     >
//       Select vehicle
//     </button> */}
//   </div>
// )}

// {/* Add style to hide scrollbar */}
// <style>{`
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
// `}</style>
//               </div>
//             );
//           })}
//         </div>

//         {/* Load more */}
//         {visibleCars < cars.length && (
//           <div className="text-center mt-8 flex w-full items-center justify-center">
//             <button
//               onClick={handleLoadMore}
//               className="group gap-2 flex bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-slate-200 hover:text-black transition items-center"
//             >
//               Load More
//               <ChevronDown className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-y-1 group-hover:text-slate-800" />
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ChooseSuzuki;


import React, { useState, useEffect } from "react";
import { X, Images, ArrowDown, ChevronDown } from "lucide-react";
import { useCarContext } from "../context/CarContext";
import { useNavigate } from "react-router-dom"; // if using React Router

// Helper to optimize Cloudinary URLs
const optimizeImageUrl = (url, width = 400) => {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

const ChooseSuzuki = () => {
  const { selectCar } = useCarContext();
  const navigate = useNavigate(); // for navigation to details page

  const [visibleCars, setVisibleCars] = useState(6);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState(null); // controls popup

  // Format price
  const formatPrice = (price) => {
    if (!price) return "₦0";
    return `₦${Number(price).toLocaleString()}`;
  };

  // Monthly calculation
  const calculateMonthly = (price, months = 36) => {
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

          // Extract variant images (from this variant only)
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

          const showFrom =
            variantPrices.length > 1 && new Set(variantPrices).size > 1;
          const monthlyPayment = calculateMonthly(variantPrices[0]);

          const mainImage = car.images?.[0]?.url || car.images?.[0] || "/empty-cars.svg";
          const optimizedMainImage = optimizeImageUrl(mainImage, 400);

          return {
            ...car,
            id: car._id || car.id,
            image: optimizedMainImage,
            images: variantImages.map(img => optimizeImageUrl(img, 200)),
            showFrom,
            priceFormatted: formatPrice(Math.min(...variantPrices)),
            monthlyFormatted: monthlyPayment,
          };
        });

        // Sort by availability: available first, then coming soon, then not available
        const availabilityRank = (status) => {
          const s = String(status || '').toUpperCase();
          if (s === 'COMING_SOON') return 1;
          if (s === 'NOT_AVAILABLE' || s === 'UNAVAILABLE') return 2;
          return 0; // treat anything else as available
        };

        formatted.sort((a, b) => {
          const rankA = availabilityRank(a.availability);
          const rankB = availabilityRank(b.availability);
          if (rankA !== rankB) return rankA - rankB;
          return String(a.name || '').localeCompare(String(b.name || ''));
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

const formatStatus = (status) => {
  if (!status) return '';
  return status
    .toLowerCase()                // convert whole string to lowercase
    .split('_')                   // split by underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
    .join(' ');                   // join with space
};

  if (loading) {
    return <p className="text-center py-20">Loading vehicles...</p>;
  }

  return (
    <section id="vehicles" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header (unchanged) */}
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
                onMouseEnter={() => setSelectedCarId(car.id)}  // open popup on hover
                onMouseLeave={() => setSelectedCarId(null)}    // close when mouse leaves card
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />

                {/* Image icon - now navigates to details page */}
                {car.images?.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card hover events interference
                      navigate(`/car/${car.id}`); // adjust route as needed
                    }}
                    className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full hover:scale-110 transition"
                  >
                    <Images className="w-5 h-5 text-cyan-500" />
                  </button>
                )}

                {/* Price */}
                <div className="absolute top-4 right-4 z-10 bg-[#1a2942] text-white p-3 rounded">
  {car.availability === 'COMING_SOON' || car.availability === 'NOT_AVAILABLE' ? (
    <p>{formatStatus(car.availability)}</p>
  ) : (
    <p>
      Monthly from: <strong>{car.monthlyFormatted}</strong>
    </p>
  )}
</div>

                {/* Bottom */}
                <div className="absolute bottom-0 z-10 p-4 text-white w-full">
                  <h3 className="text-xl font-bold">{`${car.name} ${car.variant}`}</h3>
                  <button
                    onClick={() => {
                      selectCar(car);
                      const calculator = document.querySelector('#calculator');
                      if (calculator) {
                        calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="group gap-4 mt-2 w-full bg-cyan-500 py-2 rounded-full hover:bg-slate-200 hover:text-black transition flex items-center justify-center"
                  >
                    Calculate Monthly Payment
                    <ChevronDown className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-y-1 group-hover:text-slate-800" />
                  </button>
                </div>

                {/* POPUP INSIDE CARD - shows each variant with its images + description */}
                {isOpen && (
                  <div className="absolute inset-0 z-10 bg-black/20 flex flex-col p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCarId(null);
                      }}
                      className="self-end bg-white p-2 rounded-full mb-4 hover:scale-110 transition z-10"
                    >
                      <X size={18} />
                    </button>

                    <h3 className="text-white text-xl font-bold mb-4">{car.name}</h3>

                    {/* Scrollable variants container with hidden scrollbar */}
                    <div
                      className="bg-white rounded-lg p-3 w-full flex flex-col max-h-[280px] overflow-y-auto scrollbar-hide"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {cars
                        .filter(c => c.name === car.name)
                        .map((variant) => (
                          <div key={variant.id} className="mb-4 last:mb-0 border-b border-gray-200 pb-3 last:border-0">
                            {/* Variant images */}
                            <div className="mb-2">
                              {variant.images && variant.images.length > 1 ? (
                                <div className="grid grid-cols-3 gap-1">
                                  {variant.images.slice(0, 3).map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt={`${variant.name} ${variant.variant || ''} ${idx+1}`}
                                      className="rounded-lg object-cover w-full h-20"
                                      onError={(e) => (e.target.src = '/empty-cars.svg')}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <img
                                  src={variant.images?.[0] || '/empty-cars.svg'}
                                  alt={variant.name}
                                  className="rounded-lg object-cover w-full h-28"
                                  onError={(e) => (e.target.src = '/empty-cars.svg')}
                                />
                              )}
                            </div>
                            {/* Variant name and description */}
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {variant.variant || 'Standard'}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-3">
                                {variant.description || 'No description available'}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {visibleCars < cars.length && (
          <div className="text-center mt-8 flex w-full items-center justify-center">
            <button
              onClick={handleLoadMore}
              className="group gap-2 flex bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-slate-200 hover:text-black transition items-center"
            >
              Load More
              <ChevronDown className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-y-1 group-hover:text-slate-800" />
            </button>
          </div>
        )}
      </div>

      {/* Style to hide scrollbar (placed once at the end) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ChooseSuzuki;
