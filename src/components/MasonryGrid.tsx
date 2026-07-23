"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MasonryGridProps {
  images: { id: string | number; src: string; alt: string }[];
}

export function MasonryGrid({ images }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Touch swipe handling for mobile lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else setColumns(3);
    };

    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  // Handle touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Image
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getColumns = () => {
    type ImageWithIndex = typeof images[0] & { originalIndex: number };
    const cols: ImageWithIndex[][] = Array.from({ length: columns }, () => []);
    images.forEach((img, i) => {
      cols[i % columns].push({ ...img, originalIndex: i });
    });
    return cols;
  };

  const currentColumns = getColumns();

  return (
    <>
      <div className="flex gap-3 sm:gap-4 w-full">
        {currentColumns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3 sm:gap-4 flex-1">
            {col.map((img: any, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                className="w-full relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 group cursor-zoom-in active:scale-[0.99] transition-transform"
                onClick={() => setSelectedIndex(img.originalIndex)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs sm:text-sm font-medium tracking-wide drop-shadow-md">View</span>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-6 md:p-12 cursor-zoom-out select-none"
            onClick={() => setSelectedIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/30 rounded-full backdrop-blur-sm"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close lightbox"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>
            
            {/* Prev Button */}
            {images.length > 1 && (
              <button 
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all p-2 sm:p-3 z-50 cursor-pointer bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                src={images[selectedIndex].src}
                alt="Expanded view"
                className="max-w-full max-h-[85vh] sm:max-h-full object-contain rounded-md shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()} 
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </AnimatePresence>

            {/* Next Button */}
            {images.length > 1 && (
              <button 
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all p-2 sm:p-3 z-50 cursor-pointer bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next image"
              >
                <ChevronRight size={24} className="sm:w-8 sm:h-8" />
              </button>
            )}
            
            {/* Counter */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/70 font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
