import React, { useState } from 'react';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { BurgerMenu } from './components/BurgerMenu';
import { PromoStoryViewer } from './components/PromoStoryViewer';
import { SplashScreen } from './components/SplashScreen';
import { FloatingCart } from './components/FloatingCart';
import { PageSkeleton, FooterSkeleton } from './components/SkeletonLoader';
import { AddressMapModal } from './components/AddressMapModal';
import { HomePage } from './components/HomePage';
import { FoodPage } from './components/FoodPage';
import { PartnerPage } from './components/PartnerPage';
import { AllRestaurantsPage } from './components/AllRestaurantsPage';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminDataProvider } from './contexts/AdminDataContext';
import { MenuItem, CartItem } from './types';
import { useAdminData } from './contexts/AdminDataContext';

function AppInner() {
  const { sponsors, products } = useAdminData();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageReady, setIsPageReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'food' | 'partner' | 'all-restaurants'>('home');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [editCartItem, setEditCartItem] = useState<CartItem | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [cityLabel, setCityLabel] = useState('Ж. Раимбекова 14');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleSplashDone = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setShowSplash(false);
    setIsLoading(false);
  };

  const handlePageReady = () => setIsPageReady(true);

  const handleCategoryClick = (id: string) => {
    if (id === 'food') {
      setIsPageReady(false);
      setCurrentPage('food');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePartnerClick = (partnerId: string) => {
    setIsPageReady(false);
    setSelectedPartnerId(partnerId);
    setCurrentPage('partner');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBack = () => {
    setIsPageReady(false);
    if (currentPage === 'partner' && selectedPartnerId) {
      setCurrentPage('all-restaurants');
      setSelectedPartnerId(null);
    } else {
      setCurrentPage('home');
      setSelectedPartnerId(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewAll = () => {
    setIsPageReady(false);
    setCurrentPage('all-restaurants');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const addToCart = (item: MenuItem, opts?: { selectedSize: number; selectedDough: number; removedIngredients: string[] }) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.item.id === item.id);
      if (ex) {
        return prev.map(i => i.item.id === item.id ? {
          ...i,
          quantity: i.quantity + 1,
          selectedSize: opts?.selectedSize ?? i.selectedSize,
          selectedDough: opts?.selectedDough ?? i.selectedDough,
          removedIngredients: opts?.removedIngredients ?? i.removedIngredients,
        } : i);
      }
      return [...prev, {
        item,
        quantity: 1,
        selectedSize: opts?.selectedSize,
        selectedDough: opts?.selectedDough,
        removedIngredients: opts?.removedIngredients,
      }];
    });
  };

  const updateCartItemOpts = (itemId: string, opts: { selectedSize: number; selectedDough: number; removedIngredients: string[] }) => {
    setCartItems(prev => prev.map(i => i.item.id === itemId ? {
      ...i,
      selectedSize: opts.selectedSize,
      selectedDough: opts.selectedDough,
      removedIngredients: opts.removedIngredients,
    } : i));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) setCartItems(prev => prev.filter(i => i.item.id !== id));
    else setCartItems(prev => prev.map(i => i.item.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const cartTotal = cartItems.reduce((a, i) => a + i.item.price * i.quantity, 0);

  const openMap = () => {
    setIsMenuOpen(false);
    setTimeout(() => setIsMapOpen(true), 360);
  };

  const promoCardsForViewer = sponsors
    .filter(s => s.active && s.placement === 'promo')
    .map(s => ({
      id: s.id,
      title: s.name,
      subtitle: s.subtitle,
      description: s.description,
      cta: s.cta,
      image: s.image || '/food.avif',
      bgColor: s.bgColor || '#FF5A00',
      productId: s.productId,
      partnerId: s.partnerId,
      videoUrl: s.videoUrl,
    }));

  const handlePromoCtaClick = (productId?: string, partnerId?: string) => {
    setStoryIndex(null);
    if (productId) {
      const adminProduct = products.find(p => p.id === productId);
      if (!adminProduct) return;
      const menuItem: MenuItem = {
        id: adminProduct.id,
        name: adminProduct.name,
        description: adminProduct.description,
        price: adminProduct.price,
        image: adminProduct.image,
        category: adminProduct.category,
        badge: adminProduct.badge,
        badgeColor: adminProduct.badgeColor,
        isNew: adminProduct.isNew,
        isHit: adminProduct.isHit,
        variants: adminProduct.variants,
        doughOptions: adminProduct.doughOptions,
        ingredients: adminProduct.ingredients,
        partnerId: adminProduct.partnerId,
      };
      setTimeout(() => {
        setEditCartItem(null);
        setSelectedItem(menuItem);
      }, 300);
    } else if (partnerId) {
      setTimeout(() => {
        handlePartnerClick(partnerId);
      }, 300);
    }
  };

  const handleCartItemClick = (cartItem: CartItem) => {
    setIsCartOpen(false);
    setTimeout(() => {
      setEditCartItem(cartItem);
      setSelectedItem(cartItem.item);
    }, 120);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setEditCartItem(null);
  };

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'clip', width: '100%' }}>

        <Header
          onMenuClick={() => setIsMenuOpen(true)}
          cartCount={cartCount}
          address={cityLabel}
          onAddressClick={() => setIsMapOpen(true)}
          onBack={(currentPage === 'food' || currentPage === 'partner' || currentPage === 'all-restaurants') ? handleBack : undefined}
        />

        {isLoading ? (
          <PageSkeleton />
        ) : currentPage === 'food' ? (
          <FoodPage
            onAdd={addToCart}
            onItemClick={(item) => { setEditCartItem(null); setSelectedItem(item); }}
            onStoryClick={(index) => setStoryIndex(index)}
            onReady={handlePageReady}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
          />
        ) : currentPage === 'partner' && selectedPartnerId ? (
          <PartnerPage
            partnerId={selectedPartnerId}
            onAdd={addToCart}
            onItemClick={(item) => { setEditCartItem(null); setSelectedItem(item); }}
            onReady={handlePageReady}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
          />
        ) : currentPage === 'all-restaurants' ? (
          <AllRestaurantsPage
            onPartnerClick={handlePartnerClick}
            onReady={handlePageReady}
          />
        ) : (
          <HomePage
            onAddressClick={() => setIsMapOpen(true)}
            onCategoryClick={handleCategoryClick}
            onReady={handlePageReady}
            onPartnerClick={handlePartnerClick}
            onViewAll={handleViewAll}
          />
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          onItemClick={handleCartItemClick}
          onAddSuggestion={(item) => addToCart(item)}
        />

        <ProductModal
          item={selectedItem}
          onClose={handleModalClose}
          onAdd={(item, opts) => addToCart(item, opts)}
          editCartItem={editCartItem}
          onUpdate={editCartItem ? (opts) => updateCartItemOpts(editCartItem.item.id, opts) : undefined}
        />

        <BurgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          cityLabel={cityLabel}
          onCityClick={openMap}
        />

        {isMapOpen && (
          <AddressMapModal
            onClose={() => setIsMapOpen(false)}
            onSelectAddress={(addr) => {
              setCityLabel(addr);
              setIsMapOpen(false);
            }}
          />
        )}

        {storyIndex !== null && (
          <PromoStoryViewer
            cards={promoCardsForViewer}
            startIndex={storyIndex}
            onClose={() => setStoryIndex(null)}
            onCtaClick={handlePromoCtaClick}
          />
        )}

        {!isCartOpen && !selectedItem && cartCount > 0 && (
          <FloatingCart total={cartTotal} onClick={() => setIsCartOpen(true)} />
        )}

        {!isLoading && (
          isPageReady
            ? <Footer onAdminClick={() => setIsAdminOpen(true)} />
            : <FooterSkeleton />
        )}
      </div>

      {isAdminOpen && (
        <AdminPanel onClose={() => setIsAdminOpen(false)} />
      )}
    </>
  );
}

function App() {
  return (
    <AdminDataProvider>
      <AppInner />
    </AdminDataProvider>
  );
}

export default App;
