import React from 'react';
import { MenuItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FrequentItemsProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export function FrequentItems({ items, onAdd }: FrequentItemsProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h2
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: '24px',
          fontWeight: 800,
          color: '#1c1c1e',
          letterSpacing: '-0.4px',
          lineHeight: '30px',
          padding: '0 16px',
          marginBottom: '16px',
        }}
      >
        {t.frequentlyOrdered}
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          paddingTop: '6px',
          paddingBottom: '10px',
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />

        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAdd(item)}
            aria-label={item.name}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              width: '252px',
              height: '90px',
              background: '#ffffff',
              borderRadius: '22px',
              border: 'none',
              boxShadow: '0 2px 14px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              cursor: 'pointer',
              outline: 'none',
              WebkitAppearance: 'none',
              padding: '0 14px 0 8px',
              textAlign: 'left',
              fontFamily: "'Manrope', sans-serif",
              gap: '12px',
            }}
          >
            <div style={{ flexShrink: 0, width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={item.image} alt={item.name}
                style={{ width: '74px', height: '74px', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '15px', fontWeight: 700, color: '#1c1c1e',
                lineHeight: '20px', letterSpacing: '-0.2px',
                margin: '0 0 3px 0',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {item.name}
              </p>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px', fontWeight: 500, color: '#8E8E93',
                lineHeight: '17px', margin: 0, whiteSpace: 'nowrap',
              }}>
                {t.from} {item.price} с
              </p>
            </div>
          </button>
        ))}

        <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />
      </div>
    </div>
  );
}
