// import React, { useState, useEffect } from 'react';
// import { ArrowDown, ChevronDown, X, Images } from 'lucide-react';
// import { useCarContext } from '../context/CarContext';
//   // Removed hardcoded cars array. Fetching from backend instead.
// const ChooseSuzuki = () => {
//    const [visibleCars, setVisibleCars] = useState(6);
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCarImages, setSelectedCarImages] = useState(null);
//     // Helper to format price as currency
//     function formatPrice(price) {
//       if (!price) return '₦0';
//       return `₦${Number(price).toLocaleString()}`;
//     }

//     // Simple monthly payment calculation
//     function calculateMonthly(price, months = 60) {
//       if (!price) return '₦0';
//       const downPayment = price * 0.1;
//       const loanAmount = price - downPayment;
//       const monthlyInterestRate = 0.08 / 12;
//       const monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
//         (Math.pow(1 + monthlyInterestRate, months) - 1);
//       return formatPrice(Math.round(monthlyPayment));
//     }
 

//   useEffect(() => {
//     async function fetchCars() {
//       setLoading(true);
//       setError(null);
//       try {
//         const { getCars } = await import('../api/cars');
//         const response = await getCars();
//         const cars = Array.isArray(response?.data) ? response.data : [];
//         const formatted = cars.map(car => {
//           const imageUrl = (Array.isArray(car.images) && car.images[0]?.url) ? car.images[0].url : '/empty-cars.svg';
//           return {
//             ...car,
//             image: imageUrl,
//             images: Array.isArray(car.images) ? car.images.map(img => img.url || img) : [],
//             price: car.basePrice || car.price || 0,
//             monthly: car.basePrice ? calculateMonthly(car.basePrice) : (car.price ? calculateMonthly(car.price) : 0),
//           };
//         });
//         setCars(formatted);
//       } catch (err) {
//         setError('Failed to load cars');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCars();
//   }, []);

//   const handleLoadMore = () => {
//     setVisibleCars(cars.length);
//   };

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     if (selectedCarImages) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [selectedCarImages]);

//   return (
//     <>
//     <section id="vehicles" className="bg-white py-16 md:py-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8 sm:mb-12">
//           <div className="mb-4 bg-[#ECF2F9] justify-center items-center rounded-full inline-flex px-3 sm:px-4 py-2 flex-wrap sm:flex-nowrap gap-2">
//             <span className="bg-white text-gray-600 text-xs sm:text-sm md:text-base font-medium px-2 rounded-full">Step 1</span>
//             <span className="text-cyan-500 text-xs sm:text-sm md:text-base font-medium cursor-pointer hover:underline flex items-center">
//               Browse and select vehicle <ArrowDown className="w-3 sm:w-4 h-3 sm:h-4 inline-block ml-1" />
//             </span>
//           </div>
//           <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
//             Choose your perfect suzuki
//           </h2>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-[620px] mx-auto px-4">
//            Explore our range and choose the Suzuki that fits your lifestyle.
//          From sleek city cruisers to refined family sedans, start with the one that feels right.
//           </p>
//         </div>

//         {/* Car Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
//           {cars.slice(0, visibleCars).map((car) => (
//             <div
//               key={car.id}
//               className="group relative rounded-none overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[320px] sm:h-[360px] md:h-[400px]"
//               style={{
//                 backgroundImage: `url(${car.image})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//               }}
//             >
//               {/* Overlay Gradient */}
//               <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

//               {/* View Images Icon */}
//               <button 
//                 className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
//                 onClick={() => setSelectedCarImages({ name: car.name, images: car.images, variants: car.variants })}
//                 title="View more images"
//               >
//                 <Images className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
//               </button>

//               {/* Inventory badge */}
//               <div className="absolute top-2 sm:top-4 left-12 sm:left-16 z-10 flex items-center gap-1 bg-[#1a2942] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
//                 <span>Available</span>
//               </div>

