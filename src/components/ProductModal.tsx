import React, { useEffect, useRef, useState } from 'react';
import { MenuItem, CartItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminData } from '../contexts/AdminDataContext';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, opts: { selectedSize: number; selectedDough: number; removedIngredients: string[] }) => void;
  editCartItem?: CartItem | null;
  onUpdate?: (opts: { selectedSize: number; selectedDough: number; removedIngredients: string[] }) => void;
}

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
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', background: '#F2F2F7', borderRadius: '999px', padding: '3px', gap: '2px' }}>
      <div style={{
        position: 'absolute', top: '3px', bottom: '3px', borderRadius: '999px',
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
            border: 'none', borderRadius: '999px', cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif", fontSize: '14px',
            fontWeight: selected === i ? 700 : 500, background: 'transparent',
            color: selected === i ? '#1c1c1e' : '#8E8E93',
            transition: 'color 0.18s', lineHeight: '1.2', whiteSpace: 'nowrap',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ProductModal({ item, onClose, onAdd, editCartItem, onUpdate }: ProductModalProps) {
  const { t } = useLanguage();
  const { partners } = useAdminData();
  const [visible, setVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedDough, setSelectedDough] = useState(0);
  const [removedIngredients, setRemovedIngredients] = useState<Set<string>>(new Set());

  const isEdit = !!editCartItem;

  const DOUGHS = [t.traditional, t.thin];
  const hasVariants = item && item.variants && item.variants.length > 0;
  const SIZE_LABELS = hasVariants
    ? item!.variants!.map(v => v.label)
    : [`25 ${t.sizeSuffix}`, `30 ${t.sizeSuffix}`, `35 ${t.sizeSuffix}`];
  const doughOptions = (item && item.doughOptions) ? item.doughOptions : DOUGHS;

  const partner = item?.partnerId ? partners.find(p => p.id === item.partnerId) : null;

  useEffect(() => {
    if (item) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      if (isEdit && editCartItem) {
        setSelectedSize(editCartItem.selectedSize ?? (hasVariants ? 0 : 1));
        setSelectedDough(editCartItem.selectedDough ?? 0);
        setRemovedIngredients(new Set(editCartItem.removedIngredients ?? []));
      } else {
        setSelectedSize(hasVariants ? 0 : 1);
        setSelectedDough(0);
        setRemovedIngredients(new Set());
      }
    } else {
      setVisible(false);
    }
  }, [item]);

  useEffect(() => {
    if (item) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 360); };

  const handleConfirm = () => {
    if (!item) return;
    const opts = { selectedSize, selectedDough, removedIngredients: Array.from(removedIngredients) };
    if (isEdit && onUpdate) {
      onUpdate(opts);
    } else {
      onAdd(item, opts);
    }
    handleClose();
  };

  const toggleIngredient = (name: string) => {
    setRemovedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  if (!item) return null;

  const variantExtra = hasVariants ? (item.variants![selectedSize]?.priceExtra ?? 0) : [0, 100, 200][selectedSize];
  const finalPrice = item.price + variantExtra;
  const currentImage = hasVariants && item.variants![selectedSize]?.image
    ? item.variants![selectedSize].image!
    : item.image;
  const ingredients = item.ingredients ?? [];

  return (
    <>
      <div
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 200, opacity: visible ? 1 : 0, transition: 'opacity 0.32s ease' }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
        width: '100%', maxWidth: '480px', height: '100dvh',
        background: '#fff', zIndex: 201,
        transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', flexShrink: 0, width: '100%', height: '44dvh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={currentImage}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'opacity 0.2s ease' }}
          />
          <button onClick={handleClose} aria-label="Закрыть" style={{
            position: 'absolute', top: '14px', left: '14px',
            width: '36px', height: '36px', background: 'rgba(255,255,255,0.92)',
            border: '1.5px solid #E5E5EA', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#3C3C43" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isEdit && (
            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
              background: '#FF5A00', borderRadius: 999, padding: '5px 14px', zIndex: 10,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'Manrope',sans-serif" }}>Редактирование заказа</span>
            </div>
          )}

          {partner && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: '5px 10px 5px 6px',
              border: '1.5px solid #E5E5EA', zIndex: 10,
            }}>
              {partner.logo ? (
                <img src={partner.logo} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FF5A00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: "'Manrope',sans-serif" }}>{partner.name[0]}</span>
                </div>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1c1c1e', fontFamily: "'Manrope',sans-serif", whiteSpace: 'nowrap' }}>{partner.name}</span>
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: '#F2F2F7', flexShrink: 0 }} />

        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '22px', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.3px', lineHeight: '28px', margin: 0 }}>
              {item.name}
            </h2>
            <div style={{ flexShrink: 0, marginTop: '4px', width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C7C7CC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 5.4v3M6 3.5v.4" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {hasVariants && (
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 600, color: '#FF5A00', margin: '0 0 6px' }}>
              {SIZE_LABELS[selectedSize]}{variantExtra > 0 ? ` · +${variantExtra} с` : ''}
            </p>
          )}

          {ingredients.length > 0 && (
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '14px', fontWeight: 400, color: '#3C3C43', lineHeight: '22px', margin: '0 0 16px' }}>
              {ingredients.map((ing, idx) => {
                const removed = removedIngredients.has(ing.name);
                const isLast = idx === ingredients.length - 1;
                return (
                  <React.Fragment key={ing.name}>
                    {ing.removable ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: removed ? 'none' : 'underline', textDecorationColor: '#C7C7CC', textUnderlineOffset: '2px', color: removed ? '#C7C7CC' : '#3C3C43', transition: 'color 0.15s' }}>
                        <span>{ing.name}</span>
                        <button
                          onClick={() => toggleIngredient(ing.name)}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', border: `1.5px solid ${removed ? '#C7C7CC' : '#8E8E93'}`, background: 'transparent', cursor: 'pointer', padding: 0, marginLeft: '1px', flexShrink: 0, lineHeight: 1 }}
                        >
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            {removed ? <path d="M2 5h6M5 2v6" stroke="#C7C7CC" strokeWidth="1.6" strokeLinecap="round"/> : <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="#8E8E93" strokeWidth="1.6" strokeLinecap="round"/>}
                          </svg>
                        </button>
                      </span>
                    ) : (
                      <span style={{ color: removed ? '#C7C7CC' : '#3C3C43' }}>{ing.name}</span>
                    )}
                    {!isLast && <span style={{ color: '#8E8E93' }}>, </span>}
                  </React.Fragment>
                );
              })}
            </p>
          )}

          {ingredients.length === 0 && item.description && (
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '14px', fontWeight: 400, color: '#3C3C43', lineHeight: '20px', margin: '0 0 16px' }}>
              {item.description}
            </p>
          )}

          <div style={{ marginBottom: '8px' }}>
            <SegmentedControl options={SIZE_LABELS} selected={selectedSize} onSelect={setSelectedSize} />
          </div>

          {doughOptions.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SegmentedControl options={doughOptions} selected={selectedDough} onSelect={setSelectedDough} />
            </div>
          )}

          <div style={{ height: '84px' }} />
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px 32px', background: '#fff', borderTop: '1px solid #F2F2F7' }}>
          <button
            onClick={handleConfirm}
            onMouseDown={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseUp={e => (e.currentTarget.style.opacity = '1')}
            onTouchStart={e => (e.currentTarget.style.opacity = '0.88')}
            onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
            style={{ width: '100%', padding: '16px', background: '#FF5A00', border: 'none', borderRadius: '999px', cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px', transition: 'opacity 0.15s' }}
          >
            {isEdit ? `Обновить заказ · ${finalPrice} с` : `${t.addToCart} ${finalPrice} с`}
          </button>
        </div>
      </div>
    </>
  );
}
