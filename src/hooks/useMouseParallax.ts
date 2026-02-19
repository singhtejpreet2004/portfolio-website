'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

export interface MouseParallaxValues {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

export function useMouseParallax(): MouseParallaxValues {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Lazy spring — feels floaty and organic
  const springX = useSpring(mouseX, { stiffness: 40, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 15 });

  useEffect(() => {
    // No parallax on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return { springX, springY };
}
