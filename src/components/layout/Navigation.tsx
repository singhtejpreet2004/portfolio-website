'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Download,
  Star, User, Code2, Briefcase, FolderOpen,
  GraduationCap, Trophy, Mail,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'About',        href: '#about',        icon: User          },
  { label: 'Skills',       href: '#skills',       icon: Code2         },
  { label: 'Experience',   href: '#experience',   icon: Briefcase     },
  { label: 'Projects',     href: '#projects',     icon: FolderOpen    },
  { label: 'Education',    href: '#education',    icon: GraduationCap },
  { label: 'Achievements', href: '#achievements', icon: Trophy        },
  { label: 'Contact',      href: '#contact',      icon: Mail          },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen]       = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  // Accent class bundles — yellow in dark, cyan in light
  const aText  = isDark ? 'text-[var(--color-yellow)]'                                                 : 'text-[var(--color-cyan)]';
  const aBorder= isDark ? 'border-[var(--color-yellow)]/50 hover:border-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10' : 'border-[var(--color-cyan)]/50 hover:border-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10';
  const aActive= isDark ? 'bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20'         : 'bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/20';
  const aBg    = isDark ? 'bg-[var(--color-yellow)]'                                                   : 'bg-[var(--color-cyan)]';
  const aBgText= isDark ? 'text-[var(--color-text-dark)]'                                              : 'text-white';
  const aGlow  = isDark ? 'hover:shadow-[var(--shadow-glow-yellow)]'                                   : 'hover:shadow-[var(--shadow-glow-cyan)]';

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
      {/* ── DESKTOP: vertical dock, right side ────────────────── */}
      <motion.nav
        initial={{ x: 120, opacity: 0 }}
        animate={{
          x:       isScrolled ? 0  : 120,
          opacity: isScrolled ? 1  : 0,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-1 glass rounded-2xl px-2 py-3 shadow-xl"
      >
        {/* Star — top of dock, links back to hero */}
        <a
          href="#hero"
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all mb-1 ${aBorder} ${aText}`}
          title="Home"
        >
          <Star size={16} fill="currentColor" />
        </a>

        {/* Divider */}
        <div className="w-6 h-px rounded-full mb-1" style={{ background: 'var(--border-color)' }} />

        {/* Nav items — icon-only vertical stack */}
        {navItems.map((item) => {
          const isActive = activeSection === item.href.replace('#', '');
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              title={item.label}
              className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 ${
                isActive
                  ? aText
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className={`absolute inset-0 rounded-full ${aActive}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
            </a>
          );
        })}

        {/* Divider */}
        <div className="w-6 h-px rounded-full mt-1 mb-1" style={{ background: 'var(--border-color)' }} />

        {/* Theme toggle */}
        <button
          onClick={(e) => toggleTheme(e)}
          className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Resume — icon only in dock */}
        <a
          href="/resume.pdf"
          className={`flex items-center justify-center w-8 h-8 rounded-full ${aBg} ${aBgText} ${aGlow} transition-all mt-0.5`}
          title="Download Resume"
          download
        >
          <Download size={14} />
        </a>
      </motion.nav>

      {/* ── MOBILE: slim top bar ───────────────────────────────── */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y:       isScrolled ? 0   : -60,
          opacity: isScrolled ? 1   : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden fixed top-3 left-3 right-3 z-50 glass rounded-full px-3 py-2 flex items-center justify-between shadow-lg"
      >
        {/* Star — home */}
        <a
          href="#hero"
          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${aBorder} ${aText}`}
        >
          <Star size={14} fill="currentColor" />
        </a>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => toggleTheme(e)}
            className="p-2 rounded-full text-[var(--text-secondary)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full text-[var(--text-secondary)]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      {/* ── MOBILE: fullscreen overlay menu ───────────────────── */}
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
                  className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] hover:text-[var(--color-cyan)] transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href="/resume.pdf"
                className={`mt-4 px-6 py-3 rounded-full font-medium ${aBg} ${aBgText}`}
              >
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll progress — moved to left edge ──────────────── */}
      <ScrollProgress />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);

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
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: visible ? 0 : -16, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-3 top-1/2 -translate-y-1/2 z-[60] w-[3px] rounded-full overflow-hidden"
      style={{ height: '40vh', background: 'var(--border-color)' }}
    >
      <motion.div
        className="w-full rounded-full"
        style={{ height: `${progress}%`, background: 'var(--nav-accent)' }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
}
