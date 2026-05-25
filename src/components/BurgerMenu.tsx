import React, { useEffect, useState } from 'react';
import { LogoIcon } from './LogoIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, Lang } from '../i18n/translations';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCityClick?: () => void;
  cityLabel?: string;
}

export function BurgerMenu({ isOpen, onClose, onCityClick, cityLabel }: BurgerMenuProps) {
  const { t, lang, setLang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      setLangOpen(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const D = () => (
    <div style={{ height: '1px', background: '#2C2C2E', margin: '0 0' }} />
  );

  const currentLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 300,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0, right: 0,
          width: '100%',
          maxWidth: '480px',
          height: '100dvh',
          background: '#1C1C1E',
          zIndex: 301,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoIcon color="#FF5A00" height={38} />
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#2C2C2E', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <D />

        {/* ── City ── */}
        <div
          onClick={onCityClick}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#fff"/>
            </svg>
            <div>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '12px', fontWeight: 500, color: '#636366', display: 'block', lineHeight: 1, marginBottom: '3px' }}>Адрес доставки</span>
              <span style={{ ...rowText, fontSize: '15px' }}>{cityLabel || t.city}</span>
            </div>
          </div>
          <svg width="7" height="12" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <D />

        {/* ── Delivery info ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ ...rowText, color: '#fff' }}>29 {t.minutes}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '16px', fontWeight: 700, color: '#FF5A00' }}>4.83</span>
              <Stars value={4.83} />
            </div>
          </div>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            border: '1.5px solid #48484A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 5.5v3M6 3.8v.35" stroke="#8E8E93" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <D />

        {/* ── Language row ── */}
        <div>
          <button
            onClick={() => setLangOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '16px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.7"/>
                <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18" stroke="#fff" strokeWidth="1.5"/>
              </svg>
              <span style={rowText}>{t.language}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{currentLang.flag}</span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '14px', fontWeight: 500, color: '#8E8E93' }}>
                {currentLang.name}
              </span>
              <svg
                width="7" height="12" viewBox="0 0 8 14" fill="none"
                style={{ transform: langOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              >
                <path d="M1 1l6 6-6 6" stroke="#48484A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Language options — animated expand */}
          <div style={{
            maxHeight: langOpen ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.28s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {LANGUAGES.map(l => {
                const active = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '11px 14px',
                      background: active ? 'rgba(255,90,0,0.12)' : '#2C2C2E',
                      border: active ? '1.5px solid rgba(255,90,0,0.4)' : '1.5px solid transparent',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px', lineHeight: 1 }}>{l.flag}</span>
                      <span style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '15px',
                        fontWeight: active ? 700 : 500,
                        color: active ? '#FF5A00' : '#fff',
                      }}>
                        {l.name}
                      </span>
                    </div>
                    {active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <D />

        {/* ── Nav items ── */}
        {[
          { label: t.login,      icon: <LoginIcon /> },
          { label: t.promotions, icon: <PromoIcon /> },
          { label: t.contacts,   icon: <ContactIcon /> },
          { label: t.about,      icon: <AboutIcon /> },
        ].map(({ label, icon }, i, arr) => (
          <React.Fragment key={label}>
            <button
              style={{
                display: 'flex', alignItems: 'center',
                width: '100%', padding: '18px 16px',
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
                gap: '14px',
              }}
            >
              <span style={{ opacity: 0.5, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '19px', fontWeight: 700, color: '#fff' }}>
                {label}
              </span>
            </button>
            {i < arr.length - 1 && <D />}
          </React.Fragment>
        ))}

        <D />

        {/* ── Phone numbers ── */}
        <div style={{ padding: '18px 16px 6px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.7 }}>
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" fill="#fff"/>
            </svg>
            <div>
              {['+7 (700) 555-00-11', '+7 (700) 555-00-22', '+7 (312) 555-00-33'].map(n => (
                <p key={n} style={{ margin: '0 0 4px', fontFamily: "'Manrope', sans-serif", fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                  {n}
                </p>
              ))}
              <p style={{ margin: '4px 0 0', fontFamily: "'Manrope', sans-serif", fontSize: '12px', fontWeight: 500, color: '#636366' }}>
                {t.callByPhone}
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </>
  );
}

/* ─── helpers ─── */
const rowText: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: '16px', fontWeight: 600, color: '#fff',
};

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`sg${i}`}>
                <stop offset={`${filled * 100}%`} stopColor="#FF9500"/>
                <stop offset={`${filled * 100}%`} stopColor="#48484A"/>
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#sg${i})`}
            />
          </svg>
        );
      })}
    </div>
  );
}

function LoginIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="1.8"/></svg>;
}
function PromoIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="7" r="1.5" fill="#fff"/></svg>;
}
function ContactIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function AboutIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.8"/><path d="M12 8v4M12 16v.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>;
}
