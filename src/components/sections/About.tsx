'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Radio, GitBranch, FolderGit2, Trophy, Code2, FileText, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { useMouseContext } from '@/contexts/MouseContext';

// ─────────────────────────────────────────────────────────
// STATS — 4 top + 3 bottom, dock-hover magnification
// ─────────────────────────────────────────────────────────

const stats: { icon: LucideIcon; label: string; value: number; suffix: string; color: string }[] = [
  { icon: Radio,      label: 'Live Streams Scaled', value: 8,  suffix: '+',  color: '#58a6ff' },
  { icon: GitBranch,  label: 'Pipelines Shipped',   value: 15, suffix: '+',  color: '#a78bfa' },
  { icon: FolderGit2, label: 'Projects Built',       value: 4,  suffix: '+',  color: '#5BCC7E' },
  { icon: Trophy,     label: 'Hackathons Won',       value: 3,  suffix: '',   color: '#FFD300' },
  { icon: Code2,      label: 'Lines of Code',        value: 50, suffix: 'K+', color: '#58a6ff' },
  { icon: FileText,   label: 'Research Papers',      value: 2,  suffix: '',   color: '#a78bfa' },
  { icon: Award,      label: 'Patent Filed',         value: 1,  suffix: '',   color: '#FFD300' },
];

// ─────────────────────────────────────────────────────────
// TECH BADGES — Simple Icons CDN, brand colours
// ─────────────────────────────────────────────────────────

const techBadges = [
  { name: 'Python',  slug: 'python',        color: '3776AB', top: '8%',  left: '-20%' },
  { name: 'Kafka',   slug: 'apachekafka',   color: 'ffffff', top: '68%', left: '108%' },
  { name: 'Spark',   slug: 'apachespark',   color: 'E25A1C', top: '88%', left: '28%'  },
  { name: 'Airflow', slug: 'apacheairflow', color: '017CEE', top: '18%', left: '100%' },
  { name: 'Docker',  slug: 'docker',        color: '2496ED', top: '-8%', left: '46%'  },
];

// ─────────────────────────────────────────────────────────
// DOCK HOVER — within-row distance magnification
// ─────────────────────────────────────────────────────────

function getCardProps(idx: number, hovered: number | null) {
  if (hovered === null) return { scale: 1, opacity: 1 };

  const hovRow = hovered < 4 ? 0 : 1;
  const myRow  = idx     < 4 ? 0 : 1;

  if (hovRow !== myRow) return { scale: 0.97, opacity: 0.55 };

  const hL = hovered < 4 ? hovered : hovered - 4;
  const iL = idx     < 4 ? idx     : idx     - 4;
  const d  = Math.abs(hL - iL);

  if (d === 0) return { scale: 1.13, opacity: 1 };
  if (d === 1) return { scale: 1.04, opacity: 0.9 };
  return { scale: 0.97, opacity: 0.65 };
}

// ─────────────────────────────────────────────────────────
// CODE CARD LINES
// ─────────────────────────────────────────────────────────

const codeLines = [
  { delay: 0.3,  jsx: (
    <><span className="text-[var(--code-keyword)]">class</span>{' '}
    <span className="text-[var(--code-fn)]">DataEngineer</span>:</>
  )},
  { delay: 0.5,  jsx: (
    <span className="ml-4"><span className="text-[var(--code-keyword)]">def</span>{' '}
    <span className="text-[var(--code-fn)]">__init__</span>
    <span className="text-[var(--text-secondary)]">(self):</span></span>
  )},
  { delay: 0.7,  jsx: (
    <span className="ml-8 text-[var(--text-secondary)]">
      self.name = <span className="text-[var(--code-string)]">&quot;Tejpreet&quot;</span>
    </span>
  )},
  { delay: 0.9,  jsx: (
    <span className="ml-8 text-[var(--text-secondary)]">
      self.passion = <span className="text-[var(--code-string)]">&quot;Pipelines&quot;</span>
    </span>
  )},
  { delay: 1.1,  jsx: (
    <span className="ml-8 text-[var(--text-secondary)]">
      self.coffee = <span className="text-[var(--code-fn)]">float</span>(<span className="text-[var(--code-string)]">&quot;inf&quot;</span>)
    </span>
  )},
  { delay: 1.3,  jsx: (
    <span className="ml-4"><span className="text-[var(--code-keyword)]">def</span>{' '}
    <span className="text-[var(--code-fn)]">build</span>
    <span className="text-[var(--text-secondary)]">(self, chaos):</span></span>
  )},
  { delay: 1.5,  jsx: (
    <span className="ml-8 text-[var(--text-secondary)]">
      <span className="text-[var(--code-keyword)]">return</span> Pipeline(chaos).
    </span>
  )},
  { delay: 1.7,  jsx: (
    <span className="ml-12 text-[var(--text-secondary)]">transform().insights()</span>
  )},
];

