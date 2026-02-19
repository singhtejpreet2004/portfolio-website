'use client';

import { motion } from 'framer-motion';
import { Award, BadgeCheck, Trophy, Lightbulb, FileText } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { achievements } from '@/data/achievements';

const typeIcons = {
  certification: BadgeCheck,
  award: Trophy,
  accomplishment: Lightbulb,
};

export default function Achievements() {
  const certifications = achievements.filter((a) => a.type === 'certification');
  const awards = achievements.filter((a) => a.type === 'award');
  const accomplishments = achievements.filter((a) => a.type === 'accomplishment');

  return (
    <section id="achievements" className="relative py-24 md:py-32">
      <div
        className="absolute bottom-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-yellow) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          subtitle="// assert data_quality.score >= 'excellent'"
          title="Achievements & Certifications"
        />

        {/* Certifications */}
        <div className="mb-12">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-display)]">
            <BadgeCheck size={20} className="text-[var(--color-cyan)]" />
            Certifications
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, scale: 0, rotate: i % 2 === 0 ? -15 : 15, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, type: 'spring', stiffness: 400, damping: 20 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-opacity-50 transition-all duration-300 group cursor-default"
                style={{ borderLeftWidth: '3px', borderLeftColor: cert.badgeColor }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${cert.badgeColor}15` }}
                  >
                    <BadgeCheck size={20} style={{ color: cert.badgeColor }} />
                  </div>
                  <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                    {cert.date}
                  </span>
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-[var(--color-yellow)] transition-colors">
                  {cert.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">{cert.issuer}</p>

                {/* Shimmer effect on hover */}
                <div className="mt-3 h-0.5 rounded-full overflow-hidden bg-[var(--bg-hover)]">
                  <motion.div
                    className="h-full w-full rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${cert.badgeColor}, transparent)` }}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Competitions & Awards */}
        <div className="mb-12">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-display)]">
            <Trophy size={20} className="text-[var(--color-yellow)]" />
            Competitions & Awards
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, scale: 0, rotate: i % 3 === 0 ? -20 : i % 3 === 1 ? 0 : 20, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 350, damping: 22 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-yellow)]/20 transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${award.badgeColor}15` }}
                  >
                    <Trophy size={20} style={{ color: award.badgeColor }} />
                  </div>
                  <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                    {award.date}
                  </span>
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-2 group-hover:text-[var(--color-yellow)] transition-colors">
                  {award.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {award.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Research & Publications */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-display)]">
            <FileText size={20} className="text-[var(--color-green)]" />
            Research & Publications
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {accomplishments.map((acc, i) => (
              <motion.div
                key={acc.title}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 300, damping: 22 }}
                whileHover={{ y: -2 }}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-green)]/20 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: `${acc.badgeColor}15` }}
                  >
                    <Lightbulb size={20} style={{ color: acc.badgeColor }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                      {acc.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">{acc.issuer} · {acc.date}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {acc.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
