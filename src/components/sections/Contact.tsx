'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { profile } from '@/data/profile';

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  globe: Globe,
};

// ─────────────────────────────────────────────────────────
// THANK YOU POPUP
// ─────────────────────────────────────────────────────────

function ThankYouPopup({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(6,11,21,0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--border-color)] p-8 shadow-2xl text-center"
        style={{ background: 'var(--bg-card)' }}
        initial={{ scale: 0.88, y: 28, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Check icon */}
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(91,204,126,0.12)', border: '1px solid rgba(91,204,126,0.25)' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
        >
          <CheckCircle2 size={30} className="text-[var(--color-green)]" />
        </motion.div>

        <motion.h3
          className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)] mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Message Received!
        </motion.h3>

        <motion.p
          className="text-sm text-[var(--text-secondary)] leading-relaxed mb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
        >
          Thanks for reaching out. I&apos;ll get back to you shortly.
        </motion.p>

        <motion.p
          className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[var(--color-cyan)] opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.35 }}
        >
          OK · Message Delivered
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('send failed');
      setFormState('idle');
      setShowThankYou(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  return (
    <>
      <section id="contact" className="relative py-24 md:py-32">
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
        />

        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading
            subtitle='// POST /api/contact { message: "Let&apos;s build something" }'
            title="Let's Connect"
            align="center"
          />

          <div className="grid lg:grid-cols-2 gap-10 mt-12">
            {/* Left — Terminal Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-hover)]">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                    POST /api/hire-me
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 bg-[var(--bg-card)]">
                  <div className="font-[family-name:var(--font-jetbrains)] text-sm space-y-4">
                    <span className="text-[var(--text-secondary)]">{'{'}</span>

                    <div className="ml-4 flex items-center gap-2 flex-wrap">
                      <span className="text-[var(--color-cyan)]">&quot;name&quot;</span>
                      <span className="text-[var(--text-secondary)]">:</span>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        required
                        className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-cyan)] transition-colors placeholder:text-[var(--text-secondary)]/50"
                      />
                    </div>

                    <div className="ml-4 flex items-center gap-2 flex-wrap">
                      <span className="text-[var(--color-cyan)]">&quot;email&quot;</span>
                      <span className="text-[var(--text-secondary)]">:</span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-cyan)] transition-colors placeholder:text-[var(--text-secondary)]/50"
                      />
                    </div>

                    <div className="ml-4 flex items-center gap-2 flex-wrap">
                      <span className="text-[var(--color-cyan)]">&quot;subject&quot;</span>
                      <span className="text-[var(--text-secondary)]">:</span>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-cyan)] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option value="hiring">Job Opportunity</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="freelance">Freelance Project</option>
                        <option value="other">Just Saying Hi</option>
                      </select>
                    </div>

                    <div className="ml-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[var(--color-cyan)]">&quot;message&quot;</span>
                        <span className="text-[var(--text-secondary)]">:</span>
                      </div>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your message here..."
                        required
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-cyan)] transition-colors resize-none placeholder:text-[var(--text-secondary)]/50"
                      />
                    </div>

                    <span className="text-[var(--text-secondary)]">{'}'}</span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={formState !== 'idle'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold text-sm hover:shadow-[var(--shadow-glow-yellow)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formState === 'idle' ? (
                      <span className="font-[family-name:var(--font-jetbrains)]">Send Request</span>
                    ) : formState === 'error' ? (
                      <span className="font-[family-name:var(--font-jetbrains)]">Failed — try again</span>
                    ) : (
                      <span className="font-[family-name:var(--font-jetbrains)]">Sending...</span>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right — Social Links & Info */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                Whether you&apos;re looking for a data engineer to join your team, want to collaborate
                on an exciting project, or just want to geek out about Kafka — I&apos;d love to hear
                from you.
              </p>

              {profile.socialLinks.map((link, i) => {
                const Icon = socialIcons[link.icon] || Globe;
                return (
                  <motion.a
                    key={link.platform}
                    href={link.url}
                    target={link.icon !== 'mail' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-cyan)]/20 transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center group-hover:bg-[var(--color-cyan)]/10 transition-colors">
                      <Icon size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{link.platform}</span>
                      <p className="text-xs text-[var(--text-secondary)]">{link.handle}</p>
                    </div>
                    <ArrowRight size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors" />
                  </motion.a>
                );
              })}

              {/* Resume Download */}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Tejpreet_Singh_Resume.pdf"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold hover:shadow-[var(--shadow-glow-yellow)] transition-all"
              >
                Download Resume
              </motion.a>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.75 }}
                className="flex items-center justify-center gap-2 p-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-green)] animate-pulse" />
                <span className="text-sm text-[var(--color-green)] font-medium">Open to opportunities</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Thank you popup */}
      <AnimatePresence>
        {showThankYou && <ThankYouPopup onClose={() => setShowThankYou(false)} />}
      </AnimatePresence>
    </>
  );
}
