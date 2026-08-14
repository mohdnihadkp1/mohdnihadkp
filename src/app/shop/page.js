import React from 'react';
import { products } from '@/data/products';
import ShopClient from './ShopClient';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const productId = resolvedParams?.product;
  
  // Default store metadata
  const defaultTitle = 'Store | Mohammed Nihad KP';
  const defaultDescription = 'Premium assets, custom PC builds, and exclusive devices directly from my workspace to yours.';
  
  if (productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      return {
        title: `${product.title} | Store`,
        description: product.description,
        openGraph: {
          title: product.title,
          description: product.description,
          url: `https://nihadkp.com/shop?product=${product.id}`,
          siteName: "Nihad KP Store",
          images: product.image ? [{ url: product.image, width: 800, height: 600 }] : undefined,
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: product.title,
          description: product.description,
          images: product.image ? [product.image] : undefined,
        }
      };
    }
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: "https://nihadkp.com/shop",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
    }
  };
}

export default async function Shop({ searchParams }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams?.category || 'all';

  // Filter products based on category on the server
  let filteredProducts = products.filter(product => {
    if (currentCategory === 'all') return true;
    if (currentCategory === 'physical' && product.category === 'Physical') return true;
    if (currentCategory === 'digital' && product.category === 'Digital') return true;
    if (currentCategory === 'services' && product.category === 'Service') return true;
    return false;
  });

  if (filteredProducts.length === 0) {
    filteredProducts = [{
      id: "dummy-1",
      title: "Coming Soon - New Release",
      category: currentCategory === 'physical' ? 'Physical' : currentCategory === 'digital' ? 'Digital' : 'Service',
      price: "$--",
      image: "",
      description: "We are currently restocking this category. Check back soon for new premium items."
    }];
  }

  return <ShopClient initialProducts={filteredProducts} currentCategory={currentCategory} />;
}
