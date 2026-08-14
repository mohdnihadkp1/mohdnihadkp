import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { ArrowLeft, Monitor, FileText } from 'lucide-react';

export const metadata = {
  title: 'Freelance Services | Mohammed Nihad KP',
};

const services = [
  { 
    icon: <Monitor size={24} />, 
    title: "Portfolio Website Creation", 
    desc: "Stand out with a stunning, custom-built portfolio website. I design and develop responsive, fast, and visually striking personal websites that showcase your work and skills perfectly to clients and employers." 
  },
  { 
    icon: <FileText size={24} />, 
    title: "CV & Cover Letter Design", 
    desc: "Land your dream job with a professionally crafted CV and Cover Letter. I create modern, beautiful, and ATS-friendly designs that highlight your strengths and make a lasting impression on recruiters." 
  }
];

export default function Services() {
  return (
    <div className={styles.servicesContainer}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={20} /> Back to Portfolio
          </Link>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Freelance Services</h1>
            <p className={styles.subtitle}>Premium digital solutions tailored to your needs.</p>
          </div>
          <div /> {/* Spacer */}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.noticeBox}>
            <h3>Payment Terms</h3>
            <p>To ensure commitment and quality, all paid services require a <strong>50% advance payment</strong> prior to commencement. The remaining balance is due upon successful completion.</p>
          </div>

          <div className={styles.grid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.iconContainer}>
                  {service.icon}
                </div>
                <h2 className={styles.serviceTitle}>{service.title}</h2>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <Link href="/#contact" className={styles.hireBtn}>Contact</Link>
              </div>
            ))}
          </div>

          <div className={styles.freeHelpBox}>
            <h3>Need Free Help?</h3>
            <p>If you have any technical doubts or need guidance on something I am familiar with, feel free to contact me. I am always happy to help for <strong>completely free</strong>!</p>
            <Link href="/#contact" className={styles.contactBtn}>Get in Touch</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
