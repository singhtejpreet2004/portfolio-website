'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ subtitle, title, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
    >
      <p className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--color-cyan)] mb-2">
        {subtitle}
      </p>
      <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
        {title}
      </h2>
      <div
        className={`mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  );
}
