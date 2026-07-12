"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MasonryGrid } from "@/components/MasonryGrid";

interface PhotoCategory {
  title: string;
  images: { id: string; src: string; alt: string }[];
}

export function CategorySection({ category, isDefaultOpen }: { category: PhotoCategory, isDefaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className="border-b border-brand-brown/10 pb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-brand-dark group-hover:text-brand-brown transition-colors">
          {category.title}
        </h2>
        <div className="text-brand-brown/50 group-hover:text-brand-brown transition-colors">
          {isOpen ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="pt-8">
          <MasonryGrid images={category.images} />
        </div>
      )}
    </div>
  );
}
