'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapPin, Star, X } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { experiences } from '@/data/experience';

// ─────────────────────────────────────────────────────────
// POPUP — full-screen, backdrop blur
// ─────────────────────────────────────────────────────────

function ExperiencePopup({
  exp,
  onClose,
}: {
  exp: (typeof experiences)[0];
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(6,11,21,0.6)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-card)' }}
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-[var(--border-color)]"
          style={{ background: 'var(--bg-hover)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-cyan)]">
                  {exp.startDate} — {exp.endDate}
                </span>
                <span className="text-[var(--border-color)]">·</span>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <MapPin size={11} />
                  {exp.location}
                </div>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                {exp.company}
              </h3>
              <p className="text-[var(--color-yellow)] font-medium text-sm mt-0.5">{exp.role}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[62vh]">
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{exp.description}</p>

          {/* Bullets */}
          <ul className="space-y-3">
            {exp.bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed"
              >
                <span className="text-[var(--color-cyan)] mt-0.5 shrink-0 text-xs">▸</span>
                {bullet}
              </motion.li>
            ))}
          </ul>

          {/* Key achievement */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl border"
            style={{ background: 'rgba(255,211,0,0.05)', borderColor: 'rgba(255,211,0,0.18)' }}
          >
            <Star size={14} className="text-[var(--color-yellow)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-yellow)]">{exp.keyAchievement}</p>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {exp.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  background: 'rgba(88,166,255,0.07)',
                  borderColor: 'rgba(88,166,255,0.22)',
                  color: 'var(--color-cyan)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// COMMIT NODE — pulsing dot on trunk
// ─────────────────────────────────────────────────────────

function CommitNode({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative z-10"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full border-2 border-[var(--color-cyan)]"
        style={{ background: 'var(--bg-primary)' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--color-cyan)]"
        animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// GIT BRANCH SVG CONNECTOR
// ─────────────────────────────────────────────────────────

function BranchConnector({ side, delay = 0 }: { side: 'left' | 'right'; delay?: number }) {
  // Git PR branch shape:
  //   - starts at the trunk node (x=0 in right branch space)
  //   - curves diagonally outward (like `git checkout -b branch`)
  //   - then runs horizontally to the card
  // viewBox "0 0 100 40": x=0 is trunk, x=100 is card left/right edge
  // Path: M 0,0 (node) → quarter-bezier diagonal → then horizontal at y=38
  // The curve is: M 0 0 C 0 24, 28 38, 40 38 L 100 38
  //   reads as: start at trunk top, curve outward, then straight across
  const d = 'M 0 0 C 0 26 30 38 44 38 L 100 38';

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden
      className={`hidden md:block absolute h-10 pointer-events-none ${
        side === 'right'
          ? 'left-1/2 top-[26px] w-[calc(50%-2rem)]'
          : 'right-1/2 top-[26px] w-[calc(50%-2rem)]'
      }`}
      style={side === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <motion.path
        d={d}
        stroke="var(--color-cyan)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeOpacity="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// TIMELINE CARD — scroll-appear + scroll-fade
// ─────────────────────────────────────────────────────────

function TimelineCard({
  exp,
  index,
  onOpen,
}: {
  exp: (typeof experiences)[0];
  index: number;
  onOpen: () => void;
}) {
  const isLeft = index % 2 === 0;
  const rowRef = useRef<HTMLDivElement>(null);

  // Scroll-driven: fade in on enter, fade out on exit
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [40, 0, 0, -20]);
  const scale   = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [0.96, 1, 1, 0.98]);

  const delay = index * 0.08;

  return (
    <div ref={rowRef} className="relative min-h-[56px]">
      {/* ── Node on trunk (desktop: center, mobile: left-6) ── */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-7 z-10">
        <CommitNode delay={delay} />
      </div>

      {/* ── SVG git branch connector ── */}
      <BranchConnector side={isLeft ? 'left' : 'right'} delay={delay + 0.15} />

      {/* ── Mobile horizontal stub ── */}
      <motion.div
        className="md:hidden absolute left-8 top-8 w-5 h-[1.5px] opacity-40"
        style={{ background: 'var(--color-cyan)' }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
      />

      {/* ── Card ── */}
      <motion.div
        style={{ opacity, y, scale }}
        className={`
          /* mobile: always to the right of left trunk */
          ml-14
          /* desktop: alternating */
          md:ml-0
          ${isLeft
            ? 'md:mr-[calc(50%+2rem)] md:pt-10'
            : 'md:ml-[calc(50%+2rem)] md:pt-10'}
          pt-2
        `}
      >
        <motion.div
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 24 } }}
          onClick={onOpen}
          className="p-5 rounded-xl border border-[var(--border-color)] hover:border-[var(--color-cyan)]/25 transition-colors duration-300 cursor-pointer group"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Date + location */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-cyan)]">
              {exp.startDate} — {exp.endDate}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <MapPin size={11} />
              {exp.location}
            </div>
          </div>

          {/* Company + role */}
          <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--text-primary)] mb-0.5 leading-snug">
            {exp.company}
          </h3>
          <p className="text-sm text-[var(--color-yellow)] font-medium mb-3">{exp.role}</p>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
            {exp.description}
          </p>

          {/* Key achievement */}
          <div
            className="flex items-start gap-2 p-3 rounded-lg mb-4"
            style={{ background: 'rgba(255,211,0,0.05)', border: '1px solid rgba(255,211,0,0.14)' }}
          >
            <Star size={12} className="text-[var(--color-yellow)] mt-0.5 shrink-0" />
            <span className="text-xs text-[var(--color-yellow)] leading-relaxed">{exp.keyAchievement}</span>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {exp.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                style={{
                  background: 'rgba(88,166,255,0.07)',
                  borderColor: 'rgba(88,166,255,0.18)',
                  color: 'var(--color-cyan)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Expand hint */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors">
            <span>View details</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[var(--color-cyan)]"
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function Experience() {
  const [activeExp, setActiveExp] = useState<(typeof experiences)[0] | null>(null);

  return (
    <section id="experience" className="relative py-24 md:py-32">
      {/* Background glow */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 left-0 w-96 h-96 opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-cyan) 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          subtitle="// git log --graph --all --oneline"
          title="Experience"
        />

        {/* Timeline container */}
        <div className="relative mt-12">
          {/* Main trunk — desktop: center, mobile: left-6 */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-px"
            style={{
              background: 'linear-gradient(to bottom, var(--color-cyan), rgba(88,166,255,0.25) 80%, transparent)',
            }}
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />

          {/* Cards */}
          <div className="space-y-20 md:space-y-24">
            {experiences.map((exp, i) => (
              <TimelineCard
                key={exp.id}
                exp={exp}
                index={i}
                onOpen={() => setActiveExp(exp)}
              />
            ))}
          </div>

          {/* End-of-history marker */}
          <motion.div
            className="flex items-center gap-2 mt-10 ml-6 md:ml-[calc(50%-0.5rem)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="w-3 h-3 rounded-sm border border-[var(--color-cyan)]/30 rotate-45"
              style={{ background: 'var(--bg-primary)' }}
            />
            <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] opacity-40">
              HEAD~{experiences.length} · earlier commits archived
            </span>
          </motion.div>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {activeExp && (
          <ExperiencePopup exp={activeExp} onClose={() => setActiveExp(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
