'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { profile } from '@/data/profile';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Left - Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)] mb-2">
              {profile.name}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-1">{profile.title}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Building the future of data infrastructure,
              <br />
              one pipeline at a time.
            </p>
          </div>

          {/* Center - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact'].map(
                (link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-cyan)] transition-colors"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Right - Social & Back to Top */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-3">
              {[
                { icon: Github, url: profile.socialLinks[0].url },
                { icon: Linkedin, url: profile.socialLinks[1].url },
                { icon: Mail, url: profile.socialLinks[2].url },
              ].map(({ icon: Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)]/20 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-yellow)]/20 transition-all"
            >
              <ArrowUp size={14} />
              Back to Top
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            Built with Next.js, Framer Motion & lots of{' '}
            <Heart size={12} className="text-[var(--color-yellow)] fill-[var(--color-yellow)]" /> and ☕
          </p>
        </div>
      </div>
    </footer>
  );
}