//               {/* Price Info Box */}
//               <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-[#1a2942] rounded-lg px-2 sm:px-3 md:px-4 py-2 sm:py-3 shadow-lg">
//                 <p className="text-white text-xs sm:text-sm font-normal mb-1">
//                   From: <span className='text-xs sm:text-sm font-bold text-white'>{car.price}</span>
//                 </p>
//                 <p className="text-white text-xs sm:text-sm font-normal">
//                   Monthly From: <span className='text-xs sm:text-sm font-bold text-white'>{car.monthly}</span>
//                 </p>
//               </div>

//               {/* Car Info - Bottom Section */}
//               <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 md:p-6">
//                 <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{car.name}</h3>
//                 <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 drop-shadow-lg">{car.description}</p>

//                 {/* CTA Button */}
//                 <button 
//                   onClick={() => {
//                     selectCar(car);
//                     setTimeout(() => {
//                       const calculator = document.querySelector('#calculator');
//                       if (calculator) {
//                         calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                       }
//                     }, 100);
//                   }}
//                   className="group/btn flex items-center justify-between w-full bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full transition-all duration-300"
//                 >
//                   <span className="text-[10px] sm:text-xs md:text-sm">Calculate Monthly Payment</span>
//                   <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-y-1 transition-transform group-hover:text-black" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Load More Button */}
//         {visibleCars < cars.length && (
//           <div className="text-center px-4 flex">
//             <button
//               onClick={handleLoadMore}
//               className="bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-normal px-8 sm:px-12 py-4 sm:py-5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-base sm:text-lg flex items-center gap-3 mx-auto"
//             >
//               Load More vehicles
//               <div
//                 key={car.id}
//                 className="group relative rounded-none overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[320px] sm:h-[360px] md:h-[400px]"
//                 style={{
//                   backgroundImage: `url(${car.image})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                 }}
//               >
//                 {/* Overlay Gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

//                 {/* View Images Icon */}
//                 <button 
//                   className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
//                   onClick={() => setSelectedCarImages({ name: car.name, images: car.images, variants: car.variants })}
//                   title="View more images"
//                 >
//                   <Images className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
//                 </button>

//                 {/* Inventory badge */}
//                 <div className="absolute top-2 sm:top-4 left-12 sm:left-16 z-10 flex items-center gap-1 bg-[#1a2942] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
//                   <span>Available</span>
//                 </div>

//                 {/* Price Info Box */}
//                 <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-[#1a2942] rounded-lg px-2 sm:px-3 md:px-4 py-2 sm:py-3 shadow-lg">
//                   <p className="text-white text-xs sm:text-sm font-normal mb-1">
//                     From: <span className='text-xs sm:text-sm font-bold text-white'>{car.price}</span>
//                   </p>
//                   <p className="text-white text-xs sm:text-sm font-normal">
//                     Monthly From: <span className='text-xs sm:text-sm font-bold text-white'>{car.monthly}</span>
//                   </p>
//                 </div>

//                 {/* Car Info - Bottom Section */}
//                 <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 md:p-6">
//                   <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{car.name}</h3>
//                   <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 drop-shadow-lg">{car.description}</p>

//                   {/* CTA Button */}
//                   <button 
//                     onClick={() => {
//                       selectCar(car);
//                       setTimeout(() => {
//                         const calculator = document.querySelector('#calculator');
//                         if (calculator) {
//                           calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                         }
//                       }, 100);
//                     }}
//                     className="group/btn flex items-center justify-between w-full bg-cyan-500 hover:bg-slate-100 hover:text-black text-white font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full transition-all duration-300"
//                   >
//                     <span className="text-[10px] sm:text-xs md:text-sm">Calculate Monthly Payment</span>
//                     <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-y-1 transition-transform group-hover:text-black" />
//                   </button>
//                 </div>

