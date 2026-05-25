import React, { useState, useEffect } from 'react';
import { HomePageSkeleton } from './SkeletonLoader';
import { PopularRestaurants } from './PopularRestaurants';

interface HomePageProps {
  onAddressClick: () => void;
  onCategoryClick?: (id: string) => void;
  onReady?: () => void;
  onPartnerClick?: (partnerId: string) => void;
  onViewAll?: () => void;
}

interface CardProps {
  image: string;
  label: string;
  sublabel?: string;
  dimmed?: boolean;
  badge?: string;
  pillBadge?: string;
  banner?: boolean;
  onClick?: () => void;
}

function PillBadge({ text }: { text: string }) {
  return (
    <div style={{ position: 'absolute', top: '-2px', left: '-4px', transform: 'rotate(-4deg)', zIndex: 3, display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ backgroundColor: '#3730A3', borderRadius: '100px', padding: '6px 14px', fontSize: '13px', fontWeight: 900, color: 'transparent', whiteSpace: 'nowrap', lineHeight: '20px', userSelect: 'none', letterSpacing: '-0.2px', fontFamily: "'Manrope', sans-serif" }}>{text}</div>
      <div style={{ position: 'relative', backgroundColor: '#6366F1', borderRadius: '100px', padding: '6px 14px', fontSize: '13px', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', lineHeight: '20px', overflow: 'hidden', marginTop: '-36px', letterSpacing: '-0.2px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ position: 'absolute', top: '4px', left: '6px', right: '6px', height: '42%', background: 'rgba(255,255,255,0.28)', borderRadius: '100px 100px 70px 70px', pointerEvents: 'none' }} />
        {text}
      </div>
    </div>
  );
}

const noSelectStyle: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
} as React.CSSProperties;

function CategoryCard({ image, label, sublabel, dimmed, badge, pillBadge, banner, onClick }: CardProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={dimmed ? undefined : onClick}
      onMouseDown={() => !dimmed && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => !dimmed && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: dimmed ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        opacity: dimmed ? 0.45 : 1,
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        transition: pressed ? 'transform 0.25s cubic-bezier(0.4,0,0.6,1), filter 0.25s ease' : 'transform 0.4s cubic-bezier(0.34,1.3,0.64,1), filter 0.4s ease',
        filter: pressed ? 'brightness(0.94)' : 'brightness(1)',
        ...noSelectStyle,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '110px' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: '#ececec', borderRadius: '22px' }} />
        {badge && <div style={{ position: 'absolute', top: '6px', right: '8px', background: '#FF5A00', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px', zIndex: 3, fontFamily: "'Manrope', sans-serif" }}>{badge}</div>}
        {pillBadge && <PillBadge text={pillBadge} />}
        {banner ? (
          <img src={image} alt={label} draggable={false} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '92px', objectFit: 'cover', borderRadius: '22px', zIndex: 2, pointerEvents: 'none' }} />
        ) : (
          <img src={image} alt={label} draggable={false} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '115px', width: 'auto', objectFit: 'contain', zIndex: 2, pointerEvents: 'none' }} />
        )}
      </div>
      <div style={{ marginTop: '8px', textAlign: 'center', ...noSelectStyle }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#111', fontFamily: "'Manrope', sans-serif" }}>{label}</span>
        {sublabel && <span style={{ fontSize: '13px', fontWeight: 400, color: '#999', fontFamily: "'Manrope', sans-serif" }}> • {sublabel}</span>}
      </div>
    </div>
  );
}

function CourierBanner() {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      style={{
        width: '100%', borderRadius: '22px', overflow: 'hidden',
        height: '140px', cursor: 'pointer', flexShrink: 0,
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        filter: pressed ? 'brightness(0.94)' : 'brightness(1)',
        transition: pressed ? 'transform 0.2s cubic-bezier(0.4,0,0.6,1)' : 'transform 0.35s cubic-bezier(0.34,1.3,0.64,1)',
        WebkitTapHighlightColor: 'transparent',
        ...noSelectStyle,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <img
        src="/courier-card.png"
        alt="Стать курьером"
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          objectPosition: 'right center',
          display: 'block', pointerEvents: 'none',
          ...noSelectStyle,
        }}
      />
    </div>
  );
}

export function HomePage({ onAddressClick, onCategoryClick, onReady, onPartnerClick, onViewAll }: HomePageProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      onReady?.();
    }, 900);
    return () => clearTimeout(t);
  }, [onReady]);

  if (loading) return <HomePageSkeleton />;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', ...noSelectStyle }}>
      <div className="homepage-inner">
        <div className="home-category-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <CategoryCard image="/food-card.png" label="Еда" onClick={() => onCategoryClick?.('food')} />
          <CategoryCard image="/delivery-card.png" label="Доставка" onClick={() => onCategoryClick?.('delivery')} />
          <CategoryCard image="/taxi-card.png" label="Такси" dimmed pillBadge="Скоро 🚖" />
          <CategoryCard image="/services-card.png" label="Услуги" banner pillBadge="New" onClick={() => onCategoryClick?.('services')} />
        </div>
        <PopularRestaurants onPartnerClick={onPartnerClick} onViewAll={onViewAll} />
      </div>
    </div>
  );
}
