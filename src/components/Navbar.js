"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show this navbar on the music, shop, or blog route since they have their own custom headers
  if (pathname && (pathname.startsWith('/music') || pathname.startsWith('/shop') || pathname.startsWith('/blog'))) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>NKP.</Link>
        <div className={styles.links}>
          <Link href="/services" className={pathname === '/services' ? styles.active : ''}>Services</Link>
          <Link href="/shop" className={pathname === '/shop' ? styles.active : ''}>Store</Link>
          <Link href="/blog" className={pathname === '/blog' ? styles.active : ''}>Blog</Link>
          <Link href="/music" className={styles.musicLink}>Music Player</Link>
        </div>
      </div>
    </nav>
  );
}
