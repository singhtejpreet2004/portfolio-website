'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { skillCategories } from '@/data/skills';

// ── Types ─────────────────────────────────────────────────────────────────────
type LT = 'cmd' | 'out' | 'err' | 'info' | 'ok' | 'dim' | 'blank' | 'rich';
interface Line { id: number; type: LT; text: string; jsx?: ReactNode }

// ── Category terminal colors (readable on #0D1117) ────────────────────────────
const CAT_COLOR: Record<string, string> = {
  'Languages':          '#FFD300',
  'Data Engineering':   '#58a6ff',
  'Infrastructure':     '#5BCC7E',
  'Databases':          '#A78BFA',
  'Monitoring & Tools': '#FF8080',
};

// All skills sorted by proficiency desc
const ALL = skillCategories
  .flatMap((c) => c.skills.map((s) => ({ ...s, catName: c.name, color: CAT_COLOR[c.name] ?? '#fff' })))
  .sort((a, b) => b.proficiency - a.proficiency);

// ── Helpers ───────────────────────────────────────────────────────────────────
function bar(pct: number, w = 16) {
  const f = Math.round((pct / 100) * w);
  return '█'.repeat(f) + '░'.repeat(w - f);
}
function pad(s: string, n: number) { return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length); }
function slug(name: string) {
  return name.toLowerCase().replace(/\+\+/g, 'pp').replace(/[/#\s]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function catSlug(name: string) { return name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-'); }
function catAvg(name: string) {
  const sk = ALL.filter((s) => s.catName === name);
  return Math.round(sk.reduce((sum, s) => sum + s.proficiency, 0) / sk.length);
}

// ── JSX line builders (syntax-highlighted) ────────────────────────────────────
function jskillRow(skill: (typeof ALL)[0]): ReactNode {
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span style={{ color: skill.color }}>{pad(skill.name, 22)}</span>
      <span className="text-[var(--text-secondary)]">{pad(skill.catName, 22)}</span>
      <span style={{ color: skill.color }}>{bar(skill.proficiency)}</span>
      <span className="text-[var(--text-primary)]">{' ' + skill.proficiency + '%'}</span>
      <span className="text-[var(--text-secondary)] opacity-60">{' · ' + skill.yearsOfExperience + 'yr'}</span>
    </div>
  );
}

function jcatTree(chars: string, cat: (typeof skillCategories)[0]): ReactNode {
  const color = CAT_COLOR[cat.name] ?? '#fff';
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--text-secondary)]">{chars}</span>
      <span style={{ color }} className="font-semibold">{pad(catSlug(cat.name) + '/', 28)}</span>
      <span className="text-[var(--text-secondary)] opacity-50">{'[avg: ' + catAvg(cat.name) + '%  · ' + cat.skills.length + ' files]'}</span>
    </div>
  );
}

function jskillTree(chars: string, skill: (typeof ALL)[0]): ReactNode {
  const s = slug(skill.name);
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--text-secondary)]">{chars}</span>
      <span style={{ color: skill.color }}>{pad(s, 26)}</span>
      <span className="text-[var(--text-secondary)]">{'.skill  '}</span>
      <span style={{ color: skill.color }}>{bar(skill.proficiency)}</span>
      <span className="text-[var(--text-secondary)]">{' ' + skill.proficiency + '%'}</span>
      <span className="text-[var(--text-secondary)] opacity-50">{' · ' + skill.yearsOfExperience + 'yr'}</span>
    </div>
  );
}

function jcatLine(skill: (typeof ALL)[0]): ReactNode {
  const s = slug(skill.name) + '.skill';
  return (
    <span className="whitespace-pre text-sm" style={{ color: skill.color }}>{s + '  '}</span>
  );
}

function jmount(cat: (typeof skillCategories)[0]): ReactNode {
  const color = CAT_COLOR[cat.name] ?? '#fff';
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--color-green)]">  ✓ </span>
      <span className="text-[var(--text-secondary)]">Mounted  </span>
      <span style={{ color }}>{catSlug(cat.name) + '/'}</span>
      <span className="text-[var(--text-secondary)]">{'   [' + cat.skills.length + ' skills]'}</span>
    </div>
  );
}

