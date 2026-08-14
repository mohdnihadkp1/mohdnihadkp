import React from 'react';
import Link from 'next/link';
import { blogs } from '@/data/blogs';
import styles from './page.module.css';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog | Nihad KP',
  description: 'Articles on tech, development, business, and my personal setups.',
};

export default function BlogFeed() {
  return (
    <div className={styles.blogContainer}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={20} /> Back Home
          </Link>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>The Blog</h1>
            <p className={styles.subtitle}>Thoughts, guides, and premium gear recommendations.</p>
          </div>
          <div />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {blogs.map(blog => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className={styles.blogCard}>
                <div 
                  className={styles.cardImage} 
                  style={{ backgroundImage: `url(${blog.coverImage})` }}
                >
                  <div className={styles.tags}>
                    {blog.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.date}>
                    <Calendar size={14} /> 
                    {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className={styles.cardTitle}>{blog.title}</h2>
                  <p className={styles.cardDesc}>{blog.description}</p>
                  <div className={styles.readMore}>
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
