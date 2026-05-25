import React from 'react';
import { MenuItem, Category, CartItem } from '../types';
import { MenuItemRow } from './MenuItemRow';
import { useAdminData } from '../contexts/AdminDataContext';

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string, qty: number) => void;
}

export function MenuSection({ category, items, onAdd, cartItems = [], onUpdateQuantity }: MenuSectionProps) {
  const { partners } = useAdminData();
  if (items.length === 0) return null;

  const firstPartnerId = items[0]?.partnerId;
  const partner = firstPartnerId ? partners.find(p => p.id === firstPartnerId) : null;

  return (
    <div className="bg-white mt-2">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        {partner?.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : category.logoColor && category.logoChar ? (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: category.logoColor, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: `0 2px 8px ${category.logoColor}55`,
          }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: "'Manrope', sans-serif", lineHeight: 1 }}>
              {category.logoChar}
            </span>
          </div>
        ) : null}
        <div style={{ minWidth: 0 }}>
          <h2 className="text-[20px] font-black text-[#1c1c1e] leading-tight">
            {category.label}
          </h2>
          {(partner?.name || category.restaurantName) && (
            <p style={{ fontSize: 12, fontWeight: 500, color: '#8E8E93', margin: 0, fontFamily: "'Manrope', sans-serif", lineHeight: '16px' }}>
              {partner?.name ?? category.restaurantName}
            </p>
          )}
        </div>
        <div className="flex-1 h-px bg-gray-100 ml-1" />
      </div>
      <div>
        {items.map((item, index) => {
          const cartQty = cartItems.find(c => c.item.id === item.id)?.quantity ?? 0;
          return (
            <div key={item.id}>
              <MenuItemRow
                item={item}
                onAdd={onAdd}
                cartQuantity={cartQty}
                onUpdateQuantity={onUpdateQuantity}
              />
              {index < items.length - 1 && <div className="mx-4 border-b border-gray-100" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
