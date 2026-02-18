'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-0 w-96 h-96 opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading subtitle="// where_it_all_began" title="About Me" />

        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left - Illustrated Character Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative">
              {/* Character illustration frame */}
              <div className="w-72 h-80 rounded-2xl bg-gradient-to-br from-[var(--color-navy-medium)] to-[var(--color-navy-light)] border border-[var(--border-color)] p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 right-4 h-8 rounded-lg bg-[var(--bg-hover)] flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                    tejpreet.py
                  </span>
                </div>

                {/* Code animation */}
                <div className="mt-8 w-full font-[family-name:var(--font-jetbrains)] text-xs space-y-1.5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--color-purple)]"
                  >
                    <span className="text-[var(--color-cyan)]">class</span> DataEngineer:
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="ml-4 text-[var(--text-secondary)]"
                  >
                    <span className="text-[var(--color-cyan)]">def</span>{' '}
                    <span className="text-[var(--color-yellow)]">__init__</span>(self):
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="ml-8 text-[var(--text-secondary)]"
                  >
                    self.name = <span className="text-[var(--color-green)]">&quot;Tejpreet&quot;</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="ml-8 text-[var(--text-secondary)]"
                  >
                    self.passion = <span className="text-[var(--color-green)]">&quot;Pipelines&quot;</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1 }}
                    className="ml-8 text-[var(--text-secondary)]"
                  >
                    self.coffee = <span className="text-[var(--color-yellow)]">float</span>(<span className="text-[var(--color-green)]">&quot;inf&quot;</span>)
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.3 }}
                    className="ml-4 text-[var(--text-secondary)]"
                  >
                    <span className="text-[var(--color-cyan)]">def</span>{' '}
                    <span className="text-[var(--color-yellow)]">build</span>(self, chaos):
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                    className="ml-8 text-[var(--text-secondary)]"
                  >
                    <span className="text-[var(--color-cyan)]">return</span> Pipeline(chaos).
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.7 }}
                    className="ml-12 text-[var(--text-secondary)]"
                  >
                    transform().insights()
                  </motion.div>
                </div>

                {/* Floating coffee emoji */}
                <motion.div
                  className="absolute bottom-4 right-4 text-2xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ☕
                </motion.div>
              </div>

              {/* Floating tech icons */}
              {['🐍', '📡', '🐳', '⚡'].map((icon, i) => (
                <motion.div
                  key={i}
                  className="absolute w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-lg shadow-lg"
                  style={{
                    top: `${[10, 70, 85, 20][i]}%`,
                    left: `${[-15, 105, 30, 95][i]}%`,
                  }}
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Bio Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 space-y-5"
          >
            {profile.bio.map((paragraph, i) => (
              <p
                key={i}
                className="text-[var(--text-secondary)] text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Fun Facts Counter Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {profile.funFacts.map((fact, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center hover:border-[var(--color-cyan)]/30 transition-all duration-300 group cursor-default"
            >
              <div className="text-3xl mb-2">{fact.icon}</div>
              <div className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                {fact.isCounter ? (
                  <AnimatedCounter target={fact.value as number} suffix="+" />
                ) : (
                  <span>{fact.value}</span>
                )}
              </div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">{fact.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