function jcatDetail(label: string, val: string, valColor?: string): ReactNode {
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--color-cyan)]">{'  ' + pad(label, 14)}</span>
      <span className="text-[var(--text-secondary)]">: </span>
      {valColor
        ? <span style={{ color: valColor }}>{val}</span>
        : <span className="text-[var(--text-primary)]">{val}</span>}
    </div>
  );
}

// ── Command builders ──────────────────────────────────────────────────────────
let _id = 20000;
function mkLine(type: LT, text: string, jsx?: ReactNode): Line { return { id: _id++, type, text, jsx }; }

function cmdTree(catFilter?: string): Line[] {
  const out: Line[] = [];
  let cats = skillCategories;
  if (catFilter) {
    const q = catFilter.toLowerCase().replace(/-/g, ' ').replace(/\/$/, '');
    cats = skillCategories.filter((c) => c.name.toLowerCase().includes(q));
    if (!cats.length) return [
      mkLine('err', `  tree: no category matching '${catFilter}'`),
      mkLine('dim', '  Available: languages · data-engineering · infrastructure · databases · monitoring-tools'),
      mkLine('blank', ''),
    ];
  }
  const label = catFilter
    ? `~/skills/${catSlug(cats[0].name)}`
    : `~/skills  (${ALL.length} skills · ${skillCategories.length} categories)`;
  out.push(mkLine('rich', '', <div className="whitespace-pre text-sm leading-relaxed font-semibold text-[var(--text-primary)]">{label}</div>));

  cats.forEach((cat, ci) => {
    const lastCat = ci === cats.length - 1;
    const catPrefix = !catFilter ? (lastCat ? '└── ' : '├── ') : '';
    const childPfx  = !catFilter ? (lastCat ? '    ' : '│   ') : '';
    if (!catFilter) {
      out.push(mkLine('blank', ''));
      out.push(mkLine('rich', '', jcatTree(catPrefix, cat)));
    }
    const sorted = [...cat.skills].sort((a, b) => b.proficiency - a.proficiency);
    sorted.forEach((s, si) => {
      const lastSkill = si === sorted.length - 1;
      const sfx = childPfx + (lastSkill ? '└── ' : '├── ');
      const full = { ...s, catName: cat.name, color: CAT_COLOR[cat.name] ?? '#fff' };
      out.push(mkLine('rich', '', jskillTree(sfx, full)));
    });
  });

  out.push(mkLine('blank', ''));
  out.push(mkLine('dim', `  ${ALL.length} .skill files`));
  out.push(mkLine('blank', ''));
  return out;
}

function cmdLs(catFilter?: string): Line[] {
  if (!catFilter) {
    // Show category dirs colored
    const jsx = (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {skillCategories.map((c) => (
          <span key={c.name} style={{ color: CAT_COLOR[c.name] }}>{catSlug(c.name) + '/   '}</span>
        ))}
      </div>
    );
    return [mkLine('rich', '', jsx), mkLine('blank', ''), mkLine('dim', `  ${skillCategories.length} directories`), mkLine('blank', '')];
  }
  const q = catFilter.toLowerCase().replace(/-/g, ' ').replace(/\/$/, '');
  const cat = skillCategories.find((c) => c.name.toLowerCase().includes(q));
  if (!cat) return [
    mkLine('err', `  ls: ${catFilter}: No such directory`),
    mkLine('dim', '  Try `ls` without args to see categories'),
    mkLine('blank', ''),
  ];
  const color = CAT_COLOR[cat.name] ?? '#fff';
  const jsx = (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {cat.skills.map((s) => (
        <span key={s.name} style={{ color }}>{slug(s.name) + '.skill   '}</span>
      ))}
    </div>
  );
  return [mkLine('rich', '', jsx), mkLine('blank', ''), mkLine('dim', `  ${cat.skills.length} .skill files in ${catSlug(cat.name)}/`), mkLine('blank', '')];
}

