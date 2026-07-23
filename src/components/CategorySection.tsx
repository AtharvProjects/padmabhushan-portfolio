"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MasonryGrid } from "@/components/MasonryGrid";
import { MainCategory, SubCategory } from "@/lib/getPhotos";

function SubCategoryAccordion({ subCategory }: { subCategory: SubCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-brand-brown/10 rounded-xl overflow-hidden bg-brand-light/30 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left hover:bg-brand-brown/5 transition-colors group"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-brand-dark group-hover:text-brand-brown transition-colors">
            {subCategory.title}
          </h3>
          <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-brand-brown/10 text-brand-dark/70 font-medium whitespace-nowrap">
            {subCategory.images.length} {subCategory.images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        <div className="text-brand-brown/50 group-hover:text-brand-brown transition-colors flex-shrink-0">
          {isOpen ? <ChevronUp size={20} className="sm:w-[22px] sm:h-[22px]" /> : <ChevronDown size={20} className="sm:w-[22px] sm:h-[22px]" />}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-3 sm:p-5 pt-2 border-t border-brand-brown/5">
          <MasonryGrid images={subCategory.images} />
        </div>
      )}
    </div>
  );
}

export function CategorySection({ 
  category, 
  isDefaultOpen = false 
}: { 
  category: MainCategory; 
  isDefaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const hasSubCategories = category.subCategories.length > 0;

  return (
    <div className="border border-brand-brown/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white shadow-sm transition-all hover:border-brand-brown/30">
      {/* Category Main Header (Tap to Open) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="pr-2">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-brand-dark group-hover:text-brand-brown transition-colors">
            {category.title}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-brand-dark/60 mt-1 font-medium">
            {hasSubCategories ? `${category.subCategories.length} Subsections • ` : ""}{category.allImages.length} Photos
          </p>
        </div>
        <div className="text-brand-brown/60 group-hover:text-brand-brown transition-colors p-1.5 sm:p-2 bg-brand-brown/5 rounded-full flex-shrink-0">
          {isOpen ? <ChevronUp size={22} className="sm:w-[28px] sm:h-[28px]" /> : <ChevronDown size={22} className="sm:w-[28px] sm:h-[28px]" />}
        </div>
      </button>
      
      {/* Content area when Main Category is tapped/opened */}
      {isOpen && (
        <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 border-t border-brand-brown/10 mt-4 sm:mt-6">
          {hasSubCategories ? (
            /* Subsections each as tap-to-open sub-accordion */
            <div className="space-y-2.5 sm:space-y-3">
              {category.subCategories.map((subCat) => (
                <SubCategoryAccordion key={subCat.id} subCategory={subCat} />
              ))}
            </div>
          ) : (
            /* Direct photos for category with no subcategories */
            <div className="pt-2">
              <MasonryGrid images={category.allImages} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
