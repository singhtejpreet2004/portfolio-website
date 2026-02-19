'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion';
import { ExternalLink, Github, X, Zap } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';

// ─────────────────────────────────────────────────────────
// TECH ICON MAP — react-icons
// ─────────────────────────────────────────────────────────

import {
  SiApachekafka,
  SiDocker,
  SiFlask,
  SiGrafana,
  SiPrometheus,
  SiInfluxdb,
  SiTensorflow,
  SiApacheairflow,
  SiApachespark,
  SiPostgresql,
  SiJupyter,
  SiPython,
  SiMariadb,
} from 'react-icons/si';
import { FaDatabase, FaServer } from 'react-icons/fa';

type IconComp = React.ComponentType<{ size?: number; color?: string }>;

const TECH_ICONS: Record<string, { icon: IconComp; color: string }> = {
  'Apache Kafka':     { icon: SiApachekafka   as IconComp, color: '#88b4d4' },
  'Docker':           { icon: SiDocker        as IconComp, color: '#2496ED' },
  'Flask':            { icon: SiFlask         as IconComp, color: '#aaaaaa' },
  'Grafana':          { icon: SiGrafana       as IconComp, color: '#F46800' },
  'Prometheus':       { icon: SiPrometheus    as IconComp, color: '#E6522C' },
  'InfluxDB':         { icon: SiInfluxdb      as IconComp, color: '#22ADF6' },
  'TensorFlow Lite':  { icon: SiTensorflow    as IconComp, color: '#FF8C00' },
  'Apache Airflow':   { icon: SiApacheairflow as IconComp, color: '#017CEE' },
  'PySpark':          { icon: SiApachespark   as IconComp, color: '#E25A1C' },
  'MinIO':            { icon: FaServer        as IconComp, color: '#C72E49' },
  'PostgreSQL':       { icon: SiPostgresql    as IconComp, color: '#4169E1' },
  'Delta Lake':       { icon: FaDatabase      as IconComp, color: '#00ADD8' },
  'Jupyter':          { icon: SiJupyter       as IconComp, color: '#F37626' },
  'Python':           { icon: SiPython        as IconComp, color: '#3776AB' },
  'MariaDB':          { icon: SiMariadb       as IconComp, color: '#4eb5c0' },
  'Launchd':          { icon: FaDatabase      as IconComp, color: '#888888' },
  'Redpanda Console': { icon: FaServer        as IconComp, color: '#E85B5B' },
};

