'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
// COMMIT NODE — burst flash + 3 staggered ripple rings
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
      {/* One-time burst flash on appear */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--color-cyan)]"
        initial={{ scale: 1, opacity: 0.9 }}
        whileInView={{ scale: 5, opacity: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.1, ease: 'easeOut' }}
      />

      {/* 3 staggered continuous ripple rings */}
      {([0, 0.7, 1.4] as number[]).map((ringOffset) => (
        <motion.div
          key={ringOffset}
          className="absolute inset-0 rounded-full bg-[var(--color-cyan)]"
          animate={{ scale: [1, 2.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeOut',
            delay: delay + ringOffset,
          }}
        />
      ))}

      {/* The dot */}
      <div
        className="relative w-3.5 h-3.5 rounded-full border-2 border-[var(--color-cyan)]"
        style={{
          background: 'var(--bg-primary)',
          boxShadow: '0 0 10px rgba(88,166,255,0.55)',
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// GIT BRANCH CONNECTOR — draw-in + traveling pulse
// ─────────────────────────────────────────────────────────

function BranchConnector({ side, delay = 0 }: { side: 'left' | 'right'; delay?: number }) {
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
      {/* Base path — draws in */}
      <motion.path
        d={d}
        stroke="var(--color-cyan)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeOpacity="0.35"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      />
      {/* Glow overlay — thinner, brighter */}
      <motion.path
        d={d}
        stroke="var(--color-cyan)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeOpacity="0.65"
        style={{ filter: 'drop-shadow(0 0 2px rgba(88,166,255,0.7))' }}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      />
      {/* Traveling pulse — white segment sweeps from 0% to 100% of path */}
      <motion.path
        d={d}
        stroke="white"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.85"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
        initial={{ pathLength: 0.16, pathOffset: 0 }}
        whileInView={{ pathLength: 0.16, pathOffset: 0.84 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.58, ease: 'easeInOut' }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// SHARED ANIMATION VARIANTS (module-level — stable references)
// ─────────────────────────────────────────────────────────

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.55 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 500, damping: 22 },
  },
};

// Stable module-level variant for badge stagger group
const badgeGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.038 } },
};

// ─────────────────────────────────────────────────────────
// TIMELINE CARD — 3D entrance + staggered content + hover tilt
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
  const delay = index * 0.08;

  // Scroll-driven appear / disappear
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [52, 0, 0, -28]);
  const scale   = useTransform(scrollYProgress, [0, 0.12, 0.80, 1], [0.92, 1, 1, 0.96]);

  // Stagger container — memoized so the variants object reference is stable
  const contentVariants = useMemo(() => ({
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.065, delayChildren: delay + 0.24 },
    },
  }), [delay]);

  return (
    <div ref={rowRef} className="relative min-h-[56px]">
      {/* ── Node on trunk ── */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-7 z-10">
        <CommitNode delay={delay} />
      </div>

      {/* ── SVG git branch connector ── */}
      <BranchConnector side={isLeft ? 'left' : 'right'} delay={delay + 0.12} />

      {/* ── Mobile horizontal stub ── */}
      <motion.div
        className="md:hidden absolute left-8 top-8 w-5 h-[1.5px] opacity-40"
        style={{ background: 'var(--color-cyan)' }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
      />

      {/* ── Scroll-driven wrapper ── */}
      <motion.div
        style={{ opacity, y, scale }}
        className={`
          ml-14
          md:ml-0
          ${isLeft ? 'md:mr-[calc(50%+2rem)] md:pt-10' : 'md:ml-[calc(50%+2rem)] md:pt-10'}
          pt-2
        `}
      >
        {/* ── Card: 3D flip-in + hover tilt ── */}
        {/* perspective:900 on the same element as rotateX → correct 3D chain */}
        <motion.div
          initial={{ rotateX: 16 }}
          whileInView={{ rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, damping: 22, delay: delay + 0.04 }}
          whileHover={{
            y: -5,
            rotateX: -1.5,
            rotateY: isLeft ? 2.5 : -2.5,
            boxShadow: '0 14px 52px rgba(0,0,0,0.38), 0 0 28px rgba(88,166,255,0.1)',
            transition: { type: 'spring', stiffness: 340, damping: 28 },
          }}
          onClick={onOpen}
          className="p-5 rounded-xl border border-[var(--border-color)] hover:border-[var(--color-cyan)]/30 transition-colors duration-300 cursor-pointer group relative overflow-hidden"
          style={{ background: 'var(--bg-card)', perspective: 900 }}
        >
          {/* Hover top-edge glow (CSS group-hover for performance) */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(88,166,255,0.08) 0%, transparent 65%)',
            }}
          />

          {/* ── Staggered content ── */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Date + location */}
            <motion.div variants={rowVariants} className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-cyan)]">
                {exp.startDate} — {exp.endDate}
              </span>
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <MapPin size={11} />
                {exp.location}
              </div>
            </motion.div>

            {/* Company */}
            <motion.h3
              variants={rowVariants}
              className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--text-primary)] mb-0.5 leading-snug"
            >
              {exp.company}
            </motion.h3>

            {/* Role */}
            <motion.p variants={rowVariants} className="text-sm text-[var(--color-yellow)] font-medium mb-3">
              {exp.role}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={rowVariants}
              className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3"
            >
              {exp.description}
            </motion.p>

            {/* Key achievement */}
            <motion.div
              variants={rowVariants}
              className="flex items-start gap-2 p-3 rounded-lg mb-4"
              style={{ background: 'rgba(255,211,0,0.05)', border: '1px solid rgba(255,211,0,0.14)' }}
            >
              <Star size={12} className="text-[var(--color-yellow)] mt-0.5 shrink-0" />
              <span className="text-xs text-[var(--color-yellow)] leading-relaxed">
                {exp.keyAchievement}
              </span>
            </motion.div>

            {/* Tech badges — own stagger (module-level variants = stable ref) */}
            <motion.div
              variants={badgeGroupVariants}
              className="flex flex-wrap gap-1.5 mb-4"
            >
              {exp.techStack.map((tech) => (
                <motion.span
                  key={tech}
                  variants={badgeVariants}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                  style={{
                    background: 'rgba(88,166,255,0.07)',
                    borderColor: 'rgba(88,166,255,0.18)',
                    color: 'var(--color-cyan)',
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Expand hint */}
            <motion.div
              variants={rowVariants}
              className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors"
            >
              <span>View details</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[var(--color-cyan)]"
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
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
      {/* Background glows */}
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
          {/* Main trunk line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-px"
            style={{
              background:
                'linear-gradient(to bottom, var(--color-cyan), rgba(88,166,255,0.25) 80%, transparent)',
            }}
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />

          {/* Trunk shimmer — scrolling pulse traveling down the line */}
          <div className="absolute left-6 md:left-1/2 -translate-x-px top-0 bottom-0 w-[2px] overflow-hidden pointer-events-none">
            <motion.div
              style={{
                position: 'absolute',
                width: '100%',
                height: '28%',
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(88,166,255,0.75) 35%, rgba(88,166,255,0.9) 50%, rgba(88,166,255,0.75) 65%, transparent 100%)',
              }}
              animate={{ y: ['-28%', '128%'] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1.0,
                delay: 1.6,
              }}
            />
          </div>

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
