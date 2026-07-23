"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { SearchModal } from "@/components/SearchModal";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keydown shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="fixed top-8 left-0 right-0 z-50 w-full px-4 md:px-8">
        <nav className="bg-brand-light rounded-full px-2 py-2 flex items-center justify-between shadow-sm border border-brand-brown/10 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ml-1 hover:opacity-90 transition-opacity"
            >
              <img 
                src="/profile.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover object-[center_25%] pointer-events-none select-none"
                draggable={false}
              />
            </Link>

            <div className="flex gap-6 items-center text-brand-dark font-medium text-sm">
              <Link href="/" className="hover:text-brand-brown transition-colors">
                Home
              </Link>
              <Link href="/my-work" className="hover:text-brand-brown transition-colors">
                Work
              </Link>
            </div>
          </div>

          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search" 
            className="flex items-center gap-2 text-brand-dark hover:text-brand-brown transition-colors px-3 py-1.5 rounded-full hover:bg-brand-brown/10 text-sm font-medium border border-brand-brown/10 mr-1"
          >
            <Search size={18} />
            <span className="hidden sm:inline opacity-80">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-brand-brown/10 rounded text-brand-dark/70">⌘K</kbd>
          </button>
        </nav>
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
