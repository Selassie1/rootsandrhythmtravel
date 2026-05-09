'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface TourImageCarouselProps {
  images: string[];
  title: string;
}

export default function TourImageCarousel({ images, title }: TourImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = images.length;

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setCurrent((next + total) % total);
  }, [total]);

  const prev = () => go(current - 1, -1);
  const next = () => go(current + 1, 1);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => go(current + 1, 1), 5000);
    return () => clearInterval(timer);
  }, [current, total, go]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[current]}
            alt={`${title} - image ${current + 1}`}
            fill
            unoptimized
            className="object-cover object-center scale-105"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#131A14] via-black/40 to-black/60 pointer-events-none" />

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-[#E8D3A2]' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-6 right-6 z-20 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {current + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}
