import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../contexts/LanguageContext';

interface DeliveryMapProps {
  onClose: () => void;
}

const ALMATY: [number, number] = [43.2220, 76.8512];
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://carto.com/">CARTO</a>';

type AddressType = 'home' | 'work' | 'other';

export function DeliveryMap({ onClose }: DeliveryMapProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('Алматы, Казахстан');
  const [addrType, setAddrType] = useState<AddressType>('home');
  const [entrance, setEntrance] = useState('');
  const [intercom, setIntercom] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [comment, setComment] = useState('');
  const [geocoding, setGeocoding] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: ALMATY, zoom: 15, zoomControl: false, attributionControl: true,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    map.on('moveend', () => {
      const { lat, lng } = map.getCenter();
      scheduleGeocode(lat, lng);
    });

    scheduleGeocode(ALMATY[0], ALMATY[1]);

    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleGeocode = (lat: number, lng: number) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    setGeocoding(true);
    geocodeTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ru`,
          { headers: { 'Accept-Language': 'ru' } }
        );
        const data = await res.json();
        const a = data.address || {};
        const parts = [
          a.city || a.town || a.village || 'Алматы',
          a.road || a.pedestrian || a.footway || '',
          a.house_number || '',
        ].filter(Boolean);
        setAddress(parts.join(', ') || data.display_name || '—');
      } catch {
        setAddress('—');
      } finally {
        setGeocoding(false);
      }
    }, 600);
  };

  const handleLocate = () => {
    navigator.geolocation?.getCurrentPosition(pos => {
      mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { duration: 1 });
    });
  };

  const handleClose = () => { setVisible(false); setTimeout(onClose, 360); };
  const handleSave = () => { handleClose(); };

  const inp: React.CSSProperties = {
    width: '100%', background: '#2C2C2E', border: 'none', borderRadius: '12px',
    padding: '12px 14px', fontFamily: "'Manrope', sans-serif",
    fontSize: '14px', fontWeight: 500, color: '#fff',
    outline: 'none', boxSizing: 'border-box',
  };

  const tabs = [
    { id: 'delivery' as const, label: t.deliveryMode },
    { id: 'pickup'   as const, label: t.pickupMode  },
  ];

  const addrBtns = [
    { id: 'home'  as AddressType, label: t.addrHouse },
    { id: 'work'  as AddressType, label: t.addrOffice },
    { id: 'other' as AddressType, label: '📍 ...' },
  ];

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 500, opacity: visible ? 1 : 0, transition: 'opacity 0.32s ease',
        }}
      />

      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
        width: '100%', maxWidth: '480px', height: '100dvh',
        background: '#1C1C1E', zIndex: 501,
        transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* ── MAP ── */}
        <div style={{ position: 'relative', flexShrink: 0, height: '44dvh' }}>
          <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />

          {/* Fixed center pin */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', filter: 'blur(2px)' }} />
            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
              <circle cx="18" cy="18" r="18" fill="#FF5A00"/>
              <circle cx="18" cy="18" r="7" fill="#fff"/>
              <path d="M18 36 L18 44" stroke="#FF5A00" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

          {/* × close */}
          <button onClick={handleClose} style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 20, width: '36px', height: '36px', borderRadius: '50%', background: '#1C1C1E', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Delivery / Pickup toggle */}
          <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', background: '#1C1C1E', borderRadius: '999px', padding: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {tabs.map(tb => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                style={{
                  padding: '7px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 700,
                  background: tab === tb.id ? '#FF5A00' : 'transparent',
                  color: tab === tb.id ? '#fff' : '#8E8E93',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* My location button */}
          <button onClick={handleLocate} style={{ position: 'absolute', bottom: '14px', right: '14px', zIndex: 20, width: '40px', height: '40px', borderRadius: '50%', background: '#1C1C1E', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#FF5A00"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* ── FORM ── */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Country */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2C2C2E', borderRadius: '12px', padding: '12px 14px' }}>
            <span style={{ fontSize: '18px' }}>🇰🇿</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.country}
            </span>
          </div>

          {/* Address field */}
          <div style={{ position: 'relative' }}>
            <label style={{ position: 'absolute', top: '8px', left: '14px', fontFamily: "'Manrope',sans-serif", fontSize: '11px', fontWeight: 500, color: '#636366' }}>
              {t.addressLabel}
            </label>
            <input
              value={geocoding ? t.determining : address}
              onChange={e => setAddress(e.target.value)}
              style={{ ...inp, paddingTop: '26px', paddingBottom: '8px' }}
              placeholder={t.addressPlaceholder}
            />
          </div>

          {/* Address type */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {addrBtns.map(b => (
              <button
                key={b.id}
                onClick={() => setAddrType(b.id)}
                style={{
                  flex: 1, padding: '9px 4px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontFamily: "'Manrope',sans-serif", fontSize: '13px', fontWeight: 600,
                  background: addrType === b.id ? '#FF5A00' : '#2C2C2E',
                  color: addrType === b.id ? '#fff' : '#8E8E93',
                  transition: 'background 0.18s, color 0.18s',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Entrance / Intercom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input value={entrance} onChange={e => setEntrance(e.target.value)} style={inp} placeholder={t.entrancePlaceholder}/>
            <input value={intercom} onChange={e => setIntercom(e.target.value)} style={inp} placeholder={t.intercomPlaceholder}/>
          </div>

          {/* Floor / Apartment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input value={floor} onChange={e => setFloor(e.target.value)} style={inp} placeholder={t.floorPlaceholder}/>
            <input value={apartment} onChange={e => setApartment(e.target.value)} style={inp} placeholder={t.apartmentPlaceholder}/>
          </div>

          {/* Comment */}
          <input value={comment} onChange={e => setComment(e.target.value)} style={inp} placeholder={t.commentPlaceholder}/>

          <div style={{ height: '80px' }} />
        </div>

        {/* ── Save CTA ── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px 32px', background: '#1C1C1E', borderTop: '1px solid #2C2C2E' }}>
          <button
            onClick={handleSave}
            onMouseDown={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseUp={e => (e.currentTarget.style.opacity = '1')}
            onTouchStart={e => (e.currentTarget.style.opacity = '0.88')}
            onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
            style={{ width: '100%', padding: '15px', background: '#FF5A00', border: 'none', borderRadius: '999px', cursor: 'pointer', fontFamily: "'Manrope',sans-serif", fontSize: '16px', fontWeight: 800, color: '#fff', transition: 'opacity 0.15s' }}
          >
            {t.saveAddress}
          </button>
        </div>
      </div>
    </>
  );
}
