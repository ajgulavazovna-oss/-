import React, { useState } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

interface PopularRestaurantsProps {
  onPartnerClick?: (partnerId: string) => void;
  onViewAll?: () => void;
}

const STATIC_RESTAURANTS = [
  { id: 's1', name: 'Burger House', brandName: 'BURGER\nHOUSE', rating: 4.8, timeMin: 30, timeMax: 40, priceLevel: '$$', image: '/burger-new.jpeg' },
  { id: 's2', name: 'Pizza Mia',    brandName: 'PIZZA\nMIA',    rating: 4.7, timeMin: 25, timeMax: 35, priceLevel: '$$', image: '/food.avif' },
  { id: 's3', name: 'Sushi Time',   brandName: 'SUSHI\nTIME',   rating: 4.9, timeMin: 30, timeMax: 45, priceLevel: '$$$', image: '/sushi.jpeg' },
  { id: 's4', name: 'Coffee Day',   brandName: 'COFFEE\nDAY',   rating: 4.6, timeMin: 20, timeMax: 30, priceLevel: '$',   image: '/food-card.png' },
];

const noSelectStyle: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
} as React.CSSProperties;

interface CardData {
  id: string;
  name: string;
  brandName: string;
  rating: number;
  timeMin: number;
  timeMax: number;
  priceLevel: string;
  image: string;
  partnerId?: string;
}

function RestaurantCard({ card, onPress }: { card: CardData; onPress?: () => void }) {
  const [pressed, setPressed] = useState(false);
  const lines = card.brandName.split('\n');

  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onPress}
      style={{
        width: 'calc(25% - 6px)',
        minWidth: 'calc(25% - 6px)',
        maxWidth: 'calc(25% - 6px)',
        flexShrink: 0,
        flexGrow: 0,
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        cursor: onPress ? 'pointer' : 'default',
        transform: pressed ? 'scale(0.94)' : 'scale(1)',
        transition: pressed
          ? 'transform 0.18s cubic-bezier(0.4,0,0.6,1)'
          : 'transform 0.35s cubic-bezier(0.34,1.3,0.64,1)',
        WebkitTapHighlightColor: 'transparent',
        ...noSelectStyle,
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        <img
          src={card.image}
          alt={card.name}
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.22) 100%)',
        }} />
      </div>

      <div style={{ padding: '7px 7px 9px 7px' }}>
        <div style={{
          fontSize: '12px', fontWeight: 700, color: '#111',
          fontFamily: "'Manrope', sans-serif",
          marginBottom: '4px', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {card.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: "'Manrope', sans-serif", marginBottom: '2px' }}>
          <span style={{ color: '#FF8C00', fontSize: '11px' }}>★</span>
          <span style={{ fontWeight: 600, color: '#111' }}>{card.rating.toFixed(1)}</span>
        </div>
        <div style={{ fontSize: '10px', color: '#888', fontFamily: "'Manrope', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {card.timeMin}–{card.timeMax} мин • {card.priceLevel}
        </div>
      </div>
    </div>
  );
}

export function PopularRestaurants({ onPartnerClick, onViewAll }: PopularRestaurantsProps) {
  const { partners, products } = useAdminData();

  const activePartners = partners.filter(p => p.status === 'active');

  const cards: CardData[] = activePartners.length > 0
    ? activePartners.map(p => {
        const partnerProducts = products.filter(x => x.partnerId === p.id);
        const avgPrice = partnerProducts.length > 0
          ? partnerProducts.reduce((s, x) => s + x.price, 0) / partnerProducts.length
          : 0;
        const priceLevel = avgPrice === 0 ? '$' : avgPrice < 500 ? '$' : avgPrice < 1000 ? '$$' : '$$$';
        const words = p.name.toUpperCase().split(' ');
        const brandName = words.length >= 2
          ? `${words[0]}\n${words.slice(1).join(' ')}`
          : p.name.toUpperCase();
        return {
          id: p.id,
          partnerId: p.id,
          name: p.name,
          brandName,
          rating: 4.8,
          timeMin: 25,
          timeMax: 45,
          priceLevel,
          image: p.banner || p.logo || '/food-card.png',
        };
      })
    : STATIC_RESTAURANTS;

  return (
    <div style={{ marginTop: '28px', ...noSelectStyle }}>
      <style>{`.popular-restaurants-scroll::-webkit-scrollbar { display: none; }`}</style>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '14px',
      }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#111', fontFamily: "'Manrope', sans-serif" }}>
          Популярные рестораны
        </span>
        <button
          onClick={onViewAll}
          style={{
            fontSize: '14px', fontWeight: 600, color: '#FF5A00',
            fontFamily: "'Manrope', sans-serif",
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px',
            whiteSpace: 'nowrap', background: 'none', border: 'none', padding: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Смотреть все <span style={{ fontSize: '16px', marginTop: '-1px' }}>›</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {cards.map(card => (
          <RestaurantCard
            key={card.id}
            card={card}
            onPress={card.partnerId ? () => onPartnerClick?.(card.partnerId!) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
