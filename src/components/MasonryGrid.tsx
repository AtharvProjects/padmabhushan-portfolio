"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MasonryGridProps {
  images: { id: string | number; src: string; alt: string }[];
}

export function MasonryGrid({ images }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  // lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
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

  const getColumns = () => {
    type ImageWithIndex = typeof images[0] & { originalIndex: number };
    const cols: ImageWithIndex[][] = Array.from({ length: columns }, () => []);
    images.forEach((img, i) => {
      // Keep track of the original index to open the correct lightbox image
      cols[i % columns].push({ ...img, originalIndex: i });
    });
    return cols;
  };

  const currentColumns = getColumns();

  return (
    <>
      <div className="flex gap-4 w-full">
        {currentColumns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4 flex-1">
            {col.map((img: any, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                className="w-full relative overflow-hidden rounded-lg bg-gray-100 group cursor-zoom-in"
                onClick={() => setSelectedIndex(img.originalIndex)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white font-medium tracking-wide drop-shadow-md">View</span>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={36} />
            </button>
            
            {/* Prev Button */}
            {images.length > 1 && (
              <button 
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:scale-110 transition-all p-4 z-50 cursor-pointer bg-black/20 hover:bg-black/40 rounded-full"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={48} />
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
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()} 
              />
            </AnimatePresence>

            {/* Next Button */}
            {images.length > 1 && (
              <button 
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:scale-110 transition-all p-4 z-50 cursor-pointer bg-black/20 hover:bg-black/40 rounded-full"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next image"
              >
                <ChevronRight size={48} />
              </button>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
