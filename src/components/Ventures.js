import React from 'react';
import styles from './Ventures.module.css';

export default function Ventures() {
  return (
    <section className={styles.venturesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ventures & Leadership</h2>
          <p className={styles.subtitle}>Driving innovation through strategic foundations and tech communities.</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.roleCard}>
            <div className={styles.roleHeader}>
              <h3>Founder & Tech Lead</h3>
              <span className={styles.badge}>Active</span>
            </div>
            <p className={styles.description}>
              Leading freelance collectives and business foundations. Leveraging AI to accelerate development cycles and deliver premium digital solutions globally. 
            </p>
            <ul className={styles.highlights}>
              <li>Managing cross-functional teams and freelance collectives.</li>
              <li>Architecting scalable cloud infrastructure (GCP, Vercel, Firebase).</li>
              <li>Mentoring developers in AI-driven development practices.</li>
            </ul>
          </div>
          
          <div className={styles.visionCard}>
            <h3>The Global Vision</h3>
            <p>
              Driven by a massive goal: to travel to all 195 countries, build financial independence to elevate my family, and eventually educate others on harnessing the power of AI to overcome their own limitations.
            </p>
            <div className={styles.exploring}>
              <h4>Currently Exploring:</h4>
              <ul>
                <li>🌍 High-paying global career opportunities (Abroad, Remote).</li>
                <li>🎓 Fully-funded international scholarships (Europe, GCC, China).</li>
                <li>🤝 Networking with tech entrepreneurs and AI innovators.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
