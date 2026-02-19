'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ChevronDown, Award, Users } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { education } from '@/data/education';

export default function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          subtitle="// source_systems.academic_records"
          title="Education"
        />

        <div className="space-y-8">
          {education.map((edu, i) => (
            <EducationCard key={i} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationCard({ edu, index }: { edu: (typeof education)[0]; index: number }) {
  const [showCourses, setShowCourses] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scaleX: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.2, duration: 0.6, type: 'spring', stiffness: 200, damping: 24 }}
      className="p-6 md:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-yellow)]/20 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-beige)]/10 border border-[var(--border-color)] flex items-center justify-center">
            <GraduationCap size={28} className="text-[var(--color-yellow)]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)]">
                {edu.institution}
              </h3>
              <p className="text-[var(--color-yellow)] font-medium">
                {edu.degree} — {edu.field}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--text-secondary)]">
                {edu.startDate} — {edu.endDate}
              </span>
              {edu.gpa && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-green)]/10 text-[var(--color-green)] border border-[var(--color-green)]/20">
                  CGPA: {edu.gpa}
                </span>
              )}
            </div>
          </div>

          {/* Activities */}
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            {edu.activities.map((activity) => (
              <span
                key={activity}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-lavender)]/10 text-[var(--color-lavender)] border border-[var(--color-lavender)]/20"
              >
                <Users size={10} />
                {activity}
              </span>
            ))}
          </div>

          {/* Coursework Accordion */}
          <button
            onClick={() => setShowCourses(!showCourses)}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-cyan)] transition-colors mt-2"
          >
            <Award size={14} />
            Relevant Coursework
            <motion.span animate={{ rotate: showCourses ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showCourses && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mt-3">
                  {edu.coursework.map((course, i) => (
                    <motion.span
                      key={course}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
