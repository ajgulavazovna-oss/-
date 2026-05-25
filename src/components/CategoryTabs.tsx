import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <div className="scroll-x py-2 bg-white" style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* leading spacer — guarantees left indent on iOS Safari */}
      <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1.5 rounded-full text-[13px] font-black flex-shrink-0 transition-colors ${
            active === cat.id
              ? 'bg-[#FF5A00] text-white'
              : 'bg-[#F2F2F7] text-[#1c1c1e]'
          }`}
        >
          {cat.label}
        </button>
      ))}

      {/* trailing spacer */}
      <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />
    </div>
  );
}
