'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> initializing portfolio...', delay: 0 },
  { text: '> loading pipeline systems...', delay: 600 },
  { text: '> mounting components...', delay: 1200 },
  { text: '> all systems operational ✓', delay: 1800 },
];

const TOTAL_MS = 2600;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVisible(true);

    // Boot lines — collect all timer IDs so cleanup cancels them (fixes StrictMode double messages)
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach(({ text, delay }) => {
      timers.push(setTimeout(() => setLines((l) => [...l, text]), delay));
    });

    // Progress bar
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / TOTAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Dismiss
    timers.push(setTimeout(() => setVisible(false), TOTAL_MS + 300));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#10162F' }}
        >
          {/* Subtle dot grid background */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, #58a6ff 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-sm mx-4 rounded-2xl border overflow-hidden"
            style={{
              background: '#1A2142',
              borderColor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 0 60px rgba(88,166,255,0.08), 0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.07]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <span className="ml-2 text-[10px] font-mono text-white/40">boot.sh</span>
            </div>

            {/* Boot lines */}
            <div className="p-5 space-y-2 min-h-[110px]">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[11px] font-mono"
                  style={{
                    color: line.includes('✓') ? '#5BCC7E' : i === lines.length - 1 ? '#58a6ff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {line}
                  {i === lines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-0.5"
                    >
                      _
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Loading</span>
                <span className="text-[9px] font-mono text-white/30">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #58a6ff, #5BCC7E)',
                    boxShadow: '0 0 8px rgba(88,166,255,0.5)',
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
