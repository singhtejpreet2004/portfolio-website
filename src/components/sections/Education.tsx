'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion';
import { GraduationCap, BookOpen, Users } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { education } from '@/data/education';

// ─────────────────────────────────────────────────────────
// Sort OLDEST first → [matric(0), HS(1), university(2)]
//
// Direction: reversed x — starts at university (card 2, rightmost)
// and moves through HS then matric (cards appear from LEFT).
// University shown first, matric last. Cards fade to RIGHT.
// ─────────────────────────────────────────────────────────

const sortedEdu = [...education].sort(
  (a, b) => Number(a.startDate) - Number(b.startDate), // oldest first
);

const CARD_W      = 520;   // wider than Projects (420)
const CARD_GAP    = 80;
const CARD_STRIDE = CARD_W + CARD_GAP;
const DOT_Y       = 46;

// ─────────────────────────────────────────────────────────
// EDU NODE — yellow accent
// ─────────────────────────────────────────────────────────

function EduNode({ active }: { active: boolean }) {
  const accent     = 'var(--color-yellow)';
  const accentRgba = 'rgba(255,211,0,0.55)';

  return (
    <div className="relative flex items-center justify-center w-5 h-5">
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

      {active && ([0, 0.75, 1.5] as number[]).map((off) => (
        <motion.div
          key={off}
          className="absolute w-full h-full rounded-full"
          style={{ background: accent }}
          animate={{ scale: [1, 3.2, 1], opacity: [0.38, 0, 0.38] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: off }}
        />
      ))}

      <motion.div
        className="relative w-3.5 h-3.5 rounded-full border-2"
        animate={{
          borderColor: active ? accent : 'rgba(255,211,0,0.22)',
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
// EDU BRANCH CONNECTOR — yellow S-curve
// ─────────────────────────────────────────────────────────

const BRANCH_PATH = 'M 20 0 C 38 22 2 52 20 88';

function EduBranchConnector({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 40 88"
      preserveAspectRatio="none"
      className="block mx-auto pointer-events-none"
      style={{ width: 40, height: 88 }}
      aria-hidden
    >
      <motion.path d={BRANCH_PATH} stroke="var(--color-yellow)" strokeWidth="1.5"
        vectorEffect="non-scaling-stroke" fill="none"
        animate={{ strokeOpacity: active ? 0.5 : 0.14 }} transition={{ duration: 0.4 }}
      />
      <motion.path d={BRANCH_PATH} stroke="var(--color-yellow)" strokeWidth="1"
        vectorEffect="non-scaling-stroke" fill="none"
        style={{ filter: 'drop-shadow(0 0 3px rgba(255,211,0,0.75))' }}
        animate={{ strokeOpacity: active ? 0.85 : 0 }} transition={{ duration: 0.4 }}
      />
      <motion.path d={BRANCH_PATH} stroke="var(--color-yellow)" strokeWidth="1.5"
        vectorEffect="non-scaling-stroke" fill="none" strokeOpacity={0}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      />
      {active && (
        <motion.path d={BRANCH_PATH} stroke="white" strokeWidth="2.5"
          vectorEffect="non-scaling-stroke" fill="none" strokeLinecap="round" strokeOpacity="0.85"
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
// EDU CARD ITEM
// ─────────────────────────────────────────────────────────

function EduCardItem({
  edu,
  state,
}: {
  edu: (typeof sortedEdu)[0];
  state: 'active' | 'passed' | 'upcoming';
}) {
  const isActive  = state === 'active';
  const isPassed  = state === 'passed';   // to the right (univ side, already seen)

  const levelLabel =
    edu.degree.includes('Bachelor')
      ? 'UNDERGRADUATE'
      : edu.degree.includes('XII') || edu.degree.includes('Higher')
        ? 'HIGHER SECONDARY'
        : 'SECONDARY';

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: CARD_W, flexShrink: 0 }}
    >
      {/* Year range label */}
      <div className="relative h-8 flex items-end justify-center mb-1">
        <AnimatePresence>
          {isActive && (
            <motion.span
              key="year"
              initial={{ opacity: 0, y: 10, scale: 0.75 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className="absolute bottom-0 text-xs font-[family-name:var(--font-jetbrains)] tracking-wide whitespace-nowrap"
              style={{ color: 'var(--color-yellow)' }}
            >
              {edu.startDate} → {edu.endDate}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <EduNode active={isActive} />
      <EduBranchConnector active={isActive} />

      {/* Meta strip */}
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
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border"
                style={{ background: 'rgba(255,211,0,0.07)', borderColor: 'rgba(255,211,0,0.22)' }}
              >
                <GraduationCap size={11} className="text-[var(--color-yellow)] opacity-70" />
                <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)]">
                  {levelLabel}
                </span>
              </div>
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] opacity-50">
                {Number(edu.endDate) - Number(edu.startDate)} year{Number(edu.endDate) - Number(edu.startDate) !== 1 ? 's' : ''}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="inactive-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPassed ? 0.1 : 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-9"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Card */}
      <motion.div
        animate={{
          scale:   isActive ? 1 : 0.76,
          opacity: isPassed ? 0.14 : isActive ? 1 : 0.52,
          y:       isActive ? 0 : 18,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="w-full rounded-2xl border overflow-hidden"
        style={{
          background:  'var(--bg-card)',
          borderColor: isActive ? 'rgba(255,211,0,0.4)' : 'var(--border-color)',
          boxShadow:   isActive
            ? '0 24px 72px rgba(0,0,0,0.55), 0 0 48px rgba(255,211,0,0.07)'
            : '0 4px 16px rgba(0,0,0,0.18)',
          willChange: 'transform',
        }}
      >
        <div
          className="h-0.5 w-full"
          style={{ background: isActive ? 'linear-gradient(to right, var(--color-yellow), rgba(255,211,0,0.15))' : 'transparent' }}
        />

        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-medium"
              style={{ background: 'rgba(255,211,0,0.1)', color: 'var(--color-yellow)', border: '1px solid rgba(255,211,0,0.2)' }}
            >
              {levelLabel}
            </span>
            <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
              {edu.startDate} — {edu.endDate}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)] mb-1 leading-snug">
            {edu.institution}
          </h3>

          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-yellow)' }}>
            {edu.degree}
          </p>

          <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
            {edu.field}
          </p>

          {edu.gpa && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5"
              style={{ background: 'rgba(91,204,126,0.06)', border: '1px solid rgba(91,204,126,0.16)' }}
            >
              <BookOpen size={13} className="text-[var(--color-green)]" />
              <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">
                {edu.degree.includes('Bachelor') ? 'CGPA' : 'Percentage'}: {edu.gpa}
              </span>
            </div>
          )}

          {edu.activities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {edu.activities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(88,166,255,0.08)', color: 'var(--color-cyan)', border: '1px solid rgba(88,166,255,0.18)' }}
                >
                  <Users size={9} />
                  {a}
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 opacity-60">Key Subjects</p>
            <div className="flex flex-wrap gap-1.5">
              {edu.coursework.slice(0, 7).map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                >
                  {c}
                </span>
              ))}
              {edu.coursework.length > 7 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                  +{edu.coursework.length - 7}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function Education() {
  const n = sortedEdu.length;

  // Track sorted oldest first: [matric(0), HS(1), univ(2)]
  // We start at university (card n-1, rightmost in track) and scroll to matric (card 0, leftmost)
  // → x increases as scroll progresses (track moves RIGHT, cards appear from LEFT)
  const xStart = -(CARD_W / 2) - (n - 1) * CARD_STRIDE; // university (card n-1) centered
  const xEnd   = -(CARD_W / 2);                          // matric    (card 0)   centered

  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset: ['start start', 'end end'],
  });

  // REVERSED: x goes from xStart (more negative) → xEnd (less negative) as scroll increases
  const rawX = useTransform(scrollYProgress, [0.12, 1], [xStart, xEnd], { clamp: true });
  const x    = useSpring(rawX, { stiffness: 38, damping: 14, mass: 0.9, restSpeed: 0.001 });

  // activeIndex: n-1 (university) at start, decreases to 0 (matric)
  const [activeIndex, setActiveIndex] = useState(n - 1);
  useMotionValueEvent(rawX, 'change', (val) => {
    const floatIdx = (-(val) - CARD_W / 2) / CARD_STRIDE;
    setActiveIndex(Math.max(0, Math.min(Math.round(floatIdx), n - 1)));
  });

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

  // Spine fill: from active card rightward to university (passed/seen cards are on the RIGHT)
  const spineFillX     = activeIndex * CARD_STRIDE;              // left offset from card-0 center
  const spineFillWidth = (n - 1 - activeIndex) * CARD_STRIDE;   // extends to univ (rightmost)

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative"
      style={{ height: `${(n + 0.5) * 100}vh` }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-yellow) 0%, transparent 70%)' }}
      />

      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

        {/* Heading */}
        <motion.div
          className="pt-14 pb-2 max-w-7xl mx-auto px-6 w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <SectionHeading
            subtitle="// edu.timeline | undergraduate → secondary"
            title="Education"
          />
        </motion.div>

        {/* Card track area */}
        <div className="flex-1 relative overflow-hidden flex items-start">

          {/* Spine base (viewport-wide) */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            style={{
              left: 0, right: 0, top: DOT_Y, height: 2,
              background: 'linear-gradient(to right, transparent 2%, rgba(255,211,0,0.18) 8%, rgba(255,211,0,0.18) 92%, transparent 98%)',
            }}
            initial={{ scaleX: 0 }}
            animate={entered ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.35 }}
          />

          {/* Shimmer */}
          {entered && (
            <div className="absolute z-0 pointer-events-none overflow-hidden" style={{ left: 0, right: 0, top: DOT_Y, height: 2 }}>
              <motion.div
                style={{ position: 'absolute', height: '100%', width: '12%', background: 'linear-gradient(to right, transparent, rgba(255,211,0,0.8), transparent)' }}
                animate={{ x: ['-12%', '950%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.0, delay: 1.4 }}
              />
            </div>
          )}

          {/* Card track — x increases = moves RIGHT = cards appear from LEFT */}
          <motion.div
            className="absolute flex"
            style={{ left: '50%', top: 0, x, gap: CARD_GAP, alignItems: 'flex-start', willChange: 'transform' }}
          >
            {/* Spine inside track */}
            {n > 1 && (
              <motion.div
                className="absolute pointer-events-none"
                style={{ top: DOT_Y, left: CARD_W / 2, width: (n - 1) * CARD_STRIDE, height: 2, background: 'rgba(255,211,0,0.22)', boxShadow: '0 0 6px rgba(255,211,0,0.15)' }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={entered ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            )}

            {/* Progress fill: from active card rightward toward university (seen cards) */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: DOT_Y, height: 2,
                background: 'linear-gradient(to right, var(--color-yellow), rgba(255,211,0,0.4))',
                boxShadow: '0 0 10px rgba(255,211,0,0.6)',
              }}
              animate={{
                x:       entered ? CARD_W / 2 + spineFillX : CARD_W / 2 + (n - 1) * CARD_STRIDE,
                width:   entered ? spineFillWidth : 0,
                opacity: entered ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 70, damping: 18 }}
            />

            {/* Cards: track sorted oldest first [matric(0), HS(1), univ(2)] */}
            {sortedEdu.map((edu, i) => {
              // i > activeIndex → RIGHT → passed/seen (univ side)
              // i < activeIndex → LEFT  → upcoming (matric side, not yet reached)
              const state: 'active' | 'passed' | 'upcoming' =
                i === activeIndex ? 'active' : i > activeIndex ? 'passed' : 'upcoming';
              return (
                <EduCardItem
                  key={`${edu.institution}-${edu.startDate}`}
                  edu={edu}
                  state={state}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-2 pb-6">
          <div className="flex items-center gap-2">
            {sortedEdu.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width:      i === activeIndex ? 20 : 6,
                  height:     6,
                  background: i === activeIndex
                    ? 'var(--color-yellow)'
                    : i > activeIndex
                      ? 'rgba(255,211,0,0.32)'  // passed (univ side, right)
                      : 'rgba(255,255,255,0.1)', // upcoming (matric side, left)
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {entered && (
              <motion.div
                key={activeIndex === 0 ? 'done' : 'scrolling'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] flex items-center gap-1.5"
              >
                {activeIndex === 0 ? (
                  <>
                    <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
                    continue scrolling
                  </>
                ) : (
                  <>
                    <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>↓</motion.span>
                    {`${activeIndex} more stage${activeIndex !== 1 ? 's' : ''} ←`}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
