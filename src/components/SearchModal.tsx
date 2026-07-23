"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Image as ImageIcon, Folder, ArrowRight } from "lucide-react";
import { MainCategory, PhotoItem } from "@/lib/getPhotos";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultSubCategory {
  mainTitle: string;
  subTitle: string;
  subId: string;
  images: PhotoItem[];
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<PhotoItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch photos data on first open
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      setLoading(true);
      fetch("/api/photos")
        .then((res) => res.json())
        .then((data: MainCategory[]) => {
          setCategories(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, categories.length]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setLightboxImage(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImage) {
          setLightboxImage(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, lightboxImage]);

  const cleanQuery = query.trim().toLowerCase();

  // Search logic
  const matchedCategories: MainCategory[] = [];
  const matchedSubCategories: SearchResultSubCategory[] = [];
  const matchedPhotos: { photo: PhotoItem; categoryName: string; subName?: string }[] = [];

  if (cleanQuery.length > 0 && categories.length > 0) {
    categories.forEach((cat) => {
      if (cat.title.toLowerCase().includes(cleanQuery)) {
        matchedCategories.push(cat);
      }

      cat.subCategories.forEach((sub) => {
        if (sub.title.toLowerCase().includes(cleanQuery)) {
          matchedSubCategories.push({
            mainTitle: cat.title,
            subTitle: sub.title,
            subId: sub.id,
            images: sub.images,
          });
        }

        sub.images.forEach((img) => {
          if (img.alt.toLowerCase().includes(cleanQuery) || sub.title.toLowerCase().includes(cleanQuery)) {
            matchedPhotos.push({
              photo: img,
              categoryName: cat.title,
              subName: sub.title,
            });
          }
        });
      });

      // Direct images in main category
      if (cat.subCategories.length === 0) {
        cat.allImages.forEach((img) => {
          if (img.alt.toLowerCase().includes(cleanQuery) || cat.title.toLowerCase().includes(cleanQuery)) {
            matchedPhotos.push({
              photo: img,
              categoryName: cat.title,
            });
          }
        });
      }
    });
  }

  // Deduplicate matched photos
  const uniquePhotos = Array.from(
    new Map(matchedPhotos.map((item) => [item.photo.src, item])).values()
  ).slice(0, 12);

  const suggestedTags = [
    "Human Portraits",
    "Harishchandragad",
    "Sunset",
    "Landscape",
    "Sandhan Valley",
    "My Best Work",
    "Travel",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-brown/10 flex flex-col max-h-[85vh] sm:max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-3 sm:p-4 border-b border-brand-brown/10 flex items-center gap-2.5 sm:gap-3 bg-brand-light/30">
              <Search className="text-brand-brown/70 flex-shrink-0" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search photos, topics..."
                className="w-full bg-transparent text-brand-dark placeholder:text-brand-dark/40 font-sans text-base outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-brand-dark/50 hover:text-brand-dark hover:bg-brand-brown/10 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-brand-dark/60 hover:text-brand-dark hover:bg-brand-brown/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results / Empty State */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
              {loading && (
                <div className="py-12 text-center text-brand-dark/60 font-medium">
                  Loading gallery content...
                </div>
              )}

              {!loading && cleanQuery.length === 0 && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-brand-dark/50 font-medium">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-brown/5 text-brand-dark hover:bg-brand-brown/15 transition-all border border-brand-brown/10 flex items-center gap-1.5"
                      >
                        <Search size={12} className="opacity-50" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && cleanQuery.length > 0 && (
                <>
                  {/* Category Matches */}
                  {matchedCategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-brand-dark/50 font-medium">
                        Categories
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {matchedCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href="/my-work"
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-xl bg-brand-light/50 hover:bg-brand-brown/10 transition-colors border border-brand-brown/5 group"
                          >
                            <div className="flex items-center gap-3">
                              <Folder className="text-brand-brown" size={18} />
                              <span className="font-serif font-medium text-brand-dark text-base sm:text-lg">
                                {cat.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-brand-dark/60">
                              <span>{cat.allImages.length} photos</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SubCategory Matches */}
                  {matchedSubCategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-brand-dark/50 font-medium">
                        Subsections
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchedSubCategories.map((sub) => (
                          <Link
                            key={`${sub.mainTitle}-${sub.subId}`}
                            href="/my-work"
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-xl bg-brand-light/50 hover:bg-brand-brown/10 transition-colors border border-brand-brown/5 group"
                          >
                            <div>
                              <p className="text-[11px] text-brand-dark/50 font-medium">{sub.mainTitle}</p>
                              <p className="font-serif font-medium text-brand-dark text-sm sm:text-base">{sub.subTitle}</p>
                            </div>
                            <span className="text-xs bg-brand-brown/10 px-2 py-0.5 rounded-full text-brand-dark/70 font-medium">
                              {sub.images.length}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo Thumbnail Matches */}
                  {uniquePhotos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-brand-dark/50 font-medium">
                        Photos ({uniquePhotos.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {uniquePhotos.map((item) => (
                          <div
                            key={item.photo.src}
                            onClick={() => setLightboxImage(item.photo)}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer border border-brand-brown/10 hover:shadow-md transition-all active:scale-95"
                          >
                            <img
                              src={item.photo.src}
                              alt={item.photo.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <ImageIcon className="text-white drop-shadow-md" size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {matchedCategories.length === 0 &&
                    matchedSubCategories.length === 0 &&
                    uniquePhotos.length === 0 && (
                      <div className="py-12 text-center space-y-2">
                        <p className="text-brand-dark font-medium">No results found for &quot;{query}&quot;</p>
                        <p className="text-xs text-brand-dark/50">
                          Try searching for keywords like &quot;Portraits&quot;, &quot;Travel&quot;, or &quot;Sunset&quot;.
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>

            {/* Footer help line */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-light/50 border-t border-brand-brown/10 text-xs text-brand-dark/50 flex justify-between items-center">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-brand-brown/20 font-mono text-[10px]">ESC</kbd> to close</span>
              <span>Padmabhushan Portfolio</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Lightbox for searched photo */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors p-2 bg-black/30 rounded-full"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} className="sm:w-8 sm:h-8" />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-w-full max-h-[85vh] sm:max-h-full object-contain rounded-md shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
