'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { profile } from '@/data/profile';

// ─────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive grid
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

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
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Interactive Dot Grid Background */}
      <InteractiveDotGrid mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Floating Code Keywords */}
      <FloatingCodeElements />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left - Text Content (3 cols) */}
          <div className="lg:col-span-2">
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
              <span className="font-[family-name:var(--font-jetbrains)]">
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
                className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[var(--color-yellow)] to-[#FFA500] text-[var(--color-text-dark)] font-semibold transition-all duration-300 overflow-hidden"
              >
                {/* Shine sweep on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative flex items-center gap-2">
                  Explore My Work
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                </span>
              </a>
              <a
                href="#contact"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] font-semibold hover:bg-[var(--color-cyan)]/10 hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right - Complex Data Pipeline Visualization (3 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hidden lg:flex lg:col-span-3 items-center justify-center"
          >
            <DataPipelineGraph />
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

// ─────────────────────────────────────────────────────────
// INTERACTIVE DOT GRID (Gravitational Lens Effect)
// Dots near cursor warp outward like a gravitational lens,
// and glow with the accent color — feels like your cursor
// is bending the fabric of the data space.
// ─────────────────────────────────────────────────────────

function InteractiveDotGrid({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const spacing = 40;
    const influenceRadius = 150;
    const maxDisplacement = 20;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * spacing;
          const baseY = row * spacing;

          const dx = baseX - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let drawX = baseX;
          let drawY = baseY;
          let radius = 1.2;
          let alpha = 0.08;

          if (dist < influenceRadius && dist > 0) {
            // Gravitational lens: push dots AWAY from cursor
            const force = (1 - dist / influenceRadius);
            const angle = Math.atan2(dy, dx);
            const displacement = force * force * maxDisplacement;
            drawX = baseX + Math.cos(angle) * displacement;
            drawY = baseY + Math.sin(angle) * displacement;

            // Dots near cursor grow and glow
            radius = 1.2 + force * 3;
            alpha = 0.08 + force * 0.5;
          }

          // Color: blend between base (white) and cyan near cursor
          const nearness = dist < influenceRadius ? 1 - dist / influenceRadius : 0;
          const r = Math.round(255 - nearness * 153);  // 255 -> 102
          const g = Math.round(255 - nearness * 59);   // 255 -> 196
          const b = 255;

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          // Connection lines to nearby distorted dots
          if (nearness > 0.3 && col < cols - 1) {
            const nextBaseX = (col + 1) * spacing;
            const ndx = nextBaseX - mx;
            const ndy = baseY - my;
            const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
            if (ndist < influenceRadius) {
              const nforce = (1 - ndist / influenceRadius);
              const nangle = Math.atan2(ndy, ndx);
              const ndisp = nforce * nforce * maxDisplacement;
              const nx = nextBaseX + Math.cos(nangle) * ndisp;
              const ny = baseY + Math.sin(nangle) * ndisp;
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = `rgba(102, 196, 255, ${nearness * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─────────────────────────────────────────────────────────
// FLOATING CODE ELEMENTS (more keywords, varied sizes)
// ─────────────────────────────────────────────────────────

function FloatingCodeElements() {
  const keywords = [
    { text: 'SELECT *', size: 'text-base' },
    { text: 'FROM streams', size: 'text-sm' },
    { text: 'JOIN', size: 'text-lg' },
    { text: 'WHERE latency < 200ms', size: 'text-xs' },
    { text: 'GROUP BY', size: 'text-sm' },
    { text: '{ }', size: 'text-2xl' },
    { text: '=>', size: 'text-xl' },
    { text: 'lambda x:', size: 'text-sm' },
    { text: 'def transform():', size: 'text-xs' },
    { text: 'class Pipeline:', size: 'text-sm' },
    { text: 'import kafka', size: 'text-xs' },
    { text: 'yield record', size: 'text-xs' },
    { text: 'async def', size: 'text-sm' },
    { text: '.subscribe()', size: 'text-xs' },
    { text: 'ORDER BY timestamp', size: 'text-xs' },
    { text: 'PARTITION BY', size: 'text-sm' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {keywords.map((kw, i) => (
        <motion.span
          key={i}
          className={`absolute font-[family-name:var(--font-jetbrains)] text-[var(--text-primary)] select-none ${kw.size}`}
          style={{
            left: `${(7 + i * 19) % 88}%`,
            top: `${(3 + i * 13) % 90}%`,
            opacity: 0.025 + (i % 3) * 0.008,
          }}
          animate={{
            y: [0, -(15 + (i % 4) * 5), 0],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
            rotate: [0, (i % 2 === 0 ? 2 : -2), 0],
          }}
          transition={{
            duration: 8 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.25,
          }}
        >
          {kw.text}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TERMINAL TEXT (typed-out effect)
// ─────────────────────────────────────────────────────────

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

  return (
    <>
      {displayed}
      <span className="animate-[blink_1s_infinite]">_</span>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// DATA PIPELINE GRAPH — Complex, multi-layered architecture
// with flowing data particles, hover-to-magnify sub-diagrams,
// and enough visual density to impress.
// ─────────────────────────────────────────────────────────

interface PipelineNode {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
  layer: 'source' | 'ingest' | 'process' | 'store' | 'serve';
  subNodes?: { label: string; color: string }[];
}

function DataPipelineGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: PipelineNode[] = [
    // Source Layer
    { id: 'api', x: 80, y: 60, color: '#FFD300', label: 'REST API', size: 14, layer: 'source', subNodes: [{ label: 'Auth', color: '#FFD300' }, { label: 'Rate Limit', color: '#FFA500' }, { label: 'Validate', color: '#5BCC7E' }] },
    { id: 'iot', x: 220, y: 40, color: '#FFD300', label: 'IoT Sensors', size: 14, layer: 'source', subNodes: [{ label: 'MQTT', color: '#66C4FF' }, { label: 'Temp', color: '#FF6B6B' }, { label: 'Video', color: '#E8E0FF' }] },
    { id: 'db', x: 370, y: 65, color: '#FFD300', label: 'Databases', size: 14, layer: 'source', subNodes: [{ label: 'CDC', color: '#5BCC7E' }, { label: 'Binlog', color: '#FFD300' }, { label: 'Snapshot', color: '#66C4FF' }] },
    { id: 'logs', x: 500, y: 50, color: '#FFD300', label: 'Log Streams', size: 12, layer: 'source' },

    // Ingestion Layer
    { id: 'kafka1', x: 140, y: 170, color: '#66C4FF', label: 'Kafka', size: 18, layer: 'ingest', subNodes: [{ label: 'Topic A', color: '#66C4FF' }, { label: 'Topic B', color: '#3A10E5' }, { label: 'Partitions', color: '#5BCC7E' }, { label: 'Replicas', color: '#FFD300' }] },
    { id: 'kafka2', x: 400, y: 160, color: '#66C4FF', label: 'Kafka', size: 18, layer: 'ingest' },

    // Processing Layer
    { id: 'spark', x: 120, y: 300, color: '#3A10E5', label: 'Spark', size: 16, layer: 'process', subNodes: [{ label: 'Map', color: '#3A10E5' }, { label: 'Reduce', color: '#66C4FF' }, { label: 'Window', color: '#FFD300' }] },
    { id: 'flink', x: 290, y: 280, color: '#3A10E5', label: 'Flink', size: 16, layer: 'process', subNodes: [{ label: 'CEP', color: '#FF6B6B' }, { label: 'State', color: '#5BCC7E' }, { label: 'Timer', color: '#66C4FF' }] },
    { id: 'airflow', x: 450, y: 310, color: '#3A10E5', label: 'Airflow', size: 15, layer: 'process' },

    // Storage Layer
    { id: 'delta', x: 100, y: 430, color: '#5BCC7E', label: 'Delta Lake', size: 16, layer: 'store', subNodes: [{ label: 'Bronze', color: '#CD7F32' }, { label: 'Silver', color: '#C0C0C0' }, { label: 'Gold', color: '#FFD300' }] },
    { id: 'warehouse', x: 290, y: 420, color: '#5BCC7E', label: 'Warehouse', size: 15, layer: 'store' },
    { id: 'redis', x: 460, y: 440, color: '#5BCC7E', label: 'Redis', size: 13, layer: 'store' },

    // Serving Layer
    { id: 'dashboard', x: 140, y: 550, color: '#FF6B6B', label: 'Dashboards', size: 15, layer: 'serve', subNodes: [{ label: 'Grafana', color: '#FF6B6B' }, { label: 'Metrics', color: '#FFD300' }, { label: 'Alerts', color: '#66C4FF' }] },
    { id: 'mlmodel', x: 320, y: 540, color: '#FF6B6B', label: 'ML Models', size: 15, layer: 'serve' },
    { id: 'apiout', x: 480, y: 555, color: '#FF6B6B', label: 'API Gateway', size: 14, layer: 'serve' },
  ];

  const connections: [string, string][] = [
    // Source -> Ingest
    ['api', 'kafka1'], ['iot', 'kafka1'], ['db', 'kafka2'], ['logs', 'kafka2'],
    // Ingest -> Process
    ['kafka1', 'spark'], ['kafka1', 'flink'], ['kafka2', 'flink'], ['kafka2', 'airflow'],
    // Process -> Store
    ['spark', 'delta'], ['flink', 'warehouse'], ['flink', 'redis'], ['airflow', 'warehouse'], ['airflow', 'delta'],
    // Store -> Serve
    ['delta', 'dashboard'], ['warehouse', 'dashboard'], ['warehouse', 'mlmodel'], ['redis', 'apiout'], ['delta', 'mlmodel'],
    // Cross-connections
    ['spark', 'warehouse'], ['redis', 'mlmodel'],
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  // Layer labels
  const layers = [
    { label: 'Sources', y: 30, color: '#FFD300' },
    { label: 'Ingestion', y: 145, color: '#66C4FF' },
    { label: 'Processing', y: 270, color: '#3A10E5' },
    { label: 'Storage', y: 405, color: '#5BCC7E' },
    { label: 'Serving', y: 525, color: '#FF6B6B' },
  ];

  return (
    <div className="relative w-full max-w-[580px] h-[600px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 580 600">
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bigGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer separator lines (dashed) */}
        {layers.map((layer, i) => (
          <g key={layer.label}>
            <line
              x1={20}
              y1={layer.y + 35}
              x2={560}
              y2={layer.y + 35}
              stroke="var(--text-primary)"
              strokeOpacity={0.04}
              strokeDasharray="4 6"
            />
            <text
              x={560}
              y={layer.y + 28}
              textAnchor="end"
              fill={layer.color}
              fontSize="9"
              fontFamily="var(--font-jetbrains)"
              opacity={0.4}
            >
              {layer.label}
            </text>
          </g>
        ))}

        {/* Connection Lines */}
        {connections.map(([fromId, toId], i) => {
          const from = getNode(fromId);
          const to = getNode(toId);
          const isHighlighted = hoveredNode === fromId || hoveredNode === toId;
          return (
            <motion.path
              key={`conn-${i}`}
              d={`M ${from.x} ${from.y} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y}`}
              fill="none"
              stroke={isHighlighted ? 'var(--color-cyan)' : 'var(--color-cyan)'}
              strokeWidth={isHighlighted ? 1.8 : 0.8}
              strokeOpacity={isHighlighted ? 0.6 : 0.15}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
            />
          );
        })}

        {/* DATA PARTICLES flowing along connections */}
        {connections.map(([fromId, toId], i) => {
          const from = getNode(fromId);
          const to = getNode(toId);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <motion.circle
              key={`p-${i}`}
              r={2}
              fill="var(--color-yellow)"
              filter="url(#glow2)"
              animate={{
                cx: [from.x, midX, to.x],
                cy: [from.y, midY, to.y],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 2.5 + (i % 3) * 0.5,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'linear',
              }}
            />
          );
        })}

        {/* Additional slower, larger particles on key paths */}
        {connections.filter((_, i) => i % 4 === 0).map(([fromId, toId], i) => {
          const from = getNode(fromId);
          const to = getNode(toId);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <motion.circle
              key={`bigp-${i}`}
              r={3.5}
              fill="var(--color-cyan)"
              filter="url(#glow2)"
              animate={{
                cx: [from.x, midX, to.x],
                cy: [from.y, midY, to.y],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.2 + 1,
                ease: 'linear',
              }}
            />
          );
        })}

        {/* NODES */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer glow ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size + 10}
                fill={node.color}
                opacity={isHovered ? 0.15 : 0.04}
                filter="url(#bigGlow)"
                animate={isHovered ? { r: node.size + 20 } : { r: [node.size + 8, node.size + 12, node.size + 8] }}
                transition={isHovered ? { duration: 0.3 } : { duration: 3, repeat: Infinity }}
              />
              {/* Main node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? node.size + 3 : node.size}
                fill="var(--bg-primary)"
                stroke={node.color}
                strokeWidth={isHovered ? 3 : 2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + nodes.indexOf(node) * 0.05, type: 'spring' }}
              />
              {/* Inner icon/dot */}
              <circle cx={node.x} cy={node.y} r={3} fill={node.color} opacity={0.6} />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + node.size + 14}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="9"
                fontFamily="var(--font-jetbrains)"
                opacity={isHovered ? 1 : 0.6}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* HOVER SUB-DIAGRAM — magnification popup */}
        {hoveredNode && (() => {
          const node = getNode(hoveredNode);
          if (!node.subNodes) return null;

          const subRadius = 35;
          const subCount = node.subNodes.length;

          return (
            <motion.g
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
            >
              {/* Backdrop circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={subRadius + 16}
                fill="var(--bg-primary)"
                fillOpacity={0.92}
                stroke={node.color}
                strokeWidth={1}
                strokeOpacity={0.3}
              />

              {/* Sub-node connections */}
              {node.subNodes.map((_, idx) => {
                const angle = (idx / subCount) * Math.PI * 2 - Math.PI / 2;
                const sx = node.x + Math.cos(angle) * subRadius;
                const sy = node.y + Math.sin(angle) * subRadius;
                return (
                  <line
                    key={`sub-conn-${idx}`}
                    x1={node.x}
                    y1={node.y}
                    x2={sx}
                    y2={sy}
                    stroke={node.color}
                    strokeWidth={0.8}
                    strokeOpacity={0.4}
                  />
                );
              })}

              {/* Center label */}
              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fill={node.color}
                fontSize="8"
                fontWeight="bold"
                fontFamily="var(--font-jetbrains)"
              >
                {node.label}
              </text>

              {/* Sub-nodes */}
              {node.subNodes.map((sub, idx) => {
                const angle = (idx / subCount) * Math.PI * 2 - Math.PI / 2;
                const sx = node.x + Math.cos(angle) * subRadius;
                const sy = node.y + Math.sin(angle) * subRadius;
                return (
                  <g key={`sub-${idx}`}>
                    <motion.circle
                      cx={sx}
                      cy={sy}
                      r={8}
                      fill="var(--bg-primary)"
                      stroke={sub.color}
                      strokeWidth={1.5}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.05, type: 'spring' }}
                    />
                    <text
                      x={sx}
                      y={sy + 16}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="7"
                      fontFamily="var(--font-jetbrains)"
                    >
                      {sub.label}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          );
        })()}
      </svg>
    </div>
  );
}
