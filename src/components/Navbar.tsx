import Link from "next/link";
import { Search, User } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 w-full px-4 md:px-8">
      <nav className="bg-brand-light rounded-full px-2 py-2 flex items-center justify-between shadow-sm border border-brand-brown/10">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ml-1">
            <img 
              src="/gallery/Travel/harishchandragad/IMG20251228070142 (1).jpg" 
              alt="Profile" 
              className="w-full h-full object-cover object-[70%_60%] grayscale scale-150"
            />
          </div>

          <div className="flex gap-6 items-center text-brand-dark font-medium text-sm">
            <Link href="/" className="hover:text-brand-brown transition-colors">
              Home
            </Link>
            <Link href="/my-work" className="hover:text-brand-brown transition-colors">
              Work
            </Link>
          </div>
        </div>

        <button aria-label="Search" className="text-brand-dark hover:text-brand-brown transition-colors p-2 rounded-full mr-2">
          <Search size={20} />
        </button>
      </nav>
    </div>
  );
}
