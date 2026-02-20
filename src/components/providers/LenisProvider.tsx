'use client';

import { ReactLenis, useLenis } from 'lenis/react';

// Bridges Lenis's RAF-driven scroll into Framer Motion's useScroll MotionValues.
// Lenis replaces native scroll events; FM listens to the native 'scroll' event.
// This synthetic dispatch fires on every Lenis tick so useScroll stays in sync.
function LenisSyncToFramer() {
  useLenis(() => {
    window.dispatchEvent(new Event('scroll', { bubbles: false }));
  });
  return null;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      <LenisSyncToFramer />
      {children}
    </ReactLenis>
  );
}
