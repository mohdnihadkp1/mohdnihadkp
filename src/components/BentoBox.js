"use client";

import React from 'react';
import styles from './BentoBox.module.css';
import { Globe, Server, Wrench, Palette, Briefcase, Rocket } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BentoBox() {
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className={styles.bentoSection} id="about">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Grid 1: Who & Where (Full Image Background) */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.card1}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={cardVariants}
          >
            <Image 
              src="/professional_photo.jpg" 
              alt="Nihad KP Professional" 
              fill
              className={styles.bgImage}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className={styles.overlayGradient}></div>
            <div className={styles.cardContentOverlay}>
              <h2 className={styles.cardTitleOverlay}>Based in Kerala,<br/>Scaling Globally.</h2>
            </div>
          </motion.div>

          {/* Grid 2: The Complete Ecosystem (2x2 Stylish Grid) */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.card2}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={cardVariants}
          >
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>The Complete Ecosystem</h2>
              <div className={styles.ecosystemGrid}>
                <div className={styles.ecosystemItem}>
                  <Server className={styles.icon} />
                  <div>
                    <h3>Tech & Infrastructure</h3>
                    <p>Google Ecosystem, Firebase, Vercel, GitHub, AI.</p>
                  </div>
                </div>
                <div className={styles.ecosystemItem}>
                  <Wrench className={styles.icon} />
                  <div>
                    <h3>System Diagnostics</h3>
                    <p>Custom Android ROMs.</p>
                  </div>
                </div>
                <div className={styles.ecosystemItem}>
                  <Palette className={styles.icon} />
                  <div>
                    <h3>Creative Studio</h3>
                    <p>Video/Image Editing, Photography, AI Prompts.</p>
                  </div>
                </div>
                <div className={styles.ecosystemItem}>
                  <Briefcase className={styles.icon} />
                  <div>
                    <h3>Active Ventures</h3>
                    <p>KP Foundation, Calicut Store.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid 3: Beyond Code (Auto-playing Video) */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.card3}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={cardVariants}
          >
            <div className={styles.videoContainer}>
              <video 
                src="/ai_video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className={styles.playingVideoImage}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <div className={styles.scanlines}></div>
              
              <div className={styles.videoContentOverlay}>
                <h2 className={styles.videoTitleOverlay}>Visual Storyteller</h2>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
