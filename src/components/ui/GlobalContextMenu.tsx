'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────
// GLOBAL CONTEXT MENU — terminal-style right-click menu
// Attaches to window so it works anywhere on the site
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
      { label: 'view source', icon: '{}', category: 'link', messages: [], link: 'https://github.com/singhtejpreet2004/portfolio-website' },
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
              {(['★', '✓', '⚡', '★', '✓', '⚡'] as const)[i]}
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
// MAIN EXPORT — mounts as a sibling in layout, no wrapper div
// ─────────────────────────────────────────────────────────

export default function GlobalContextMenu() {
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsProcessing, setToastIsProcessing] = useState(false);
  const [hireStep, setHireStep] = useState<'none' | 'form' | 'resume' | 'thanks'>('none');
  const [hireForm, setHireForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [hireErrors, setHireErrors] = useState<Record<string, string>>({});
  const lastMenuMsg = useRef<Record<string, number>>({});

  // Intercept right-click globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowContextMenu({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Close on any click
  useEffect(() => {
    const close = () => setShowContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // Open hire popup via custom event (triggered by skills terminal `sudo hire tejpreet`)
  useEffect(() => {
    const handler = () => setHireStep('form');
    window.addEventListener('open-hire-popup', handler);
    return () => window.removeEventListener('open-hire-popup', handler);
  }, []);

  return (
    <>
      {/* Terminal Context Menu */}
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
            onHire={() => {
              setHireStep('form');
              setHireForm({ name: '', company: '', email: '', phone: '' });
              setHireErrors({});
            }}
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
            onSubmitForm={async () => {
              const errs: Record<string, string> = {};
              if (!hireForm.name.trim()) errs.name = 'Required';
              if (!hireForm.company.trim()) errs.company = 'Required';
              if (!hireForm.email.trim() || !hireForm.email.includes('@')) errs.email = 'Valid email required';
              if (Object.keys(errs).length > 0) { setHireErrors(errs); return; }
              setHireStep('resume');
              // Fire-and-forget email notification
              fetch('/api/hire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hireForm),
              }).catch(() => {/* silently ignore — UX not blocked */});
            }}
            onNext={() => setHireStep(hireStep === 'resume' ? 'thanks' : 'none')}
            onClose={() => setHireStep('none')}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-6 right-6 z-[200] px-5 py-3 rounded-xl font-[family-name:var(--font-jetbrains)] text-sm shadow-2xl border"
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
    </>
  );
}
