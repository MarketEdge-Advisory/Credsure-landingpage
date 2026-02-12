import React from 'react';
import { Clock, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { LuFacebook } from "react-icons/lu";
import { FiInstagram  } from "react-icons/fi";
import { PiTwitterLogo } from "react-icons/pi";


const Footer = () => {
  return (
    <footer className="bg-[#0A2647] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 sm:gap-12 lg:gap-16 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 md:flex-1 max-w-xs">
            <div className="flex items-center gap-2 sm:gap-4">
              <img src='/suzuki-footer-logo.svg' alt="Suzuki Logo" className="h-8 sm:h-10 w-auto" />
              <img src='/credsure-footer-logo.svg' alt="Credsure Logo" className="h-8 sm:h-10 w-auto" />
            </div>
            <p className="text-xs sm:text-sm text-gray-300">
              Your trusted authorized Suzuki dealer, partnering with Credsure to make vehicle ownership accessible to everyone.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className=" bg-[#011F3D] rounded-full flex items-center justify-center hover:bg-white hover:text-[#0A2647] transition-colors group p-2">
                <LuFacebook className="w-5 h-5" />
              </a>
               <a href="#" className=" bg-[#011F3D] rounded-full flex items-center justify-center hover:bg-white hover:text-[#0A2647] transition-colors group p-2">
                <FiInstagram className="w-5 h-5" />
              </a>
               <a href="#" className=" bg-[#011F3D] rounded-full flex items-center justify-center hover:bg-white hover:text-[#0A2647] transition-colors group p-2">
                <PiTwitterLogo className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div className="flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Consumer Rights</a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Responsible Lending</a>
              </li>
            </ul>
          </div> */}

          {/* Credsure Customer Support */}
          <div className="flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Credsure Customer Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock size={16} className="mt-0.5 sm:mt-1 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs sm:text-sm text-gray-300">Monday - Friday, 9:00 AM - 6:00 PM WAT</span>
              </li>
              {/* <li className="flex items-center gap-2 sm:gap-3">
                <Phone size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="tel:+2341234567890" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">+234 123 456 7890</a>
              </li> */}
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="mailto:support@credsure.com" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">support@credsure.com</a>
              </li>
            </ul>
          </div>

          {/* CFAO (Suzuki) */}
          <div className="flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">CFAO (Suzuki)</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin size={16} className="mt-0.5 sm:mt-1 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs sm:text-sm text-gray-300">Victoria Island, Lagos, Nigeria.</span>
              </li>
              {/* <li className="flex items-center gap-2 sm:gap-3">
                <Phone size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="tel:+2341234567890" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">+234 123 456 7890</a>
              </li> */}
              <li className="flex items-start gap-2 sm:gap-3">
                <Globe size={16} className="mt-0.5 sm:mt-1 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="https://www.cfaogroup.com/en/homepage/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors break-all">https://www.cfaogroup.com/en/homepage/</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6 mb-4">
          <p className="text-[10px] sm:text-xs text-gray-400">
            <strong>Important Disclaimer:</strong> Monthly payment estimates are indicative and subject to final credit approval. Actual rates, terms, and down payment requirements may vary based on creditworthiness, income verification, and other eligibility criteria. All financing is provided by Credsure and subject to their terms and conditions. CFAO is an authorized Suzuki dealer and facilitates vehicle sales only. Offer valid for Nigerian residents only.
          </p>
        </div>
         <div className="flex w-full items-center justify-center pt-4 sm:pt-6">
          <p className="text-[10px] sm:text-xs text-gray-400">
            {/* &copy; {new Date().getFullYear()} CFAO Motors Nigeria Limited. All rights reserved. | Powered by Credsure. */}
            &copy; {new Date().getFullYear()} 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
