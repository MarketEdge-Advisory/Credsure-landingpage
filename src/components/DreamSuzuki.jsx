import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, X, Send } from 'lucide-react';

const DreamSuzuki = () => {
  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! Welcome to Credsure Suzuki. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');

  // FAQ Database
  const faqs = [
    {
      question: 'How does the Buy Now Pay Later work?',
      answer: 'Our BNPL program allows you to drive your dream Suzuki with flexible monthly payments starting from ₦500,000. You pay a down payment and spread the remaining cost over 12-60 months.'
    },
    {
      question: 'What documents do I need?',
      answer: 'You need a valid ID card, proof of income (salary slip or bank statement), utility bill, and passport photographs. Our team will guide you through the complete documentation process.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Fast pre-approval! Most applications are reviewed within 24-48 hours. Once approved, vehicle delivery happens within 1 week.'
    },
    {
      question: 'What is the minimum down payment?',
      answer: 'The minimum down payment is typically 10% of the vehicle price. However, this can vary based on your credit profile and chosen vehicle model.'
    },
    {
      question: 'Can I pay off early?',
      answer: 'Yes! You can pay off your vehicle loan early without any penalties. This can also help you save on interest costs.'
    },
    {
      question: 'Which Suzuki models are available?',
      answer: 'We offer various Suzuki models including Dzire, Swift, Across, Grand Vitara, Eeco Cargo, and more. Browse through our hero slider to see all available models and their monthly payment options.'
    },
    {
      question: 'What is included in the monthly payment?',
      answer: 'Your monthly payment covers the vehicle cost and interest. Insurance and maintenance packages can be added separately based on your preference.'
    },
    {
      question: 'Do you offer insurance?',
      answer: 'Yes, we can help arrange comprehensive insurance coverage for your vehicle. This can be included in your financing package.'
    }
  ];

  // Promotional hero images (up to 3 slots) - These are full background images with car
  // First image is mandatory
  // Structure: { id, image, title, price, description, buttonText, isMandatory }
  const [promotionalSlides, setPromotionalSlides] = useState([
    {
      id: 1,
      image: '/Dzire1.svg',
      title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
      price: '₦500,000',
      description: 'Fast pre-approval. Transparent payments. Vehicle delivery within 1 week. Finance your Suzuki with Credsure BNPL, Nigeria\'s trusted auto financing partner.',
      buttonText: 'Check Your Monthly Payment',
      isMandatory: true
    },
    {
      id: 2,
      image: '/across_suzuki.avif',
      title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
      price: '₦800,000',
      description: 'Fast pre-approval. Transparent payments. Vehicle delivery within 1 week. Finance your Suzuki with Credsure BNPL, Nigeria\'s trusted auto financing partner.',
      buttonText: 'Check Your Monthly Payment',
      isMandatory: false
    },
    {
      id: 3,
      image: '/Grand-vitara5.1L.avif',
      title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
      price: '₦950,000',
      description: 'Fast pre-approval. Transparent payments. Vehicle delivery within 1 week. Finance your Suzuki with Credsure BNPL, Nigeria\'s trusted auto financing partner.',
      buttonText: 'Check Your Monthly Payment',
      isMandatory: false
    },
  ]);
  
  // Vehicle model slides (up to 11 vehicles) - These also display as full hero backgrounds
  // Structure: { id, name, image, title, description, specifications, price, monthlyPayment, buttonText }
  // price: Vehicle worth in Naira
  // monthlyPayment: Calculated lowest monthly fee (can use calculateMonthlyPayment helper)
  const [vehicleSlides, setVehicleSlides] = useState([]);

  // Car Gallery Data (11 cars with brief descriptions)
  const [carGalleryPage, setCarGalleryPage] = useState(0);
  const carsPerPage = 3;
  const carGallery = [
    {
      id: 1,
      name: 'Suzuki Dzire',
      image: '/Dzire.svg',
      description: 'Compact sedan with modern features and excellent fuel efficiency. Perfect for city driving.',
      price: 12500000
    },
    {
      id: 2,
      name: 'Suzuki Swift',
      image: '/Swift.svg',
      description: 'Sporty hatchback with dynamic styling and agile performance. Ideal for urban adventures.',
      price: 15000000
    },
    {
      id: 3,
      name: 'Suzuki Alto',
      image: '/Alto.svg',
      description: 'Affordable and reliable everyday car with low running costs. Great first car option.',
      price: 8500000
    },
    {
      id: 4,
      name: 'Suzuki Grand Vitara',
      image: '/Grandvitara.svg',
      description: 'Premium SUV with hybrid technology and advanced safety features. Luxury meets efficiency.',
      price: 24300250
    },
    {
      id: 5,
      name: 'Suzuki Jimny 5-Door',
      image: '/Jimny.svg',
      description: 'Legendary off-road capability with extra space. Adventure-ready compact SUV.',
      price: 18000000
    },
    {
      id: 6,
      name: 'Suzuki Grand Vitara 1.5L',
      image: '/Grand-vitara5.1L.avif',
      description: 'Powerful 1.5L engine with premium interior and smart technology integration.',
      price: 22500000
    },
    {
      id: 7,
      name: 'Suzuki S-Presso',
      image: '/presso.jpeg',
      description: 'Bold SUV-inspired design with enhanced ground clearance. Compact yet spacious.',
      price: 9800000
    },
    {
      id: 8,
      name: 'Suzuki Ertiga',
      image: '/Ertiga.svg',
      description: '7-seater MPV with spacious interior and comfortable ride. Perfect family car.',
      price: 16500000
    },
    {
      id: 9,
      name: 'Suzuki Celerio',
      image: '/celerio-suzuki.jpg',
      description: 'Fuel-efficient hatchback with modern amenities. Budget-friendly and practical.',
      price: 10200000
    },
    {
      id: 10,
      name: 'Suzuki Across',
      image: '/across_suzuki.avif',
      description: 'Hybrid SUV with all-wheel drive and cutting-edge technology. Eco-friendly performance.',
      price: 45000000
    },
    {
      id: 11,
      name: 'Suzuki Eeco Cargo',
      image: '/Eeco-cargo.avif',
      description: 'Versatile cargo van with spacious loading capacity. Ideal for business needs.',
      price: 25000000
    }
  ];

  const totalPages = Math.ceil(carGallery.length / carsPerPage);
  const currentCars = carGallery.slice(
    carGalleryPage * carsPerPage,
    (carGalleryPage + 1) * carsPerPage
  );

  const nextPage = () => {
    setCarGalleryPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCarGalleryPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex) => {
    setCarGalleryPage(pageIndex);
  };

  // Combine all slides (promotional + vehicles)
  const allSlides = [...promotionalSlides, ...vehicleSlides];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper function to calculate monthly payment
  // Formula: (Car Price * 0.018) - basic calculation
  // Backend can implement more sophisticated calculation with interest rates, terms, etc.
  const calculateMonthlyPayment = (carPrice, months = 60) => {
    // Simple example: 10% down payment, 60 months, ~8% annual interest
    const downPayment = carPrice * 0.1;
    const loanAmount = carPrice - downPayment;
    const monthlyInterestRate = 0.08 / 12;
    const monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / 
                          (Math.pow(1 + monthlyInterestRate, months) - 1);
    return Math.round(monthlyPayment);
  };

  // ============ MANAGEMENT FUNCTIONS FOR BACKEND INTEGRATION ============

  // Add new promotional slide (max 3)
  const addPromotionalSlide = (slideData) => {
    if (promotionalSlides.length < 3) {
      const newSlide = {
        id: Date.now(),
        ...slideData
      };
      setPromotionalSlides(prev => [...prev, newSlide]);
      return { success: true, message: 'Promotional slide added successfully' };
    }
    return { success: false, message: 'Maximum 3 promotional slides reached' };
  };

  // Update promotional slide
  const updatePromotionalSlide = (id, updatedData) => {
    setPromotionalSlides(prev => 
      prev.map(slide => slide.id === id ? { ...slide, ...updatedData } : slide)
    );
    return { success: true, message: 'Promotional slide updated successfully' };
  };

  // Remove promotional slide (keep at least 1 mandatory)
  const removePromotionalSlide = (id) => {
    const slide = promotionalSlides.find(s => s.id === id);
    if (slide?.isMandatory && promotionalSlides.length === 1) {
      return { success: false, message: 'Cannot remove the mandatory promotional slide' };
    }
    setPromotionalSlides(prev => prev.filter(slide => slide.id !== id));
    if (currentSlide >= allSlides.length - 1) setCurrentSlide(0);
    return { success: true, message: 'Promotional slide removed successfully' };
  };

  // Add new vehicle (max 11)
  const addVehicle = (vehicleData) => {
    if (vehicleSlides.length < 11) {
      const newVehicle = {
        id: Date.now(),
        monthlyPayment: calculateMonthlyPayment(vehicleData.price || 0),
        ...vehicleData
      };
      setVehicleSlides(prev => [...prev, newVehicle]);
      return { success: true, message: 'Vehicle added successfully', vehicle: newVehicle };
    }
    return { success: false, message: 'Maximum 11 vehicles reached' };
  };

  // Update vehicle
  const updateVehicle = (id, updatedData) => {
    setVehicleSlides(prev => 
      prev.map(vehicle => {
        if (vehicle.id === id) {
          const updated = { ...vehicle, ...updatedData };
          // Recalculate monthly payment if price changed
          if (updatedData.price) {
            updated.monthlyPayment = calculateMonthlyPayment(updatedData.price);
          }
          return updated;
        }
        return vehicle;
      })
    );
    return { success: true, message: 'Vehicle updated successfully' };
  };

  // Remove vehicle
  const removeVehicle = (id) => {
    setVehicleSlides(prev => prev.filter(vehicle => vehicle.id !== id));
    if (currentSlide >= allSlides.length - 1) setCurrentSlide(0);
    return { success: true, message: 'Vehicle removed successfully' };
  };

  // Expose these functions for backend integration
  // Can be called via props, context, or API
  window.suzukiHeroManager = {
    addPromotionalSlide,
    updatePromotionalSlide,
    removePromotionalSlide,
    addVehicle,
    updateVehicle,
    removeVehicle,
    calculateMonthlyPayment
  };

  // ============ CHATBOT FUNCTIONS ============

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: userInput,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Find matching FAQ
    const matchingFaq = faqs.find(faq => 
      userInput.toLowerCase().includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase()) ||
      faq.question.toLowerCase().includes(userInput.toLowerCase())
    );

    // Bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: matchingFaq 
          ? matchingFaq.answer 
          : "I'd be happy to help! For specific inquiries, please use the calculator below or contact our sales team. You can also ask about our payment plans, required documents, or available models.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 500);

    setUserInput('');
  };

  const handleQuickQuestion = (question) => {
    const faq = faqs.find(f => f.question === question);
    if (faq) {
      // Add user question
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        message: question,
        timestamp: new Date()
      }]);
      
      // Add bot answer
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          message: faq.answer,
          timestamp: new Date()
        }]);
      }, 500);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (allSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % allSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [allSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Check if current slide is promotional (first 3)
  const isPromotionalSlide = currentSlide < promotionalSlides.length;
  const currentSlideData = allSlides[currentSlide];

  return (
    <div id="home" className="relative w-full overflow-hidden">
      {/* Hero Section with Full Background Image */}
      <div className="relative min-h-screen w-full bg-[#0f1e3d] mt-16">
        {/* Background Image - Current Slide */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url('${currentSlideData?.image}')`,
            backgroundSize: 'cover',
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center">
          <div className="container px-4 md:px-8 lg:px-16">
            <div className="max-w-2xl">
              {/* Heading */}
              <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold text-white leading-tight animate-[fade-in_1s_ease-out]">
                {isPromotionalSlide ? (
                  <>
                    {currentSlideData?.title}{' '}
                    <span className="block mt-1 sm:mt-2 text-blue-300">{currentSlideData?.price}</span>
                  </>
                ) : (
                  <>
                    {currentSlideData?.title}
                    <span className="block mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-[45px]">
                      {currentSlideData?.name}
                    </span>
                    {currentSlideData?.monthlyPayment && (
                      <span className="block mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-blue-300">
                        Pay Monthly from ₦{currentSlideData.monthlyPayment.toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="mb-6 sm:mb-10 text-sm sm:text-base md:text-lg lg:text-[18px] max-w-[620px] text-gray-200 leading-relaxed animate-[fade-in-delay_1s_ease-out_0.3s_both]">
                {currentSlideData?.description}
              </p>

              {/* Specifications (for vehicle slides) */}
              {!isPromotionalSlide && currentSlideData?.specifications && (
                <div className="mb-6 animate-[fade-in-delay_1s_ease-out_0.4s_both]">
                  <p className="text-sm md:text-base text-gray-300 mb-2">
                    {currentSlideData.specifications}
                  </p>
                  {currentSlideData?.price && (
                    <p className="text-xs md:text-sm text-gray-400">
                      Vehicle Price: ₦{currentSlideData.price.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <div className="animate-[fade-in-delay-2_1s_ease-out_0.6s_both]">
                <button 
                  className="group flex items-center justify-between gap-2 sm:gap-4 bg-white hover:bg-cyan-400 hover:text-slate-100 text-gray-700 font-medium px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]"
                  onClick={() => {
                    const calculator = document.querySelector('#calculator');
                    if (calculator) {
                      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <span className="text-sm sm:text-base md:text-lg">
                    {currentSlideData?.buttonText || 'Check Your Monthly Payment'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-blue-500 transition-transform duration-300 group-hover:translate-y-1 group-hover:text-slate-100" />
                </button>
              </div>
            </div>
          </div>

          {/* Car Gallery - Floating on Right Side */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 z-20">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4">
              <h3 className="text-white text-lg font-bold mb-4 text-center">Explore Our Fleet</h3>
              
              {/* Car Cards */}
              <div className="space-y-3 mb-4">
                {currentCars.map((car) => (
                  <div 
                    key={car.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-16 bg-white/5 rounded flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={car.image} 
                          alt={car.name}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm truncate">{car.name}</h4>
                        <p className="text-gray-300 text-xs line-clamp-2">{car.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-blue-300 text-xs font-semibold">
                            ₦{(car.price / 1000000).toFixed(1)}M
                          </span>
                          <a 
                            href="#calculator"
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            Calculate →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={prevPage}
                  className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-7 h-7 rounded-full text-xs transition-all ${
                        carGalleryPage === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {allSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {allSlides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {allSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-8 h-2 bg-white' 
                      : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          <div className="absolute top-24 right-4 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-20">
            <div className="text-center">
              <p className="font-semibold">{currentSlide + 1} / {allSlides.length}</p>
              {!isPromotionalSlide && currentSlideData?.name && (
                <p className="text-xs text-gray-300 mt-0.5">{currentSlideData.name}</p>
              )}
            </div>
          </div>

          {/* Chatbot */}
          <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isChatOpen && (
              <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fade-in_0.3s_ease-out] flex flex-col max-h-[calc(100vh-120px)] mt-16">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Credsure Assistant</h3>
                      <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-3 min-h-0">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Questions */}
                <div className="p-2 bg-white border-t border-gray-200 flex-shrink-0">
                  <p className="text-xs text-gray-600 mb-1.5">Quick questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {faqs.slice(0, 3).map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(faq.question)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {faq.question.split(' ').slice(0, 3).join(' ')}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-slate-200 hover:text-black text-white p-2 rounded-full transition-colors flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Toggle chat"
            >
              {isChatOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MessageCircle className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamSuzuki;