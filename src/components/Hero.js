"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Stars } from '@react-three/drei';
import styles from './Hero.module.css';
import Link from 'next/link';

function InteractiveStars() {
  const starsRef = useRef();

  useFrame(({ clock, pointer }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.05 + pointer.x * 0.2;
      starsRef.current.rotation.x = pointer.y * 0.2;
    }
  });

  return (
    <Stars ref={starsRef} radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={1} />
  );
}

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.canvasContainer}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
          <InteractiveStars />
        </Canvas>
      </div>
      <motion.div 
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className={styles.headline}>
          Building Scalable Digital Ventures & Strategic Business Solutions.
        </motion.h1>
        <motion.p variants={itemVariants} className={styles.subtext}>
          Transforming complex market challenges into profitable, user-centric platforms through modern digital infrastructure and visionary leadership.
        </motion.p>
        <motion.div variants={itemVariants} className={styles.actions}>
          <Link href="#ventures" className={styles.primaryButton}>
            Explore My Ventures
          </Link>
          <Link href="#contact" className={styles.secondaryButton}>
            Let's Talk Business
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.keywords}>
          <span>Explore:</span>
          <Link href="/blog" className={styles.keyword}>Blogs</Link>
          <Link href="/services" className={styles.keyword}>Services</Link>
          <Link href="/shop" className={styles.keyword}>Store</Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
