'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { profile } from '@/data/profile';

// ─────────────────────────────────────────────────────────
// HERO SECTION — with animated dashboard + all easter eggs
// ─────────────────────────────────────────────────────────

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Easter egg states
  const [showMatrix, setShowMatrix] = useState(false);
  const [overdriveMode, setOverdriveMode] = useState(false);
  const [colorCycle, setColorCycle] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsProcessing, setToastIsProcessing] = useState(false);
  const [showEasterEggGuide, setShowEasterEggGuide] = useState(false);

  // Hire popup state machine
  const [hireStep, setHireStep] = useState<'none' | 'form' | 'resume' | 'thanks'>('none');
  const [hireForm, setHireForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [hireErrors, setHireErrors] = useState<Record<string, string>>({});

  // Track last used message per context menu category (no-repeat)
  const lastMenuMsg = useRef<Record<string, number>>({});

  // Track mouse position for interactive grid
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  // Typewriter effect for taglines
  useEffect(() => {
    const tagline = profile.taglines[taglineIndex];
    if (isTyping) {
      if (displayText.length < tagline.length) {
        const timeout = setTimeout(() => {
          setDisplayText(tagline.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setTaglineIndex((prev) => (prev + 1) % profile.taglines.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, taglineIndex]);

  // ── EASTER EGGS ────────────────────────────────────────

  // 1. Konami Code → Overdrive Mode
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a',
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          setOverdriveMode(true);
          setToastMessage('SYSTEM OVERLOAD ACTIVATED');
          setTimeout(() => setOverdriveMode(false), 5000);
          setTimeout(() => setToastMessage(null), 3000);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 5. Type "kafka" → toast notification
  useEffect(() => {
    let buffer = '';
    const handleKeyPress = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 20) buffer = buffer.slice(-20);
      if (buffer.includes('kafka')) {
        setToastMessage('Apache Kafka detected — streaming mode engaged');
        setTimeout(() => setToastMessage(null), 3000);
        buffer = '';
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // 7. Mouse Shake (5 shakes) → Matrix Rain for 4 seconds
  useEffect(() => {
    let positions: { x: number; y: number; t: number }[] = [];
    let shakeCount = 0;
    let lastDirection = 0; // -1 left, 1 right

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      positions.push({ x: e.clientX, y: e.clientY, t: now });
      // Keep only last 500ms of positions
      positions = positions.filter((p) => now - p.t < 250);

      if (positions.length >= 3) {
        const prev = positions[positions.length - 2];
        const curr = positions[positions.length - 1];
        const dx = curr.x - prev.x;

        // Detect direction change (shake) — only on fast, vigorous movement
        if (Math.abs(dx) > 50) {
          const dir = dx > 0 ? 1 : -1;
          if (lastDirection !== 0 && dir !== lastDirection) {
            shakeCount++;
            if (shakeCount >= 7) {
              setShowMatrix(true);
              setTimeout(() => setShowMatrix(false), 4000);
              shakeCount = 0;
              positions = [];
            }
          }
          lastDirection = dir;
        }
      }

      // Reset shake count if no activity
      if (positions.length < 2) {
        shakeCount = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 4. Idle Animation (15s) — handled inside InteractiveDotGrid

  // 3. Triple-click name → cycling color schemes
  const nameClickCount = useRef(0);
  const nameClickTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nameClickCount.current++;
    clearTimeout(nameClickTimer.current);
    if (nameClickCount.current >= 3) {
      setColorCycle(true);
      setToastMessage('Color cycle activated');
      setTimeout(() => { setColorCycle(false); setToastMessage(null); }, 3000);
      nameClickCount.current = 0;
    } else {
      nameClickTimer.current = setTimeout(() => {
        nameClickCount.current = 0;
      }, 800);
    }
  };

  // 6. Right-click hero → fake terminal context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Close context menu on click
  useEffect(() => {
    const close = () => setShowContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // Close easter egg guide on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEasterEggGuide(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Matrix Rain Overlay — blocks all interaction */}
      <AnimatePresence>
        {showMatrix && <MatrixRain />}
      </AnimatePresence>

      <section
        id="hero"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
        className={`relative min-h-screen flex items-center overflow-hidden ${
          overdriveMode ? 'overdrive-mode' : ''
        } ${colorCycle ? 'color-cycle' : ''}`}
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Interactive Dot Grid Background */}
        <InteractiveDotGrid mouseX={mousePos.x} mouseY={mousePos.y} overdrive={overdriveMode} />

        {/* Floating Code Keywords */}
        <FloatingCodeElements overdrive={overdriveMode} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left - Text Content (2 cols) */}
            <div className="lg:col-span-2">
              {/* Terminal pre-heading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--color-cyan)] mb-6"
              >
                <span className="text-[var(--color-green)]">{'>'}</span>{' '}
                <TerminalText text="initializing data_engineer.portfolio()" />
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                  <span className="text-[var(--text-secondary)]">Hi, I&apos;m</span>
                  <br />
                  <span
                    className={`text-gradient cursor-pointer select-none ${
                      colorCycle ? 'animate-color-cycle' : ''
                    }`}
                    onClick={handleNameClick}
                  >
                    {profile.name}
                  </span>
                </h1>
              </motion.div>

              {/* Rotating Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-xl md:text-2xl text-[var(--text-secondary)] mb-6 h-8"
              >
                <span className="font-[family-name:var(--font-jetbrains)]">
                  {displayText}
                </span>
                <span className="inline-block w-0.5 h-6 bg-[var(--color-yellow)] ml-1 animate-[blink_1s_infinite]" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-lg text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed"
              >
                I build the infrastructure that turns{' '}
                <span className="text-[var(--color-yellow)] font-medium">raw chaos</span> into{' '}
                <span className="text-[var(--color-cyan)] font-medium">actionable insights</span>.
                Real-time streaming, ETL pipelines, and everything in between.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#projects"
                  className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative flex items-center gap-2">
                    Explore My Work
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                      &rarr;
                    </span>
                  </span>
                </a>
                <a
                  href="#contact"
                  className="group flex items-center px-7 py-3.5 rounded-full border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] font-semibold hover:bg-[var(--color-cyan)]/10 hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in Touch
                </a>
              </motion.div>
            </div>

            {/* Right - Animated Dashboard (3 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden lg:flex lg:col-span-3 items-center justify-center"
            >
              <DataDashboard overdrive={overdriveMode} onToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); }} />
            </motion.div>
          </div>
        </div>

        {/* Hidden Easter Egg Guide Button — subtle >_ icon bottom-left */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          whileHover={{ opacity: 0.8, scale: 1.1 }}
          transition={{ delay: 3 }}
          onClick={() => setShowEasterEggGuide(true)}
          className="absolute bottom-8 left-8 text-[var(--color-cyan)] font-[family-name:var(--font-jetbrains)] text-sm cursor-pointer z-20 pointer-events-auto"
          title="secrets"
        >
          {'>_'}
        </motion.button>

        {/* Easter Egg Guide Popup */}
        <AnimatePresence>
          {showEasterEggGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center"
              onClick={() => setShowEasterEggGuide(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

              {/* Guide Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-md w-full mx-4 rounded-2xl border overflow-hidden shadow-2xl"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 0 60px rgba(88,166,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {/* Terminal title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <button onClick={() => setShowEasterEggGuide(false)} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 cursor-pointer" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                    </div>
                    <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                      secrets.md
                    </span>
                  </div>
                  <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)]">
                    TOP SECRET
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <p className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] mb-3">
                      <span className="text-[var(--color-green)]">$</span> cat ~/.easter-eggs
                    </p>
                    <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] mb-1">
                      Hidden Features
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-4">
                      You found the secret menu. Here&apos;s what&apos;s hiding in this site:
                    </p>
                  </div>

                  {[
                    {
                      trigger: '↑ ↑ ↓ ↓ ← → ← → B A',
                      name: 'Konami Code',
                      desc: 'Activates OVERDRIVE mode — rainbow grid, pulsing visuals, chaos',
                      color: 'var(--color-yellow)',
                    },
                    {
                      trigger: 'Triple-click my name',
                      name: 'Color Cycle',
                      desc: 'Name cycles through a rainbow gradient for 3 seconds',
                      color: 'var(--color-purple)',
                    },
                    {
                      trigger: 'Don\'t move mouse for 15s',
                      name: 'Idle Pattern',
                      desc: 'The dot grid forms a pipeline arrow shape',
                      color: 'var(--color-cyan)',
                    },
                    {
                      trigger: 'Type "kafka" anywhere',
                      name: 'Kafka Mode',
                      desc: 'Streaming mode engaged — toast notification appears',
                      color: 'var(--color-green)',
                    },
                    {
                      trigger: 'Right-click the hero',
                      name: 'Terminal Menu',
                      desc: 'Fake terminal context menu with special commands',
                      color: 'var(--color-cyan)',
                    },
                    {
                      trigger: 'Shake mouse fast & vigorously',
                      name: 'Matrix Rain',
                      desc: 'SYSTEM BREACH — 4 seconds of digital rain, site locks up. Must be a fast, rigorous shake.',
                      color: '#FF5F57',
                    },
                    {
                      trigger: 'Click top-right dashboard corner',
                      name: 'Card Shuffle',
                      desc: 'Switches between Data Pipeline and Video Pipeline dashboard views',
                      color: 'var(--color-green)',
                    },
                    {
                      trigger: 'Right-click → sudo hire tejpreet',
                      name: 'Hire Flow',
                      desc: 'Opens a 3-step sequence: contact form → resume download → thank you',
                      color: 'var(--color-yellow)',
                    },
                  ].map((egg, i) => (
                    <motion.div
                      key={egg.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex gap-3 p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-cyan)]/30 transition-colors"
                    >
                      <div
                        className="w-1 rounded-full flex-shrink-0"
                        style={{ background: egg.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-[family-name:var(--font-jetbrains)] font-bold text-[var(--text-primary)]">
                            {egg.name}
                          </span>
                        </div>
                        <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)] mb-1">
                          {egg.trigger}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)]">
                          {egg.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] text-center pt-2 opacity-50">
                    press esc or click outside to close
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)]">
            scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={20} className="text-[var(--color-yellow)]" />
          </motion.div>
        </motion.div>

        {/* Terminal Context Menu (Easter Egg #6) — expanded */}
        <AnimatePresence>
          {showContextMenu && (
            <ContextMenu
              x={showContextMenu.x}
              y={showContextMenu.y}
              onClose={() => setShowContextMenu(null)}
              lastMsg={lastMenuMsg}
              onProcessingToast={(msg) => {
                setToastIsProcessing(true);
                setToastMessage('processing...');
                setTimeout(() => {
                  setToastIsProcessing(false);
                  setToastMessage(msg);
                  setTimeout(() => setToastMessage(null), 3000);
                }, 900);
              }}
              onHire={() => { setHireStep('form'); setHireForm({ name: '', company: '', email: '', phone: '' }); setHireErrors({}); }}
            />
          )}
        </AnimatePresence>

        {/* Hire Popup Sequence */}
        <AnimatePresence mode="wait">
          {hireStep !== 'none' && (
            <HirePopup
              step={hireStep}
              form={hireForm}
              errors={hireErrors}
              onFormChange={(field, val) => setHireForm((f) => ({ ...f, [field]: val }))}
              onSubmitForm={() => {
                const errs: Record<string, string> = {};
                if (!hireForm.name.trim()) errs.name = 'Required';
                if (!hireForm.company.trim()) errs.company = 'Required';
                if (!hireForm.email.trim() || !hireForm.email.includes('@')) errs.email = 'Valid email required';
                if (Object.keys(errs).length > 0) { setHireErrors(errs); return; }
                setHireStep('resume');
              }}
              onNext={() => setHireStep(hireStep === 'resume' ? 'thanks' : 'none')}
              onClose={() => setHireStep('none')}
            />
          )}
        </AnimatePresence>

        {/* Toast Notification — slides in from right */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key={toastMessage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl font-[family-name:var(--font-jetbrains)] text-sm shadow-2xl border"
              style={{
                background: 'var(--bg-secondary)',
                color: toastIsProcessing ? 'var(--color-yellow)' : 'var(--color-green)',
                borderColor: toastIsProcessing ? 'rgba(255,211,0,0.3)' : 'rgba(91,204,126,0.4)',
                boxShadow: toastIsProcessing
                  ? '0 0 30px rgba(255,211,0,0.15), 0 8px 32px rgba(0,0,0,0.3)'
                  : '0 0 30px rgba(91,204,126,0.2), 0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-2">
                {toastIsProcessing
                  ? <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>⟳</motion.span>
                  : <span>✓</span>
                }
                {toastMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// MATRIX RAIN — Full screen number rain (Easter Egg #7)
// Website becomes unresponsive for 4 seconds
// ─────────────────────────────────────────────────────────

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 16);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    const draw = () => {
      ctx.fillStyle = 'rgba(16, 22, 47, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 16;
        const y = drops[i] * 16;

        // Leading character is bright cyan/green
        ctx.fillStyle = `rgba(88, 166, 255, ${0.8 + Math.random() * 0.2})`;
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.fillText(char, x, y);

        // Trail characters fade
        if (drops[i] > 0) {
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = `rgba(58, 16, 229, ${0.3 + Math.random() * 0.2})`;
          ctx.fillText(trailChar, x, y - 16);
        }

        drops[i]++;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    const interval = setInterval(draw, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] cursor-not-allowed"
      style={{ pointerEvents: 'all' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Glitch text overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 1] }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.p
            className="font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)] text-3xl font-bold tracking-widest"
            animate={{ opacity: [1, 0.5, 1], x: [0, -2, 2, 0] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          >
            SYSTEM BREACH DETECTED
          </motion.p>
          <motion.p
            className="font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)] text-sm mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {'>'} reconstructing pipeline integrity...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// INTERACTIVE DOT GRID (Gravitational Lens Effect)
// ─────────────────────────────────────────────────────────

function InteractiveDotGrid({
  mouseX,
  mouseY,
  overdrive,
}: {
  mouseX: number;
  mouseY: number;
  overdrive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isIdleRef = useRef(false);
  const idleTimeRef = useRef(0);
  // Cache canvas dimensions to avoid layout reads every frame
  const wRef = useRef(0);
  const hRef = useRef(0);

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };

    // Reset idle timer on mouse move
    isIdleRef.current = false;
    idleTimeRef.current = 0;
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isIdleRef.current = true;
    }, 15000);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      wRef.current = canvas.offsetWidth;
      hRef.current = canvas.offsetHeight;
      canvas.width = wRef.current * dpr;
      canvas.height = hRef.current * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const spacing = 40;
    const influenceRadius = overdrive ? 250 : 150;
    const maxDisplacement = overdrive ? 35 : 20;

    let frameCount = 0;
    let running = true;

    // Pause animation when tab is not visible
    const handleVisibility = () => { running = !document.hidden; if (running) draw(); };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (!running) return;
      const w = wRef.current;
      const h = hRef.current;
      if (w === 0 || h === 0) { animFrameRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      frameCount++;

      // Easter Egg #4: Idle animation — dots form a pipeline icon pattern
      const isIdle = isIdleRef.current;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * spacing;
          const baseY = row * spacing;

          const dx = baseX - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let drawX = baseX;
          let drawY = baseY;
          let radius = 1.2;
          let alpha = 0.13;

          if (isIdle) {
            // Form a simplified pipeline/data flow icon in the center
            const centerX = w / 2;
            const centerY = h / 2;
            const relX = baseX - centerX;
            const relY = baseY - centerY;

            // Draw a simple arrow/chevron pattern
            const isPartOfArrow =
              (Math.abs(relY) < 60 && Math.abs(relX) < 120) || // horizontal bar
              (relX > 80 && relX < 140 && Math.abs(relY - relX + 80) < 30) || // top arrow
              (relX > 80 && relX < 140 && Math.abs(relY + relX - 80) < 30); // bottom arrow

            if (isPartOfArrow) {
              const pulse = Math.sin(frameCount * 0.03) * 0.3 + 0.7;
              alpha = 0.4 * pulse;
              radius = 2.5;
            }
          } else if (dist < influenceRadius && dist > 0) {
            const force = 1 - dist / influenceRadius;
            const angle = Math.atan2(dy, dx);
            const displacement = force * force * maxDisplacement;
            drawX = baseX + Math.cos(angle) * displacement;
            drawY = baseY + Math.sin(angle) * displacement;
            radius = 1.2 + force * 3;
            alpha = 0.08 + force * 0.5;
          }

          // Color: blend between base and cyan near cursor
          const nearness = dist < influenceRadius ? 1 - dist / influenceRadius : 0;
          let r, g, b;

          if (overdrive) {
            // Rainbow colors in overdrive
            const hueShift = (frameCount * 3 + col * 10 + row * 10) % 360;
            const rgb = hslToRgb(hueShift / 360, 1, 0.6);
            r = rgb[0];
            g = rgb[1];
            b = rgb[2];
            alpha = Math.max(alpha, 0.15);
          } else {
            r = Math.round(255 - nearness * 153);
            g = Math.round(255 - nearness * 59);
            b = 255;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          // Connection lines to nearby distorted dots
          if (nearness > 0.3 && col < cols - 1) {
            const nextBaseX = (col + 1) * spacing;
            const ndx = nextBaseX - mx;
            const ndy = baseY - my;
            const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
            if (ndist < influenceRadius) {
              const nforce = 1 - ndist / influenceRadius;
              const nangle = Math.atan2(ndy, ndx);
              const ndisp = nforce * nforce * maxDisplacement;
              const nx = nextBaseX + Math.cos(nangle) * ndisp;
              const ny = baseY + Math.sin(nangle) * ndisp;
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = overdrive
                ? `rgba(${r}, ${g}, ${b}, ${nearness * 0.3})`
                : `rgba(88, 166, 255, ${nearness * 0.25})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [overdrive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// HSL to RGB helper for overdrive rainbow
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// ─────────────────────────────────────────────────────────
// FLOATING CODE ELEMENTS
// ─────────────────────────────────────────────────────────

function FloatingCodeElements({ overdrive }: { overdrive: boolean }) {
  const keywords = [
    { text: 'SELECT *', size: 'text-base' },
    { text: 'FROM streams', size: 'text-sm' },
    { text: 'JOIN', size: 'text-lg' },
    { text: 'WHERE latency < 200ms', size: 'text-xs' },
    { text: 'GROUP BY', size: 'text-sm' },
    { text: '{ }', size: 'text-2xl' },
    { text: '=>', size: 'text-xl' },
    { text: 'lambda x:', size: 'text-sm' },
    { text: 'def transform():', size: 'text-xs' },
    { text: 'class Pipeline:', size: 'text-sm' },
    { text: 'import kafka', size: 'text-xs' },
    { text: 'yield record', size: 'text-xs' },
    { text: 'async def', size: 'text-sm' },
    { text: '.subscribe()', size: 'text-xs' },
    { text: 'ORDER BY timestamp', size: 'text-xs' },
    { text: 'PARTITION BY', size: 'text-sm' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {keywords.map((kw, i) => (
        <motion.span
          key={i}
          className={`absolute font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)] select-none ${kw.size}`}
          style={{
            left: `${(7 + i * 19) % 88}%`,
            top: `${(3 + i * 13) % 90}%`,
            opacity: overdrive ? 0.15 : 0.045 + (i % 3) * 0.015,
            willChange: 'transform',
          }}
          animate={{
            y: [0, -(15 + (i % 4) * 5), 0],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
          }}
          transition={{
            duration: overdrive ? 2 + i * 0.1 : 10 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {kw.text}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CONTEXT MENU — terminal-style right-click menu
// ─────────────────────────────────────────────────────────

type MenuItem = {
  label: string;
  icon: string;
  category: string;
  messages: string[];
  link?: string;
  isHire?: boolean;
};

const menuGroups: { items: MenuItem[] }[] = [
  {
    items: [
      {
        label: 'inspect pipeline',
        icon: '>',
        category: 'inspect',
        messages: [
          'Pipeline healthy: 0 errors, 0 warnings',
          'Pipeline integrity 99.97% — SLA met',
          'All 12 stages nominal — throughput: 42.8K/s',
        ],
      },
      {
        label: 'run diagnostics',
        icon: '⚡',
        category: 'diag',
        messages: [
          'All systems operational — latency: 12ms',
          'Memory: 42% — CPU: 17% — Disk: 8%',
          'Kafka lag: 0 — Redis hit: 97.3% — p99: 23ms',
        ],
      },
      {
        label: 'trace --path data',
        icon: '~',
        category: 'trace',
        messages: [
          'Kafka → Spark → Delta → dbt → Grafana ✓',
          'Trace complete: 3 hops, 14ms end-to-end',
          'Hot path identified: spark.transform (8ms)',
        ],
      },
    ],
  },
  {
    items: [
      {
        label: 'whoami tejpreet',
        icon: '?',
        category: 'whoami',
        messages: [
          'Data Engineer @ Plaksha / Dixon IoT Lab',
          'Kafka whisperer. ETL wizard. Tea person.',
          'Patent holder. Hackathon winner. Poet.',
        ],
      },
      {
        label: 'ls ~/skills',
        icon: '$',
        category: 'skills',
        messages: [
          'kafka, spark, dbt, airflow, delta-lake, redis',
          'python, sql, typescript, rust (learning), bash',
          'aws, gcp, docker, k8s, terraform, grafana',
        ],
      },
      {
        label: 'force-deploy HEAD',
        icon: '!',
        category: 'deploy',
        messages: [
          'Deployed v2.4.1 — all pipelines green',
          'Rolling update complete — zero downtime',
        ],
      },
    ],
  },
  {
    items: [
      { label: 'view resume', icon: '→', category: 'link', messages: [], link: '/resume.pdf' },
      { label: 'view source', icon: '{}', category: 'link', messages: [], link: 'https://github.com/tejpreetsingh' },
    ],
  },
  {
    items: [
      { label: 'sudo hire tejpreet', icon: '★', category: 'hire', messages: [], isHire: true },
    ],
  },
];

function ContextMenu({
  x, y, onClose, lastMsg, onProcessingToast, onHire,
}: {
  x: number;
  y: number;
  onClose: () => void;
  lastMsg: React.MutableRefObject<Record<string, number>>;
  onProcessingToast: (msg: string) => void;
  onHire: () => void;
}) {
  const pickMsg = (category: string, messages: string[]) => {
    const last = lastMsg.current[category] ?? -1;
    let idx = Math.floor(Math.random() * messages.length);
    if (messages.length > 1) {
      while (idx === last) idx = Math.floor(Math.random() * messages.length);
    }
    lastMsg.current[category] = idx;
    return messages[idx];
  };

  const handleItem = (item: MenuItem) => {
    onClose();
    if (item.isHire) { onHire(); return; }
    if (item.link) { window.open(item.link, '_blank'); return; }
    onProcessingToast(pickMsg(item.category, item.messages));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="fixed z-[100] min-w-[230px] rounded-xl overflow-hidden shadow-2xl border border-[var(--border-color)]"
      style={{ left: x, top: y, background: 'var(--bg-secondary)', transformOrigin: 'top left' }}
    >
      <div className="px-3 py-2 text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] border-b border-[var(--border-color)] flex items-center gap-2">
        <span className="text-[var(--color-green)]">●</span>
        tejpreet@portfolio:~$
      </div>
      {menuGroups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'border-t border-[var(--border-color)]' : ''}>
          {group.items.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => handleItem(item)}
              className="w-full px-3 py-2 text-left text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)] flex items-center gap-2.5 group"
              whileHover={{ backgroundColor: 'rgba(88,166,255,0.08)', x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <span className="text-[var(--color-yellow)] text-[10px] w-4 flex-shrink-0 group-hover:text-[var(--color-cyan)] transition-colors">
                {item.icon}
              </span>
              <span className={`group-hover:text-[var(--color-cyan)] transition-colors ${item.isHire ? 'text-[var(--color-yellow)] font-bold' : ''}`}>
                {item.label}
              </span>
              {item.isHire && (
                <motion.span
                  className="ml-auto text-[8px] text-[var(--color-green)] opacity-60"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ELEVATED
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// HIRE POPUP — 3-step modal sequence
// ModalShell is a STABLE top-level component (never nested
// inside another function) — prevents React unmount flicker
// ─────────────────────────────────────────────────────────

const HIRE_INPUT_BASE =
  'w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--color-cyan)] focus:shadow-[0_0_0_2px_rgba(88,166,255,0.15)] transition-all duration-200';

function HireModalShell({
  filename, onClose, children,
}: {
  filename: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md mx-4 rounded-2xl border overflow-hidden"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 0 60px rgba(88,166,255,0.08), 0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">{filename}</span>
          </div>
          <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)]">sudo</span>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function HirePopup({
  step, form, errors, onFormChange, onSubmitForm, onNext, onClose,
}: {
  step: 'form' | 'resume' | 'thanks';
  form: { name: string; company: string; email: string; phone: string };
  errors: Record<string, string>;
  onFormChange: (field: string, val: string) => void;
  onSubmitForm: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  if (step === 'form') {
    return (
      <HireModalShell filename="hire.sh" onClose={onClose}>
        <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-green)] mb-1">$ sudo hire tejpreet</p>
        <h2 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] mb-1">Let&apos;s Work Together</h2>
        <p className="text-[11px] text-[var(--text-secondary)] mb-4">Fill in your details and I&apos;ll be in touch.</p>
        <div className="space-y-3">
          {[
            { field: 'name', label: 'Name', placeholder: 'Jane Smith', type: 'text' },
            { field: 'company', label: 'Company', placeholder: 'Acme Corp', type: 'text' },
            { field: 'email', label: 'Email', placeholder: 'jane@acme.com', type: 'email' },
            { field: 'phone', label: 'Phone (optional)', placeholder: '+1 555 000 0000', type: 'tel' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label className="block text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-widest mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={(e) => onFormChange(field, e.target.value)}
                placeholder={placeholder}
                className={HIRE_INPUT_BASE}
              />
              {errors[field] && (
                <p className="text-[9px] text-[#FF5F57] mt-1 font-[family-name:var(--font-jetbrains)]">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
        <motion.button
          onClick={onSubmitForm}
          className="mt-5 w-full py-2.5 rounded-lg text-[11px] font-[family-name:var(--font-jetbrains)] font-bold text-[var(--color-text-dark)] cursor-pointer"
          style={{ background: 'linear-gradient(90deg, var(--color-green), #3DC97A)' }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(91,204,126,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          Submit →
        </motion.button>
      </HireModalShell>
    );
  }

  if (step === 'resume') {
    return (
      <HireModalShell filename="access_granted.sh" onClose={onClose}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
            className="text-4xl mb-3"
          >
            ★
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-green)] mb-1">
            ACCESS GRANTED
          </motion.p>
          <h2 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] mb-2">Now grab my resume</h2>
          <p className="text-[11px] text-[var(--text-secondary)] mb-5">Everything you need to make the call.</p>
          <div className="flex flex-col gap-3">
            <motion.a
              href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="block py-2.5 rounded-lg text-[11px] font-[family-name:var(--font-jetbrains)] font-bold text-[var(--color-text-dark)] text-center cursor-pointer"
              style={{ background: 'linear-gradient(90deg, var(--color-yellow), #FFA500)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,211,0,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              ↓ Download Resume (PDF)
            </motion.a>
            <motion.button
              onClick={onNext}
              className="py-2 rounded-lg text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)] border border-[var(--color-cyan)]/30 cursor-pointer"
              whileHover={{ backgroundColor: 'rgba(88,166,255,0.08)', borderColor: 'var(--color-cyan)' }}
            >
              Continue →
            </motion.button>
          </div>
        </div>
      </HireModalShell>
    );
  }

  // step === 'thanks'
  return (
    <HireModalShell filename="thank_you.sh" onClose={onClose}>
      <div className="text-center">
        <motion.div className="relative inline-block mb-4">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i / 6) * Math.PI * 2) * 36,
                y: Math.sin((i / 6) * Math.PI * 2) * 36,
              }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.8 }}
            >
              {['★', '✓', '⚡', '★', '✓', '⚡'][i]}
            </motion.span>
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto"
            style={{ background: 'rgba(91,204,126,0.15)', border: '2px solid var(--color-green)' }}
          >
            ✓
          </motion.div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--text-primary)] mb-2">
          Thank you, {form.name.split(' ')[0]}!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[12px] text-[var(--text-secondary)] mb-1">
          I appreciate your interest in my profile.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-[12px] text-[var(--color-cyan)] font-[family-name:var(--font-jetbrains)]">
          I&apos;ll be in touch shortly. ✦
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onClose}
          className="mt-5 px-6 py-2 rounded-lg text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-pointer"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          Close
        </motion.button>
      </div>
    </HireModalShell>
  );
}

// ─────────────────────────────────────────────────────────
// TERMINAL TEXT (typed-out effect)
// ─────────────────────────────────────────────────────────

function TerminalText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayed}
      <span className="animate-[blink_1s_infinite]">_</span>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// DATA DASHBOARD — GitHub-homepage inspired animated
// monitoring dashboard with live charts, counters,
// terminal output, and status indicators
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// FLOATING SQUIRCLE — interactive badge that floats and
// jitters on click
// ─────────────────────────────────────────────────────────

function FloatingSquircle({
  label,
  color,
  glowColor,
  top,
  left,
  right,
  bottom,
  delay,
  floatDirection,
}: {
  label: string;
  color: string;
  glowColor: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: number;
  floatDirection: 'up' | 'down' | 'left' | 'right';
}) {
  const [jitter, setJitter] = useState(false);
  const [isRed, setIsRed] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    // Flash red briefly then jitter like annoyed
    setIsRed(true);
    setTimeout(() => setIsRed(false), 150);
    setJitter(true);
    setClickCount((c) => c + 1);
    setTimeout(() => setJitter(false), 700);
  };

  const floatAnim = {
    up: { y: [0, -6, 0], x: [0, 2, 0] },
    down: { y: [0, 6, 0], x: [0, -1, 0] },
    left: { x: [0, -5, 0], y: [0, 2, 0] },
    right: { x: [0, 5, 0], y: [0, -2, 0] },
  };

  const currentColor = isRed ? '#FF5F57' : color;
  const currentGlow = isRed ? 'rgba(255,95,87,0.4)' : glowColor;

  return (
    <motion.button
      onClick={handleClick}
      className="absolute px-3 py-1.5 text-[10px] font-[family-name:var(--font-jetbrains)] font-bold border cursor-pointer select-none z-[30] backdrop-blur-md"
      style={{
        top,
        left,
        right,
        bottom,
        background: isRed
          ? 'rgba(255, 95, 87, 0.15)'
          : 'rgba(255, 255, 255, 0.07)',
        borderColor: currentColor,
        color: currentColor,
        borderRadius: '12px',
        boxShadow: `0 0 20px ${currentGlow}`,
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        willChange: 'transform',
      }}
      animate={
        jitter
          ? {
              x: [0, -6, 7, -5, 6, -4, 3, -1, 0],
              y: [0, 4, -5, 3, -4, 2, -1, 0],
              rotate: [0, -5, 6, -4, 5, -3, 2, -1, 0],
              scale: [1, 1.15, 0.9, 1.1, 0.93, 1.05, 0.97, 1],
            }
          : floatAnim[floatDirection]
      }
      transition={
        jitter
          ? { duration: 0.6, ease: 'easeOut' }
          : { duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }
      }
      whileHover={{ scale: 1.08, boxShadow: `0 0 30px ${currentGlow}` }}
    >
      {clickCount >= 5 ? 'stop it.' : label}
    </motion.button>
  );
}

function DataDashboard({ overdrive, onToast }: { overdrive: boolean; onToast: (msg: string) => void }) {
  const [activeCard, setActiveCard] = useState<'pipeline' | 'video'>('pipeline');
  const [cornerHovered, setCornerHovered] = useState(false);

  const handleShuffle = () => setActiveCard((a) => (a === 'pipeline' ? 'video' : 'pipeline'));

  const backAnim = {
    rotateZ: -2.5,
    x: cornerHovered ? 32 : 24,
    y: cornerHovered ? -24 : -18,
    scale: 0.97,
    opacity: 0.65,
  };
  const frontAnim = { rotateZ: 0, x: 0, y: 0, scale: 1 };
  const springTransition = { type: 'spring' as const, stiffness: 260, damping: 28 };

  return (
    <div className="relative w-full max-w-[680px]" style={{ perspective: '1200px' }}>
      {/* Floating interactive squircles — scattered asymmetrically around dashboard */}
      <FloatingSquircle label="42.8K events/s" color="var(--color-cyan)" glowColor="rgba(88,166,255,0.2)" top="-18px" left="22%" delay={0} floatDirection="up" />
      <FloatingSquircle label="p99: 23ms" color="var(--color-yellow)" glowColor="rgba(255,211,0,0.2)" top="28%" right="-72px" delay={0.6} floatDirection="right" />
      <FloatingSquircle label="0 errors" color="var(--color-green)" glowColor="rgba(91,204,126,0.2)" bottom="-18px" left="55%" delay={1.2} floatDirection="down" />
      <FloatingSquircle label="6 partitions" color="var(--color-purple)" glowColor="rgba(58,16,229,0.2)" top="62%" left="-70px" delay={1.8} floatDirection="left" />

      {/* Card stack */}
      <div className="relative">
        {/* Back card (inactive) — peeks from top-right */}
        <motion.div
          className="absolute top-0 left-0 w-full rounded-2xl overflow-hidden"
          animate={activeCard === 'pipeline' ? backAnim : frontAnim}
          transition={springTransition}
          style={{ transformOrigin: 'bottom left', zIndex: activeCard === 'pipeline' ? 5 : 10, pointerEvents: activeCard === 'pipeline' ? 'none' : 'auto' }}
        >
          <VideoPipelineDashboard overdrive={overdrive} onToast={onToast} />
        </motion.div>

        {/* Front card (active pipeline) */}
        <motion.div
          animate={activeCard === 'pipeline' ? frontAnim : backAnim}
          transition={springTransition}
          style={{ transformOrigin: 'bottom left', zIndex: activeCard === 'pipeline' ? 10 : 5, position: 'relative', pointerEvents: activeCard === 'pipeline' ? 'auto' : 'none' }}
        >
          <PipelineDashboardCard overdrive={overdrive} onToast={onToast} />
        </motion.div>

        {/* Corner hover zone — top-right, triggers peek + shuffle */}
        <motion.div
          className="absolute top-0 right-0 z-20 cursor-pointer flex items-end justify-start p-1.5"
          style={{ width: 100, height: 80 }}
          onHoverStart={() => setCornerHovered(true)}
          onHoverEnd={() => setCornerHovered(false)}
          onClick={handleShuffle}
          title="Switch dashboard view"
        >
          <motion.div
            className="text-[8px] font-[family-name:var(--font-jetbrains)] px-1.5 py-0.5 rounded border border-[var(--border-color)] select-none"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            animate={{ opacity: cornerHovered ? 0.9 : 0.3, scale: cornerHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {activeCard === 'pipeline' ? 'video ⇄' : 'data ⇄'}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PIPELINE DASHBOARD CARD (extracted for card-stack)
// ─────────────────────────────────────────────────────────

function PipelineDashboardCard({ overdrive, onToast }: { overdrive: boolean; onToast: (msg: string) => void }) {
  const [pipelineStates, setPipelineStates] = useState([
    { name: 'Kafka Ingest', status: 'running', color: 'var(--color-green)' },
    { name: 'Spark Transform', status: 'running', color: 'var(--color-green)' },
    { name: 'Delta Write', status: 'running', color: 'var(--color-green)' },
    { name: 'dbt Models', status: 'building', color: 'var(--color-yellow)' },
    { name: 'Grafana Sync', status: 'ready', color: 'var(--color-cyan)' },
  ]);
  const [chartPaused, setChartPaused] = useState(false);
  const [showDeployToast, setShowDeployToast] = useState(false);
  const [deployCount, setDeployCount] = useState(0);

  const togglePipelineStatus = (index: number) => {
    setPipelineStates((prev) => {
      const next = [...prev];
      const cycle = ['running', 'paused', 'error', 'running'] as const;
      const colors = { running: 'var(--color-green)', paused: 'var(--color-yellow)', error: '#FF5F57' } as const;
      const currentIdx = cycle.indexOf(next[index].status as typeof cycle[number]);
      const nextStatus = cycle[(currentIdx + 1) % (cycle.length - 1)] as keyof typeof colors;
      next[index] = { ...next[index], status: nextStatus, color: colors[nextStatus] };
      return next;
    });
  };

  const handleDeploy = () => {
    setDeployCount((c) => c + 1);
    setShowDeployToast(true);
    setPipelineStates((prev) => prev.map((p) => ({ ...p, status: 'running', color: 'var(--color-green)' })));
    onToast('Pipeline deployed successfully — all stages green');
    setTimeout(() => setShowDeployToast(false), 2000);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-2xl"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: overdrive ? 'var(--color-yellow)' : 'var(--border-color)',
        boxShadow: overdrive ? '0 0 60px rgba(255,211,0,0.3), 0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(88,166,255,0.05)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all cursor-pointer" />
            <button className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all cursor-pointer" onClick={() => setChartPaused((p) => !p)} />
            <button className="w-3 h-3 rounded-full bg-[#28CA41] hover:brightness-125 transition-all cursor-pointer" />
          </div>
          <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">pipeline-monitor.tsx</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDeploy} className="px-2.5 py-0.5 text-[9px] font-[family-name:var(--font-jetbrains)] font-bold rounded-md border border-[var(--color-green)]/40 text-[var(--color-green)] hover:bg-[var(--color-green)]/10 hover:border-[var(--color-green)] transition-all cursor-pointer">
            {showDeployToast ? '✓ deployed!' : `deploy (${deployCount})`}
          </button>
          <div className="flex items-center gap-2">
            <motion.div className="w-2 h-2 rounded-full bg-[var(--color-green)]" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">LIVE</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--border-color)' }}>
        <MetricCard label="Events/sec" value={42_847} suffix="" color="var(--color-cyan)" overdrive={overdrive} />
        <MetricCard label="Pipeline Latency" value={12} suffix="ms" color="var(--color-green)" overdrive={overdrive} />
        <MetricCard label="Uptime" value={99.97} suffix="%" color="var(--color-yellow)" overdrive={overdrive} />
      </div>
      <div className="grid grid-cols-5 gap-px" style={{ background: 'var(--border-color)' }}>
        <div className="col-span-3 p-4 cursor-pointer" style={{ background: 'var(--bg-secondary)' }} onClick={() => setChartPaused((p) => !p)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider">Throughput</span>
              {chartPaused && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[8px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)] bg-[var(--color-yellow)]/10 px-1.5 py-0.5 rounded">PAUSED</motion.span>}
            </div>
            <div className="flex gap-3">
              <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)] flex items-center gap-1"><span className="w-2 h-0.5 bg-[var(--color-cyan)] rounded" /> ingress</span>
              <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--color-purple)] flex items-center gap-1"><span className="w-2 h-0.5 bg-[var(--color-purple)] rounded" /> egress</span>
            </div>
          </div>
          <LiveChart overdrive={overdrive} paused={chartPaused} />
        </div>
        <div className="col-span-2 p-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider">Pipeline Status</span>
            <span className="text-[8px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] opacity-50">click to toggle</span>
          </div>
          <div className="space-y-2">
            {pipelineStates.map((item, i) => (
              <motion.button key={item.name} className="flex items-center justify-between w-full text-left rounded-md px-2 py-1.5 -mx-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer" onClick={() => togglePipelineStatus(i)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} whileTap={{ scale: 0.97 }}>
                <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)]">{item.name}</span>
                <div className="flex items-center gap-1.5">
                  <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} animate={item.status === 'running' ? { opacity: [1, 0.3, 1] } : item.status === 'paused' ? { scale: [1, 1.3, 1] } : item.status === 'error' ? { opacity: [1, 0, 1] } : {}} transition={{ duration: item.status === 'error' ? 0.5 : 1.5, repeat: Infinity }} />
                  <span className="text-[9px] font-[family-name:var(--font-jetbrains)]" style={{ color: item.color }}>{item.status}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
        <div className="px-4 py-3"><TerminalOutput overdrive={overdrive} /></div>
        <div className="flex items-center gap-2 px-4 pb-3">
          <DashboardActionButton label="Run DAG" icon="▶" color="var(--color-green)" message="DAG pipeline_daily triggered" onToast={onToast} />
          <DashboardActionButton label="Clear Cache" icon="⟳" color="var(--color-cyan)" message="Redis cache flushed — rebuilding" onToast={onToast} />
          <DashboardActionButton label="Scale Up" icon="↑" color="var(--color-yellow)" message="Scaling Spark workers: 4 → 8" onToast={onToast} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// VIDEO PIPELINE DASHBOARD — alternate card
// ─────────────────────────────────────────────────────────

function VideoPipelineDashboard({ overdrive, onToast }: { overdrive: boolean; onToast: (msg: string) => void }) {
  const [stageStates, setStageStates] = useState([
    { name: 'Frame Capture', status: 'running', color: 'var(--color-green)' },
    { name: 'Pre-process', status: 'running', color: 'var(--color-green)' },
    { name: 'Model Infer', status: 'running', color: 'var(--color-green)' },
    { name: 'Post-process', status: 'building', color: 'var(--color-yellow)' },
    { name: 'Stream Output', status: 'ready', color: 'var(--color-cyan)' },
  ]);
  const [chartPaused, setChartPaused] = useState(false);
  const [fps, setFps] = useState(30);
  const [bufferPct, setBufferPct] = useState(84);
  const [deployCount, setDeployCount] = useState(0);
  const [showDeployToast, setShowDeployToast] = useState(false);

  useEffect(() => {
    if (chartPaused) return;
    const interval = setInterval(() => {
      setFps(Math.round(28 + Math.random() * 4));
      setBufferPct(Math.round(78 + Math.random() * 12));
    }, 1200);
    return () => clearInterval(interval);
  }, [chartPaused]);

  const toggleStage = (index: number) => {
    setStageStates((prev) => {
      const next = [...prev];
      const cycle = ['running', 'paused', 'error', 'running'] as const;
      const colors = { running: 'var(--color-green)', paused: 'var(--color-yellow)', error: '#FF5F57' } as const;
      const currentIdx = cycle.indexOf(next[index].status as typeof cycle[number]);
      const nextStatus = cycle[(currentIdx + 1) % (cycle.length - 1)] as keyof typeof colors;
      next[index] = { ...next[index], status: nextStatus, color: colors[nextStatus] };
      return next;
    });
  };

  const handleDeploy = () => {
    setDeployCount((c) => c + 1);
    setShowDeployToast(true);
    setStageStates((prev) => prev.map((p) => ({ ...p, status: 'running', color: 'var(--color-green)' })));
    onToast('Video pipeline restarted — all stages running');
    setTimeout(() => setShowDeployToast(false), 2000);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-2xl"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: overdrive ? 'var(--color-yellow)' : 'var(--border-color)',
        boxShadow: overdrive ? '0 0 60px rgba(255,211,0,0.3), 0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(91,204,126,0.05)',
      }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all cursor-pointer" />
            <button className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all cursor-pointer" onClick={() => setChartPaused((p) => !p)} />
            <button className="w-3 h-3 rounded-full bg-[#28CA41] hover:brightness-125 transition-all cursor-pointer" />
          </div>
          <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">video-pipeline.tsx</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDeploy} className="px-2.5 py-0.5 text-[9px] font-[family-name:var(--font-jetbrains)] font-bold rounded-md border border-[var(--color-green)]/40 text-[var(--color-green)] hover:bg-[var(--color-green)]/10 hover:border-[var(--color-green)] transition-all cursor-pointer">
            {showDeployToast ? '✓ restarted!' : `restart (${deployCount})`}
          </button>
          <div className="flex items-center gap-2">
            <motion.div className="w-2 h-2 rounded-full bg-[var(--color-green)]" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">LIVE</span>
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--border-color)' }}>
        <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider block">FPS</span>
          <motion.div className="text-2xl font-bold font-[family-name:var(--font-display)] mt-1" style={{ color: overdrive ? 'var(--color-yellow)' : 'var(--color-green)' }}
            animate={{ opacity: [0.7, 1] }} transition={{ duration: 0.3 }}>
            {fps}<span className="text-sm ml-0.5 opacity-60">fps</span>
          </motion.div>
        </div>
        <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider block">Infer Latency</span>
          <div className="text-2xl font-bold font-[family-name:var(--font-display)] mt-1" style={{ color: overdrive ? 'var(--color-yellow)' : 'var(--color-cyan)' }}>18<span className="text-sm ml-0.5 opacity-60">ms</span></div>
        </div>
        <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider block">Drop Rate</span>
          <div className="text-2xl font-bold font-[family-name:var(--font-display)] mt-1" style={{ color: overdrive ? 'var(--color-yellow)' : 'var(--color-yellow)' }}>0.3<span className="text-sm ml-0.5 opacity-60">%</span></div>
        </div>
      </div>

      {/* Chart + status */}
      <div className="grid grid-cols-5 gap-px" style={{ background: 'var(--border-color)' }}>
        <div className="col-span-3 p-4 cursor-pointer" style={{ background: 'var(--bg-secondary)' }} onClick={() => setChartPaused((p) => !p)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider">Frame Buffer</span>
              {chartPaused && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-[family-name:var(--font-jetbrains)] text-[var(--color-yellow)] bg-[var(--color-yellow)]/10 px-1.5 py-0.5 rounded">PAUSED</motion.span>}
            </div>
            <span className="text-[9px] font-[family-name:var(--font-jetbrains)]" style={{ color: bufferPct > 90 ? '#FF5F57' : 'var(--color-green)' }}>{bufferPct}% utilized</span>
          </div>
          <BarChart paused={chartPaused} overdrive={overdrive} />
          {/* Buffer progress bar */}
          <div className="mt-3 h-1 rounded-full bg-[var(--border-color)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: bufferPct > 90 ? '#FF5F57' : 'var(--color-green)' }}
              animate={{ width: `${bufferPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="col-span-2 p-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider">Stage Status</span>
            <span className="text-[8px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] opacity-50">click to toggle</span>
          </div>
          <div className="space-y-2">
            {stageStates.map((item, i) => (
              <motion.button key={item.name} className="flex items-center justify-between w-full text-left rounded-md px-2 py-1.5 -mx-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer" onClick={() => toggleStage(i)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} whileTap={{ scale: 0.97 }}>
                <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)]">{item.name}</span>
                <div className="flex items-center gap-1.5">
                  <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} animate={item.status === 'running' ? { opacity: [1, 0.3, 1] } : item.status === 'paused' ? { scale: [1, 1.3, 1] } : item.status === 'error' ? { opacity: [1, 0, 1] } : {}} transition={{ duration: item.status === 'error' ? 0.5 : 1.5, repeat: Infinity }} />
                  <span className="text-[9px] font-[family-name:var(--font-jetbrains)]" style={{ color: item.color }}>{item.status}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal + buttons */}
      <div className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
        <div className="px-4 py-3"><VideoTerminalOutput overdrive={overdrive} /></div>
        <div className="flex items-center gap-2 px-4 pb-3">
          <DashboardActionButton label="Boost FPS" icon="⚡" color="var(--color-yellow)" message="FPS target increased: 30 → 60" onToast={onToast} />
          <DashboardActionButton label="Reset Buffer" icon="⟳" color="var(--color-cyan)" message="Frame buffer cleared — rebuilding" onToast={onToast} />
          <DashboardActionButton label="Export" icon="↓" color="var(--color-green)" message="Metrics exported to s3://metrics/video" onToast={onToast} />
        </div>
      </div>
    </div>
  );
}

// Bar chart for video pipeline
function BarChart({ paused, overdrive }: { paused: boolean; overdrive: boolean }) {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 18 }, () => 30 + Math.random() * 60));

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setBars((prev) => [...prev.slice(1), 20 + Math.random() * 75]);
    }, 700);
    return () => clearInterval(interval);
  }, [paused]);

  const h = 100;
  return (
    <div className="flex items-end gap-[2px] h-[100px]">
      {bars.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            background: overdrive
              ? `hsl(${40 + (i * 8) % 30}, 95%, ${45 + (i * 3) % 25}%)`
              : i === bars.length - 1
              ? 'var(--color-yellow)'
              : `rgba(255,211,0,${0.3 + (v / 100) * 0.6})`,
          }}
          animate={{ height: `${(v / 100) * h}px` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// Video pipeline terminal output
function VideoTerminalOutput({ overdrive }: { overdrive: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const templates = [
    '[capture] ✓ Frame #47,291 captured (1080p@30fps)',
    '[preproc] ✓ Resize + normalize: 2.1ms',
    '[infer]   ✓ YOLOv8: 3 objects detected',
    '[encode]  ✓ H.264 encoded — bitrate: 4.2 Mbps',
    '[stream]  ✓ 142 clients receiving',
    '[buffer]  ✓ Ring buffer healthy — 84% utilization',
    '[drop]    ✓ Drop rate nominal: 0.3%',
    '[gpu]     ✓ CUDA utilization: 72%',
    '[infer]   ✓ Confidence threshold: 0.85',
    '[capture] ✓ Frame #47,348 captured (1080p@30fps)',
  ];

  useEffect(() => {
    templates.slice(0, 3).forEach((line, i) => {
      setTimeout(() => setLines((prev) => [...prev.slice(-4), line]), 1200 + i * 400);
    });
    let idx = 3;
    const interval = setInterval(() => {
      const line = overdrive ? `[OVERLOAD] ⚡ ${templates[idx % templates.length]}` : templates[idx % templates.length];
      setLines((prev) => [...prev.slice(-4), line]);
      idx++;
    }, 2200);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overdrive]);

  return (
    <div className="space-y-1 h-[60px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {lines.map((line, i) => (
          <motion.div key={`${line}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] leading-tight truncate">
            <span className="mr-1" style={{ color: line.includes('✓') ? 'var(--color-green)' : overdrive ? 'var(--color-yellow)' : 'var(--text-secondary)' }}>{'>'}</span>
            {line}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DASHBOARD ACTION BUTTON — clickable with feedback toast
// ─────────────────────────────────────────────────────────

function DashboardActionButton({
  label,
  icon,
  color,
  message,
  onToast,
}: {
  label: string;
  icon: string;
  color: string;
  message: string;
  onToast: (msg: string) => void;
}) {
  const [running, setRunning] = useState(false);

  const handleClick = () => {
    if (running) return;
    setRunning(true);
    setTimeout(() => {
      onToast(message);
      setRunning(false);
    }, 800);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-[family-name:var(--font-jetbrains)] font-medium rounded-md border transition-all cursor-pointer"
        style={{
          borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
          color,
        }}
        whileHover={{
          borderColor: color,
          backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{running ? '...' : icon}</span>
        {label}
      </motion.button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// METRIC CARD — single animated metric with counting effect
// ─────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  suffix,
  color,
  overdrive,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  overdrive: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);
  const [fluctuation, setFluctuation] = useState(0);

  // Count up animation on mount
  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(animate, 800);
    return () => clearTimeout(timer);
  }, [value]);

  // Live fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFluctuation(Math.floor(Math.random() * 100) - 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const displayValue =
    value > 1000
      ? ((displayed + fluctuation) / 1000).toFixed(1) + 'K'
      : value < 100 && suffix === '%'
      ? displayed.toFixed(2)
      : (displayed + Math.floor(fluctuation / 10)).toString();

  return (
    <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
      <span className="text-[9px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] uppercase tracking-wider">
        {label}
      </span>
      <motion.div
        className="text-2xl font-bold font-[family-name:var(--font-display)] mt-1"
        style={{ color: overdrive ? 'var(--color-yellow)' : color }}
      >
        {displayValue}
        <span className="text-sm ml-0.5 opacity-60">{suffix}</span>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LIVE CHART — animated SVG line chart with two data series
// ─────────────────────────────────────────────────────────

function LiveChart({ overdrive, paused = false }: { overdrive: boolean; paused?: boolean }) {
  const [data1, setData1] = useState<number[]>([]);
  const [data2, setData2] = useState<number[]>([]);
  const maxPoints = 30;

  useEffect(() => {
    // Seed initial data
    const initial1 = Array.from({ length: maxPoints }, () => 40 + Math.random() * 40);
    const initial2 = Array.from({ length: maxPoints }, () => 30 + Math.random() * 30);
    setData1(initial1);
    setData2(initial2);
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setData1((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev.slice(1), prev[prev.length - 1] + (Math.random() - 0.48) * 15];
        next[next.length - 1] = Math.max(10, Math.min(95, next[next.length - 1]));
        return next;
      });
      setData2((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev.slice(1), prev[prev.length - 1] + (Math.random() - 0.48) * 12];
        next[next.length - 1] = Math.max(5, Math.min(80, next[next.length - 1]));
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [paused]);

  if (data1.length === 0) return <div className="h-[100px]" />;

  const w = 300;
  const h = 100;

  const toPath = (data: number[]) => {
    return data
      .map((v, i) => {
        const x = (i / (maxPoints - 1)) * w;
        const y = h - (v / 100) * h;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const toArea = (data: number[]) => {
    const path = data
      .map((v, i) => {
        const x = (i / (maxPoints - 1)) * w;
        const y = h - (v / 100) * h;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    return `${path} L ${w} ${h} L 0 ${h} Z`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[100px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-purple)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--color-purple)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => (
        <line
          key={v}
          x1={0}
          y1={h - (v / 100) * h}
          x2={w}
          y2={h - (v / 100) * h}
          stroke="var(--text-primary)"
          strokeOpacity={0.04}
          strokeDasharray="2 4"
        />
      ))}

      {/* Area fills */}
      <path d={toArea(data1)} fill="url(#areaGrad1)" />
      <path d={toArea(data2)} fill="url(#areaGrad2)" />

      {/* Lines */}
      <motion.path
        d={toPath(data2)}
        fill="none"
        stroke={overdrive ? 'var(--color-yellow)' : 'var(--color-purple)'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.path
        d={toPath(data1)}
        fill="none"
        stroke={overdrive ? 'var(--color-cyan)' : 'var(--color-cyan)'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Latest value dot */}
      <motion.circle
        cx={w}
        cy={h - (data1[data1.length - 1] / 100) * h}
        r={3}
        fill="var(--color-cyan)"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// TERMINAL OUTPUT — scrolling log lines
// ─────────────────────────────────────────────────────────

function TerminalOutput({ overdrive }: { overdrive: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const logTemplates = [
    '[kafka] ✓ Consumed 12,847 events from topic.raw-events',
    '[spark] ✓ Transform batch #4,291 completed (423ms)',
    '[delta] ✓ Upserted 8,192 rows into gold.user_metrics',
    '[airflow] ✓ DAG pipeline_daily triggered successfully',
    '[dbt] ✓ Model dim_users passed 3/3 tests',
    '[grafana] ✓ Dashboard metrics refreshed (lag: 2ms)',
    '[monitor] ✓ All 12 pipeline stages healthy',
    '[kafka] ✓ Consumer group rebalanced — 6 partitions',
    '[spark] ✓ Checkpoint saved to s3://lakehouse/cp/',
    '[redis] ✓ Cache hit rate: 97.3% (warm)',
  ];

  useEffect(() => {
    // Show initial lines with stagger
    const initialLines = logTemplates.slice(0, 3);
    initialLines.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev.slice(-4), line]);
      }, 1200 + i * 400);
    });

    // Then cycle through
    let lineIndex = 3;
    const interval = setInterval(() => {
      const line = overdrive
        ? `[OVERLOAD] ⚡ ${logTemplates[lineIndex % logTemplates.length]}`
        : logTemplates[lineIndex % logTemplates.length];
      setLines((prev) => [...prev.slice(-4), line]);
      lineIndex++;
    }, 2500);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overdrive]);

  return (
    <div className="space-y-1 h-[60px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {lines.map((line, i) => (
          <motion.div
            key={`${line}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] leading-tight truncate"
          >
            <span
              className="mr-1"
              style={{
                color: line.includes('✓')
                  ? 'var(--color-green)'
                  : overdrive
                  ? 'var(--color-yellow)'
                  : 'var(--text-secondary)',
              }}
            >
              {'>'}
            </span>
            {line}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