//                 {/* Popup modal inside card */}
//                 {selectedCarImages && selectedCarImages.name === car.name && (
//                   <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40" onClick={() => setSelectedCarImages(null)}>
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 md:p-8 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
//                       {/* Header */}
//                       <div className="flex items-center justify-between mb-6">
//                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//                           {selectedCarImages.name}
//                         </h1>
//                         <button
//                           onClick={() => setSelectedCarImages(null)}
//                           className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
//                         >
//                           <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                         </button>
//                       </div>
//                       {/* Image Gallery */}
//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
//                         {Array.from({ length: 3 }).map((_, index) => {
//                           const img = selectedCarImages.variants && selectedCarImages.variants[index] && selectedCarImages.images[index]
//                             ? selectedCarImages.images[index]
//                             : (index === 0 && selectedCarImages.images[0]) || null;
//                           if (selectedCarImages.variants && selectedCarImages.variants[index]) {
//                             return img ? (
//                               <div key={index} className="bg-gray-100 rounded-sm overflow-hidden aspect-video">
//                                 <img src={img} alt={`${selectedCarImages.name} model ${index + 1}`} className="w-full h-full object-cover" />
//                               </div>
//                             ) : (
//                               <div key={index} className="bg-gray-100 rounded-sm aspect-video flex items-center justify-center">
//                                 <span className="text-gray-300 text-sm">No image</span>
//                               </div>
//                             );
//                           } else if (index === 0 && selectedCarImages.images[0]) {
//                             return (
//                               <div key={index} className="bg-gray-100 rounded-sm overflow-hidden aspect-video">
//                                 <img src={selectedCarImages.images[0]} alt={`${selectedCarImages.name} model 1`} className="w-full h-full object-cover" />
//                               </div>
//                             );
//                           } else {
//                             return (
//                               <div key={index} className="bg-gray-100 rounded-sm aspect-video flex items-center justify-center">
//                                 <span className="text-gray-300 text-sm">No image</span>
//                               </div>
//                             );
//                           }
//                         })}
//                       </div>
//                       {/* Specifications Grid */}
//                       <div className={`grid grid-cols-1 ${selectedCarImages.variants?.length > 1 ? 'md:grid-cols-2' : ''} gap-6 md:gap-8`}>
//                         {selectedCarImages.variants?.map((variant, variantIndex) => (
//                           <div key={variantIndex} className="bg-white border border-gray-200 rounded-sm p-4 sm:p-6">
//                             <div className="mb-4 pb-4 border-b border-gray-200">
//                               <h2 className="text-lg sm:text-xl font-bold text-gray-900 bg-cyan-100 px-3 py-2 rounded">
//                                 {variant.name}
//                               </h2>
//                             </div>
//                             <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">{variant.description}</p>
//                             <div className="mb-6">
//                               <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Engine and Performance</h3>
//                               <ul className="space-y-2">
//                                 {variant.enginePerformance.map((item, idx) => (
//                                   <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
//                                     <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
//                                     <span>{item}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="mb-6">
//                               <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Dimensions and Capacities</h3>
//                               <ul className="space-y-2">
//                                 {variant.dimensionsCapacities.map((item, idx) => (
//                                   <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
//                                     <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
//                                     <span>{item}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="mb-6">
//                               <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Key Features (2025 Model)</h3>
//                               <ul className="space-y-2">
//                                 {variant.keyFeatures.map((item, idx) => (
//                                   <li key={idx} className="text-sm sm:text-base text-gray-700 flex items-start">
//                                     <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
//                                     <span>{item}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <button
//                               onClick={() => {
//                                 const car = cars.find(c => c.name === selectedCarImages.name);
//                                 if (car) {
//                                   selectCar(car);
//                                   setSelectedCarImages(null);
//                                   setTimeout(() => {
//                                     const calculator = document.querySelector('#calculator');
//                                     if (calculator) {
//                                       calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                                     }
//                                   }, 100);
//                                 }
//                               }}
//                               className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
//                             >
//                               Calculate Monthly Payment
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               </section>
//               </></>
//               )
// };

// export default ChooseSuzuki;


// import React, { useState, useEffect } from "react";
// import { ArrowDown, ChevronDown, X, Images } from "lucide-react";
// import { useCarContext } from "../context/CarContext";

