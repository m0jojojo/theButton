'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar';
import AnnouncementBar from './AnnouncementBar';

const navLinks = [
  { name: 'All Products', href: '/products' },
  { name: 'New Arrivals', href: '/collections/new-arrivals' },
  { name: 'Sarees', href: '/collections/sarees' },
  { name: 'Suits', href: '/collections/suits' },
  { name: 'Kurtis', href: '/collections/kurtis' },
  { name: 'Lehengas', href: '/collections/lehengas' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { user, logout, isLoading } = useAuth();
  const cartCount = getItemCount();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
    setMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((open) => !open);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 md:h-20">
          {/* Left: hamburger on mobile, logo on desktop */}
          <div className="flex flex-1 md:flex-none items-center">
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobileMenu}
              className="md:hidden -ml-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity text-gray-900"
            >
              RANGREZ
            </Link>
          </div>

          {/* Logo - centered on mobile */}
          <Link
            href="/"
            className="md:hidden text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity text-gray-900"
          >
            RANGREZ
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex flex-1 md:flex-none items-center justify-end space-x-1 md:space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Search toggle - Mobile (outside the hamburger menu) */}
            <button
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
              onClick={toggleMobileSearch}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileSearchOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            {/* User Menu - Desktop */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="hidden md:block relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                      aria-label="User menu"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <div className="p-2 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Orders
                          </Link>
                          {user.role === 'admin' && (
                            <>
                              <Link
                                href="/admin/dashboard"
                                onClick={() => setUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200 mt-1 pt-2"
                              >
                                Dashboard
                              </Link>
                              <Link
                                href="/admin/homepage-settings"
                                onClick={() => setUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Homepage Settings
                              </Link>
                            </>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Cart icon */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search - lives in the bar itself, not in the hamburger menu */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3">
              <SearchBar mobile onClose={() => setMobileSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Auth Links */}
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Login
                    </Link>
                  )}
                  <div className="border-t border-gray-200 pt-3"></div>
                </>
              )}
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}

