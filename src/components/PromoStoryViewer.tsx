import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PromoCard } from '../types';

interface PromoStoryViewerProps {
  cards: PromoCard[];
  startIndex: number;
  onClose: () => void;
  onCtaClick?: (productId?: string, partnerId?: string) => void;
}

const STORY_DURATION = 5000;

export function PromoStoryViewer({ cards, startIndex, onClose, onCtaClick }: PromoStoryViewerProps) {
  const [current, setCurrent] = useState(startIndex);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);           // 0–100
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [animating, setAnimating] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const pauseOffsetRef = useRef(0);
  const durationRef = useRef(STORY_DURATION);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* open animation */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* reset duration to default when card changes */
  useEffect(() => {
    durationRef.current = STORY_DURATION;
  }, [current]);

  /* progress bar ticker */
  const startProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pausedRef.current = false;
    pauseOffsetRef.current = 0;
    startTimeRef.current = performance.now();
    setProgress(0);

    const tick = (now: number) => {
      if (pausedRef.current) return;
      const elapsed = now - startTimeRef.current + pauseOffsetRef.current;
      const pct = Math.min((elapsed / durationRef.current) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        goNext();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const card = cards[current];
    if (!card.videoUrl) {
      startProgress();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    if (current < cards.length - 1) {
      setSlideDir('left');
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => c + 1);
        setSlideDir(null);
        setAnimating(false);
      }, 320);
    } else {
      handleClose();
    }
  }, [current, cards.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPrev = useCallback(() => {
    if (current > 0) {
      setSlideDir('right');
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => c - 1);
        setSlideDir(null);
        setAnimating(false);
      }, 320);
    }
  }, [current]);

  const handleClose = () => {
    cancelAnimationFrame(rafRef.current);
    setVisible(false);
    setTimeout(onClose, 360);
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const w = (e.currentTarget as HTMLDivElement).offsetWidth;
    if (x < w * 0.35) goPrev();
    else if (x > w * 0.65) goNext();
  };

  /* long-press pause */
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStart = useRef(0);

  const handlePointerDown = () => {
    pressStart.current = performance.now();
    pressTimer.current = setTimeout(() => {
      pausedRef.current = true;
      pauseOffsetRef.current += performance.now() - startTimeRef.current;
    }, 120);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    const held = performance.now() - pressStart.current;
    if (pausedRef.current) {
      pausedRef.current = false;
      startTimeRef.current = performance.now();
      const tick = (now: number) => {
        if (pausedRef.current) return;
        const elapsed = now - startTimeRef.current + pauseOffsetRef.current;
        const pct = Math.min((elapsed / durationRef.current) * 100, 100);
        setProgress(pct);
        if (pct < 100) rafRef.current = requestAnimationFrame(tick);
        else goNext();
      };
      rafRef.current = requestAnimationFrame(tick);
    } else if (held < 200) {
      // treated as tap — handled by onClick
    }
  };

  const card = cards[current];

  const slideTransform = animating
    ? slideDir === 'left'
      ? 'translateX(-6%) scale(0.96)'
      : 'translateX(6%) scale(0.96)'
    : 'translateX(0) scale(1)';

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.32s ease',
      }}
      onClick={handleClose}
    >
      {/* Story card */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp as any}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100dvh',
          borderRadius: 0,
          overflow: 'hidden',
          background: card.bgColor,
          transform: visible
            ? slideTransform
            : 'scale(0.88)',
          transition: animating
            ? 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease'
            : 'transform 0.42s cubic-bezier(0.34,1.2,0.64,1), opacity 0.38s ease',
          opacity: visible ? (animating ? 0.6 : 1) : 0,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: 'pointer',
        } as React.CSSProperties}
        onClick={(e) => { e.stopPropagation(); (handleTap as any)(e); }}
      >
        {/* ── Progress bars ── */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            zIndex: 10,
            display: 'flex', gap: '4px',
            padding: '12px 10px 0',
          }}
        >
          {cards.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: '3px', borderRadius: '2px',
                background: 'rgba(255,255,255,0.3)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: '#fff',
                  width: i < current ? '100%'
                    : i === current ? `${progress}%`
                    : '0%',
                  transition: i === current ? 'none' : 'width 0.1s ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Close button ── */}
        <button
          onClick={e => { e.stopPropagation(); handleClose(); }}
          style={{
            position: 'absolute', top: '22px', right: '14px',
            zIndex: 20,
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          } as React.CSSProperties}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ── Full image or video ── */}
        {card.videoUrl ? (
          <video
            key={card.id}
            ref={videoRef}
            src={card.videoUrl}
            autoPlay
            muted
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onLoadedMetadata={(e) => {
              const dur = e.currentTarget.duration;
              if (dur && isFinite(dur) && dur > 0) {
                durationRef.current = dur * 1000;
                startProgress();
              }
            }}
            onEnded={goNext}
          />
        ) : (
          <img
            key={card.id}
            src={card.image}
            alt={card.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: animating ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.42s cubic-bezier(0.34,1.2,0.64,1)',
            }}
          />
        )}

        {/* ── Gradient overlay ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.18) 0%,
            transparent 30%,
            transparent 55%,
            rgba(0,0,0,0.72) 100%
          )`,
        }} />

        {/* ── Content ── */}
        <div
          key={`content-${card.id}`}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 20px 44px',
            animation: 'storyContentIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both',
          }}
        >
          {card.subtitle && (
            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '13px', fontWeight: 600,
              color: 'rgba(255,255,255,0.75)',
              margin: '0 0 6px',
              letterSpacing: '0.2px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              {card.subtitle}
            </p>
          )}

          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '32px', fontWeight: 900,
            color: '#fff', margin: '0 0 10px',
            lineHeight: '1.1', letterSpacing: '-0.5px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>
            {card.title.toUpperCase()}
          </h2>

          {card.description && (
            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '14px', fontWeight: 500,
              color: 'rgba(255,255,255,0.88)',
              margin: '0 0 20px',
              lineHeight: '1.5',
              textShadow: '0 1px 6px rgba(0,0,0,0.3)',
            }}>
              {card.description}
            </p>
          )}

          {card.cta && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (onCtaClick && (card.productId || card.partnerId)) {
                  onCtaClick(card.productId, card.partnerId);
                } else {
                  handleClose();
                }
              }}
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '999px',
                padding: '13px 26px',
                cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '14px',
                fontWeight: 800,
                color: '#1c1c1e',
                margin: 0,
                textAlign: 'center',
              } as React.CSSProperties}
            >
              {card.cta}
            </button>
          )}
        </div>

        {/* ── Tap zones (invisible) ── */}
        <div style={{ position: 'absolute', inset: 0, top: '60px', display: 'flex', zIndex: 5 }}>
          <div style={{ flex: '0 0 35%', height: '100%' }} />
          <div style={{ flex: 1, height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
