'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { skillCategories } from '@/data/skills';
import { useMouseContext } from '@/contexts/MouseContext';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { springX } = useMouseContext();
  const gridParallaxX = useTransform(springX, [-1, 1], [-7, 7]);

  const allSkills = activeCategory === 'All'
    ? skillCategories
    : skillCategories.filter((c) => c.name === activeCategory);

  const categories = ['All', ...skillCategories.map((c) => c.name)];

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          subtitle="// transform(raw_potential, expertise)"
          title="Skills & Technologies"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-[var(--color-text-dark)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-color)]'
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 rounded-full bg-[var(--color-yellow)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ x: gridParallaxX, willChange: 'transform' }}
          >
            {allSkills.map((category, catIdx) => (
              <motion.div
                key={category.name}
                initial={{
                  opacity: 0,
                  y: 80,
                  x: catIdx % 3 === 0 ? -60 : catIdx % 3 === 2 ? 60 : 0,
                  scale: 0.8,
                  rotateZ: catIdx % 2 === 0 ? -3 : 3,
                }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotateZ: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: catIdx * 0.12, duration: 0.7, type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-opacity-50 transition-all duration-300 group"
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: category.color,
                }}
              >
                <h3
                  className="font-[family-name:var(--font-display)] text-lg font-bold mb-5"
                  style={{ color: category.color }}
                >
                  {category.name}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIdx) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      proficiency={skill.proficiency}
                      years={skill.yearsOfExperience}
                      color={category.color}
                      delay={catIdx * 0.1 + skillIdx * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function SkillBar({
  name,
  icon,
  proficiency,
  years,
  color,
  delay,
}: {
  name: string;
  icon: string;
  proficiency: number;
  years: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="group/skill">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{name}</span>
        </div>
        <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
          {years}yr{years !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}CC)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