// const ChooseSuzuki = () => {
//   const { selectCar } = useCarContext();

//   const [visibleCars, setVisibleCars] = useState(6);
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCarImages, setSelectedCarImages] = useState(null);

//   // Format price
//   const formatPrice = (price) => {
//     if (!price) return "₦0";
//     return `₦${Number(price).toLocaleString()}`;
//   };

//   // Calculate monthly payment
//   const calculateMonthly = (price, months = 60) => {
//     if (!price) return "₦0";

//     const downPayment = price * 0.1;
//     const loanAmount = price - downPayment;
//     const monthlyInterestRate = 0.08 / 12;

//     const monthlyPayment =
//       (loanAmount *
//         monthlyInterestRate *
//         Math.pow(1 + monthlyInterestRate, months)) /
//       (Math.pow(1 + monthlyInterestRate, months) - 1);

//     return formatPrice(Math.round(monthlyPayment));
//   };

//   // Fetch cars
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         setLoading(true);

//         const { getCars } = await import("../api/cars");
//         const response = await getCars();

//         const carsArray = Array.isArray(response?.data)
//           ? response.data
//           : [];

//         const formattedCars = carsArray.map((car) => {
//           const imageUrl =
//             Array.isArray(car.images) && car.images[0]?.url
//               ? car.images[0].url
//               : "/empty-cars.svg";

//           const price = car.basePrice || car.price || 0;

//           return {
//             ...car,
//             id: car._id || car.id,
//             image: imageUrl,
//             images: Array.isArray(car.images)
//               ? car.images.map((img) => img.url || img)
//               : [],
//             priceFormatted: formatPrice(price),
//             monthlyFormatted: calculateMonthly(price),
//           };
//         });

//         setCars(formattedCars);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load cars");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCars();
//   }, []);

//   // Load more
//   const handleLoadMore = () => {
//     setVisibleCars(cars.length);
//   };

//   // Prevent body scroll when modal open
//   useEffect(() => {
//     if (selectedCarImages) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [selectedCarImages]);

//   // Loading state
//   if (loading)
//     return (
//       <section className="py-20 text-center">
//         <p className="text-lg font-medium">Loading vehicles...</p>
//       </section>
//     );

//   // Error state
//   if (error)
//     return (
//       <section className="py-20 text-center">
//         <p className="text-red-500 font-medium">{error}</p>
//       </section>
//     );

//   return (
//     <>
//       <section id="vehicles" className="bg-white py-16 md:py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* HEADER */}
//           <div className="text-center mb-12">
//             <div className="mb-4 bg-[#ECF2F9] rounded-full inline-flex px-4 py-2 gap-2 items-center justify-center">
//               <span className="bg-white text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
//                 Step 1
//               </span>

//               <span className="text-cyan-500 text-sm font-medium flex items-center">
//                 Browse and select vehicle
//                 <ArrowDown className="w-4 h-4 ml-1" />
//               </span>
//             </div>

//             <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
//               Choose your perfect Suzuki
//             </h2>

//             <p className="text-gray-600 max-w-xl mx-auto">
//               Explore our range and choose the Suzuki that fits your lifestyle.
//             </p>
//           </div>

//           {/* CAR GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//             {cars.slice(0, visibleCars).map((car) => (
//               <div
//                 key={car.id}
//                 className="relative h-[360px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
//                 style={{
//                   backgroundImage: `url(${car.image})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20"></div>

//                 {/* image button */}
//                 <button
//                   onClick={() => setSelectedCarImages(car)}
//                   className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow"
//                 >
//                   <Images className="w-5 h-5 text-cyan-500" />
//                 </button>

//                 {/* price */}
//                 <div className="absolute top-4 right-4 z-10 bg-[#1a2942] text-white p-3 rounded-lg shadow">
//                   <p>
//                     From:{" "}
//                     <strong>{car.priceFormatted}</strong>
//                   </p>

