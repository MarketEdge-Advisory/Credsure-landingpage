import React, { useState } from 'react';
import { Camera, Search } from 'lucide-react';

const Header = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Vehicles', href: '#vehicles' },
    { name: 'Calculator', href: '#calculator' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'FAQs', href: '#faqs' },
  ];

  // Function to scroll to home and set active link
  const goToHome = (e) => {
    e.preventDefault();
    setActiveLink('Home');
    setMobileMenuOpen(false);
    const homeElement = document.querySelector('#home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 z-50 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {/* Suzuki Logo - clickable */}
            <div className="flex items-center gap-2">
              <a href="#home" onClick={goToHome} className="block">
                <img src='/credsure-real-logo.svg' alt='Suzuki Logo' className='w-20 h-auto' />
              </a>
            </div>

            {/* Credsure Logo - clickable */}
            <div className="flex items-center gap-2 border-gray-300 pl-4">
              <a href="#home" onClick={goToHome} className="block">
                <img src='/suzuki-by-cfao-logo.png' alt='Credsure Logo' className='w-20 h-auto' />
              </a>
            </div>
          </div>

          {/* Navigation Links (unchanged) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(link.name);
                  setMobileMenuOpen(false);
                  const element = document.querySelector(link.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`text-sm font-medium transition-colors ${
                  activeLink === link.name
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } pb-1`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search Bar (unchanged) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Browse Suzuki vehicles here..."
                className="w-80 pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Mobile Menu Button (unchanged) */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu (unchanged) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.name);
                    setMobileMenuOpen(false);
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`text-sm font-medium px-4 py-2 transition-colors ${
                    activeLink === link.name
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;