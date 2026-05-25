import React, { useEffect, useRef, useState } from 'react';
import { CartItem, MenuItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminData, AdminCartSuggestion, CartSuggestionVariant } from '../contexts/AdminDataContext';

function SegmentedControl({ options, selected, onSelect }: {
  options: string[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>('button');
    const btn = buttons[selected];
    if (!btn) return;
    setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [selected, options]);
  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', background: '#F2F2F7', borderRadius: 999, padding: 3, gap: 2 }}>
      <div style={{
        position: 'absolute', top: 3, bottom: 3, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.13)',
        transition: 'left 0.22s cubic-bezier(0.34,1.2,0.64,1), width 0.22s cubic-bezier(0.34,1.2,0.64,1)',
        pointerEvents: 'none', zIndex: 0, ...pillStyle,
      }} />
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onSelect(i)}
          style={{
            position: 'relative', zIndex: 1, flex: 1, padding: '8px 0',
            border: 'none', borderRadius: 999, cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif", fontSize: 14,
            fontWeight: selected === i ? 700 : 500, background: 'transparent',
            color: selected === i ? '#1c1c1e' : '#8E8E93',
            transition: 'color 0.18s', whiteSpace: 'nowrap',
          }}
        >{opt}</button>
      ))}
    </div>
  );
}

function VariantPicker({
  item,
  onConfirm,
  onClose,
}: {
  item: AdminCartSuggestion;
  onConfirm: (variant?: CartSuggestionVariant) => void;
  onClose: () => void;
}) {
  const hasVariants = !!(item.variants && item.variants.length > 0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 360);
  };

  const selectedVariant = hasVariants ? item.variants![selectedIdx] : undefined;
  const price = selectedVariant ? selectedVariant.price : item.price;

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)',
          zIndex: 200, opacity: visible ? 1 : 0, transition: 'opacity 0.32s ease',
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
        width: '100%', maxWidth: '480px', height: '100dvh',
        background: '#fff', zIndex: 201,
        transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative', flexShrink: 0, width: '100%', height: '44dvh',
          background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', overflow: 'hidden',
        }}>
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          )}
          <button
            onClick={handleClose}
            aria-label="Закрыть"
            style={{
              position: 'absolute', top: 14, left: 14,
              width: 36, height: 36, background: 'rgba(255,255,255,0.92)',
              border: '1.5px solid #E5E5EA', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#3C3C43" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div style={{ height: 1, background: '#F2F2F7', flexShrink: 0 }} />

        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as const, padding: '16px 16px 0' }}>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 22,
            fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.3px',
            lineHeight: '28px', margin: '0 0 4px',
          }}>{item.name}</h2>

          {hasVariants && (
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 13,
              fontWeight: 600, color: '#FF5A00', margin: '0 0 6px',
            }}>{item.variants![selectedIdx].label}</p>
          )}

          {item.subtitle && (
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 14,
              color: '#3C3C43', lineHeight: '20px', margin: '0 0 16px',
            }}>{item.subtitle}</p>
          )}

          {hasVariants && (
            <div style={{ marginBottom: 8 }}>
              <SegmentedControl
                options={item.variants!.map(v => v.label)}
                selected={selectedIdx}
                onSelect={setSelectedIdx}
              />
            </div>
          )}

          <div style={{ height: 84 }} />
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 16px 32px', background: '#fff',
          borderTop: '1px solid #F2F2F7',
        }}>
          <button
            onClick={() => { onConfirm(selectedVariant); handleClose(); }}
            onMouseDown={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseUp={e => (e.currentTarget.style.opacity = '1')}
            onTouchStart={e => (e.currentTarget.style.opacity = '0.88')}
            onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
            style={{
              width: '100%', padding: 16, background: '#FF5A00',
              border: 'none', borderRadius: 999, cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif", fontSize: 16,
              fontWeight: 800, color: '#fff', letterSpacing: '-0.2px',
              transition: 'opacity 0.15s',
            }}
          >
            В корзину · {price} с
          </button>
        </div>
      </div>
    </>
  );
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  onItemClick?: (cartItem: CartItem) => void;
  onAddSuggestion?: (item: MenuItem, selectedSize?: number) => void;
}

function ClearConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.45)',
          animation: 'dialogFadeIn 0.22s ease forwards',
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '420px', zIndex: 301,
        padding: '0 12px 32px',
        animation: 'dialogSlideUp 0.3s cubic-bezier(0.32,0.72,0,1) forwards',
      }}>
        <div style={{
          background: '#fff', borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        }}>
          <div style={{ padding: '28px 24px 20px', textAlign: 'center', borderBottom: '1px solid #F2F2F7' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,59,48,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6M14 11v6" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: "'Manrope', sans-serif", fontSize: '18px',
              fontWeight: 800, color: '#1c1c1e', margin: '0 0 8px', letterSpacing: '-0.3px',
            }}>Очистить корзину?</h3>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: '14px',
              fontWeight: 500, color: '#8E8E93', margin: 0, lineHeight: '20px',
            }}>Все товары будут удалены из корзины. Это действие нельзя отменить.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
            <button
              onClick={onConfirm}
              style={{
                width: '100%', padding: '15px',
                background: '#FF3B30', border: 'none', borderRadius: '999px',
                fontFamily: "'Manrope', sans-serif", fontSize: '16px',
                fontWeight: 800, color: '#fff', cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseDown={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseUp={e => (e.currentTarget.style.opacity = '1')}
              onTouchStart={e => (e.currentTarget.style.opacity = '0.85')}
              onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
            >
              Удалить всё
            </button>
            <button
              onClick={onCancel}
              style={{
                width: '100%', padding: '15px',
                background: '#F2F2F7', border: 'none', borderRadius: '999px',
                fontFamily: "'Manrope', sans-serif", fontSize: '16px',
                fontWeight: 700, color: '#1c1c1e', cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseDown={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseUp={e => (e.currentTarget.style.opacity = '1')}
              onTouchStart={e => (e.currentTarget.style.opacity = '0.7')}
              onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onClearCart, onItemClick, onAddSuggestion }: CartDrawerProps) {
  const { t } = useLanguage();
  const { settings, cartSuggestions } = useAdminData();
  const [showConfirm, setShowConfirm] = useState(false);
  const [variantItem, setVariantItem] = useState<AdminCartSuggestion | null>(null);

  const activeSuggestions = (cartSuggestions ?? []).filter(s => s.active);

  const handleSuggestionAdd = (s: AdminCartSuggestion) => {
    setVariantItem(s);
  };

  const handleVariantConfirm = (variant?: CartSuggestionVariant) => {
    if (!variantItem) return;
    let menuItem: MenuItem;
    if (variant) {
      menuItem = {
        id: `${variantItem.id}-${variant.label}`,
        name: `${variantItem.name} ${variant.label}`,
        description: variant.label,
        price: variant.price,
        image: variantItem.image ?? '',
        category: 'suggest',
      };
    } else {
      menuItem = {
        id: variantItem.id,
        name: variantItem.name,
        description: variantItem.subtitle,
        price: variantItem.price,
        image: variantItem.image ?? '',
        category: 'suggest',
      };
    }
    onAddSuggestion?.(menuItem);
  };

  const getEffectivePrice = (ci: CartItem): number => {
    const base = ci.item.price;
    if (ci.selectedSize === undefined) return base;
    if (ci.item.variants && ci.item.variants.length > 0) {
      return base + (ci.item.variants[ci.selectedSize]?.priceExtra ?? 0);
    }
    const fallbackExtras = [0, 100, 200];
    return base + (fallbackExtras[ci.selectedSize] ?? 0);
  };

  const itemTotal = items.reduce((s, i) => s + getEffectivePrice(i) * i.quantity, 0);
  const delivery = items.length > 0
    ? (settings.deliveryFree ? 0 : settings.deliveryFee)
    : 0;
  const total = itemTotal + delivery;

  const handleConfirmClear = () => {
    setShowConfirm(false);
    onClearCart();
  };

  return (
    <>
      <style>{`
        @keyframes dialogFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dialogSlideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-black text-[#1c1c1e]">{t.cartLabel}</h2>
            {items.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                title="Очистить корзину"
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,59,48,0.10)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                  marginLeft: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,59,48,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,59,48,0.10)')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11v6M14 11v6" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#1c1c1e" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ gap: '0' }}>
              <img
                src="/empty-cart.png"
                alt="Корзина пуста"
                style={{
                  width: '240px',
                  height: '240px',
                  objectFit: 'contain',
                  marginBottom: '4px',
                  filter: 'drop-shadow(0 8px 24px rgba(255,90,0,0.18))',
                }}
              />
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: '#1c1c1e',
                margin: '0 0 8px',
                letterSpacing: '-0.3px',
              }}>
                Корзина пуста
              </p>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#8E8E93',
                margin: 0,
                lineHeight: '20px',
              }}>
                Заполните её вкусными блюдами 🍔
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((ci) => (
                <div key={ci.item.id} className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => onItemClick?.(ci)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      flex: 1, minWidth: 0, background: 'none', border: 'none',
                      padding: 0, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      flexShrink: 0, width: '64px', height: '64px',
                      borderRadius: '16px', overflow: 'hidden',
                      background: '#F2F2F7',
                      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.06)',
                      position: 'relative',
                    }}>
                      <img src={ci.item.image} alt={ci.item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{
                        position: 'absolute', bottom: '4px', right: '4px',
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: '#FF5A00',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2v8M2 6h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1c1c1e', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ci.item.name}
                      </p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 700, color: '#FF5A00', margin: 0 }}>
                        {getEffectivePrice(ci)} с
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(ci.item.id, ci.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#1c1c1e] font-black text-lg leading-none"
                    >−</button>
                    <span key={ci.quantity} className="cart-qty-num">{ci.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(ci.item.id, ci.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-[#FF5A00] flex items-center justify-center text-white font-black text-lg leading-none"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && activeSuggestions.length > 0 && (
          <div style={{ borderTop: '1px solid #F2F2F7', padding: '16px 0 4px' }}>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: '20px',
              fontWeight: 900, color: '#1c1c1e', margin: '0 0 16px',
              paddingLeft: '16px', letterSpacing: '-0.3px',
            }}>Добавить к заказу?</p>
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'stretch',
              overflowX: 'auto', paddingLeft: '16px', paddingRight: '16px',
              paddingBottom: '8px', scrollbarWidth: 'none',
            }}>
              {activeSuggestions.map((s) => {
                const hasVariants = s.variants && s.variants.length > 0;
                return (
                  <div key={s.id} style={{
                    flexShrink: 0, width: '120px',
                    display: 'flex', flexDirection: 'column',
                    paddingTop: '44px',
                  }}>
                    <div style={{
                      flex: 1,
                      background: '#F7F7F7',
                      borderRadius: '16px', padding: '0 8px 12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    }}>
                      <div style={{
                        width: '90px', height: '90px',
                        marginTop: '-48px', marginBottom: '6px',
                        flexShrink: 0, overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img
                          src={s.image}
                          alt={s.name}
                          style={{
                            width: '90px', height: '90px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))',
                            display: 'block',
                          }}
                        />
                      </div>
                      <p style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '13px', fontWeight: 700,
                        color: '#1c1c1e', margin: '0 0 2px',
                        textAlign: 'left', width: '100%',
                        lineHeight: '17px',
                      }}>{s.name}</p>
                      <p style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '11px', fontWeight: 500,
                        color: '#8E8E93', margin: '0 0 10px',
                        textAlign: 'left', width: '100%',
                        flex: 1,
                      }}>{s.subtitle}</p>
                      <button
                        onClick={() => handleSuggestionAdd(s)}
                        style={{
                          width: '100%', background: '#EBEBEB',
                          border: 'none', borderRadius: '999px', padding: '7px 0',
                          textAlign: 'center', cursor: 'pointer',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseDown={e => (e.currentTarget.style.opacity = '0.72')}
                        onMouseUp={e => (e.currentTarget.style.opacity = '1')}
                        onTouchStart={e => (e.currentTarget.style.opacity = '0.72')}
                        onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <span style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '13px', fontWeight: 800,
                          color: '#1c1c1e',
                        }}>
                          {hasVariants ? 'Выбрать' : `${s.price} с`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-[14px] font-bold text-gray-400">
              <span>{t.orderSum}</span><span>{itemTotal} с</span>
            </div>
            <div className="flex justify-between text-[14px] font-bold text-gray-400">
              <span>{t.delivery}</span>
              <span style={{ color: settings.deliveryFree ? '#34C759' : '#8E8E93' }}>
                {settings.deliveryFree ? 'Бесплатно' : `${settings.deliveryFee} с`}
              </span>
            </div>
            <div className="flex justify-between text-[16px] font-black text-[#1c1c1e] pt-1">
              <span>{t.total}</span><span>{total} с</span>
            </div>
            <button className="w-full mt-2 bg-[#FF5A00] text-white text-[16px] font-black py-4 rounded-full active:scale-95 transition-transform">
              {t.checkout}
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <ClearConfirmDialog
          onConfirm={handleConfirmClear}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {variantItem && (
        <VariantPicker
          item={variantItem}
          onConfirm={handleVariantConfirm}
          onClose={() => setVariantItem(null)}
        />
      )}
    </>
  );
}
