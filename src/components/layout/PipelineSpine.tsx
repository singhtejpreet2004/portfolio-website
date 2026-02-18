'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const sections = ['about', 'skills', 'experience', 'projects', 'education', 'achievements', 'contact'];

export default function PipelineSpine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(progress);

      // Find active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300) {
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
    <div className="fixed left-6 top-0 bottom-0 z-20 hidden xl:flex flex-col items-center pointer-events-none">
      {/* Main Line */}
      <div className="relative w-px h-full">
        {/* Background line */}
        <div className="absolute inset-0 w-px bg-[var(--border-color)]" />

        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-[var(--color-cyan)] to-[var(--color-purple)]"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {/* Flowing particle */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-cyan)]"
          style={{
            top: `${scrollProgress * 100}%`,
            boxShadow: '0 0 8px var(--color-cyan), 0 0 16px var(--color-cyan)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Section Nodes */}
        {sections.map((section, i) => {
          const isActive = activeSection === section;
          const position = ((i + 1) / (sections.length + 1)) * 100;

          return (
            <a
              key={section}
              href={`#${section}`}
              className="pointer-events-auto absolute left-1/2 -translate-x-1/2 group"
              style={{ top: `${position}%` }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--color-cyan)] border-[var(--color-cyan)] shadow-[0_0_8px_rgba(102,196,255,0.6)]'
                    : 'bg-[var(--bg-primary)] border-[var(--border-color)] group-hover:border-[var(--color-cyan)]'
                }`}
              />
              <span
                className={`absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-[family-name:var(--font-jetbrains)] whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--color-cyan)] opacity-100'
                    : 'text-[var(--text-secondary)] opacity-0 group-hover:opacity-70'
                }`}
              >
                {section}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
