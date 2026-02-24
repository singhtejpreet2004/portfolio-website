'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { BadgeCheck, Trophy, Lightbulb, FileText } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { achievements } from '@/data/achievements';

// ─────────────────────────────────────────────────────────
// BENTO GRID LAYOUT  (grid-cols-3)
// [0] SQL cert       1-col
// [1] Oracle cert    1-col
// [2] IBM cert       1-col
// [3] Hackathon ★    2-col
// [4] Innospark      1-col
// [5] Top 5 Bharat   1-col
// [6] Patent         2-col
// [7] Research       3-col
// ─────────────────────────────────────────────────────────

const BENTO_CONFIG = [
  { colSpan: 1, size: 'sm' as const },
  { colSpan: 1, size: 'sm' as const },
  { colSpan: 1, size: 'sm' as const },
  { colSpan: 2, size: 'md' as const },
  { colSpan: 1, size: 'sm' as const },
  { colSpan: 1, size: 'sm' as const },
  { colSpan: 2, size: 'md' as const },
  { colSpan: 3, size: 'lg' as const },
];

const typeIcons = {
  certification: BadgeCheck,
  award: Trophy,
  accomplishment: Lightbulb,
};

function BentoCard({
  achievement,
  colSpan,
  size,
  index,
}: {
  achievement: (typeof achievements)[0];
  colSpan: number;
  size: 'sm' | 'md' | 'lg';
  index: number;
}) {
  const Icon = typeIcons[achievement.type] || Lightbulb;
  const isLarge  = size === 'lg';
  const isMedium = size === 'md';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.055,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="relative rounded-2xl border border-[var(--border-color)] overflow-hidden group cursor-default"
      style={{
        gridColumn: `span ${colSpan}`,
        background: 'var(--bg-card)',
        borderLeftWidth: '3px',
        borderLeftColor: achievement.badgeColor,
      }}
    >
      {/* Hover color wash */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `${achievement.badgeColor}07` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.22 }}
      />

      <div className={`relative z-10 h-full flex flex-col ${isLarge ? 'p-5 md:flex-row md:gap-4 md:items-start' : isMedium ? 'p-4' : 'p-3'}`}>
        {/* Icon */}
        <div
          className={`flex-shrink-0 rounded-xl flex items-center justify-center mb-3 ${
            isLarge ? 'w-10 h-10 md:mb-0' : isMedium ? 'w-9 h-9' : 'w-8 h-8'
          }`}
          style={{ backgroundColor: `${achievement.badgeColor}18` }}
        >
          {achievement.type === 'accomplishment'
            ? <FileText size={isLarge ? 18 : isMedium ? 16 : 14} style={{ color: achievement.badgeColor }} />
            : <Icon    size={isLarge ? 18 : isMedium ? 16 : 14} style={{ color: achievement.badgeColor }} />
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Type + date */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: achievement.badgeColor, opacity: 0.75 }}
            >
              {achievement.type}
            </span>
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] flex-shrink-0">
              {achievement.date}
            </span>
          </div>

          {/* Title */}
          <h4
            className={`font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--color-yellow)] transition-colors ${
              isLarge ? 'text-base mb-1.5' : isMedium ? 'text-sm mb-1' : 'text-xs mb-1'
            }`}
          >
            {achievement.title}
          </h4>

          {/* Issuer */}
          <p className="text-[11px] text-[var(--text-secondary)] mb-1.5 opacity-70">
            {achievement.issuer}
          </p>

          {/* Description — md and lg */}
          {(isMedium || isLarge) && (
            <p className={`text-xs text-[var(--text-secondary)] leading-relaxed ${isLarge ? '' : 'line-clamp-2'}`}>
              {achievement.description}
            </p>
          )}

          {/* Shimmer bar */}
          <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${achievement.badgeColor}, transparent)` }}
              initial={{ x: '-110%' }}
              whileInView={{ x: '110%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: index * 0.07 + 0.45, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  // Zoom effect: section scales from 0.97 → 1.02 as it scrolls into view
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset: ['start end', 'center center'],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);
  const scale    = useSpring(rawScale, { stiffness: 55, damping: 18 });

  return (
    <section id="achievements" ref={sectionRef} className="relative py-24 md:py-32">
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-yellow) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-cyan) 0%, transparent 70%)' }}
      />

      <motion.div
        className="max-w-5xl mx-auto px-6"
        style={{ scale, willChange: 'transform', transformOrigin: 'top center' }}
      >
        <SectionHeading
          subtitle="// assert performance.score >= 'excellent'"
          title="Achievements"
        />

        {/* Bento grid */}
        <motion.div
          className="grid gap-3 mt-10"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {achievements.map((achievement, i) => {
            const config = BENTO_CONFIG[i] ?? { colSpan: 1, size: 'sm' as const };
            return (
              <BentoCard
                key={achievement.title}
                achievement={achievement}
                colSpan={config.colSpan}
                size={config.size}
                index={i}
              />
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
