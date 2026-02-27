import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, X, Send } from 'lucide-react';
import { getCars } from '../api/cars';

const DreamSuzuki = () => {
    const carsPerPage = 3;
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
  const [promotionalSlides, setPromotionalSlides] = useState([]);
  const [carGallery, setCarGallery] = useState([]);

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await getCars();
        const cars = Array.isArray(response?.data) ? response.data : [];
        setCarGallery(cars.map(car => ({
          id: car.id,
          name: car.name,
          image: (Array.isArray(car.images) && car.images[0]?.url) ? car.images[0].url : '/empty-cars.svg',
          description: car.description,
          price: car.basePrice || car.bestPrice || car.price
        })));
        setPromotionalSlides([
          {
            id: 1,
            image: '/Dzire1.svg',
            title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
            price: cars[0]?.basePrice ? `₦${cars[0].basePrice.toLocaleString()}` : (cars[0]?.bestPrice ? `₦${cars[0].bestPrice.toLocaleString()}` : ''),
            buttonText: 'Check Your Monthly Payment',
            isMandatory: false
          },
          {
            id: 2,
            image: '/Dzire2.svg',
            title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
            price: cars[1]?.basePrice ? `₦${cars[1].basePrice.toLocaleString()}` : (cars[1]?.bestPrice ? `₦${cars[1].bestPrice.toLocaleString()}` : ''),
            buttonText: 'Check Your Monthly Payment',
            isMandatory: false
          },
          {
            id: 3,
            image: '/Dzire3.svg',
             title: 'Drive Your Dream Suzuki Today. Pay Monthly from',
            price: cars[2]?.basePrice ? `₦${cars[2].basePrice.toLocaleString()}` : (cars[2]?.bestPrice ? `₦${cars[2].bestPrice.toLocaleString()}` : ''),
            buttonText: 'Check Your Monthly Payment',
            isMandatory: false
          }
        ]);
      } catch (e) {
        // fallback or error handling
      }
    }
    fetchCars();
  }, []);

  // Build gallery rows – groups of 3 cars each
  // Build gallery slides – one car per slide
  // Limit fleet gallery to 11 cars
  const galleryRows = carGallery.slice(0, 11).map((car, idx) => ({
    type: 'gallery',
    id: `gallery-slide-${idx}`,
    cars: [car]
  }));

  // Interleaved sequence: [promo1, promo2, promo3, galleryRow1, promo1, promo2, promo3, galleryRow2, ...]
  // Show promo slides first, then fleet gallery slides (max 11)
  const interleavedSlides = [
    ...promotionalSlides.map(slide => ({ type: 'promo', ...slide })),
    ...galleryRows
  ];

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

  // Auto-advance – gallery slides linger a bit longer than promo slides
  useEffect(() => {
    if (interleavedSlides.length > 1) {
      const isGallery = interleavedSlides[currentSlide]?.type === 'gallery';
      const delay = isGallery ? 7000 : 5000;
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % interleavedSlides.length);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, interleavedSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % interleavedSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + interleavedSlides.length) % interleavedSlides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const currentSlideData = interleavedSlides[currentSlide];
  const isGallerySlide = currentSlideData?.type === 'gallery';

  return (
    <div id="home" className="relative w-full overflow-hidden">
      {/* ── Single Hero Container – Interleaved Promo + Gallery Slides ── */}
      <div className="relative min-h-screen w-full bg-[#0f1e3d] mt-16">

        {/* ── PROMO SLIDE: full background image ── */}
        {!isGallerySlide && (
          <div
            key={currentSlideData?.id}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
            style={{ backgroundImage: `url('${currentSlideData?.image}')` }}
          />
        )}

        {/* Overlay – darker for gallery so cards pop */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            isGallerySlide
              ? 'bg-[#0a1628]'
              : 'bg-gradient-to-r from-black/60 via-black/40 to-transparent'
          }`}
        />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">

          {/* ─── PROMO CONTENT ─── */}
          {!isGallerySlide && (
            <div className="w-full container px-4 md:px-8 lg:px-16">
              <div className="max-w-2xl">
                <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold text-white leading-tight">
                  {currentSlideData?.title}{' '}
                  <span className="block mt-1 sm:mt-2 text-blue-300">{currentSlideData?.price}</span>
                </h1>
                <p className="mb-6 sm:mb-10 text-sm sm:text-base md:text-lg lg:text-[18px] max-w-[620px] text-gray-200 leading-relaxed">
                  {currentSlideData?.description}
                </p>
                <div>
                  <button
                    className="group flex items-center justify-between gap-2 sm:gap-4 bg-white hover:bg-cyan-400 hover:text-slate-100 text-gray-700 font-medium px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]"
                    onClick={() => {
                      const calculator = document.querySelector('#calculator');
                      if (calculator) calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          )}

          {/* ─── GALLERY CONTENT ─── */}
          {isGallerySlide && (
            <div className="w-full flex flex-col items-center justify-center px-4 py-12">
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Explore Our Fleet</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Find Your Perfect Suzuki
                </h2>
                <p className="text-gray-400 mt-3 text-base md:text-lg max-w-xl mx-auto">
                  Every model available through Credsure flexible financing.
                </p>
              </div>
              {/* Single portrait image, centered */}
              {currentSlideData.cars.map((car) => (
                <div
                  key={car.id}
                  className="relative flex flex-col items-center justify-center mx-auto h-[420px] w-full max-w-[900px] rounded-2xl overflow-hidden group shadow-xl bg-white/10 text"
                  style={{
                    backgroundImage: `url('${car.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 group-hover:via-black/40" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <h4 className="text-white font-bold text-xl mb-1">{car.name}</h4>
                    <p className="text-gray-300 text-sm mb-3 md:max-w-[600px]">{car.description}</p>
                    <span className="text-blue-300 font-semibold text-base block mb-2">
                      ₦{(car.price / 1000000).toFixed(1)}M
                    </span>
                    <button
                      className="text-xs md:text-sm bg-white/20 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                      onClick={() => {
                        const calc = document.querySelector('#calculator');
                        if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      Calculate →
                    </button>
                  </div>
                </div>
              ))}
              {/* Slide indicator */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Showing model {currentSlide + 1} of {carGallery.length}
              </p>
            </div>
          )}

          {/* ─── Navigation Arrows (always visible) ─── */}
          {interleavedSlides.length > 1 && (
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

          {/* ─── Pagination Dots ─── */}
          {interleavedSlides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 flex-wrap justify-center max-w-xs">
              {interleavedSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? slide.type === 'gallery'
                        ? 'w-8 h-2 bg-blue-400'
                        : 'w-8 h-2 bg-white'
                      : slide.type === 'gallery'
                        ? 'w-2 h-2 bg-blue-500/50 hover:bg-blue-400/75'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* ─── Slide type badge ─── */}
          <div className="absolute top-24 right-4 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-20 text-center">
            <p className="font-semibold">{currentSlide + 1} / {interleavedSlides.length}</p>
            <p className="text-xs text-gray-300">{isGallerySlide ? 'Fleet' : 'Promo'}</p>
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
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
              {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamSuzuki;