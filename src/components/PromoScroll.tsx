import React from 'react';
import { PromoCard } from '../types';

interface PromoScrollProps {
  cards: PromoCard[];
  onCardClick?: (index: number) => void;
}

export function PromoScroll({ cards, onCardClick }: PromoScrollProps) {
  return (
    <div className="scroll-x py-2" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />

      {cards.map((card, index) => (
        <div
          key={card.id}
          onClick={() => onCardClick?.(index)}
          className="relative w-[112px] h-[112px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
          style={{
            backgroundColor: card.bgColor,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {card.videoUrl ? (
            <video
              src={card.videoUrl}
              muted
              playsInline
              autoPlay
              loop
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {card.videoUrl && (
            <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="#fff"><polygon points="2,1 9,5 2,9"/></svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
            <p className="text-white text-[11px] font-black leading-tight">{card.title}</p>
          </div>
        </div>
      ))}

      <div style={{ flexShrink: 0, width: '8px' }} aria-hidden="true" />
    </div>
  );
}