function cmdCat(query: string): Line[] {
  const q = query.toLowerCase().replace(/\.skill$/, '').replace(/-/g, ' ').trim();
  const skill = ALL.find(
    (s) => s.name.toLowerCase().includes(q) || slug(s.name).replace(/-/g, ' ').includes(q)
  );
  if (!skill) return [
    mkLine('err', `  cat: ${query}: No such file`),
    mkLine('dim', '  Try `ls` or `tree` to see valid .skill filenames'),
    mkLine('blank', ''),
  ];
  const color = skill.color;
  const s = slug(skill.name);
  return [
    mkLine('rich', '', (
      <div className="whitespace-pre text-sm leading-relaxed">
        <span className="text-[var(--text-secondary)]">{'─── '}</span>
        <span style={{ color }}>{s + '.skill'}</span>
        <span className="text-[var(--text-secondary)]">{' ' + '─'.repeat(Math.max(0, 46 - s.length))}</span>
      </div>
    )),
    mkLine('rich', '', jcatDetail('name',        skill.name,          color)),
    mkLine('rich', '', jcatDetail('category',    skill.catName,       color)),
    mkLine('rich', '', (
      <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
        <span className="text-[var(--color-cyan)]">{'  ' + pad('proficiency', 14)}</span>
        <span className="text-[var(--text-secondary)]">: </span>
        <span style={{ color }}>{bar(skill.proficiency)}</span>
        <span className="text-[var(--text-primary)]">{' ' + skill.proficiency + '%'}</span>
      </div>
    )),
    mkLine('rich', '', jcatDetail('experience',  skill.yearsOfExperience + (skill.yearsOfExperience === 1 ? ' year' : ' years'))),
    mkLine('dim', '  ' + '─'.repeat(50)),
    mkLine('blank', ''),
  ];
}

function cmdSkills(catFilter?: string): Line[] {
  let skills = ALL;
  if (catFilter) {
    const q = catFilter.toLowerCase().replace(/-/g, ' ');
    skills = ALL.filter((s) => s.catName.toLowerCase().includes(q));
    if (!skills.length) return [
      mkLine('err', `  No skills matching '${catFilter}'`),
      mkLine('dim', '  Try: languages · data-engineering · infrastructure · databases · monitoring-tools'),
      mkLine('blank', ''),
    ];
  }
  const hdr = (
    <div className="whitespace-pre text-sm leading-relaxed text-[var(--text-secondary)]">
      {'  ' + pad('Skill', 22) + pad('Category', 22) + 'Proficiency'}
    </div>
  );
  return [
    mkLine('rich', '', hdr),
    mkLine('dim', '  ' + '─'.repeat(60)),
    ...skills.map((s) => mkLine('rich', '', jskillRow(s))),
    mkLine('dim', '  ' + '─'.repeat(60)),
    mkLine('ok', `  ${skills.length} skill${skills.length !== 1 ? 's' : ''}`),
    mkLine('blank', ''),
  ];
}

// ── SQL select easter egg (proper table, no empty columns) ───────────────────
function cmdSelect(): Line[] {
  const top = ALL.slice(0, 8);
  const NW = 22, CW = 20, PW = 7;
  const tl = '  ┌' + '─'.repeat(NW) + '┬' + '─'.repeat(CW) + '┬' + '─'.repeat(PW) + '┐';
  const hd = '  │' + pad(' name', NW) + '│' + pad(' category', CW) + '│' + pad(' pct', PW) + '│';
  const sp = '  ├' + '─'.repeat(NW) + '┼' + '─'.repeat(CW) + '┼' + '─'.repeat(PW) + '┤';
  const bl = '  └' + '─'.repeat(NW) + '┴' + '─'.repeat(CW) + '┴' + '─'.repeat(PW) + '┘';
  return [
    mkLine('info', '  🥚  Easter egg: SQL interface'),
    mkLine('dim',  '  > SELECT name, category, proficiency FROM skills ORDER BY proficiency DESC LIMIT 8;'),
    mkLine('blank', ''),
    mkLine('dim', tl),
    mkLine('dim', hd),
    mkLine('dim', sp),
    ...top.map((s) => mkLine('rich', '', (
      <div key={s.name} className="whitespace-pre text-sm leading-relaxed">
        <span className="text-[var(--text-secondary)]">{'  │'}</span>
        <span style={{ color: s.color }}>{pad(' ' + s.name, NW)}</span>
        <span className="text-[var(--text-secondary)]">{'│'}</span>
        <span style={{ color: s.color }}>{pad(' ' + s.catName, CW)}</span>
        <span className="text-[var(--text-secondary)]">{'│'}</span>
        <span className="text-[var(--text-primary)]">{pad(' ' + s.proficiency + '%', PW)}</span>
        <span className="text-[var(--text-secondary)]">{'│'}</span>
      </div>
    ))),
    mkLine('dim', bl),
    mkLine('ok',  '  8 rows in set (0.002s)'),
    mkLine('blank', ''),
  ];
}