//                   <p>
//                     Monthly:{" "}
//                     <strong>{car.monthlyFormatted}</strong>
//                   </p>
//                 </div>

//                 {/* bottom content */}
//                 <div className="absolute bottom-0 z-10 p-4 text-white w-full">
//                   <h3 className="text-xl font-bold">
//                     {car.name}
//                   </h3>

//                   <p className="text-sm mb-3 line-clamp-2">
//                     {car.description}
//                   </p>

//                   <button
//                     onClick={() => selectCar(car)}
//                     className="flex items-center justify-between w-full bg-cyan-500 hover:bg-white hover:text-black text-white px-4 py-2 rounded-full transition"
//                   >
//                     Calculate Monthly Payment
//                     <ChevronDown size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}

//           </div>

//           {/* LOAD MORE */}
//           {visibleCars < cars.length && (
//             <div className="text-center mt-10">
//               <button
//                 onClick={handleLoadMore}
//                 className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full shadow"
//               >
//                 Load More Vehicles
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* MODAL */}
//       {selectedCarImages && (
//         <div
//           className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedCarImages(null)}
//         >
//           <div
//             className="bg-white rounded-xl max-w-4xl w-full p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* close */}
//             <button
//               onClick={() => setSelectedCarImages(null)}
//               className="absolute top-4 right-4 bg-black text-white p-2 rounded-full"
//             >
//               <X />
//             </button>

//             <h2 className="text-2xl font-bold mb-6">
//               {selectedCarImages.name}
//             </h2>

//             {/* images */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

//               {selectedCarImages.images.length > 0 ? (
//                 selectedCarImages.images.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt="car"
//                     className="rounded-lg"
//                   />
//                 ))
//               ) : (
//                 <p>No images available</p>
//               )}

//             </div>

//             {/* select button */}
//             <button
//               onClick={() => {
//                 selectCar(selectedCarImages);
//                 setSelectedCarImages(null);

//                 setTimeout(() => {
//                   const el =
//                     document.querySelector("#calculator");

//                   if (el)
//                     el.scrollIntoView({
//                       behavior: "smooth",
//                     });
//                 }, 200);
//               }}
//               className="mt-6 w-full bg-cyan-500 text-white py-3 rounded-full"
//             >
//               Calculate Monthly Payment
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChooseSuzuki;
// import React, { useState, useEffect } from "react";
// import { ArrowDown, ChevronDown, X, Images } from "lucide-react";
// import { useCarContext } from "../context/CarContext";

// const ChooseSuzuki = () => {
//   const { selectCar } = useCarContext();

//   const [visibleCars, setVisibleCars] = useState(6);
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCarId, setSelectedCarId] = useState(null);

//   // format price
//   const formatPrice = (price) => {
//     if (!price) return "₦0";
//     return `₦${Number(price).toLocaleString()}`;
//   };

//   // monthly calc
//   const calculateMonthly = (price, months = 60) => {
//     if (!price) return "₦0";

//     const downPayment = price * 0.1;
//     const loanAmount = price - downPayment;
//     const rate = 0.08 / 12;

//     const payment =
//       (loanAmount * rate * Math.pow(1 + rate, months)) /
//       (Math.pow(1 + rate, months) - 1);

//     return formatPrice(Math.round(payment));
//   };

//   // fetch cars
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const { getCars } = await import("../api/cars");
//         const res = await getCars();

//         const formatted = res.data.map((car) => {
//           const price = car.basePrice || car.price || 0;

//           return {
//             ...car,
//             id: car._id || car.id,
//             image:
//               car.images?.[0]?.url ||
//               "/empty-cars.svg",

//             images:
//               car.images?.map(
//                 (img) => img.url || img
//               ) || [],

//             priceFormatted:
//               formatPrice(price),

//             monthlyFormatted:
//               calculateMonthly(price),
//           };
//         });

//         setCars(formatted);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCars();
//   }, []);

//   const handleLoadMore = () => {
//     setVisibleCars(cars.length);
//   };

