'use client';

import { motion } from 'framer-motion';
import { MapPin, ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { experiences } from '@/data/experience';

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      {/* Background glow */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-cyan) 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          subtitle="// pipeline.run(career_history)"
          title="Experience"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-0.5">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-[var(--color-cyan)] via-[var(--color-cyan)]/50 to-[var(--color-cyan)]/20"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.id} experience={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  experience: exp,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative flex items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline Node — with pulsing glow ring */}
      <motion.div
        className="absolute left-0 md:left-1/2 -translate-x-1/2 z-10"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <div className="w-4 h-4 rounded-full border-[3px] border-[var(--color-cyan)] bg-[var(--bg-primary)]" />
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--color-cyan)]"
            animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? 12 : -12 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 120, damping: 18 }}
        style={{ transformOrigin: isLeft ? 'left center' : 'right center' }}
        className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
        }`}
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-cyan)]/20 transition-all duration-300 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Date & Location */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-cyan)]">
              {exp.startDate} — {exp.endDate}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <MapPin size={12} />
              {exp.location}
            </div>
          </div>

          {/* Company & Role */}
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--text-primary)] mb-1">
            {exp.company}
          </h3>
          <p className="text-[var(--color-yellow)] font-medium mb-3">{exp.role}</p>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            {exp.description}
          </p>

          {/* Expandable Bullets */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 mb-4">
              {exp.bullets.map((bullet, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                  transition={{ delay: j * 0.05 }}
                  className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                >
                  <span className="text-[var(--color-cyan)] mt-1 shrink-0">▸</span>
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Key Achievement */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-yellow)]/5 border border-[var(--color-yellow)]/10 mb-4">
            <Star size={14} className="text-[var(--color-yellow)] mt-0.5 shrink-0" />
            <span className="text-sm text-[var(--color-yellow)]">{exp.keyAchievement}</span>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-3">
            {exp.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-lavender)]/10 text-[var(--color-lavender)] border border-[var(--color-lavender)]/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Expand toggle */}
          <button className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--color-cyan)] transition-colors">
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.span>
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
