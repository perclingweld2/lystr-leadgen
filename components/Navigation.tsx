'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              ⚡ Lystr LeadGen Scout
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Scouten
              </Link>
              <Link
                href="/configurator"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Konfigurator
              </Link>
              <Link
                href="/sales-assistant"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Säljassistent
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary-700 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Scouten
              </Link>
              <Link
                href="/configurator"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                ☀️ Konfigurator
              </Link>
              <Link
                href="/sales-assistant"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                🤖 Säljassistent
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
