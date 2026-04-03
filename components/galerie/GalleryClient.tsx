"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Photo = {
  url: string;
  caption?: string;
};

type GalleryClientProps = {
  photos: Photo[];
};

export default function GalleryClient({ photos }: GalleryClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  const prev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : i === 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : i === photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, close, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

  return (
    <>
      {/* Photo grid — masonry via CSS columns */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden mb-3 cursor-pointer break-inside-avoid group"
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="relative">
              <Image
                src={photo.url}
                alt={photo.caption || `Foto ${idx + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={close}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none p-2 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Zavřít"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/60 text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>

            {/* Left arrow */}
            {photos.length > 1 && (
              <button
                className="absolute left-4 text-white/80 hover:text-white text-4xl p-3 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Předchozí"
              >
                ‹
              </button>
            )}

            {/* Right arrow */}
            {photos.length > 1 && (
              <button
                className="absolute right-4 text-white/80 hover:text-white text-4xl p-3 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Další"
              >
                ›
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[80vh]">
                <Image
                  src={photos[selectedIndex].url}
                  alt={photos[selectedIndex].caption || `Foto ${selectedIndex + 1}`}
                  width={1200}
                  height={900}
                  className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                  priority
                />
              </div>
              {photos[selectedIndex].caption && (
                <p className="mt-3 text-white/70 text-sm text-center max-w-xl px-4">
                  {photos[selectedIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
