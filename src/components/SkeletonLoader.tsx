import React from 'react';

function S({
  w, h, r = 8, style,
}: {
  w: number | string;
  h: number | string;
  r?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="sk"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  );
}

function SDark({
  w, h, r = 8, style,
}: {
  w: number | string;
  h: number | string;
  r?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="sk-dark"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonPromoScroll() {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 8px', overflowX: 'hidden' }}>
      {[0, 1, 2, 3].map(i => <S key={i} w={112} h={112} r={16} />)}
    </div>
  );
}

export function SkeletonFrequentItems() {
  return (
    <div style={{ paddingTop: 16, paddingBottom: 4 }}>
      <S w={180} h={26} r={8} style={{ margin: '0 16px 18px' }} />
      <div style={{ display: 'flex', gap: 14, padding: '6px 8px 10px', overflowX: 'hidden' }}>
        {[0, 1].map(i => (
          <div key={i} style={{ flexShrink: 0, width: 252, height: 90, borderRadius: 22, background: '#fff', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px 0 8px' }}>
            <S w={74} h={74} r="50%" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <S w="70%" h={14} r={6} />
              <S w="45%" h={12} r={6} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCategoryTabs() {
  const widths = [56, 68, 72, 80, 70, 60, 52];
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 8px', overflowX: 'hidden', background: '#fff', borderBottom: '1px solid #f2f2f7' }}>
      {widths.map((w, i) => <S key={i} w={w} h={30} r={999} />)}
    </div>
  );
}

function SkeletonMenuRow() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px', alignItems: 'center' }}>
      <S w={130} h={130} r="50%" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <S w="65%" h={16} r={7} />
        <S w="90%" h={12} r={6} />
        <S w="80%" h={12} r={6} />
        <S w={90} h={32} r={999} style={{ marginTop: 4 }} />
      </div>
    </div>
  );
}

export function SkeletonMenuSection({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ background: '#fff', marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 4px' }}>
        <S w={110} h={22} r={8} />
        <div style={{ flex: 1, height: 1, background: '#f2f2f7' }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <React.Fragment key={i}>
          <SkeletonMenuRow />
          {i < rows - 1 && <div style={{ margin: '0 16px', height: 1, background: '#f2f2f7' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #e8e8e8 0%, #e8e8e8 30%, #f5f5f5 50%, #e8e8e8 70%, #e8e8e8 100%);
          background-size: 1200px 100%;
          animation: skShimmer 1.5s infinite linear;
        }
        .sk-dark {
          background: linear-gradient(90deg, #2C2C2E 0%, #2C2C2E 30%, #3A3A3C 50%, #2C2C2E 70%, #2C2C2E 100%);
          background-size: 1200px 100%;
          animation: skShimmer 1.5s infinite linear;
        }
      `}</style>
      <div style={{ padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {[0, 1].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <S w="100%" h={110} r={22} />
              <S w={80} h={16} r={8} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[0, 1].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <S w="100%" h={110} r={22} />
              <S w={68} h={16} r={8} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function FooterSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #e8e8e8 0%, #e8e8e8 30%, #f5f5f5 50%, #e8e8e8 70%, #e8e8e8 100%);
          background-size: 1200px 100%;
          animation: skShimmer 1.5s infinite linear;
        }
        .sk-dark {
          background: linear-gradient(90deg, #2C2C2E 0%, #2C2C2E 30%, #3A3A3C 50%, #2C2C2E 70%, #2C2C2E 100%);
          background-size: 1200px 100%;
          animation: skShimmer 1.5s infinite linear;
        }
      `}</style>
      <footer style={{ fontFamily: "'Manrope', sans-serif", background: '#fff' }}>
        <div style={{ background: '#f2f2f7', margin: '0 16px', borderRadius: '20px', height: '140px' }} className="sk" />
        <div style={{ background: '#1c1c1e', marginTop: '24px', padding: '28px 16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <SDark w={38} h={38} r={10} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SDark w={110} h={14} r={5} />
              <SDark w={70} h={10} r={4} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 16px', marginBottom: '24px' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SDark w={70} h={9} r={4} />
                <SDark w="90%" h={11} r={4} />
                <SDark w="75%" h={11} r={4} />
                <SDark w="80%" h={11} r={4} />
              </div>
            ))}
          </div>
          <div style={{ height: '1px', background: '#2C2C2E', margin: '0 0 14px' }} />
          <SDark w={130} h={9} r={4} />
        </div>
      </footer>
    </>
  );
}

export function PageSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #e8e8e8 0%, #e8e8e8 30%, #f5f5f5 50%, #e8e8e8 70%, #e8e8e8 100%);
          background-size: 1200px 100%;
          animation: skShimmer 1.5s infinite linear;
        }
      `}</style>
      <div style={{ background: '#fff' }}>
        <SkeletonPromoScroll />
      </div>
      <div style={{ background: '#fff', marginTop: 8 }}>
        <SkeletonFrequentItems />
      </div>
      <SkeletonCategoryTabs />
      <SkeletonMenuSection rows={3} />
      <SkeletonMenuSection rows={4} />
      <SkeletonMenuSection rows={2} />
    </>
  );
}
