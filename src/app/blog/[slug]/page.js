import React from 'react';
import { blogs } from '@/data/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  
  if (!blog) {
    return { title: 'Blog Not Found' };
  }
  
  return {
    title: `${blog.title} | Nihad KP Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://nihadkp.com/blog/${blog.slug}`,
      siteName: "Nihad KP Blog",
      images: [{ url: blog.coverImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: blog.date,
      authors: ["Mohammed Nihad KP"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.coverImage],
    }
  };
}

// Function to render different block types
const renderBlock = (block, index) => {
  switch (block.type) {
    case 'text':
      // Basic markdown parsing for bold, italics, and headers
      let htmlContent = block.value
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
        
      return <div key={index} className={styles.textBlock} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
      
    case 'image':
      return (
        <div key={index} className={styles.imageBlock}>
          <img src={block.url} alt={block.caption || 'Blog image'} className={styles.image} />
          {block.caption && <span className={styles.caption}>{block.caption}</span>}
        </div>
      );
      
    case 'video':
      return (
        <div key={index} className={styles.videoBlock}>
          <div className={styles.videoWrapper}>
            <iframe 
              src={block.url} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          {block.caption && <span className={styles.caption}>{block.caption}</span>}
        </div>
      );
      
    case 'sticker':
      return (
        <div key={index} className={styles.stickerBlock}>
          <img src={block.url} alt="Sticker" className={styles.sticker} />
        </div>
      );
      
    case 'amazon-affiliate':
      return (
        <div key={index} className={styles.affiliateBlock}>
          <div className={styles.affiliateImageWrapper}>
            <img src={block.imageUrl} alt={block.productTitle} />
          </div>
          <div className={styles.affiliateInfo}>
            <h3>{block.productTitle}</h3>
            <p>{block.productDesc}</p>
            <div className={styles.affiliateBottom}>
              <span className={styles.price}>{block.price}</span>
              <a href={block.productUrl} target="_blank" rel="noopener noreferrer" className={styles.buyBtn}>
                {block.buttonText || 'Buy on Amazon'} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  
  if (!blog) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": [
      `https://nihadkp.com${blog.coverImage}`
    ],
    "datePublished": blog.date,
    "dateModified": blog.date,
    "author": [{
        "@type": "Person",
        "name": "Mohammed Nihad KP",
        "url": "https://nihadkp.com"
      }]
  };

  return (
    <div className={styles.articleContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.hero} style={{ backgroundImage: `url(${blog.coverImage})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={20} /> Back to Blog
          </Link>
          <div className={styles.tags}>
            {blog.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.meta}>
            <Calendar size={16} /> 
            {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {blog.content.map((block, index) => renderBlock(block, index))}
        </div>
      </main>
    </div>
  );
}
