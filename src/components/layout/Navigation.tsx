'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navItems.map((item) => item.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isScrolled ? 0 : -100,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 py-2 shadow-lg"
      >
        <div className="flex items-center gap-1">
          {/* Avatar — LEFTMOST in nav bar */}
          <a
            href="#hero"
            className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--color-yellow)]/50 hover:border-[var(--color-yellow)] transition-all mr-1"
          >
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-yellow)]/20 to-[var(--color-purple)]/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--color-yellow)]">
                <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor" opacity="0.5" />
                <path d="M6 8a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
              </svg>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  activeSection === item.href.replace('#', '')
                    ? 'text-[var(--color-yellow)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {activeSection === item.href.replace('#', '') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => toggleTheme(e)}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href="/resume.pdf"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-[var(--color-yellow)] text-[var(--color-text-dark)] font-medium hover:shadow-[var(--shadow-glow-yellow)] transition-all"
            >
              <Download size={14} />
              Resume
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-6"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] hover:text-[var(--color-yellow)] transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href="/resume.pdf"
                className="mt-4 px-6 py-3 rounded-full bg-[var(--color-yellow)] text-[var(--color-text-dark)] font-medium"
              >
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <ScrollProgress />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ x: 16, opacity: 0 }}
      animate={{ x: visible ? 0 : 16, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed right-3 top-1/2 -translate-y-1/2 z-[60] w-[3px] rounded-full overflow-hidden"
      style={{ height: '40vh', background: 'var(--border-color)' }}
    >
      <motion.div
        className="w-full rounded-full bg-gradient-to-b from-[var(--color-yellow)] to-[var(--color-cyan)]"
        style={{ height: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
}
