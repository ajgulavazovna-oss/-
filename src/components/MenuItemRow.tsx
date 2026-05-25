import React from 'react';
import { MenuItem } from '../types';

interface MenuItemRowProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (id: string, qty: number) => void;
}

const badgeThemes: Record<string, { bg: string; shadow: string }> = {
  blue:   { bg: '#5C63D8', shadow: '#2E34A8' },
  orange: { bg: '#FF5A00', shadow: '#A03200' },
  pink:   { bg: '#E8295E', shadow: '#8C0E34' },
  green:  { bg: '#2EB84B', shadow: '#0E6B27' },
};

function MarketingBadge({ text, color }: { text: string; color: string }) {
  const theme = badgeThemes[color] ?? badgeThemes.blue;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '-2px',
        left: '-4px',
        transform: 'rotate(-6deg)',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <div
        style={{
          backgroundColor: theme.shadow,
          borderRadius: '100px',
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 900,
          color: 'transparent',
          whiteSpace: 'nowrap',
          lineHeight: '20px',
          userSelect: 'none',
          letterSpacing: '-0.2px',
        }}
      >
        {text}
      </div>

      <div
        style={{
          position: 'relative',
          backgroundColor: theme.bg,
          borderRadius: '100px',
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 900,
          color: '#fff',
          whiteSpace: 'nowrap',
          lineHeight: '20px',
          overflow: 'hidden',
          marginTop: '-36px',
          letterSpacing: '-0.2px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '6px',
            right: '6px',
            height: '42%',
            background: 'rgba(255,255,255,0.30)',
            borderRadius: '100px 100px 70px 70px',
            pointerEvents: 'none',
          }}
        />
        {text}
      </div>
    </div>
  );
}

export function MenuItemRow({ item, onAdd, cartQuantity = 0, onUpdateQuantity }: MenuItemRowProps) {
  const inCart = cartQuantity > 0;

  return (
    <div
      className="flex gap-4 py-4 px-4"
      style={{
        margin: inCart ? '4px 8px' : '0',
        borderRadius: inCart ? '18px' : '0',
        border: inCart ? '2px solid #7C3AED' : '2px solid transparent',
        transition: 'border-color 0.25s ease, margin 0.25s ease, border-radius 0.25s ease',
        background: inCart ? 'rgba(124,58,237,0.03)' : 'transparent',
      }}
    >
      <div className="relative flex-shrink-0 w-[130px] h-[130px]">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        {item.badge && (
          <MarketingBadge text={item.badge} color={item.badgeColor ?? 'blue'} />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0 pt-0.5">
        <div>
          <h3 className="text-[16px] font-black text-[#1c1c1e] leading-snug mb-1.5">
            {item.name}
          </h3>
          <p className="text-[13px] font-medium text-gray-400 leading-snug line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="mt-3">
          {inCart ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: '#7C3AED', borderRadius: '999px', overflow: 'hidden' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(item.id, cartQuantity - 1); }}
                style={{
                  width: '36px', height: '36px',
                  background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '20px', fontWeight: 700,
                  lineHeight: 1, padding: 0,
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                }}
              >
                −
              </button>
              <span style={{
                minWidth: '28px', textAlign: 'center',
                fontSize: '15px', fontWeight: 900, color: '#fff',
                fontFamily: "'Manrope', sans-serif",
                userSelect: 'none',
              }}>
                {cartQuantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(item.id, cartQuantity + 1); }}
                style={{
                  width: '36px', height: '36px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '20px', fontWeight: 700,
                  lineHeight: 1, padding: 0,
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                  borderRadius: '0 999px 999px 0',
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(item)}
              className="inline-flex items-center px-4 py-2 bg-[#FFF0E8] text-[#FF5A00] text-[14px] font-black rounded-full active:scale-95 transition-transform"
            >
              от {item.price} с
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