//   if (loading)
//     return <p className="text-center">Loading...</p>;

//   return (
//     <section
//       id="vehicles"
//       className="bg-white py-16"
//     >
//       <div className="max-w-7xl mx-auto px-4">

//         {/* header */}
//         <div className="text-center mb-10">

//           <h2 className="text-3xl font-bold">
//             Choose your perfect Suzuki
//           </h2>

//         </div>

//         {/* grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//           {cars
//             .slice(0, visibleCars)
//             .map((car) => {
//               const isOpen =
//                 selectedCarId === car.id;

//               return (
//                 <div
//                   key={car.id}
//                   className="relative h-[380px] rounded-lg overflow-hidden shadow-lg"
//                   style={{
//                     backgroundImage: `url(${car.image})`,
//                     backgroundSize: "cover",
//                     backgroundPosition:
//                       "center",
//                   }}
//                 >
//                   {/* overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20"></div>

//                   {/* image icon */}
//                   <button
//                     onClick={() =>
//                       setSelectedCarId(
//                         isOpen
//                           ? null
//                           : car.id
//                       )
//                     }
//                     className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full"
//                   >
//                     <Images className="w-5 h-5 text-cyan-500" />
//                   </button>

//                   {/* price */}
//                   <div className="absolute top-4 right-4 z-20 bg-[#1a2942] text-white p-3 rounded">
//                     <p>
//                       From:{" "}
//                       <strong>
//                         {
//                           car.priceFormatted
//                         }
//                       </strong>
//                     </p>

//                     <p>
//                       Monthly:{" "}
//                       <strong>
//                         {
//                           car.monthlyFormatted
//                         }
//                       </strong>
//                     </p>
//                   </div>

//                   {/* bottom */}
//                   <div className="absolute bottom-0 z-20 p-4 text-white w-full">

//                     <h3 className="text-xl font-bold">
//                       {car.name}
//                     </h3>

//                     <button
//                       onClick={() =>
//                         selectCar(car)
//                       }
//                       className="mt-2 w-full bg-cyan-500 py-2 rounded-full"
//                     >
//                       Calculate Monthly Payment
//                     </button>

//                   </div>

//                   {/* ✅ POPUP INSIDE CARD */}
//                   {isOpen && (
//                     <div className="absolute inset-0 z-30 bg-black/80 flex flex-col p-4 overflow-y-auto">

//                       {/* close */}
//                       <button
//                         onClick={() =>
//                           setSelectedCarId(
//                             null
//                           )
//                         }
//                         className="self-end bg-white p-2 rounded-full mb-4"
//                       >
//                         <X />
//                       </button>

//                       <h3 className="text-white text-xl font-bold mb-4">
//                         {car.name}
//                       </h3>

//                       {/* images */}
//                       <div className="grid grid-cols-1 gap-3">

//                         {car.images
//                           .length >
//                         0 ? (
//                           car.images.map(
//                             (
//                               img,
//                               index
//                             ) => (
//                               <img
//                                 key={
//                                   index
//                                 }
//                                 src={
//                                   img
//                                 }
//                                 alt=""
//                                 className="rounded"
//                               />
//                             )
//                           )
//                         ) : (
//                           <p className="text-white">
//                             No images
//                           </p>
//                         )}

//                       </div>

//                       <button
//                         onClick={() => {
//                           selectCar(
//                             car
//                           );
//                           setSelectedCarId(
//                             null
//                           );
//                         }}
//                         className="mt-4 bg-cyan-500 text-white py-2 rounded-full"
//                       >
//                         Select vehicle
//                       </button>

//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>

//         {/* load more */}
//         {visibleCars < cars.length && (
//           <div className="text-center mt-8">
//             <button
//               onClick={handleLoadMore}
//               className="bg-cyan-500 text-white px-6 py-3 rounded-full"
//             >
//               Load More
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ChooseSuzuki;





// import React, { useState, useEffect } from "react";
// import { X, Images } from "lucide-react";
// import { useCarContext } from "../context/CarContext";

