"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, duration = 0.6 }) {
  const ref = useRef(null);
  // trigger once: true means it will only animate the first time it comes into view
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
      style={{ willChange: "opacity" }} // Hardware acceleration hint
    >
      {children}
    </motion.div>
  );
}
