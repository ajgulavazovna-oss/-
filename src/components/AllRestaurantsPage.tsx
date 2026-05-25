import React, { useState } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';
import { LogoIcon } from './LogoIcon';
import { isOpenNow, formatWorkHours } from '../utils/workHours';

interface AllRestaurantsPageProps {
  onPartnerClick?: (partnerId: string) => void;
  onReady?: () => void;
}

const noSelect: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
} as React.CSSProperties;

function PartnerCard({ partner, products, onPress }: {
  partner: any;
  products: any[];
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const partnerProducts = products.filter(p => p.partnerId === partner.id);
  const avgPrice = partnerProducts.length > 0
    ? partnerProducts.reduce((s: number, p: any) => s + p.price, 0) / partnerProducts.length
    : 0;
  const priceLevel = avgPrice === 0 ? '$' : avgPrice < 500 ? '$' : avgPrice < 1000 ? '$$' : '$$$';

  const openStatus = isOpenNow(partner.workOpen, partner.workClose);
  const workLabel = formatWorkHours(partner.workOpen, partner.workClose);

  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onPress}
      style={{
        background: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: pressed
          ? 'transform 0.15s cubic-bezier(0.4,0,0.6,1)'
          : 'transform 0.35s cubic-bezier(0.34,1.3,0.64,1)',
        WebkitTapHighlightColor: 'transparent',
        ...noSelect,
      }}
    >
      {/* Banner */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '65%', background: '#1c1c1e' }}>
        {partner.banner ? (
          <img
            src={partner.banner}
            alt={partner.name}
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        ) : partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #FF5A00 0%, #FF8C00 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogoIcon color="rgba(255,255,255,0.25)" height={50} />
          </div>
        )}
        {/* Open/Closed badge */}
        {openStatus !== null && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)',
            borderRadius: '20px', padding: '4px 9px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: openStatus ? '#34C759' : '#FF3B30', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'Manrope', sans-serif" }}>
              {openStatus ? 'Открыто' : 'Закрыто'}
            </span>
          </div>
        )}
      </div>

      {/* Info — clean, no overlapping logo */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{
          margin: '0 0 5px', fontSize: 14, fontWeight: 800, color: '#1c1c1e',
          fontFamily: "'Manrope', sans-serif",
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {partner.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
          <span style={{ color: '#FF8C00', fontSize: 12 }}>★</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1c1c1e', fontFamily: "'Manrope', sans-serif" }}>4.8</span>
          <span style={{ fontSize: 12, color: '#C7C7CC' }}>·</span>
          <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Manrope', sans-serif" }}>25–45 мин</span>
          <span style={{ fontSize: 12, color: '#C7C7CC' }}>·</span>
          <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Manrope', sans-serif" }}>{priceLevel}</span>
        </div>
        {partner.type && (
          <p style={{ margin: 0, fontSize: 11, color: '#AEAEB2', fontFamily: "'Manrope', sans-serif" }}>
            {partner.type}
          </p>
        )}
      </div>
    </div>
  );
}

export function AllRestaurantsPage({ onPartnerClick, onReady }: AllRestaurantsPageProps) {
  const { partners, products } = useAdminData();

  React.useEffect(() => {
    const t = setTimeout(() => onReady?.(), 300);
    return () => clearTimeout(t);
  }, [onReady]);

  const activePartners = partners.filter(p => p.status === 'active');

  return (
    <div style={{ background: '#f2f2f7', minHeight: '100vh', ...noSelect }}>

      {/* Hero header */}
      <div style={{
        background: '#fff',
        padding: '20px 16px 0',
      }}>
        <h1 style={{
          margin: '0 0 4px',
          fontSize: 28,
          fontWeight: 900,
          color: '#1c1c1e',
          fontFamily: "'Manrope', sans-serif",
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          Все рестораны
        </h1>
        <p style={{
          margin: '0 0 16px',
          fontSize: 14,
          fontWeight: 500,
          color: '#8E8E93',
          fontFamily: "'Manrope', sans-serif",
        }}>
          {activePartners.length > 0
            ? `${activePartners.length} ${activePartners.length === 1 ? 'ресторан' : activePartners.length < 5 ? 'ресторана' : 'ресторанов'} рядом с вами`
            : 'Скоро здесь появятся рестораны'}
        </p>

        {/* Orange accent line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #FF5A00, #FF8C00)', borderRadius: 3, marginBottom: 0 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 32px' }}>
        {activePartners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,90,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <LogoIcon color="#FF5A00" height={36} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1c1c1e', fontFamily: "'Manrope', sans-serif", margin: '0 0 8px' }}>
              Рестораны скоро появятся
            </p>
            <p style={{ fontSize: 14, color: '#8E8E93', fontFamily: "'Manrope', sans-serif", margin: 0 }}>
              Мы активно расширяем сеть партнёров
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {activePartners.map(partner => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                products={products}
                onPress={() => onPartnerClick?.(partner.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