// ── Dino game component ───────────────────────────────────────────────────────
function DinoGame({ onQuit }: { onQuit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onQuitRef = useRef(onQuit);
  useEffect(() => { onQuitRef.current = onQuit; }, [onQuit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    // Set canvas resolution to actual display width
    const W = canvas.parentElement?.offsetWidth ?? 800;
    const H = 130;
    canvas.width = W;
    canvas.height = H;

    const GROUND = H - 22;
    const DINO_X = 70;
    const DINO_W = 18;
    const DINO_H = 26;

    type Obs = { x: number; h: number; w: number };

    const g = {
      dinoY: 0, dinoVY: 0, jumping: false,
      obstacles: [] as Obs[],
      score: 0, speed: 4, dead: false, started: false,
      lastSpawn: 0, raf: 0, frame: 0,
    };

    function resetGame() {
      g.dinoY = 0; g.dinoVY = 0; g.jumping = false;
      g.obstacles = []; g.score = 0; g.speed = 4;
      g.dead = false; g.started = false; g.lastSpawn = 0; g.frame = 0;
    }

    function doJump() {
      if (g.dead) { resetGame(); return; }
      if (!g.started) g.started = true;
      if (!g.jumping) { g.dinoVY = -11; g.jumping = true; }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); doJump(); }
      if (e.code === 'Escape') { cancelAnimationFrame(g.raf); onQuitRef.current(); }
    };
    canvas.addEventListener('click', doJump);
    window.addEventListener('keydown', onKey);

    let last = 0;
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 16.67, 3);
      last = ts;
      g.frame++;

      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.strokeStyle = '#30363D';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();

      // Score
      ctx.fillStyle = '#FFD300';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('SCORE ' + Math.floor(g.score), W - 14, 18);

      if (!g.started && !g.dead) {
        ctx.fillStyle = '#58a6ff';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE or click to start · ESC to exit', W / 2, H / 2 + 4);
      } else if (g.dead) {
        ctx.fillStyle = '#FF6B6B';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER  —  Score: ' + Math.floor(g.score), W / 2, H / 2 - 8);
        ctx.fillStyle = '#58a6ff';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('SPACE or click to restart', W / 2, H / 2 + 12);
      } else {
        // Physics
        g.dinoY += g.dinoVY * dt;
        g.dinoVY += 0.6 * dt;
        if (g.dinoY >= 0) { g.dinoY = 0; g.dinoVY = 0; g.jumping = false; }

        // Spawn obstacles
        g.lastSpawn += dt * 16.67;
        const interval = Math.max(700, 1500 - g.score * 1.8);
        if (g.lastSpawn > interval) {
          g.lastSpawn = 0;
          g.obstacles.push({ x: W, h: 18 + Math.random() * 22, w: 10 + Math.random() * 6 });
        }
        g.obstacles = g.obstacles.filter((o) => o.x > -30);
        g.obstacles.forEach((o) => { o.x -= g.speed * dt; });

        g.score += dt * 0.12;
        g.speed = 4 + g.score * 0.022;

        // Collision (with 3px forgiveness)
        const dinoTop    = GROUND - DINO_H - g.dinoY;
        const dinoBottom = GROUND - g.dinoY;
        for (const o of g.obstacles) {
          if (DINO_X + DINO_W - 3 > o.x + 3 &&
              DINO_X + 3 < o.x + o.w - 3 &&
              dinoBottom - 2 > GROUND - o.h) {
            g.dead = true;
          }
        }

        // Draw dino — green pixel-art blocks
        const dy = GROUND - DINO_H - g.dinoY;
        ctx.fillStyle = '#5BCC7E';
        // body
        ctx.fillRect(DINO_X, dy, DINO_W, DINO_H - 8);
        // head (wider)
        ctx.fillRect(DINO_X - 2, dy - 10, DINO_W + 4, 12);
        // eye
        ctx.fillStyle = '#0D1117';
        ctx.fillRect(DINO_X + DINO_W - 3, dy - 8, 4, 4);
        // legs (alternating)
        ctx.fillStyle = '#5BCC7E';
        const lp = Math.floor(g.score * 0.8) % 2;
        if (!g.jumping) {
          ctx.fillRect(DINO_X + 2, GROUND - 8, 5, 8);
          ctx.fillRect(DINO_X + 10, GROUND - (lp ? 8 : 14), 5, lp ? 8 : 14);
        } else {
          ctx.fillRect(DINO_X + 2, GROUND - DINO_H - g.dinoY + DINO_H - 4, 5, 4);
          ctx.fillRect(DINO_X + 10, GROUND - DINO_H - g.dinoY + DINO_H - 4, 5, 4);
        }

        // Draw obstacles — cyan cacti
        ctx.fillStyle = '#58a6ff';
        for (const o of g.obstacles) {
          ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
          // cactus arms
          ctx.fillRect(o.x - 5, GROUND - o.h + 8, 5, 4);
          ctx.fillRect(o.x + o.w, GROUND - o.h + 14, 5, 4);
        }
      }

      g.raf = requestAnimationFrame(tick);
    }

    g.raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(g.raf);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('click', doJump);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="border-t border-[rgba(48,54,61,0.9)]">
      <div className="px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-[family-name:var(--font-jetbrains)]">
        <span className="text-[var(--color-green)]">◆ DINO.EXE</span>
        <span className="text-[var(--text-secondary)]">SPACE / click = jump · ESC = exit</span>
      </div>
      <canvas ref={canvasRef} className="w-full block" height={130} style={{ display: 'block' }} />
    </div>
  );
}

