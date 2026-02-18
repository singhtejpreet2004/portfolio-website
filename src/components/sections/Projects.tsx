'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Github, ChevronRight, X, Zap } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const featured = projects.find((p) => p.featured);
  const selectedData = projects.find((p) => p.id === selectedProject);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          subtitle="// SELECT * FROM portfolio.projects ORDER BY impact DESC"
          title="Projects"
        />

        {/* Project Timeline - GitHub style */}
        <ProjectTimeline projects={projects} />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 mt-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'text-[var(--color-text-dark)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-color)]'
              }`}
            >
              {filter === cat && (
                <motion.div
                  layoutId="activeProjectTab"
                  className="absolute inset-0 rounded-full bg-[var(--color-cyan)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Featured Project */}
        {featured && filter === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedProject(featured.id)}
            className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--color-purple)]/5 border border-[var(--color-purple)]/20 cursor-pointer group hover:border-[var(--color-purple)]/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-yellow)] text-[var(--color-text-dark)]">
                ★ FEATURED
              </span>
              <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                {featured.date}
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--color-yellow)] transition-colors">
              {featured.title}
            </h3>
            <p className="text-[var(--text-secondary)] mb-5 max-w-3xl leading-relaxed">
              {featured.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-[var(--color-green)]" />
              <span className="font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">
                {featured.metrics}
              </span>
            </div>
          </motion.div>
        )}

        {/* Project Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered
              .filter((p) => filter !== 'All' || !p.featured)
              .map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelectedProject(project.id)}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedData && (
          <ProjectModal
            project={selectedData}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectTimeline({ projects: allProjects }: { projects: typeof projects }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Sort by date descending
  const sorted = [...allProjects].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div ref={ref} className="relative">
      {/* Horizontal line */}
      <div className="relative h-20 flex items-center">
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Timeline nodes */}
        <div className="relative w-full flex justify-between px-4">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="flex flex-col items-center group cursor-default"
            >
              <motion.div
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                  project.featured
                    ? 'bg-[var(--color-yellow)] border-[var(--color-yellow)] shadow-[0_0_12px_rgba(255,211,0,0.5)]'
                    : 'bg-[var(--bg-primary)] border-[var(--color-cyan)] group-hover:bg-[var(--color-cyan)]'
                }`}
                whileHover={{ scale: 1.5 }}
              />
              <span className="mt-2 text-[10px] md:text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] whitespace-nowrap">
                {project.date}
              </span>
              <span className="text-[9px] md:text-[11px] text-[var(--text-secondary)] max-w-[100px] text-center mt-1 hidden md:block leading-tight">
                {project.title.split(' ').slice(0, 3).join(' ')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: (typeof projects)[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-cyan)]/30 cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-glow-cyan)]"
    >
      {/* Category & Date */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-lavender)]/10 text-[var(--color-lavender)]">
          {project.category}
        </span>
        <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
          {project.date}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--color-yellow)] transition-colors line-clamp-2">
        {project.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
        {project.shortDescription}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-hover)] text-[var(--text-secondary)]"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 4 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-hover)] text-[var(--text-secondary)]">
            +{project.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2 text-xs mb-4">
        <Zap size={12} className="text-[var(--color-green)]" />
        <span className="font-[family-name:var(--font-jetbrains)] text-[var(--color-green)]">
          {project.metrics}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-cyan)] flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details <ChevronRight size={14} />
        </span>
        <div className="flex gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]">
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-primary)] mb-2">
            {project.title}
          </h2>
          <p className="text-sm font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] mb-6">
            {project.date}
          </p>

          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            {project.longDescription}
          </p>

          {/* Metrics */}
          <div className="p-4 rounded-xl bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 mb-6">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[var(--color-green)]" />
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--color-green)] font-medium">
                {project.metrics}
              </span>
            </div>
          </div>

          {/* Tech Stack */}
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Technologies Used</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--color-lavender)]/10 text-[var(--color-lavender)] border border-[var(--color-lavender)]/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--color-yellow)]/30 transition-colors"
              >
                <Github size={16} />
                View Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-yellow)] text-[var(--color-text-dark)] text-sm font-medium hover:shadow-[var(--shadow-glow-yellow)] transition-all"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
