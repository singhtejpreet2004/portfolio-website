'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, MessageCircle, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLSpanElement>(null);

  // Typewriter effect for taglines
  useEffect(() => {
    const tagline = profile.taglines[taglineIndex];
    if (isTyping) {
      if (displayText.length < tagline.length) {
        const timeout = setTimeout(() => {
          setDisplayText(tagline.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setTaglineIndex((prev) => (prev + 1) % profile.taglines.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, taglineIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Floating Background Elements */}
      <FloatingElements />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div>
            {/* Terminal pre-heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--color-cyan)] mb-6"
            >
              <span className="text-[var(--color-green)]">{'>'}</span>{' '}
              <TerminalText text="initializing data_engineer.portfolio()" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                <span className="text-[var(--text-secondary)]">Hi, I&apos;m</span>
                <br />
                <span className="text-gradient">{profile.name}</span>
              </h1>
            </motion.div>

            {/* Rotating Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl md:text-2xl text-[var(--text-secondary)] mb-6 h-8"
            >
              <span ref={terminalRef} className="font-[family-name:var(--font-jetbrains)]">
                {displayText}
              </span>
              <span className="inline-block w-0.5 h-6 bg-[var(--color-yellow)] ml-1 animate-[blink_1s_infinite]" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed"
            >
              I build the infrastructure that turns{' '}
              <span className="text-[var(--color-yellow)] font-medium">raw chaos</span> into{' '}
              <span className="text-[var(--color-cyan)] font-medium">actionable insights</span>.
              Real-time streaming, ETL pipelines, and everything in between.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold hover:shadow-[var(--shadow-glow-yellow)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles size={18} />
                Explore My Work
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] font-semibold hover:bg-[var(--color-cyan)]/10 hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle size={18} />
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right - Data Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <DataNetworkVisualization />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)]">
          scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-[var(--color-yellow)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TerminalText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayed}<span className="animate-[blink_1s_infinite]">_</span></>;
}

function FloatingElements() {
  const keywords = ['SELECT', 'JOIN', 'WHERE', 'FROM', '{ }', '=>', 'λ', 'def', 'class', 'import'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {keywords.map((keyword, i) => (
        <motion.span
          key={i}
          className="absolute font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)] opacity-[0.03] text-lg select-none"
          style={{
            left: `${10 + (i * 23) % 80}%`,
            top: `${5 + (i * 17) % 85}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {keyword}
        </motion.span>
      ))}
    </div>
  );
}

function DataNetworkVisualization() {
  const nodes = [
    { x: 200, y: 100, color: 'var(--color-yellow)', label: 'Source', size: 16 },
    { x: 100, y: 200, color: 'var(--color-cyan)', label: 'Kafka', size: 14 },
    { x: 300, y: 200, color: 'var(--color-purple)', label: 'Spark', size: 14 },
    { x: 150, y: 320, color: 'var(--color-green)', label: 'Transform', size: 12 },
    { x: 280, y: 320, color: 'var(--color-cyan)', label: 'Load', size: 12 },
    { x: 200, y: 420, color: 'var(--color-yellow)', label: 'Output', size: 16 },
  ];

  const connections = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5],
  ];

  return (
    <div className="relative w-[400px] h-[500px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="var(--color-cyan)"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
          />
        ))}

        {/* Animated data particles along connections */}
        {connections.map(([from, to], i) => (
          <motion.circle
            key={`particle-${i}`}
            r="3"
            fill="var(--color-yellow)"
            filter="url(#glow)"
            initial={{
              cx: nodes[from].x,
              cy: nodes[from].y,
              opacity: 0,
            }}
            animate={{
              cx: [nodes[from].x, nodes[to].x],
              cy: [nodes[from].y, nodes[to].y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'linear',
            }}
          />
        ))}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={i}>
            {/* Glow circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size + 8}
              fill={node.color}
              opacity={0.1}
              filter="url(#nodeGlow)"
              animate={{ r: [node.size + 6, node.size + 12, node.size + 6] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />
            {/* Main circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="var(--bg-primary)"
              stroke={node.color}
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            />
            {/* Label */}
            <motion.text
              x={node.x}
              y={node.y + node.size + 18}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="11"
              fontFamily="var(--font-jetbrains)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {node.label}
            </motion.text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
