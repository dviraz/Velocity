'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <g transform="translate(20,20)">
              <path 
                d="M-15 0 A 15 15 0 0 1 15 0" 
                stroke="#10B981" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
              />
              <line 
                x1="0" 
                y1="0" 
                x2="12" 
                y2="-9" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </g>
          </svg>
          <span className="logo-font-poppins text-2xl font-bold text-white">
            Get Speed
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="#features" 
            className="hover:text-emerald-400 transition-colors text-gray-300"
          >
            Features
          </Link>
          <Link 
            href="#process" 
            className="hover:text-emerald-400 transition-colors text-gray-300"
          >
            Process
          </Link>
          <Link 
            href="#faq" 
            className="hover:text-emerald-400 transition-colors text-gray-300"
          >
            FAQ
          </Link>
        </nav>
        
        <Link 
          href="#contact" 
          className="hidden md:inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Get Quote
        </Link>
        
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-white"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-gray-900 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link 
          href="#features" 
          className="block py-2 px-6 hover:bg-gray-800 text-gray-300"
          onClick={closeMobileMenu}
        >
          Features
        </Link>
        <Link 
          href="#process" 
          className="block py-2 px-6 hover:bg-gray-800 text-gray-300"
          onClick={closeMobileMenu}
        >
          Process
        </Link>
        <Link 
          href="#faq" 
          className="block py-2 px-6 hover:bg-gray-800 text-gray-300"
          onClick={closeMobileMenu}
        >
          FAQ
        </Link>
        <Link 
          href="#contact" 
          className="block py-4 px-6 text-center bg-emerald-600 text-white font-bold"
          onClick={closeMobileMenu}
        >
          Get Quote
        </Link>
      </div>
    </header>
  );
};

export default Header;
