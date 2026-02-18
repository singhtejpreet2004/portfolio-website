'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always boot in dark mode — clear any stale light-mode preference
    localStorage.removeItem('theme');
    document.documentElement.removeAttribute('data-theme');
  }, []);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : 0;

    if (isTransitioning) return;
    setIsTransitioning(true);

    // Calculate the maximum radius needed to cover the entire viewport
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.background = newTheme === 'light' ? '#FAFAF8' : '#10162F';
      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      overlay.style.display = 'block';
      overlay.style.transition = 'clip-path 0.6s ease-in-out';

      requestAnimationFrame(() => {
        overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
      });

      setTimeout(() => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        overlay.style.display = 'none';
        overlay.style.transition = 'none';
        setIsTransitioning(false);
      }, 600);
    } else {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      setIsTransitioning(false);
    }
  }, [theme, isTransitioning]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <div
        ref={overlayRef}
        className="theme-transition"
        style={{ display: 'none' }}
      />
    </ThemeContext.Provider>
  );
}