function TechIcon({ tech, size = 18 }: { tech: string; size?: number }) {
  const entry = TECH_ICONS[tech];
  if (!entry) {
    return (
      <span
        title={tech}
        className="px-1.5 py-0.5 rounded text-[9px] font-medium font-[family-name:var(--font-jetbrains)]"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
      >
        {tech}
      </span>
    );
  }
  const Icon = entry.icon;
  return (
    <span title={tech} className="relative group/ti flex items-center justify-center">
      <Icon size={size} color={entry.color} />
      <span
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap opacity-0 group-hover/ti:opacity-100 transition-opacity z-20"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
      >
        {tech}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// PROJECT POPUP
// ─────────────────────────────────────────────────────────

function ProjectPopup({
  project,
  onClose,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(6,11,21,0.65)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

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
        <div className="px-6 py-5 border-b border-[var(--border-color)]" style={{ background: 'var(--bg-hover)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-cyan)]">
                  {project.date}
                </span>
                <span className="text-[var(--border-color)]">·</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ background: 'rgba(88,166,255,0.1)', color: 'var(--color-cyan)', border: '1px solid rgba(88,166,255,0.2)' }}
                >
                  {project.category}
                </span>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)] leading-snug">
                {project.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[62vh]">
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{project.longDescription}</p>

          <div
            className="flex items-start gap-3 p-4 rounded-xl border"
            style={{ background: 'rgba(91,204,126,0.05)', borderColor: 'rgba(91,204,126,0.18)' }}
          >
            <Zap size={14} className="text-[var(--color-green)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-green)]">{project.metrics}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-[var(--text-secondary)]">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              {project.techStack.map((tech) => <TechIcon key={tech} tech={tech} size={22} />)}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-hover)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <Github size={15} /> View Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[var(--shadow-glow-yellow)]"
                style={{ background: 'var(--color-yellow)', color: 'var(--color-text-dark)' }}
              >
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// COMMIT NODE — burst flash + continuous ripple rings
// ─────────────────────────────────────────────────────────

function CommitNode({ active, featured = false }: { active: boolean; featured?: boolean }) {
  const accent     = featured ? 'var(--color-yellow)' : 'var(--color-cyan)';
  const accentRgba = featured ? 'rgba(255,211,0,0.55)' : 'rgba(88,166,255,0.55)';

  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      {/* One-time burst when becoming active */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="burst"
            className="absolute w-full h-full rounded-full"
            style={{ background: accent }}
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 5.5, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Staggered ripple rings — only when active */}
      {active && ([0, 0.75, 1.5] as number[]).map((off) => (
        <motion.div
          key={off}
          className="absolute w-full h-full rounded-full"
          style={{ background: accent }}
          animate={{ scale: [1, 3.2, 1], opacity: [0.38, 0, 0.38] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: off }}
        />
      ))}

      {/* Dot */}
      <motion.div
        className="relative w-3.5 h-3.5 rounded-full border-2"
        animate={{
          borderColor: active ? accent : 'rgba(88,166,255,0.22)',
          boxShadow:   active ? `0 0 14px ${accentRgba}` : '0 0 0 transparent',
          scale:       active ? [1, 1.25, 1] : 1,
        }}
        transition={{
          scale:       { duration: 0.45, ease: 'easeOut' },
          borderColor: { duration: 0.3 },
          boxShadow:   { duration: 0.3 },
        }}
        style={{ background: 'var(--bg-primary)' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CURVED BRANCH CONNECTOR — S-curve from dot down to card
// ─────────────────────────────────────────────────────────

const BRANCH_H = 88; // px  — tall enough to fill space + show curve
// S-curve: starts at top-center, loops right, lands at bottom-center
const BRANCH_PATH = 'M 20 0 C 38 22 2 52 20 88';

function BranchConnector({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 40 88"
      preserveAspectRatio="none"
      className="block mx-auto pointer-events-none"
      style={{ width: 40, height: BRANCH_H }}
      aria-hidden
    >
      {/* Dim base */}
      <motion.path
        d={BRANCH_PATH}
        stroke="var(--color-cyan)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        animate={{ strokeOpacity: active ? 0.5 : 0.14 }}
        transition={{ duration: 0.4 }}
      />
      {/* Glow layer */}
      <motion.path
        d={BRANCH_PATH}
        stroke="var(--color-cyan)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        fill="none"
        style={{ filter: 'drop-shadow(0 0 3px rgba(88,166,255,0.75))' }}
        animate={{ strokeOpacity: active ? 0.85 : 0 }}
        transition={{ duration: 0.4 }}
      />
      {/* Draw-in on first appear */}
      <motion.path
        d={BRANCH_PATH}
        stroke="var(--color-cyan)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeOpacity={0}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      />
      {/* Traveling white pulse — active only */}
      {active && (
        <motion.path
          d={BRANCH_PATH}
          stroke="white"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.85"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.65))' }}
          initial={{ pathLength: 0.18, pathOffset: 0 }}
          animate={{ pathLength: 0.18, pathOffset: 0.82 }}
          transition={{ duration: 0.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4 }}
        />
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// CARD ITEM — date label + dot + curved branch + meta + card
// ─────────────────────────────────────────────────────────

const CARD_W     = 420;
const CARD_GAP   = 100;
const CARD_STRIDE = CARD_W + CARD_GAP;

function CardItem({
  project,
  index,
  total,
  state,
  onClick,
  onBranchClick,
}: {
  project: (typeof projects)[0];
  index: number;
  total: number;
  state: 'active' | 'left' | 'right';
  onClick: () => void;
  onBranchClick: () => void;
}) {
  const isActive = state === 'active';
  const isLeft   = state === 'left';

  // Derive a slug for the git branch label
  const branchSlug = project.category
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: CARD_W, flexShrink: 0 }}
    >
      {/* ── Date label above dot — springs in when active ── */}
      <div className="relative h-8 flex items-end justify-center mb-1">
        <AnimatePresence>
          {isActive && (
            <motion.span
              key="date"
              initial={{ opacity: 0, y: 10, scale: 0.75 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className="absolute bottom-0 text-xs font-[family-name:var(--font-jetbrains)] tracking-wide whitespace-nowrap"
              style={{ color: project.featured ? 'var(--color-yellow)' : 'var(--color-cyan)' }}
            >
              {project.date}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Dot — sits on the spine line */}
      <CommitNode active={isActive} featured={project.featured} />

      {/* Curved branch downward */}
      <BranchConnector active={isActive} />

      {/* ── Git meta strip — fills connector space with character ── */}
      <div className="w-full flex flex-col items-center gap-1.5 mb-4">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active-meta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center gap-1.5 w-full"
            >
              {/* Branch name */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border"
                style={{
                  background: 'rgba(88,166,255,0.07)',
                  borderColor: 'rgba(88,166,255,0.22)',
                }}
              >
                <span className="text-[10px] text-[var(--color-cyan)] opacity-60">⎇</span>
                <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)]">
                  feature/{branchSlug}
                </span>
              </div>
              {/* Commit counter */}
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] opacity-50">
                commit {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="inactive-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLeft ? 0.1 : 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-9" // spacer to keep layout stable
            />
          )}
        </AnimatePresence>
      </div>

      {/* Card */}
      <motion.div
        onClick={isActive ? onClick : undefined}
        animate={{
          scale:   isActive ? 1    : 0.76,
          opacity: isLeft   ? 0.14 : isActive ? 1 : 0.52,
          y:       isActive ? 0    : 18,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className={`w-full rounded-2xl border overflow-hidden group ${
          isActive ? 'cursor-pointer' : 'cursor-default pointer-events-none'
        }`}
        style={{
          background: 'var(--bg-card)',
          borderColor: isActive ? 'rgba(88,166,255,0.4)' : 'var(--border-color)',
          boxShadow: isActive
            ? '0 24px 72px rgba(0,0,0,0.55), 0 0 48px rgba(88,166,255,0.09)'
            : '0 4px 16px rgba(0,0,0,0.18)',
          willChange: 'transform',
        }}
      >
        {/* Featured top bar */}
        {project.featured && (
          <div
            className="h-0.5 w-full"
            style={{ background: 'linear-gradient(to right, var(--color-yellow), var(--color-cyan))' }}
          />
        )}

        <div className="p-6">
          {/* Category + date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{ background: 'rgba(88,166,255,0.1)', color: 'var(--color-cyan)', border: '1px solid rgba(88,166,255,0.2)' }}
              >
                {project.category}
              </span>
              {project.featured && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'var(--color-yellow)', color: '#000' }}
                >
                  ★ FEATURED
                </span>
              )}
            </div>
            <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--text-primary)] mb-2 leading-snug line-clamp-2 group-hover:text-[var(--color-yellow)] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Tech icons */}
          <div className="flex flex-wrap gap-3 items-center mb-5">
            {project.techStack.map((tech) => (
              <TechIcon key={tech} tech={tech} size={20} />
            ))}
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-2 text-xs mb-5">
            <Zap size={12} className="text-[var(--color-green)]" />
            <span className="font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">
              {project.metrics}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <motion.span
              className="text-xs text-[var(--color-cyan)] font-[family-name:var(--font-jetbrains)]"
              animate={isActive ? { opacity: [0.6, 1, 0.6] } : { opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              click to expand →
            </motion.span>
            <div className="flex gap-1.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pointer-events-auto"
                >
                  <Github size={15} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pointer-events-auto"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// EASTER EGG 1 — PR Merge toast (click branch label)
// ─────────────────────────────────────────────────────────

function PRMergeToast({ project, onDone }: { project: (typeof projects)[0]; onDone: () => void }) {
  const sha = Math.random().toString(16).slice(2, 9);
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(91,204,126,0.15) 0%, rgba(88,166,255,0.08) 100%)',
        border: '1px solid rgba(91,204,126,0.35)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-base">🟣</span>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          PR merged into <span className="text-[var(--color-cyan)]">main</span>
        </p>
        <p className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
          feat/{project.category.toLowerCase().replace(/\s+/g, '-')} · {sha}
        </p>
      </div>
      <span className="text-[var(--color-green)] text-sm font-bold">✓ Merged</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// EASTER EGG 2 — git log terminal (triple-click active card)
// ─────────────────────────────────────────────────────────

function GitLogTerminal({ projects: projs, onClose }: { projects: typeof projects; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const lines = projs.map((p) => ({
    sha: Math.random().toString(16).slice(2, 9),
    msg: `feat(${p.category.toLowerCase().replace(/\s+/g, '-')}): ${p.title.split(' ').slice(0, 5).join(' ')}`,
    date: p.date,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(6,11,21,0.7)', backdropFilter: 'blur(10px)' }} />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
        style={{ background: '#0d1117' }}
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)]" style={{ background: '#161b22' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] ml-2">
            git log --oneline --graph
          </span>
        </div>

        {/* Log lines */}
        <div className="p-4 space-y-2">
          <p className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] mb-3">
            * HEAD → main
          </p>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.15 }}
              className="flex items-start gap-3 font-[family-name:var(--font-jetbrains)] text-[12px]"
            >
              <span className="text-[var(--color-yellow)] shrink-0">* </span>
              <span className="text-[var(--color-green)] shrink-0">{line.sha}</span>
              <span className="text-[var(--text-primary)] flex-1 leading-relaxed">{line.msg}</span>
              <span className="text-[var(--text-secondary)] shrink-0 text-[10px]">{line.date}</span>
            </motion.div>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lines.length * 0.1 + 0.3 }}
            className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] mt-4 opacity-60"
          >
            (END) · press ESC or click outside to close
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// EASTER EGG 3 — "all seen" celebration confetti burst
// ─────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#58a6ff', '#FFD300', '#5BCC7E', '#ff79c6', '#bd93f9'];

function ConfettiPiece({ color, index }: { color: string; index: number }) {
  const angle = (index / 18) * Math.PI * 2;
  const dist  = 120 + Math.random() * 80;
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm pointer-events-none"
      style={{ background: color, left: '50%', top: '50%' }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={{
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotate: Math.random() * 360,
        opacity: 0,
      }}
      transition={{ duration: 0.9 + Math.random() * 0.4, ease: [0.22, 0.68, 0, 1.2] }}
    />
  );
}

function AllSeenCelebration({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const pieces = Array.from({ length: 18 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    i,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center gap-3">
        {/* Confetti */}
        {pieces.map(({ color, i }) => (
          <ConfettiPiece key={i} color={color} index={i} />
        ))}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl text-center"
          style={{
            background: 'rgba(16,22,47,0.92)',
            border: '1px solid rgba(88,166,255,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-2xl">🎉</span>
          <p className="text-sm font-bold text-[var(--text-primary)]">All commits reviewed</p>
          <p className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)]">
            git log --all · HEAD detached @ latest
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// SORT: latest first
// ─────────────────────────────────────────────────────────

const sortedProjects = [...projects].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function Projects() {
  const n = sortedProjects.length;

  // The outer container is (n+0.5) × 100vh tall — gives each card ~100vh of scroll
  // plus a 50vh entrance buffer.
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Map: first 15% = entrance, remaining = card traversal
  // x goes from −CARD_W/2 (card 0 centered) to −CARD_W/2 − (n−1)×CARD_STRIDE (card n-1 centered)
  const xInitial = -(CARD_W / 2);
  const xFinal   = xInitial - (n - 1) * CARD_STRIDE;

  // Smoother spring: lower stiffness = silkier feel, restSpeed avoids abrupt stop
  const rawX = useTransform(scrollYProgress, [0.12, 1], [xInitial, xFinal], { clamp: true });
  const x    = useSpring(rawX, { stiffness: 38, damping: 14, mass: 0.9, restSpeed: 0.001 });

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(rawX, 'change', (val) => {
    const floatIdx = (-(val) - CARD_W / 2) / CARD_STRIDE;
    setActiveIndex(Math.max(0, Math.min(Math.round(floatIdx), n - 1)));
  });

  // Entrance: section becomes visible
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = sortedProjects.find((p) => p.id === selectedId) ?? null;

  // Spine progress fill width (inside the track, from card-0-center to active-card-center)
  const spineFilledWidth = activeIndex * CARD_STRIDE;

  // ── Easter egg state ──
  // EE1: PR merge toast — click branch label
  const [prProject, setPrProject] = useState<(typeof projects)[0] | null>(null);

  // EE2: git log terminal — triple-click active card
  const [showGitLog, setShowGitLog] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCardTripleClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 600);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setShowGitLog(true);
    }
  }, []);

  // EE3: all-seen celebration — track visited project indices
  const visitedRef   = useRef(new Set<number>([0])); // starts at 0
  const [showAllSeen, setShowAllSeen] = useState(false);
  const allSeenShownRef = useRef(false);
  useEffect(() => {
    visitedRef.current.add(activeIndex);
    if (!allSeenShownRef.current && visitedRef.current.size === n) {
      allSeenShownRef.current = true;
      // small delay so the last card settles first
      setTimeout(() => setShowAllSeen(true), 600);
    }
  }, [activeIndex, n]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: `${(n + 0.5) * 100}vh` }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
      />

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

        {/* Heading */}
        <motion.div
          className="pt-14 pb-2 max-w-7xl mx-auto px-6 w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <SectionHeading
            subtitle="// git log --oneline --graph -- projects/"
            title="Projects"
          />
        </motion.div>

        {/* Card track area */}
        <div className="flex-1 relative overflow-hidden flex items-start">

          {/* ── HORIZONTAL SPINE LINE (fixed overlay, behind everything) ──
               top = 32px: date label (h-8=32px) + 1px(margin) = 33 → use 42 to hit CommitNode center
               CommitNode is h-5=20px. Its center is at 10px. Date area is h-8(32px) + mb-1(4px) = 36px above dot.
               So dot center from card-item top = 36 + 10 = 46px.
          ── */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            style={{
              left: 0,
              right: 0,
              top: 46,
              height: 2,
              background: 'linear-gradient(to right, transparent 2%, rgba(88,166,255,0.18) 8%, rgba(88,166,255,0.18) 92%, transparent 98%)',
            }}
            initial={{ scaleX: 0 }}
            animate={entered ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.35 }}
          />

          {/* Shimmer on spine */}
          {entered && (
            <div
              className="absolute z-0 pointer-events-none overflow-hidden"
              style={{ left: 0, right: 0, top: 46, height: 2 }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '12%',
                  background: 'linear-gradient(to right, transparent, rgba(88,166,255,0.8), transparent)',
                }}
                animate={{ x: ['-12%', '950%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.0, delay: 1.4 }}
              />
            </div>
          )}

          {/* ── CARD TRACK ── scrolls horizontally */}
          {/* Positioned at left:50% so card 0 (at -CARD_W/2) starts centered */}
          <motion.div
            className="absolute flex"
            style={{
              left: '50%',
              top: 0,
              x,
              gap: CARD_GAP,
              alignItems: 'flex-start',
              willChange: 'transform',
            }}
          >
            {/* Spine line segment connecting all dots (inside the track) */}
            {n > 1 && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  top: 46, // dot center y (36px date area + 10px dot center)
                  left: CARD_W / 2,
                  width: (n - 1) * CARD_STRIDE,
                  height: 2,
                  background: 'rgba(88,166,255,0.22)',
                  boxShadow: '0 0 6px rgba(88,166,255,0.15)',
                }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={entered ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            )}

            {/* Progress fill (inside track — from card-0 center to active-card center) */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: 46,
                left: CARD_W / 2,
                height: 2,
                background: 'linear-gradient(to right, var(--color-cyan), rgba(88,166,255,0.4))',
                boxShadow: '0 0 10px rgba(88,166,255,0.6)',
                transformOrigin: 'left',
              }}
              animate={{
                width: entered ? spineFilledWidth : 0,
                opacity: entered ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 70, damping: 18 }}
            />

            {/* Cards */}
            {sortedProjects.map((project, i) => {
              const state: 'active' | 'left' | 'right' =
                i === activeIndex ? 'active' : i < activeIndex ? 'left' : 'right';
              return (
                <CardItem
                  key={project.id}
                  project={project}
                  index={i}
                  total={n}
                  state={state}
                  onClick={() => {
                    handleCardTripleClick();
                    setSelectedId(project.id);
                  }}
                  onBranchClick={() => setPrProject(project)}
                />
              );
            })}
          </motion.div>
        </div>

        {/* ── Bottom bar: progress dots + scroll hint ── */}
        <div className="flex flex-col items-center gap-2 pb-6">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {sortedProjects.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width:      i === activeIndex ? 20 : 6,
                  height:     6,
                  background: i === activeIndex
                    ? 'var(--color-cyan)'
                    : i < activeIndex
                      ? 'rgba(88,166,255,0.32)'
                      : 'rgba(255,255,255,0.1)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <AnimatePresence mode="wait">
            {entered && (
              <motion.div
                key={activeIndex === n - 1 ? 'done' : 'scrolling'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] flex items-center gap-1.5"
              >
                {activeIndex === n - 1 ? (
                  <>
                    <motion.span
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      ↓
                    </motion.span>
                    continue scrolling
                  </>
                ) : (
                  <>
                    <motion.span
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    >
                      ↓
                    </motion.span>
                    {`${n - 1 - activeIndex} more project${n - 1 - activeIndex !== 1 ? 's' : ''} →`}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectPopup
            project={selectedProject}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      {/* EE1: PR merge toast */}
      <AnimatePresence>
        {prProject && (
          <PRMergeToast
            project={prProject}
            onDone={() => setPrProject(null)}
          />
        )}
      </AnimatePresence>

      {/* EE2: git log terminal */}
      <AnimatePresence>
        {showGitLog && (
          <GitLogTerminal
            projects={sortedProjects}
            onClose={() => setShowGitLog(false)}
          />
        )}
      </AnimatePresence>

      {/* EE3: all-seen confetti */}
      <AnimatePresence>
        {showAllSeen && (
          <AllSeenCelebration onDone={() => setShowAllSeen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