// const ChooseSuzuki = () => {
//   const { selectCar } = useCarContext();

//   const [visibleCars, setVisibleCars] = useState(6);
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCarId, setSelectedCarId] = useState(null);

//   // format price
//   const formatPrice = (price) => {
//     if (!price) return "₦0";
//     return `₦${Number(price).toLocaleString()}`;
//   };

//   // monthly calculation
//   const calculateMonthly = (price, months = 60) => {
//     if (!price) return "₦0";

//     const downPayment = price * 0.1;
//     const loanAmount = price - downPayment;
//     const rate = 0.08 / 12;

//     const payment =
//       (loanAmount * rate * Math.pow(1 + rate, months)) /
//       (Math.pow(1 + rate, months) - 1);

//     return formatPrice(Math.round(payment));
//   };

//   // fetch cars
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const { getCars } = await import("../api/cars");
//         const res = await getCars();

//         const formatted = res.data.map((car) => {
//           const price = car.basePrice || car.price || 0;

//           // get variant images safely
//           let variantImages = [];

//           if (car.variants && car.variants.length > 0) {
//             variantImages = car.variants
//               .map((variant) =>
//                 variant.images?.[0]?.url ||
//                 variant.images?.[0] ||
//                 variant.image
//               )
//               .filter(Boolean)
//               .slice(0, 3);
//           } else if (car.images && car.images.length > 0) {
//             variantImages = [
//               car.images[0]?.url || car.images[0]
//             ];
//           }

//           return {
//             ...car,
//             id: car._id || car.id,

//             image:
//               car.images?.[0]?.url ||
//               car.images?.[0] ||
//               "/empty-cars.svg",

//             images: variantImages || [],

//             priceFormatted: formatPrice(price),

//             monthlyFormatted: calculateMonthly(price),
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
//     setSelectedCarId((prev) =>
//       prev === carId ? null : carId
//     );
//   };

//   if (loading) {
//     return (
//       <p className="text-center py-20">
//         Loading vehicles...
//       </p>
//     );
//   }

//   return (
//     <section id="vehicles" className="bg-white py-16">
//       <div className="max-w-7xl mx-auto px-4">

//         {/* Header */}
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-bold">
//             Choose your perfect Suzuki
//           </h2>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//           {cars.slice(0, visibleCars).map((car) => {
//             const isOpen =
//               selectedCarId === car.id;

//             return (
//               <div
//                 key={car.id}
//                 className="relative h-[380px] rounded-lg overflow-hidden shadow-lg"
//                 style={{
//                   backgroundImage: `url(${car.image})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20"></div>

//                 {/* Image icon */}
//                 {car.images?.length > 0 && (
//                   <button
//                     onClick={() =>
//                       togglePopup(car.id)
//                     }
//                     className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full hover:scale-110 transition"
//                   >
//                     <Images className="w-5 h-5 text-cyan-500" />
//                   </button>
//                 )}

//                 {/* Price */}
//                 <div className="absolute top-4 right-4 z-20 bg-[#1a2942] text-white p-3 rounded">
//                   <p>
//                     From:{" "}
//                     <strong>
//                       {car.priceFormatted}
//                     </strong>
//                   </p>

//                   <p>
//                     Monthly:{" "}
//                     <strong>
//                       {car.monthlyFormatted}
//                     </strong>
//                   </p>
//                 </div>

//                 {/* Bottom */}
//                 <div className="absolute bottom-0 z-20 p-4 text-white w-full">

//                   <h3 className="text-xl font-bold">
//                     {car.name}
//                   </h3>

//                   <button
//                     onClick={() =>
//                       selectCar(car)
//                     }
//                     className="mt-2 w-full bg-cyan-500 py-2 rounded-full hover:bg-cyan-600 transition"
//                   >
//                     Calculate Monthly Payment
//                   </button>

//                 </div>

//                 {/* POPUP INSIDE CARD (Figma design preserved) */}
//                 {isOpen && (
//                   <div className="absolute inset-0 z-30 bg-black/80 flex flex-col p-4">

