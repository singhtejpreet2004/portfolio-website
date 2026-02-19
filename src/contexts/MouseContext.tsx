'use client';

import { createContext, useContext } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

interface MouseContextType {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

// Stable fallback values — used only if a consumer renders outside the provider
function createFallback(): MouseContextType {
  return {
    springX: useMotionValue(0),  // eslint-disable-line react-hooks/rules-of-hooks
    springY: useMotionValue(0),  // eslint-disable-line react-hooks/rules-of-hooks
  };
}

export const MouseContext = createContext<MouseContextType>({
  springX: { get: () => 0 } as unknown as MotionValue<number>,
  springY: { get: () => 0 } as unknown as MotionValue<number>,
});

export const useMouseContext = () => useContext(MouseContext);
