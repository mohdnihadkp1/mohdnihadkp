"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, yOffset = 50, duration = 0.6 }) {
  const ref = useRef(null);
  // trigger once: true means it will only animate the first time it comes into view
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for a buttery smooth 120Hz feel
      }}
      style={{ willChange: "opacity, transform" }} // Hardware acceleration hint
    >
      {children}
    </motion.div>
  );
}
