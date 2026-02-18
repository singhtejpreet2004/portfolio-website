'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'about', label: 'about', branch: 'feature/about' },
  { id: 'skills', label: 'skills', branch: 'feature/skills' },
  { id: 'experience', label: 'experience', branch: 'feature/experience' },
  { id: 'projects', label: 'projects', branch: 'feature/projects' },
  { id: 'education', label: 'education', branch: 'feature/education' },
  { id: 'achievements', label: 'achievements', branch: 'feature/achievements' },
  { id: 'contact', label: 'contact', branch: 'feature/contact' },
];

// Layout constants — slightly smaller branches to reduce clutter
const MAIN_X = 20;
const BRANCH_X = 55;
const SPREAD = 22;
const LABEL_OFFSET_X = BRANCH_X + 14;

export default function PipelineSpine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);
  // nodeScrollPositions: for each section, the scroll progress (0-1) at which it becomes active
  const [nodeScrollPositions, setNodeScrollPositions] = useState<number[]>([]);
  const [vh, setVh] = useState(0);

  // Calculate the scroll progress at which each section heading appears
  const calculatePositions = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const totalScroll = docHeight - viewportHeight;
    if (totalScroll <= 0) return;

    const positions = sections.map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return 0;
      // Scroll position at which this section's top reaches 300px from viewport top
      const triggerScroll = Math.max(0, el.offsetTop - 300);
      const scrollPercent = triggerScroll / totalScroll;
      // Clamp to 5%-95% of spine height
      return Math.max(0.05, Math.min(0.95, scrollPercent));
    });

    setNodeScrollPositions(positions);
    setVh(viewportHeight);
  }, []);

  useEffect(() => {
    calculatePositions();
    const t1 = setTimeout(calculatePositions, 500);
    const t2 = setTimeout(calculatePositions, 2000);
    window.addEventListener('resize', calculatePositions);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', calculatePositions);
    };
  }, [calculatePositions]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);

      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300) {
            setActiveSectionIndex(i);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveSectionIndex(-1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (vh === 0 || nodeScrollPositions.length === 0) return null;

  return (
    <div className="fixed left-4 top-0 bottom-0 z-20 hidden xl:flex pointer-events-none">
      <div className="relative h-full" style={{ width: '220px' }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 220 ${vh}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="spineGrad" x1={MAIN_X} y1={0} x2={MAIN_X} y2={vh} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-cyan)" />
              <stop offset="50%" stopColor="var(--color-purple)" />
              <stop offset="100%" stopColor="var(--color-yellow)" />
            </linearGradient>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lineGlow" x="-200%" y="-5%" width="500%" height="110%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main branch line (background) */}
          <line
            x1={MAIN_X} y1={0} x2={MAIN_X} y2={vh}
            stroke="var(--border-color)" strokeWidth={1.5} opacity={0.25}
          />

          {/* Progress fill on main line — glowing colour fill */}
          <line
            x1={MAIN_X} y1={0} x2={MAIN_X} y2={scrollProgress * vh}
            stroke="url(#spineGrad)" strokeWidth={2.5}
            filter="url(#lineGlow)"
          />

          {/* Branch curves for each section */}
          {sections.map((section, i) => {
            const scrollPos = nodeScrollPositions[i];
            if (!scrollPos && scrollPos !== 0) return null;

            // Node Y position = the scroll position mapped to viewport height
            const nodeY = scrollPos * vh;
            const forkY = nodeY - SPREAD;
            const mergeY = nodeY + SPREAD;
            const isPast = activeSectionIndex > i;
            const isActive = activeSectionIndex === i;
            const isFuture = !isPast && !isActive;

            const handleLen = SPREAD * 0.6;

            // Fork path: main → branch node
            const forkPath = `M ${MAIN_X} ${forkY} C ${MAIN_X} ${forkY + handleLen}, ${BRANCH_X} ${nodeY - handleLen}, ${BRANCH_X} ${nodeY}`;

            // Merge path: branch node → main
            const mergePath = `M ${BRANCH_X} ${nodeY} C ${BRANCH_X} ${nodeY + handleLen}, ${MAIN_X} ${mergeY - handleLen}, ${MAIN_X} ${mergeY}`;

            const branchColor = isActive
              ? 'var(--color-cyan)'
              : isPast
                ? 'var(--color-purple)'
                : 'var(--border-color)';

            // Future: faint dot on main line
            if (isFuture) {
              return (
                <g key={section.id}>
                  <circle cx={MAIN_X} cy={nodeY} r={2.5} fill="var(--border-color)" opacity={0.12} />
                </g>
              );
            }

            return (
              <g key={section.id}>
                {/* Fork curve */}
                <motion.path
                  d={forkPath}
                  fill="none"
                  stroke={branchColor}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  opacity={isActive ? 0.8 : 0.2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Merge curve (past only — faded) */}
                {isPast && (
                  <motion.path
                    d={mergePath}
                    fill="none"
                    stroke={branchColor}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    opacity={0.15}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
                  />
                )}

                {/* Fork dot on main line */}
                <circle
                  cx={MAIN_X} cy={forkY} r={2}
                  fill="var(--bg-primary)"
                  stroke={branchColor}
                  strokeWidth={1}
                  opacity={isActive ? 0.7 : 0.15}
                />

                {/* Merge dot on main line (past only — very faded) */}
                {isPast && (
                  <circle
                    cx={MAIN_X} cy={mergeY} r={2}
                    fill="var(--bg-primary)"
                    stroke={branchColor}
                    strokeWidth={1}
                    opacity={0.1}
                  />
                )}

                {/* Active glow */}
                {isActive && (
                  <motion.circle
                    cx={BRANCH_X} cy={nodeY} r={12}
                    fill="var(--color-cyan)" opacity={0.06}
                    filter="url(#nodeGlow)"
                    animate={{ r: [10, 15, 10], opacity: [0.04, 0.08, 0.04] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}

                {/* Branch node circle */}
                <motion.circle
                  cx={BRANCH_X} cy={nodeY}
                  r={isActive ? 6 : isPast ? 4 : 3}
                  fill={isActive ? branchColor : 'var(--bg-primary)'}
                  stroke={branchColor}
                  strokeWidth={1.5}
                  opacity={isActive ? 1 : 0.25}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
                />

                {/* Inner dot for active */}
                {isActive && (
                  <circle cx={BRANCH_X} cy={nodeY} r={2} fill="#fff" opacity={0.8} />
                )}

                {/* Data particle on active branch */}
                {isActive && (
                  <motion.circle
                    r={2}
                    fill="var(--color-cyan)"
                    filter="url(#nodeGlow)"
                    animate={{
                      cx: [MAIN_X, (MAIN_X + BRANCH_X) / 2, BRANCH_X],
                      cy: [forkY, (forkY + nodeY) / 2, nodeY],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </g>
            );
          })}

          {/* Flowing particle on main line — bright leading dot */}
          <motion.circle
            cx={MAIN_X}
            cy={scrollProgress * vh}
            r={4}
            fill="var(--color-cyan)"
            filter="url(#lineGlow)"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </svg>

        {/* HTML labels */}
        {sections.map((section, i) => {
          const scrollPos = nodeScrollPositions[i];
          if (!scrollPos && scrollPos !== 0) return null;

          const isPast = activeSectionIndex > i;
          const isActive = activeSectionIndex === i;
          const isFuture = !isPast && !isActive;

          if (isFuture) return null;

          // Position as percentage of viewport height
          const topPercent = scrollPos * 100;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="pointer-events-auto absolute"
              style={{
                top: `${topPercent}%`,
                left: LABEL_OFFSET_X,
                transform: 'translateY(-50%)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
                className="flex flex-col"
              >
                <span
                  className="font-[family-name:var(--font-jetbrains)] whitespace-nowrap leading-none"
                  style={{
                    fontSize: isActive ? '10px' : '9px',
                    color: isActive ? 'var(--color-cyan)' : 'var(--color-purple)',
                    fontWeight: isActive ? 700 : 400,
                    opacity: isActive ? 1 : 0.3,
                  }}
                >
                  {isActive ? '* ' : '  '}{section.branch}
                </span>

                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    className="font-[family-name:var(--font-jetbrains)] text-[7px] text-[var(--text-secondary)] mt-0.5 whitespace-nowrap"
                  >
                    {'  '}HEAD → {section.label}
                  </motion.span>
                )}

                {isPast && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="font-[family-name:var(--font-jetbrains)] text-[7px] text-[var(--color-purple)] mt-0.5 whitespace-nowrap"
                  >
                    {'  '}merged
                  </motion.span>
                )}
              </motion.div>
            </a>
          );
        })}

        {/* "main" label */}
        <div
          className="absolute font-[family-name:var(--font-jetbrains)] text-[8px] text-[var(--color-green)] opacity-30"
          style={{ left: MAIN_X - 8, top: '3%' }}
        >
          main
        </div>
      </div>
    </div>
  );
}
