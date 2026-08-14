"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AmbientBackground.module.css';

export default function AmbientBackground() {
  return (
    <div className={styles.backgroundContainer}>
      <motion.div
        className={styles.orb1}
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={styles.orb2}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -60, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={styles.orb3}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* A static noise overlay can make the dark gradient feel more premium and textured */}
      <div className={styles.noiseOverlay}></div>
    </div>
  );
}