// ─────────────────────────────────────────────────────────
// STAT CARD — reused for both rows
// ─────────────────────────────────────────────────────────

function StatCard({
  stat, idx, hoveredStat, onEnter, onLeave,
}: {
  stat: typeof stats[0];
  idx: number;
  hoveredStat: number | null;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const Icon = stat.icon;
  const { scale, opacity } = getCardProps(idx, hoveredStat);
  const isHovered = hoveredStat === idx;

  return (
    <motion.div
      animate={{ scale, opacity }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="p-6 rounded-xl border text-center"
      style={{
        background: 'var(--bg-card)',
        borderColor: isHovered ? `${stat.color}55` : 'var(--border-color)',
        transition: 'border-color 0.2s ease',
        boxShadow: isHovered ? `0 0 24px ${stat.color}18` : 'none',
        position: 'relative',
        zIndex: isHovered ? 20 : 1,
      }}
    >
      <div className="flex justify-center mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${stat.color}1a`, color: stat.color }}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
        <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={0.9} />
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function About() {
  const [flipped, setFlipped] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven entrance: section slides in from the right
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.25'],
  });
  const sectionSlideX = useTransform(scrollYProgress, [0, 1], [120, 0]);

  // Mouse parallax depth layers
  const { springX, springY } = useMouseContext();
  const cardParallaxX = useTransform(springX, [-1, 1], [-7, 7]);   // flip card: layer 2
  const cardParallaxY = useTransform(springY, [-1, 1], [-5, 5]);
  const textParallaxX = useTransform(springX, [-1, 1], [-2, 2]);   // bio: layer 0
  const glowX = useTransform(springX, [-1, 1], [20, -20]);          // bg glow: counter-parallax
  const glowY = useTransform(springY, [-1, 1], [10, -10]);

  const handleCardFlip = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => setFlipped(false), 1500);
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow — moves counter to mouse */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 opacity-[0.15] blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)',
          x: glowX,
          y: glowY,
        }}
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── Terminal-style section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-[family-name:var(--font-jetbrains)] mb-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <span className="text-[var(--color-green)]">&gt;</span>
            <span className="text-[var(--color-cyan)]">initializing data_engineer.about()</span>
            <span className="text-[var(--color-cyan)] animate-[blink_1s_step-end_infinite]">_</span>
          </div>
          <h2 className="text-4xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
            About Me
          </h2>
          <div
            className="h-[3px] w-16 mt-3 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD300, #FFA500)' }}
          />
        </motion.div>

        {/* ── Two-column: flip card | bio ── */}
        {/* Scroll-driven entrance: whole grid slides in from right */}
        <motion.div
          className="grid lg:grid-cols-5 gap-12 items-start"
          style={{ x: sectionSlideX, willChange: 'transform' }}
        >

          {/* Left — flip card + floating tech badges (mouse parallax layer 2) */}
          <motion.div
            style={{ x: cardParallaxX, y: cardParallaxY, willChange: 'transform' }}
            className="lg:col-span-2 flex flex-col items-center"
          >
            <div className="relative">
              {/* Perspective wrapper / click target */}
              <motion.div
                className="w-72 h-80 select-none"
                style={{ perspective: '1200px', cursor: 'pointer' }}
                onClick={handleCardFlip}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                title="Click to peek"
              >
                {/* Flipper */}
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {/* ── FRONT: Python code snippet ── */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-[var(--border-color)] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      background: 'linear-gradient(145deg, var(--color-navy-medium), var(--color-navy-light))',
                    }}
                  >
                    {/* macOS title bar */}
                    <div className="h-8 flex items-center px-3 gap-1.5 border-b border-[var(--border-color)]" style={{ background: 'var(--bg-hover)' }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-2 text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                        tejpreet.py
                      </span>
                    </div>

                    {/* Code lines */}
                    <div className="p-4 font-[family-name:var(--font-jetbrains)] text-xs space-y-1.5">
                      {codeLines.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: line.delay }}
                        >
                          {line.jsx}
                        </motion.div>
                      ))}
                    </div>

                  </div>

                  {/* ── BACK: avatar photo ── */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 overflow-hidden flex items-end justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(160deg, #dceeff 0%, #eef4ff 100%)',
                      borderColor: 'rgba(88,166,255,0.4)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/avatar.png"
                      alt="Tejpreet Singh"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Subtle click hint */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.2 }}
                className="text-center text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] mt-3"
                style={{ opacity: 0.45 }}
              >
                click to reveal ↑
              </motion.p>

              {/* Floating tech-stack icons */}
              {techBadges.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className="absolute w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center shadow-lg"
                  style={{
                    top: tech.top,
                    left: tech.left,
                    background: 'var(--bg-card)',
                  }}
                  animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                  title={tech.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                    alt={tech.name}
                    width={22}
                    height={22}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — bio text (mouse parallax layer 0) */}
          <motion.div
            style={{ x: textParallaxX, willChange: 'transform' }}
            className="lg:col-span-3 space-y-6 text-[var(--text-secondary)] text-lg leading-relaxed"
          >
            <p>
              As a <strong className="text-[var(--text-primary)]">Data Engineer</strong> with a
              bias for production-grade reliability, I architect the highways raw data travels on —
              Kafka-powered video analytics scaled to{' '}
              <strong className="text-[var(--color-cyan)]">8+ concurrent streams</strong> at
              sub-200ms latency, Spark-orchestrated ETL that eliminated{' '}
              <strong className="text-[var(--color-cyan)]">70% of manual overhead</strong>, and a
              Delta Lakehouse reconciling{' '}
              <strong className="text-[var(--color-cyan)]">20,000+ records</strong> at half the
              processing time. I don&apos;t just build pipelines — I build <em>guarantees</em>.
            </p>

            <p>
              Currently finishing a{' '}
              <strong className="text-[var(--text-primary)]">B.E. in Computer Science</strong> at
              Chandigarh University while shipping production infrastructure at{' '}
              <strong className="text-[var(--text-primary)]">
                Plaksha University&apos;s Dixon IoT Lab
              </strong>
              . Along the way:{' '}
              <strong className="text-[var(--color-yellow)]">three hackathon victories</strong>{' '}
              (including a ₹1,00,000 grand prize), a <em>filed patent</em> on automobile safety
              systems, two peer-reviewed publications, and certifications spanning Oracle OCI and IBM
              Data Science.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Stats grid: 4 top + 3 bottom, dock magnification ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 space-y-4"
        >
          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.slice(0, 4).map((stat, i) => (
              <StatCard
                key={i}
                stat={stat}
                idx={i}
                hoveredStat={hoveredStat}
                onEnter={() => setHoveredStat(i)}
                onLeave={() => setHoveredStat(null)}
              />
            ))}
          </div>

          {/* Row 2 — 3 cards, centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
            {stats.slice(4).map((stat, i) => {
              const idx = i + 4;
              return (
                <StatCard
                  key={idx}
                  stat={stat}
                  idx={idx}
                  hoveredStat={hoveredStat}
                  onEnter={() => setHoveredStat(idx)}
                  onLeave={() => setHoveredStat(null)}
                />
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
