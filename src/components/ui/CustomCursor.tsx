'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─────────────────────────────────────────────────────────
// CUSTOM CURSOR — terminal-inspired dot + ring
// Dot: instant. Ring: spring-lagged for personality.
// States: default | hover (links/buttons) | text (inputs) | click
// ─────────────────────────────────────────────────────────

type CursorVariant = 'default' | 'hover' | 'text' | 'click';

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring lags with a spring
  const ringX = useSpring(mouseX, { stiffness: 280, damping: 24 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 24 });

  const [variant, setVariant] = useState<CursorVariant>('default');
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Don't render on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea')) {
        setVariant('text');
      } else if (el.closest('a, button, [role="button"], label, select')) {
        setVariant('hover');
      } else {
        setVariant('default');
      }
    };

    const onDown = () => setVariant((v) => (v === 'hover' ? 'hover' : 'click'));
    const onUp = () => setVariant((v) => (v === 'hover' ? 'hover' : 'default'));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isTouch) return null;

  // Ring dimensions per state
  const ringW = { default: 28, hover: 40, click: 14, text: 2 };
  const ringH = { default: 28, hover: 40, click: 14, text: 26 };
  const ringRadius = { default: '50%', hover: '50%', click: '50%', text: '2px' };
  const ringColor = { default: '#58a6ff', hover: '#FFD300', click: '#58a6ff', text: '#58a6ff' };
  const ringOpacity = { default: 0.5, hover: 0.85, click: 0.9, text: 0.7 };
  const ringBorder = { default: 1.5, hover: 2, click: 2, text: 1.5 };

  // Dot: hidden on hover (let the element speak) and text
  const dotVisible = visible && variant !== 'hover' && variant !== 'text';
  const dotSize = variant === 'click' ? 3 : 5;

  return (
    <>
      {/* Outer ring — spring-lagged */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9998,
          border: `${ringBorder[variant]}px solid ${ringColor[variant]}`,
        }}
        animate={{
          width: ringW[variant],
          height: ringH[variant],
          borderRadius: ringRadius[variant],
          opacity: visible ? ringOpacity[variant] : 0,
          borderColor: ringColor[variant],
          borderWidth: ringBorder[variant],
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />

      {/* Inner dot — direct position, no lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          background: '#58a6ff',
          width: dotSize,
          height: dotSize,
        }}
        animate={{
          opacity: dotVisible ? 1 : 0,
          scale: variant === 'click' ? 0.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      />
    </>
  );
}
