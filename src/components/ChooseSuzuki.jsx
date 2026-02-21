import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, X, Images } from 'lucide-react';
import { useCarContext } from '../context/CarContext';

const ChooseSuzuki = () => {
  const [visibleCars, setVisibleCars] = useState(6);
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
      variants: [
        {
          name: 'DZIRE – Specs : Base Model',
          description: 'The 2025 Suzuki Dzire is a compact sedan offering sleek design, fuel efficiency, and modern features. Available in manual or automatic transmissions, it delivers reliability and comfort for daily commuting.',
          enginePerformance: [
            'Engine: 1.2-litre K12N Petrol Engine',
            'Power: 89 – 91 hp',
            'Torque: 113 Nm',
            'Transmission: 5-speed manual, 5-speed AMT',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 24.12 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3995 mm',
            'Width: 1735 mm',
            'Height: 1515 mm',
            'Wheelbase: 2450 mm',
            'Ground Clearance: 163 mm',
            'Boot Space: 378 litres',
            'Fuel Tank: 37 litres'
          ],
          keyFeatures: [
            'Interior: 7-inch touchscreen, automatic climate control, push-button start',
            'Safety: Dual airbags, ABS with EBD, rear parking sensors',
            'Exterior: LED DRLs, alloy wheels, stylish front grille'
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'New Swift',
      description: 'Sporty hatchback perfect for city driving.',
      image: '/Swift.svg',
      priceValue: 28000000,
      images: ['/Swift.svg', '/Swift.svg', '/Swift.svg'],
      variants: [
        {
          name: 'SWIFT – Specs : Sport Model',
          description: 'The 2025 Suzuki Swift is a sporty hatchback with dynamic styling and agile performance, perfect for city driving with its compact size and efficient engine.',
          enginePerformance: [
            'Engine: 1.2-litre K12N Petrol Engine',
            'Power: 89 hp',
            'Torque: 113 Nm',
            'Transmission: 5-speed manual, CVT automatic',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 23 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3845 mm',
            'Width: 1735 mm',
            'Height: 1530 mm',
            'Wheelbase: 2450 mm',
            'Ground Clearance: 163 mm',
            'Boot Space: 268 litres',
            'Fuel Tank: 37 litres'
          ],
          keyFeatures: [
            'Interior: 7-inch touchscreen, smartphone connectivity, auto AC',
            'Safety: Dual airbags, ABS, rear parking camera',
            'Exterior: LED headlamps, sporty alloy wheels, bold grille'
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Alto',
      description: 'Affordable and reliable everyday car.',
      image: '/Alto.svg',
      priceValue: 17000000,
      images: ['/Alto.svg', '/Alto.svg', '/Alto.svg'],
      variants: [
        {
          name: 'ALTO – Specs : Standard',
          description: 'The 2025 Suzuki Alto is an affordable, fuel-efficient hatchback designed for city commutes with easy maneuverability and low running costs.',
          enginePerformance: [
            'Engine: 0.8-litre F8D Petrol Engine',
            'Power: 47 hp',
            'Torque: 69 Nm',
            'Transmission: 5-speed manual',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 22 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3445 mm',
            'Width: 1475 mm',
            'Height: 1490 mm',
            'Wheelbase: 2360 mm',
            'Ground Clearance: 160 mm',
            'Boot Space: 177 litres',
            'Fuel Tank: 27 litres'
          ],
          keyFeatures: [
            'Interior: Basic infotainment, comfortable seating',
            'Safety: Driver airbag, ABS with EBD',
            'Exterior: Compact design, easy parking, stylish headlamps'
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Grand Vitara',
      description: 'Premium SUV with hybrid technology.',
      image: '/Grandvitara.svg',
      priceValue: 36000000,
      images: ['/Grandvitara.svg', '/Grandvitara.svg', '/Grandvitara.svg'],
      variants: [
        {
          name: 'GRAND VITARA – Specs : N42M',
          description: 'The 2025 Suzuki Grand Vitara is a 5-seater compact SUV offering, featuring a 1.5-litre petrol engine with strong hybrid options. It delivers around fuel economy and torque, available in FWD or AWD configurations with 5-speed manual or 6-speed automatic transmissions. Key features include a panoramic sunroof, 360-degree camera, and a 9-inch touchscreen.',
          enginePerformance: [
            'Engine: 1.5-litre K15C Intelligent Electric Hybrid or 1.5-litre Strong Hybrid.',
            'Power: 101 –103 hp (depending on hybrid variant).',
            'Torque: 122–138 Nm.',
            'Transmission: 5-speed manual, 6-speed automatic.',
            'Drivetrain: 2WD (FWD) or AllGrip AWD.',
            'Fuel Economy: Up to 27.97 km/l (mild-hybrid), 18.5 – 20 km/l (general)'
          ],
          dimensionsCapacities: [
            'Length: 4345 mm',
            'Width: 1795 mm',
            'Height: 1645 mm',
            'Wheelbase: 2600 mm',
            'Ground Clearance: 210 mm',
            'Boot Space: 373 litres',
            'Fuel Tank: 45 liters'
          ],
          keyFeatures: [
            'Interior: Panoramic sunroof, 9-inch HD touchscreen, heads-up display, ventilated seats, and ambient lighting.',
            'Safety: 360-degree camera, 6 airbags (top variants), ABS with EBD, and hill descent control (AWD).',
            'Exterior: LED DRLs, 17-inch alloy wheels, and a, bold front grille.'
          ]
        },
        {
          name: 'GRAND VITARA 1.5L – Specs – N52M',
          description: 'The 2025 Suzuki Grand Vitara is a 5-seater compact SUV offering, featuring a 1.5-litre petrol engine with strong hybrid options. It delivers around fuel economy and torque, available in FWD or AWD configurations with 5-speed manual or 6-speed automatic transmissions. Key features include a panoramic sunroof, 360-degree camera, and a 9-inch touchscreen.',
          enginePerformance: [
            'Engine: 1.5-litre K15C Intelligent Electric Hybrid or 1.5-litre Strong Hybrid.',
            'Power: 101 –103 hp (depending on hybrid variant).',
            'Torque: 122–138 Nm.',
            'Transmission: 5-speed manual, 6-speed automatic.',
            'Drivetrain: 2WD (FWD) or AllGrip AWD.',
            'Fuel Economy: Up to 27.97 km/l (mild-hybrid), 18.5 – 20 km/l (general)'
          ],
          dimensionsCapacities: [
            'Length: 4345 mm',
            'Width: 1795 mm',
            'Height: 1645 mm',
            'Wheelbase: 2600 mm',
            'Ground Clearance: 210 mm',
            'Boot Space: 373 litres',
            'Fuel Tank: 45 liters'
          ],
          keyFeatures: [
            'Interior: Panoramic sunroof, 9-inch HD touchscreen, heads-up display, ventilated seats, and ambient lighting.',
            'Safety: 360-degree camera, 6 airbags (top variants), ABS with EBD, and hill descent control (AWD).',
            'Exterior: LED DRLs, 17-inch alloy wheels, and a, bold front grille.'
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Jimny (5-Doors)',
      description: 'More space with legendary off-road DNA.',
      image: '/Jimny.svg',
      priceValue: 46000000,
      images: ['/Jimny.svg', '/Jimny.svg', '/Jimny.svg'],
      variants: [
        {
          name: 'JIMNY 5-DOOR – Specs : Off-Road',
          description: 'The 2025 Suzuki Jimny 5-Door is a compact off-roader with legendary 4WD capability, now with extra space and practicality for adventure seekers.',
          enginePerformance: [
            'Engine: 1.5-litre K15B Petrol Engine',
            'Power: 101 hp',
            'Torque: 130 Nm',
            'Transmission: 5-speed manual, 4-speed automatic',
            'Drivetrain: AllGrip Pro 4WD with low-range transfer',
            'Fuel Economy: Up to 16.94 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3985 mm',
            'Width: 1645 mm',
            'Height: 1720 mm',
            'Wheelbase: 2590 mm',
            'Ground Clearance: 210 mm',
            'Boot Space: 211 litres (332 with rear seats down)',
            'Fuel Tank: 40 litres'
          ],
          keyFeatures: [
            'Interior: 9-inch touchscreen, smartphone connectivity, cruise control',
            'Safety: Dual airbags, ABS with EBD, hill hold control',
            'Exterior: Rugged design, 15-inch alloy wheels, LED headlamps'
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'Grand Vitara 1.5L',
      description: 'Reliable commercial vehicle for business.',
      image: '/Grand-vitara5.1L.avif',
      priceValue: 42000000,
      images: ['/Grandvitara.svg', '/Grandvitara.svg', '/Grandvitara.svg'],
      variants: [
        {
          name: 'GRAND VITARA 1.5L – Specs : Premium',
          description: 'The 2025 Suzuki Grand Vitara 1.5L offers premium features with efficient performance, perfect for families seeking comfort and technology.',
          enginePerformance: [
            'Engine: 1.5-litre K15C Petrol',
            'Power: 103 hp',
            'Torque: 138 Nm',
            'Transmission: 6-speed automatic',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 20 km/l'
          ],
          dimensionsCapacities: [
            'Length: 4345 mm',
            'Width: 1795 mm',
            'Height: 1645 mm',
            'Wheelbase: 2600 mm',
            'Ground Clearance: 210 mm',
            'Boot Space: 373 litres',
            'Fuel Tank: 45 litres'
          ],
          keyFeatures: [
            'Interior: Panoramic sunroof, 9-inch touchscreen, ventilated seats',
            'Safety: 6 airbags, 360-degree camera, ABS with EBD',
            'Exterior: LED DRLs, 17-inch alloy wheels, chrome accents'
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'S-Presso',
      description: 'Bold design with enhanced performance.',
      image: '/presso.jpeg',
      priceValue: 18000000,
      images: ['/presso.jpeg', '/presso.jpeg', '/presso.jpeg'],
      variants: [
        {
          name: 'S-PRESSO – Specs : Urban',
          description: 'The 2025 Suzuki S-Presso combines SUV-inspired styling with city car practicality, offering bold design and fuel efficiency.',
          enginePerformance: [
            'Engine: 1.0-litre K10B Petrol',
            'Power: 67 hp',
            'Torque: 90 Nm',
            'Transmission: 5-speed manual, 5-speed AMT',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 21.7 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3565 mm',
            'Width: 1520 mm',
            'Height: 1564 mm',
            'Wheelbase: 2380 mm',
            'Ground Clearance: 180 mm',
            'Boot Space: 239 litres',
            'Fuel Tank: 27 litres'
          ],
          keyFeatures: [
            'Interior: 7-inch touchscreen, smartphone connectivity',
            'Safety: Dual airbags, ABS with EBD, rear parking sensors',
            'Exterior: SUV-inspired design, high ground clearance, LED DRLs'
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Ertiga',
      description: 'More space with legendary off-road DNA.',
      image: '/Ertiga.svg',
      priceValue: 36000000,
      images: ['/Ertiga.svg', '/Ertiga1.svg', '/Ertiga.svg'],
      variants: [
        {
          name: 'ERTIGA – Specs : 7-Seater MPV',
          description: 'The 2025 Suzuki Ertiga is a 7-seater MPV designed for families, offering spacious interiors, comfort, and fuel efficiency.',
          enginePerformance: [
            'Engine: 1.5-litre K15B Petrol with Mild Hybrid',
            'Power: 103 hp',
            'Torque: 138 Nm',
            'Transmission: 5-speed manual, 6-speed automatic',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 20.51 km/l'
          ],
          dimensionsCapacities: [
            'Length: 4395 mm',
            'Width: 1735 mm',
            'Height: 1690 mm',
            'Wheelbase: 2740 mm',
            'Ground Clearance: 180 mm',
            'Boot Space: 209 litres (803 with seats folded)',
            'Fuel Tank: 45 litres'
          ],
          keyFeatures: [
            'Interior: 7-inch touchscreen, captain seats (middle row), automatic AC',
            'Safety: Dual airbags, ABS with EBD, rear parking camera',
            'Exterior: LED projector headlamps, alloy wheels, roof rails'
          ]
        }
      ]
    },
    {
      id: 9,
      name: 'Celerio',
      description: 'Reliable commercial vehicle for business.',
      image: '/celerio-suzuki.jpg',
      priceValue: null,
      images: ['/Ertiga1.svg', '/Ertiga.svg', '/Ertiga1.svg'],
      variants: [
        {
          name: 'CELERIO – Specs : Economy',
          description: 'The 2025 Suzuki Celerio is a fuel-efficient hatchback perfect for budget-conscious buyers seeking reliability and low maintenance.',
          enginePerformance: [
            'Engine: 1.0-litre K10C Petrol',
            'Power: 67 hp',
            'Torque: 89 Nm',
            'Transmission: 5-speed manual, 5-speed AMT',
            'Drivetrain: FWD',
            'Fuel Economy: Up to 25 km/l'
          ],
          dimensionsCapacities: [
            'Length: 3695 mm',
            'Width: 1655 mm',
            'Height: 1555 mm',
            'Wheelbase: 2435 mm',
            'Ground Clearance: 170 mm',
            'Boot Space: 295 litres',
            'Fuel Tank: 32 litres'
          ],
          keyFeatures: [
            'Interior: 7-inch touchscreen, smartphone integration',
            'Safety: Dual airbags, ABS with EBD',
            'Exterior: Compact design, stylish grille, halogen headlamps'
          ]
        }
      ]
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
           Explore our range and choose the Suzuki that fits your lifestyle.
         From sleek city cruisers to refined family sedans — start with the one that feels right.
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

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {selectedCarImages.images.map((img, index) => (
              <div 
                key={index}
                className="bg-gray-100 rounded-sm overflow-hidden aspect-video"
              >
                <img 
                  src={img} 
                  alt={`${selectedCarImages.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
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
