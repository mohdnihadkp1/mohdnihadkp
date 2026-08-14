import React from 'react';
import styles from './CaseStudies.module.css';

const studies = [
  {
    title: "KP Foundation",
    subtitle: "All-in-one business ecosystem & foundation",
    challenge: "Establishing a unified digital footprint that manages multiple independent business ventures under one cohesive brand, enabling seamless cross-promotion and centralized management.",
    architecture: "Next.js, Vercel, Firebase, Custom Analytics.",
    link: "#"
  },
  {
    title: "Full-Scale E-Commerce (Calicut Store)",
    subtitle: "Sports items robust e-commerce app",
    challenge: "Building a performant, highly scalable e-commerce platform with complex cart management, sleek UI, and a frictionless payment flow to compete with established marketplaces.",
    architecture: "React, Node.js, Stripe, MongoDB.",
    link: "https://calicutstore.vercel.app/"
  },
  {
    title: "Chaliyam Connect",
    subtitle: "Hyper-Local Community App",
    challenge: "Creating a comprehensive local directory and home delivery tracking system for the Chaliyam community, requiring real-time updates and an intuitive interface for non-technical users.",
    architecture: "React Native, Firebase Realtime Database, Google Maps API.",
    link: "https://chaliyam.vercel.app/"
  },
  {
    title: "Calicut Gold",
    subtitle: "Bulk Gold Selling Platform",
    challenge: "Developing a secure, high-trust platform for B2B bulk gold transactions, ensuring real-time market rate syncing and robust user authentication.",
    architecture: "Next.js, Supabase, Secure API Integrations.",
    link: "https://calicutgold.vercel.app/"
  }
];

export default function CaseStudies() {
  return (
    <section className={styles.caseStudiesSection} id="ventures">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Deep-Dive Case Studies</h2>
        <div className={styles.grid}>
          {studies.map((study, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{study.title}</h3>
                <span className={styles.subtitle}>{study.subtitle}</span>
              </div>
              
              <div className={styles.content}>
                <div className={styles.block}>
                  <h4>The Challenge</h4>
                  <p>{study.challenge}</p>
                </div>
                <div className={styles.block}>
                  <h4>The Architecture</h4>
                  <p className={styles.techStack}>{study.architecture}</p>
                </div>
              </div>

              <div className={styles.walkthrough}>
                <div className={styles.videoPlaceholder}>
                  <span>[Live Walkthrough Video - 10s]</span>
                </div>
                <a href={study.link} target="_blank" rel="noreferrer" className={styles.viewLink}>
                  View Live Project &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
