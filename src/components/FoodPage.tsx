import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, PromoCard } from '../types';
import { PromoScroll } from './PromoScroll';
import { FrequentItems } from './FrequentItems';
import { CategoryTabs } from './CategoryTabs';
import { MenuSection } from './MenuSection';
import { PageSkeleton } from './SkeletonLoader';
import { LogoIcon } from './LogoIcon';
import { useAdminData } from '../contexts/AdminDataContext';

import { CartItem } from '../types';

interface FoodPageProps {
  onAdd: (item: MenuItem) => void;
  onItemClick: (item: MenuItem) => void;
  onStoryClick: (index: number) => void;
  onReady?: () => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string, qty: number) => void;
}

export function FoodPage({ onAdd, onItemClick, onStoryClick, onReady, cartItems = [], onUpdateQuantity }: FoodPageProps) {
  const { products, sponsors, categories: adminCategories } = useAdminData();
  const [loading, setLoading] = useState(true);

  const activeCategories = [...adminCategories]
    .filter(c => c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [activeCategory, setActiveCategory] = useState(activeCategories[0]?.id ?? '');
  const [isPinned, setIsPinned] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingToSection = useRef(false);
  const tabsNaturalTop = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      onReady?.();
    }, 1500);
    return () => clearTimeout(t);
  }, [onReady]);

  useEffect(() => {
    if (loading) return;
    if (tabsRef.current) {
      tabsNaturalTop.current = tabsRef.current.offsetTop;
    }
  }, [loading]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const el = sectionRefs.current[id];
    if (el && tabsRef.current) {
      isScrollingToSection.current = true;
      const tabsHeight = tabsRef.current.getBoundingClientRect().height;
      const top = el.getBoundingClientRect().top + window.scrollY - tabsHeight - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => { isScrollingToSection.current = false; }, 800);
    }
  };

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      const pinned = window.scrollY + 80 >= tabsNaturalTop.current;
      setIsPinned(pinned);
      if (isScrollingToSection.current) return;
      if (!tabsRef.current) return;
      const tabsBottom = tabsRef.current.getBoundingClientRect().bottom + 8;
      let current = activeCategories[0]?.id ?? '';
      for (const cat of activeCategories) {
        const el = sectionRefs.current[cat.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= tabsBottom) current = cat.id;
      }
      setActiveCategory(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, activeCategories]);

  const availableItems: MenuItem[] = products
    .filter(p => p.available !== false)
    .map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      badge: p.badge,
      badgeColor: p.badgeColor,
      isNew: p.isNew,
      isHit: p.isHit,
      variants: p.variants,
      doughOptions: p.doughOptions,
      ingredients: p.ingredients,
      partnerId: p.partnerId,
    }));

  const frequentItems: MenuItem[] = availableItems
    .filter(item => {
      const ap = products.find(p => p.id === item.id);
      return ap?.popular;
    })
    .slice(0, 6);

  const promoCards: PromoCard[] = sponsors
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
      videoUrl: s.videoUrl,
    }));

  const groupedItems = activeCategories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat.id] = availableItems.filter(item => item.category === cat.id);
    return acc;
  }, {});

  const visibleCategories = activeCategories.filter(cat => (groupedItems[cat.id]?.length ?? 0) > 0);

  if (loading) return <PageSkeleton />;

  return (
    <div style={{ background: '#f2f2f7', minHeight: '100vh' }}>
      {promoCards.length > 0 && (
        <div style={{ background: '#fff', paddingTop: 8 }}>
          <PromoScroll cards={promoCards} onCardClick={onStoryClick} />
        </div>
      )}

      {frequentItems.length > 0 && (
        <div style={{ background: '#fff', marginTop: 8, paddingTop: 16, paddingBottom: 8 }}>
          <FrequentItems items={frequentItems} onAdd={onItemClick} />
        </div>
      )}

      <div
        ref={tabsRef}
        style={{ position: 'sticky', top: 80, zIndex: 10, borderBottom: '1px solid #f2f2f7', background: '#fff', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
      >
        {isPinned && (
          <div key="logo" className="logo-slide-in" style={{ flexShrink: 0, paddingLeft: 12, display: 'flex', alignItems: 'center' }}>
            <LogoIcon color="#FF5A00" height={26} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <CategoryTabs categories={visibleCategories} active={activeCategory} onSelect={handleCategorySelect} />
        </div>
      </div>

      {visibleCategories.map(cat => {
        const items = groupedItems[cat.id];
        if (!items || items.length === 0) return null;
        return (
          <div key={cat.id} ref={el => { sectionRefs.current[cat.id] = el; }}>
            <MenuSection
            category={cat}
            items={items}
            onAdd={onItemClick}
            cartItems={cartItems}
            onUpdateQuantity={onUpdateQuantity}
          />
          </div>
        );
      })}

      {visibleCategories.length === 0 && (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1e', fontFamily: "'Manrope',sans-serif", marginBottom: 8 }}>Меню пусто</p>
          <p style={{ fontSize: 14, color: '#8E8E93', fontFamily: "'Manrope',sans-serif" }}>Добавьте блюда в панели управления</p>
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
}