// ── Boot lines ────────────────────────────────────────────────────────────────
function buildBoot(): Line[] {
  let bid = 0;
  const mk = (type: LT, text: string, jsx?: ReactNode): Line => ({ id: bid++, type, text, jsx });
  return [
    mk('info', '  ╔══════════════════════════════════════════════╗'),
    mk('info', '  ║          SKILLS TERMINAL  ·  v1.0.0          ║'),
    mk('info', '  ║     25 skills  ·  5 categories  ·  4 yrs     ║'),
    mk('info', '  ╚══════════════════════════════════════════════╝'),
    mk('blank', ''),
    mk('dim', '  Mounting skill filesystem...'),
    ...skillCategories.map((c) => mk('rich', '', jmount(c))),
    mk('blank', ''),
    mk('ok', '  25 skills loaded.'),
    mk('dim', "  Type 'help' to explore. Running 'tree'..."),
    mk('blank', ''),
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const [lines, setLines]               = useState<Line[]>([]);
  const [input, setInput]               = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);
  const [cmdHistory, setCmdHistory]     = useState<string[]>([]);
  const [historyIdx, setHistoryIdx]     = useState(-1);
  const [headerIdx, setHeaderIdx]       = useState(0);       // idle skill cycler
  const [showGame, setShowGame]         = useState(false);    // dino game

  // Header ticker — cycles top skills (idle "shows main skills")
  useEffect(() => {
    const id = setInterval(() => setHeaderIdx((i) => (i + 1) % ALL.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Scroll entrance — spring rise matching site style
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 0.3'] });
  const sectionY       = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  // Stable append — uses functional update, never stale
  function appendLines(batch: Line[]) {
    setLines((prev) => [...prev, ...batch]);
  }

  // Boot sequence — resets and replays on every mount (handles React StrictMode double-invoke)
  useEffect(() => {
    // Clear any residual state from a previous mount
    setLines([]);
    setInputEnabled(false);

    const boot = buildBoot();
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const next = () => {
      if (i >= boot.length) {
        const treeLines = cmdTree();
        const t = setTimeout(() => {
          setLines((prev) => [
            ...prev,
            { id: _id++, type: 'cmd', text: 'tree' },
            ...treeLines.filter((l): l is Line => !!l),
          ]);
          setInputEnabled(true);
          const ft = setTimeout(() => inputRef.current?.focus(), 100);
          timers.push(ft);
        }, 400);
        timers.push(t);
        return;
      }
      setLines((prev) => [...prev, boot[i++]]);
      const t = setTimeout(next, i <= 5 ? 100 : i <= 11 ? 65 : 40);
      timers.push(t);
    };

    const t0 = setTimeout(next, 400);
    timers.push(t0);

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Command router
  function execCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Echo the command
    appendLines([{ id: _id++, type: 'cmd', text: trimmed }]);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const rest = args.join(' ');

    // Track history for everything except `history` itself
    if (cmd.toLowerCase() !== 'history') {
      setCmdHistory((h) => [trimmed, ...h.slice(0, 49)]);
      setHistoryIdx(-1);
    }

    switch (cmd.toLowerCase()) {

      case 'help':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: '  Commands:' },
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'out',   text: '  tree                       File tree of all skills with proficiency bars' },
          { id: _id++, type: 'out',   text: '  tree <category>            Filter tree by category name' },
          { id: _id++, type: 'out',   text: '  ls                         List skill categories' },
          { id: _id++, type: 'out',   text: '  ls <category>              List .skill files in a category' },
          { id: _id++, type: 'out',   text: '  cat <skill>                View skill details  (e.g. cat python)' },
          { id: _id++, type: 'out',   text: '  skills                     Table of all skills with proficiency' },
          { id: _id++, type: 'out',   text: '  skills --cat <name>        Filter skills table by category' },
          { id: _id++, type: 'out',   text: '  history                    Command history' },
          { id: _id++, type: 'out',   text: '  clear                      Clear terminal  (Ctrl+L)' },
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'dim',   text: '  Categories: languages · data-engineering · infrastructure · databases · monitoring-tools' },
          { id: _id++, type: 'dim',   text: '  Tip: ↑/↓ arrow keys for history · Ctrl+C cancel · Ctrl+L clear' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'tree':
        appendLines(cmdTree(rest || undefined));
        break;

      case 'ls':
        appendLines(cmdLs(rest || undefined));
        break;

      case 'cat': {
        if (!rest) {
          appendLines([
            { id: _id++, type: 'err', text: '  Usage: cat <skill-name>  (e.g. cat python · cat kafka · cat docker)' },
            { id: _id++, type: 'blank', text: '' },
          ]);
          break;
        }
        // Easter egg: cat about.txt
        if (rest === 'about.txt') {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            { id: _id++, type: 'info',  text: '  🥚  Easter egg unlocked!' },
            { id: _id++, type: 'out',   text: "  Engineering IoT data pipelines at Plaksha University's Dixon IoT Lab." },
            { id: _id++, type: 'out',   text: '  MQTT → Kafka → Spark → Delta Lake → Grafana.' },
            { id: _id++, type: 'blank', text: '' },
          ]);
          break;
        }
        appendLines(cmdCat(rest));
        break;
      }

      case 'skills': {
        const ci = args.indexOf('--cat');
        appendLines(cmdSkills(ci !== -1 ? args[ci + 1] : undefined));
        break;
      }

      case 'history':
        if (cmdHistory.length === 0) {
          appendLines([{ id: _id++, type: 'dim', text: '  (no history)' }, { id: _id++, type: 'blank', text: '' }]);
        } else {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            ...cmdHistory.map((h, i) => ({ id: _id++, type: 'dim' as LT, text: `  ${String(cmdHistory.length - i).padStart(3)}  ${h}` })),
            { id: _id++, type: 'blank', text: '' },
          ]);
        }
        return;

      case 'clear':
        setLines([]);
        return;

      // ── Hidden easter eggs ─────────────────────────────────────────────────
      case 'whoami':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: '  🥚  Easter egg!' },
          { id: _id++, type: 'ok',    text: '  tejpreet singh — Data + ML Engineer' },
          { id: _id++, type: 'out',   text: '  Python → Kafka → Spark → Delta Lake → Grafana' },
          { id: _id++, type: 'out',   text: '  ✓ Open to full-time opportunities' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'pipeline':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: '  🥚  Easter egg: pipeline topology' },
          { id: _id++, type: 'dim',   text: '  [MQTT]──►[Kafka]──►[Spark]──►[Delta Δ]──►[Grafana]' },
          { id: _id++, type: 'ok',    text: '  42.8K evt/s · 3 Spark jobs · 99.97% uptime' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'kafka':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: '  🥚  Easter egg: Kafka topics' },
          { id: _id++, type: 'dim',   text: '  sensor-raw-events [8p] · processed-telemetry [4p] · anomaly-alerts [2p]' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'select':
        appendLines(cmdSelect());
        break;

      case 'game':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'ok',   text: '  🦕  Launching DINO.EXE ...' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        setTimeout(() => {
          setShowGame(true);
          inputRef.current?.blur();
        }, 300);
        break;

      case 'grafana':
      case 'dashboard':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: `  🥚  Easter egg unlocked: '${cmd}'` },
          { id: _id++, type: 'dim',   text: '  (data engineering tools hiding in this terminal)' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      default:
        appendLines([
          { id: _id++, type: 'err',  text: `  bash: ${cmd}: command not found` },
          { id: _id++, type: 'dim',  text: "  Type 'help' for available commands." },
          { id: _id++, type: 'blank', text: '' },
        ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const v = input; setInput(''); execCommand(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ni = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(ni);
      if (cmdHistory[ni] !== undefined) setInput(cmdHistory[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const ni = Math.max(historyIdx - 1, -1);
      setHistoryIdx(ni);
      setInput(ni === -1 ? '' : cmdHistory[ni] ?? '');
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('');
      appendLines([{ id: _id++, type: 'dim', text: '^C' }, { id: _id++, type: 'blank', text: '' }]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault(); setLines([]); setInput('');
    }
  }

  function lc(t: LT): string {
    switch (t) {
      case 'cmd':  return 'text-[var(--color-yellow)]';
      case 'err':  return 'text-red-400';
      case 'info': return 'text-[var(--color-cyan)]';
      case 'ok':   return 'text-[var(--color-green)]';
      case 'dim':  return 'text-[var(--text-secondary)]';
      default:     return 'text-[var(--text-primary)]';
    }
  }

  const hs = ALL[headerIdx];
  const CHIPS = ['tree', 'skills', 'ls', 'cat python', 'cat kafka', 'cat docker', 'ls data-engineering', 'game', 'help'];

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 md:py-32">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--color-cyan) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          subtitle="// ~/skills $ tree --color --sort=proficiency"
          title="Skills"
        />

        <motion.div style={{ y: sectionY, opacity: sectionOpacity }}>
          {/* Terminal window */}
          <div
            className="rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-[0_0_80px_rgba(88,166,255,0.05)]"
            style={{ background: '#0D1117' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-[rgba(48,54,61,0.9)]"
              style={{ background: '#161B22' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]">
                  tejpreet@skills: ~/skills
                </span>
              </div>

              {/* Idle skill cycler — "shows main skills when idle" */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains)]">
                <span className="text-[var(--text-secondary)] opacity-40">◆</span>
                <motion.span
                  key={headerIdx}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: hs?.color }}
                >
                  {hs?.name}
                </motion.span>
                <span className="text-[var(--text-secondary)] opacity-40">
                  {bar(hs?.proficiency ?? 0, 10)}
                </span>
                <span style={{ color: hs?.color }} className="opacity-80">
                  {hs?.proficiency}%
                </span>
              </div>
            </div>

            {/* Output buffer */}
            <div
              ref={outputRef}
              data-lenis-prevent
              className="h-[560px] md:h-[640px] overflow-y-auto p-5 font-[family-name:var(--font-jetbrains)] text-sm leading-relaxed select-text"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363D transparent' }}
            >
              {lines.filter((l): l is Line => !!l).map((line) => (
                <div key={line.id} className={line.type !== 'rich' ? lc(line.type) : ''}>
                  {line.jsx ? (
                    line.jsx
                  ) : line.type === 'cmd' ? (
                    <div className="whitespace-pre text-sm leading-relaxed">
                      <span className="text-[var(--color-green)]">tejpreet@skills</span>
                      <span className="text-[var(--text-secondary)]">:~/skills$</span>
                      <span className="text-[var(--color-yellow)]"> {line.text}</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre text-sm leading-relaxed">{line.text || '\u00A0'}</div>
                  )}
                </div>
              ))}

              {/* Input prompt */}
              {inputEnabled && !showGame && (
                <div className="flex items-center mt-1">
                  <span className="text-[var(--color-green)] text-sm whitespace-nowrap">tejpreet@skills</span>
                  <span className="text-[var(--text-secondary)] text-sm">:~/skills$&nbsp;</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!inputEnabled}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    className="flex-1 bg-transparent outline-none caret-[var(--color-yellow)] text-[var(--color-yellow)] text-sm"
                    aria-label="Terminal input"
                  />
                </div>
              )}
            </div>

            {/* Dino game — mounted inside the terminal below the output buffer */}
            {showGame && (
              <DinoGame onQuit={() => {
                setShowGame(false);
                setTimeout(() => inputRef.current?.focus(), 50);
              }} />
            )}
          </div>

          {/* Quick command chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CHIPS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => { if (!inputEnabled) return; execCommand(cmd); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-jetbrains)] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)]/30 transition-colors cursor-pointer"
              >
                $ {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
