'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'about', label: 'About', icon: '○' },
  { id: 'skills', label: 'Skills', icon: '○' },
  { id: 'experience', label: 'Experience', icon: '○' },
  { id: 'projects', label: 'Projects', icon: '○' },
  { id: 'education', label: 'Education', icon: '○' },
  { id: 'achievements', label: 'Achievements', icon: '○' },
  { id: 'contact', label: 'Contact', icon: '○' },
];

export default function PipelineSpine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(progress);

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300) {
            setActiveSection(sections[i].id);
            setActiveSectionIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mac dock magnification: items near the active one scale up
  const getScale = (index: number) => {
    if (activeSectionIndex < 0) return 1;
    const distance = Math.abs(index - activeSectionIndex);
    if (distance === 0) return 1.5;  // Active: biggest
    if (distance === 1) return 1.2;  // Adjacent: medium
    return 1;                         // Others: normal
  };

  const getNodeSize = (index: number) => {
    if (activeSectionIndex < 0) return 6;
    const distance = Math.abs(index - activeSectionIndex);
    if (distance === 0) return 10;
    if (distance === 1) return 7;
    return 5;
  };

  return (
    <div className="fixed left-5 top-0 bottom-0 z-20 hidden xl:flex flex-col items-center pointer-events-none">
      <div className="relative w-16 h-full flex flex-col items-center">
        {/* Main vertical line — styled as git branch */}
        <div className="absolute left-[19px] top-0 bottom-0 w-[2px]">
          {/* Background line (faint) */}
          <div className="absolute inset-0 bg-[var(--border-color)] rounded-full" />

          {/* Progress fill line */}
          <motion.div
            className="absolute top-0 left-0 w-full rounded-full"
            style={{
              height: `${scrollProgress * 100}%`,
              background: 'linear-gradient(180deg, var(--color-cyan), var(--color-purple), var(--color-yellow))',
            }}
          />

          {/* Flowing particle (commit traveling down the branch) */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${scrollProgress * 100}%`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-cyan)',
              boxShadow: '0 0 10px var(--color-cyan), 0 0 20px var(--color-cyan), 0 0 4px #fff',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Section Nodes — git commits with dock magnification */}
        {sections.map((section, i) => {
          const isActive = activeSection === section.id;
          const isPast = activeSectionIndex >= i;
          const scale = getScale(i);
          const nodeSize = getNodeSize(i);
          const position = 12 + ((i + 1) / (sections.length + 2)) * 76; // % from top

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="pointer-events-auto absolute group flex items-center"
              style={{ top: `${position}%`, left: 0, right: 0 }}
            >
              {/* Git branch fork decoration (small horizontal line from main branch to node) */}
              <div className="flex items-center w-full">
                {/* The node itself */}
                <motion.div
                  className="relative flex items-center justify-center"
                  style={{ marginLeft: 20 - nodeSize / 2 }}
                  animate={{
                    scale,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                >
                  {/* Outer ring (glow when active) */}
                  {isActive && (
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: nodeSize * 2 + 10,
                        height: nodeSize * 2 + 10,
                        background: `radial-gradient(circle, ${isPast ? 'rgba(102,196,255,0.15)' : 'transparent'} 0%, transparent 70%)`,
                      }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Node circle (styled as git commit dot) */}
                  <motion.div
                    className="rounded-full border-2 transition-all duration-500"
                    style={{
                      width: nodeSize * 2,
                      height: nodeSize * 2,
                      borderColor: isActive
                        ? 'var(--color-cyan)'
                        : isPast
                        ? 'var(--color-purple)'
                        : 'var(--border-color)',
                      background: isActive
                        ? 'var(--color-cyan)'
                        : isPast
                        ? 'var(--color-purple)'
                        : 'var(--bg-primary)',
                      boxShadow: isActive
                        ? '0 0 12px rgba(102,196,255,0.6), 0 0 4px rgba(102,196,255,0.8)'
                        : 'none',
                    }}
                  />
                </motion.div>

                {/* Label — scales with dock magnification */}
                <motion.span
                  className="ml-4 font-[family-name:var(--font-jetbrains)] whitespace-nowrap transition-all duration-300"
                  animate={{
                    fontSize: isActive ? '13px' : scale > 1.1 ? '11px' : '10px',
                    opacity: isActive ? 1 : scale > 1.1 ? 0.7 : 0,
                    x: isActive ? 4 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    color: isActive
                      ? 'var(--color-cyan)'
                      : isPast
                      ? 'var(--color-purple)'
                      : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {section.label}
                </motion.span>
              </div>
            </a>
          );
        })}

        {/* Git branch fork lines — connect from main line to offset positions */}
        {/* Small decorative "merge" lines at top and bottom */}
        <div
          className="absolute left-[19px] top-[8%] w-4 h-px"
          style={{ background: 'var(--border-color)' }}
        />
        <div
          className="absolute left-[19px] bottom-[8%] w-4 h-px"
          style={{ background: 'var(--border-color)' }}
        />
      </div>
    </div>
  );
}
