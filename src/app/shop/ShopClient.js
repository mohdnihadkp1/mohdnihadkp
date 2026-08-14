"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Search, Filter, X, Plus, Minus, Send } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function ShopClient({ initialProducts, currentCategory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { items, addToCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  // Filter by category (already done partially by server, but we do search filtering here)
  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    
    let message = "Hello Nihad, I'd like to purchase from your store:\n\n";
    items.forEach(item => {
      // Create a direct link to the product for the preview
      const productUrl = `${window.location.origin}/shop?product=${item.id}`;
      message += `• ${item.quantity}x ${item.title} (${item.price})\nLink: ${productUrl}\n\n`;
    });
    message += `*Total: $${getTotalPrice().toLocaleString()}*\n\nPlease let me know the next steps!`;
    
    const whatsappUrl = `https://wa.me/919846750898?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.shopContainer}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={20} /> Home
          </Link>
          <div className={styles.brandArea}>
            <span className={styles.brandLogo}>NKP</span>
            <span className={styles.brandText}>Store</span>
          </div>
          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.cartButton} onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {getTotalItems() > 0 && <span className={styles.cartCount}>{getTotalItems()}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className={styles.storeHero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Digital & Physical Goods</h1>
          <p className={styles.heroSubtitle}>Premium assets, custom PC builds, and exclusive devices directly from my workspace to yours.</p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          
          <div className={styles.storeLayout}>
            <aside className={styles.sidebar}>
              <div className={styles.filterGroup}>
                <h3>Categories</h3>
                <ul>
                  <li className={currentCategory === 'all' ? styles.activeFilter : ''}>
                    <Link href="/shop">All Products</Link>
                  </li>
                  <li className={currentCategory === 'physical' ? styles.activeFilter : ''}>
                    <Link href="/shop?category=physical">Physical</Link>
                  </li>
                  <li className={currentCategory === 'digital' ? styles.activeFilter : ''}>
                    <Link href="/shop?category=digital">Digital Assets</Link>
                  </li>
                  <li className={currentCategory === 'services' ? styles.activeFilter : ''}>
                    <Link href="/shop?category=services">Services</Link>
                  </li>
                </ul>
              </div>
            </aside>
            
            <div className={styles.productGridArea}>
              <div className={styles.gridHeader}>
                <span>Showing {filteredProducts.length} products</span>
              </div>
              
              <div className={styles.grid}>
                {filteredProducts.length === 0 ? (
                  <div className={styles.noResults}>No products found for "{searchQuery}".</div>
                ) : (
                  filteredProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.imagePlaceholder} style={product.image ? { backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        <span className={styles.categoryBadge}>{product.category}</span>
                        {!product.image && <div className={styles.imageIcon}>📸</div>}
                      </div>
                      <div className={styles.productInfo}>
                        <h2 className={styles.productTitle}>{product.title}</h2>
                        <p className={styles.productDesc}>{product.description}</p>
                        <div className={styles.priceRow}>
                          <span className={styles.price}>{product.price}</span>
                          <button 
                            className={styles.addToCartBtn}
                            onClick={() => {
                              addToCart(product);
                              setIsCartOpen(true);
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartDrawer} onClick={e => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <h2>Your Cart</h2>
              <button className={styles.closeCartBtn} onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.cartItems}>
              {items.length === 0 ? (
                <div className={styles.emptyCart}>Your cart is empty</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemDetails}>
                      <h4>{item.title}</h4>
                      <p>{item.price}</p>
                    </div>
                    <div className={styles.cartItemActions}>
                      <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <button className={styles.removeItemBtn} onClick={() => removeFromCart(item.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  <span>Total</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleWhatsAppCheckout}>
                  <Send size={18} /> Checkout via WhatsApp
                </button>
                <p className={styles.checkoutNotice}>
                  Clicking checkout will redirect you to WhatsApp to complete your order directly with Nihad.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
