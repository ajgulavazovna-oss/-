import React, { useEffect, useState } from 'react';

interface FloatingCartProps {
  total: number;
  onClick: () => void;
}

export function FloatingCart({ total, onClick }: FloatingCartProps) {
  const [visible, setVisible] = useState(false);
  const [prevTotal, setPrevTotal] = useState(total);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (total > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    if (total !== prevTotal && total > 0) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 320);
      setPrevTotal(total);
      return () => clearTimeout(t);
    }
    setPrevTotal(total);
  }, [total]);

  const formatted = total.toLocaleString('ru-RU').replace(/,/g, ' ');

  return (
    <>
      <style>{`
        @keyframes fcIn {
          from { opacity: 0; transform: scale(0.72) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fcOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.72) translateY(16px); }
        }
        @keyframes fcBump {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.07); }
          100% { transform: scale(1); }
        }
        .fc-enter { animation: fcIn 0.32s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .fc-exit  { animation: fcOut 0.22s ease forwards; }
        .fc-bump  { animation: fcBump 0.32s cubic-bezier(0.34,1.4,0.64,1); }
      `}</style>

      {total > 0 && (
        <button
          onClick={onClick}
          aria-label="Открыть корзину"
          className={`${visible ? 'fc-enter' : 'fc-exit'} ${bump ? 'fc-bump' : ''}`}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '20px',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#FF5A00',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 22px 14px 16px',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          {/* Bag icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="white" style={{ flexShrink: 0 }}>
            <path d="M10.189 5.467c.63-.646 1.362-1.868 1.834-4.17A.247.247 0 0 0 11.78 1h-3.9a.25.25 0 0 0-.249.225l-.38 3.792c-.078.793.576 1.21 1.274 1.236h.003c.641.025 1.225-.34 1.66-.786"/>
            <path d="M6.119 1.275A.25.25 0 0 0 5.869 1h-.75a1.25 1.25 0 0 0-1.242 1.112L2.37 15.669A3 3 0 0 0 5.352 19H15a3 3 0 0 0 3-3V2.25C18 1.56 17.44 1 16.75 1h-2.934a.25.25 0 0 0-.248.208c-.502 2.727-1.372 4.35-2.306 5.307-.731.749-1.721 1.279-2.786 1.238H8.47c-1.557-.06-2.876-1.237-2.71-2.885z"/>
          </svg>

          {/* Price */}
          <span style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '17px',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.3px',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            {formatted} с
          </span>
        </button>
      )}
    </>
  );
}
