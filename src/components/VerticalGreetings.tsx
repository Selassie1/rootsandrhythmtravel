"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const greetings = ["Akwaaba", "Woezor", "Oobakɛ", "Barka da zuwa", "Welcome"];

const containerVariants: Variants = {
  animate: {
    transition: { staggerChildren: 0.07 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const letterVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] } },
  exit:    { opacity: 0, y: -14, transition: { duration: 0.25, ease: [0.4, 0.0, 1, 1] } },
};

export default function VerticalGreetings() {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const word = greetings[index];
    // Wait long enough for the word to fully type in, then hold, then exit
    const holdDuration = word.length * 70 + 2200;

    const timer = setTimeout(() => {
      if (index < greetings.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        setActive(true);
      }
    }, holdDuration);

    return () => clearTimeout(timer);
  }, [index]);

  const word = greetings[index];

  return (
    <div className="absolute top-1/4 -translate-y-1/2 left-18 z-30 flex items-center pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        {active && (
          <motion.span
            key={word}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex font-serif tracking-[0.25em] text-white uppercase text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            {word.split("").map((char, i) => (
              <motion.span key={i} variants={letterVariants}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
