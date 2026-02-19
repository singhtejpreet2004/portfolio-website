'use client';

import { useState, FormEvent, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Send,
  Github,
  Linkedin,
  Mail,
  Globe,
  Download,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { profile } from '@/data/profile';

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  globe: Globe,
};

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven spring rise
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.4'],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate submission
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 4000);
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32">
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
      />

      <motion.div
        className="max-w-6xl mx-auto px-6"
        style={{ y: sectionY, opacity: sectionOpacity, willChange: 'transform, opacity' }}
      >
        <SectionHeading
          subtitle='// POST /api/contact { message: "Let&apos;s build something" }'
          title="Let's Connect"
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          {/* Left - Terminal Contact Form */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-hover)]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                  POST /api/hire-me
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 bg-[var(--bg-card)]">
                <div className="font-[family-name:var(--font-jetbrains)] text-sm space-y-4">
                  <span className="text-[var(--text-secondary)]">{'{'}</span>

                  {/* Name Field */}
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

                  {/* Email Field */}
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

                  {/* Subject Field */}
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

                  {/* Message Field */}
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

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formState !== 'idle'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold text-sm hover:shadow-[var(--shadow-glow-yellow)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === 'idle' && (
                    <>
                      <Send size={16} />
                      {'>>> Send Request'}
                    </>
                  )}
                  {formState === 'sending' && (
                    <span className="font-[family-name:var(--font-jetbrains)]">
                      Sending...
                    </span>
                  )}
                  {formState === 'success' && (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      200 OK — Message Delivered!
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Right - Social Links & Info */}
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              Whether you&apos;re looking for a data engineer to join your team, want to collaborate
              on an exciting project, or just want to geek out about Kafka — I&apos;d love to hear
              from you.
            </p>

            {/* Social Cards */}
            {profile.socialLinks.map((link, i) => {
              const Icon = socialIcons[link.icon] || Globe;
              return (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-cyan)]/20 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center group-hover:bg-[var(--color-cyan)]/10 transition-colors">
                    <Icon size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{link.platform}</span>
                    <p className="text-xs text-[var(--text-secondary)]">{link.handle}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors"
                  />
                </motion.a>
              );
            })}

            {/* Resume Download */}
            <motion.a
              href="/resume.pdf"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold hover:shadow-[var(--shadow-glow-yellow)] transition-all"
            >
              <Download size={18} />
              Download Resume
            </motion.a>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 p-3"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-green)] animate-pulse" />
              <span className="text-sm text-[var(--color-green)] font-medium">
                Open to opportunities
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