//                     {/* close */}
//                     <button
//                       onClick={() =>
//                         setSelectedCarId(null)
//                       }
//                       className="self-end bg-white p-2 rounded-full mb-4 hover:scale-110 transition"
//                     >
//                       <X size={18} />
//                     </button>

//                     <h3 className="text-white text-xl font-bold mb-4">
//                       {car.name}
//                     </h3>

//                     {/* images */}
//                     <div className="grid grid-cols-3 gap-3">

//                       {car.images?.map(
//                         (img, index) => (
//                           <img
//                             key={index}
//                             src={img}
//                             alt={`variant-${index}`}
//                             className="rounded-lg object-cover w-full h-28"
//                           />
//                         )
//                       )}

//                     </div>

//                     <button
//                       onClick={() => {
//                         selectCar(car);
//                         setSelectedCarId(null);
//                       }}
//                       className="mt-auto bg-cyan-500 text-white py-2 rounded-full hover:bg-cyan-600 transition"
//                     >
//                       Select vehicle
//                     </button>

//                   </div>
//                 )}

//               </div>
//             );
//           })}

//         </div>

//         {/* Load more */}
//         {visibleCars < cars.length && (
//           <div className="text-center mt-8">
//             <button
//               onClick={handleLoadMore}
//               className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-cyan-600 transition"
//             >
//               Load More
//             </button>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default ChooseSuzuki;




import React, { useState, useEffect } from "react";
import { X, Images, ArrowDown } from "lucide-react";
import { useCarContext } from "../context/CarContext";

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

          return {
            ...car,
            id: car._id || car.id,
            image: car.images?.[0]?.url || car.images?.[0] || "/empty-cars.svg",
            images: variantImages,
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
                className="relative h-[380px] rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundImage: `url(${car.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20"></div>

                {/* Image icon */}
                {car.images?.length > 0 && (
                  <button
                    onClick={() => togglePopup(car.id)}
                    className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full hover:scale-110 transition"
                  >
                    <Images className="w-5 h-5 text-cyan-500" />
                  </button>
                )}

                {/* Price */}
                <div className="absolute top-4 right-4 z-20 bg-[#1a2942] text-white p-3 rounded">
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
                <div className="absolute bottom-0 z-20 p-4 text-white w-full">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <button
                     onClick={() => {
                    selectCar(car);
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                    className="mt-2 w-full bg-cyan-500 py-2 rounded-full hover:bg-cyan-600 transition"
                  >
                    Calculate Monthly Payment
                  </button>
                </div>

                {/* POPUP INSIDE CARD */}
                {isOpen && (
                  <div className="absolute inset-0 z-30 bg-black/20 flex flex-col p-4">
                    {/* Close */}
                    <button
                      onClick={() => setSelectedCarId(null)}
                      className="self-end bg-white p-2 rounded-full mb-4 hover:scale-110 transition"
                    >
                      <X size={18} />
                    </button>

                    <h3 className="text-white text-xl font-bold mb-4">
                      {car.name}
                    </h3>

                    {/* Images */}
                    {/* <div className="grid grid-cols-3 gap-3">
                      {car.images?.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`variant-${index}`}
                          className="rounded-lg object-cover w-full h-28"
                        />
                      ))}
                    </div> */}
<div className="bg-white rounded-lg p-2 w-full">
  {/* Images */}
  {car.images?.length > 1 ? (
    <div className="grid grid-cols-3 gap-2">
      {car.images.slice(0, 3).map((img, index) => (
        <img
          key={index}
          src={img}
          alt={car.name}
          className="rounded-lg object-cover w-full h-24"
        />
      ))}
    </div>
  ) : (
    <img
      src={car.images?.[0]}
      alt={car.name}
      className="rounded-lg object-cover w-full h-40"
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
                      className="mt-auto bg-cyan-500 text-white py-2 rounded-full hover:bg-cyan-600 transition"
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
              className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-cyan-600 transition"
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