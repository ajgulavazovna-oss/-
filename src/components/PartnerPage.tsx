import React, { useState, useEffect } from 'react';
import { MenuItem, PromoCard } from '../types';
import { useAdminData } from '../contexts/AdminDataContext';
import { PromoScroll } from './PromoScroll';
import { MenuItemRow } from './MenuItemRow';
import { PromoStoryViewer } from './PromoStoryViewer';
import { LogoIcon } from './LogoIcon';
import { isOpenNow, formatWorkHours } from '../utils/workHours';

import { CartItem } from '../types';

interface PartnerPageProps {
  partnerId: string;
  onAdd: (item: MenuItem) => void;
  onItemClick: (item: MenuItem) => void;
  onReady?: () => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string, qty: number) => void;
}

const noSelect: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
} as React.CSSProperties;

export function PartnerPage({ partnerId, onAdd, onItemClick, onReady, cartItems = [], onUpdateQuantity }: PartnerPageProps) {
  const { partners, products, sponsors } = useAdminData();
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  const partner = partners.find(p => p.id === partnerId);

  const partnerProducts: MenuItem[] = products
    .filter(p => p.partnerId === partnerId && p.available !== false)
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

  const promoCards: PromoCard[] = sponsors
    .filter(s => s.active && s.placement === 'partner_promo' && s.partnerId === partnerId)
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

  useEffect(() => {
    const t = setTimeout(() => onReady?.(), 400);
    return () => clearTimeout(t);
  }, [onReady]);

  if (!partner) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1e', fontFamily: "'Manrope',sans-serif" }}>
          Ресторан не найден
        </p>
      </div>
    );
  }

  const avgPrice = partnerProducts.length > 0
    ? partnerProducts.reduce((s, p) => s + p.price, 0) / partnerProducts.length
    : 0;

  const priceLevel = avgPrice === 0 ? '$' : avgPrice < 500 ? '$' : avgPrice < 1000 ? '$$' : '$$$';

  const openStatus = isOpenNow(partner.workOpen, partner.workClose);
  const workLabel = formatWorkHours(partner.workOpen, partner.workClose);

  return (
    <div style={{ background: '#f2f2f7', minHeight: '100vh', ...noSelect }}>

      {/* ── Partner promo banners ── */}
      {promoCards.length > 0 && (
        <div style={{ background: '#fff', paddingTop: 8, paddingLeft: 8 }}>
          <PromoScroll
            cards={promoCards}
            onCardClick={(index) => setStoryIndex(index)}
          />
        </div>
      )}

      {/* ── Hero banner ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 200,
        background: '#1c1c1e',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {partner.banner ? (
          <img
            src={partner.banner}
            alt={partner.name}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #FF5A00 0%, #FF8C00 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogoIcon color="rgba(255,255,255,0.18)" height={110} />
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.72) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 18, left: 16, right: 16 }}>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 900, color: '#fff',
            fontFamily: "'Manrope',sans-serif",
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight: 1.1,
          }}>
            {partner.name}
          </h1>
          <p style={{
            margin: '5px 0 0', fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
            fontFamily: "'Manrope',sans-serif",
          }}>
            {partner.type}
          </p>
        </div>
      </div>

      {/* ── Partner info card ── */}
      <div style={{
        background: '#fff',
        padding: '14px 16px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        borderBottom: '1px solid #f2f2f7',
      }}>
        {/* Logo */}
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: partner.logo ? 'transparent' : '#FF5A00',
          overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          marginTop: -30,
          position: 'relative', zIndex: 2,
        }}>
          {partner.logo ? (
            <img src={partner.logo} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <LogoIcon color="#fff" height={30} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 17, fontWeight: 800, color: '#1c1c1e',
            fontFamily: "'Manrope',sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {partner.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#1c1c1e', fontFamily: "'Manrope',sans-serif", fontWeight: 600 }}>
              <span style={{ color: '#FF8C00' }}>★</span> 4.8
            </span>
            <span style={{ fontSize: 12, color: '#C7C7CC' }}>•</span>
            <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Manrope',sans-serif" }}>30–45 мин</span>
            <span style={{ fontSize: 12, color: '#C7C7CC' }}>•</span>
            <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Manrope',sans-serif" }}>{priceLevel}</span>
          </div>
          {partner.address && (
            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#AEAEB2', fontFamily: "'Manrope',sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              📍 {partner.address}
            </p>
          )}
        </div>

        {/* Open/Closed badge */}
        {openStatus !== null && (
          <div style={{
            flexShrink: 0,
            background: openStatus ? '#EDFAF1' : '#FEF2F2', borderRadius: 20,
            padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: openStatus ? '#34C759' : '#FF3B30' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: openStatus ? '#34C759' : '#FF3B30', fontFamily: "'Manrope',sans-serif" }}>
              {openStatus ? 'Открыто' : 'Закрыто'}
            </span>
          </div>
        )}
        {openStatus !== null && workLabel && (
          <div style={{
            flexShrink: 0,
            fontSize: 11, color: '#AEAEB2',
            fontFamily: "'Manrope',sans-serif", fontWeight: 600,
          }}>
            {workLabel}
          </div>
        )}
      </div>

      {/* ── Menu ── */}
      {partnerProducts.length > 0 ? (
        <div style={{ background: '#fff', marginTop: 8 }}>
          <div style={{ padding: '18px 16px 6px' }}>
            <h2 style={{
              margin: 0, fontSize: 20, fontWeight: 900, color: '#1c1c1e',
              fontFamily: "'Manrope',sans-serif",
            }}>
              Меню
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8E8E93', fontFamily: "'Manrope',sans-serif" }}>
              {partnerProducts.length} {partnerProducts.length === 1 ? 'позиция' : partnerProducts.length < 5 ? 'позиции' : 'позиций'}
            </p>
          </div>
          {partnerProducts.map((item, i) => {
            const cartQty = cartItems.find(c => c.item.id === item.id)?.quantity ?? 0;
            return (
              <div
                key={item.id}
                style={{ borderTop: i === 0 ? 'none' : '1px solid #f2f2f7' }}
              >
                <MenuItemRow
                  item={item}
                  onAdd={() => onItemClick(item)}
                  cartQuantity={cartQty}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          background: '#fff', marginTop: 8,
          padding: '48px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1c1c1e', fontFamily: "'Manrope',sans-serif", marginBottom: 8 }}>
            Меню скоро появится
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#8E8E93', fontFamily: "'Manrope',sans-serif" }}>
            Ресторан добавит блюда в ближайшее время
          </p>
        </div>
      )}

      <div style={{ height: 40 }} />

      {/* ── Story viewer for partner promos ── */}
      {storyIndex !== null && promoCards.length > 0 && (
        <PromoStoryViewer
          cards={promoCards}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
          onCtaClick={(productId, _partnerId) => {
            setStoryIndex(null);
            if (productId) {
              const adminProduct = products.find(p => p.id === productId);
              if (adminProduct) {
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
                setTimeout(() => onItemClick(menuItem), 300);
              }
            }
          }}
        />
      )}
    </div>
  );
}
