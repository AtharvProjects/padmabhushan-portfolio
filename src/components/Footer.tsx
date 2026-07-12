import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-brown text-brand-light py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold">
            Designed <span className="font-normal">to show my work.</span>
          </h2>
          <p className="text-sm opacity-90 leading-relaxed max-w-xs">
            This website is designed to showcase my work. <br /><br />
            All photographs and content on this website are the exclusive property of @padmabhushan
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span className="text-sm">DM to contact</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span className="text-sm">padmabhushan@gmail.com</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium">Social Media</h3>
          <a
            href="https://www.instagram.com/shot__by__pj/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block p-2 bg-brand-dark rounded-md text-brand-light hover:opacity-80 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 flex flex-col md:flex-row items-center justify-between text-xs opacity-70 border-t border-brand-light/20 pt-6">
        <p>Copyright © padmabhushan</p>
      </div>
    </footer>
  );
}
