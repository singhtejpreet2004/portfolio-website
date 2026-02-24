'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { skillCategories, miscellaneousSkills } from '@/data/skills';
import { useTheme } from '@/components/providers/ThemeProvider';

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

// Main skills (shown in tree) sorted by proficiency desc
const ALL = skillCategories
  .flatMap((c) => c.skills.map((s) => ({ ...s, catName: c.name, color: CAT_COLOR[c.name] ?? '#fff' })))
  .sort((a, b) => b.proficiency - a.proficiency);

// Miscellaneous skills — shown in `skills` command but NOT in `tree`
const MISC_COLOR = '#8B8FA8';
const MISC = miscellaneousSkills.map((s) => ({ ...s, catName: 'Miscellaneous', color: MISC_COLOR }));
const ALL_SKILLS = [...ALL, ...MISC];

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
      <span className="text-[var(--terminal-muted)]">{pad(skill.catName, 22)}</span>
      <span style={{ color: skill.color }}>{bar(skill.proficiency)}</span>
      <span className="text-[var(--terminal-text)]">{' ' + skill.proficiency + '%'}</span>
      <span className="text-[var(--terminal-muted)]">{' · ' + skill.yearsOfExperience + 'yr'}</span>
    </div>
  );
}

function jcatTree(chars: string, cat: (typeof skillCategories)[0]): ReactNode {
  const color = CAT_COLOR[cat.name] ?? '#fff';
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--terminal-muted)]">{chars}</span>
      <span style={{ color }} className="font-semibold">{pad(catSlug(cat.name) + '/', 28)}</span>
      <span className="text-[var(--terminal-muted)] opacity-75">{'[avg: ' + catAvg(cat.name) + '%  · ' + cat.skills.length + ' files]'}</span>
    </div>
  );
}

function jskillTree(chars: string, skill: (typeof ALL)[0]): ReactNode {
  const s = slug(skill.name);
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--terminal-muted)]">{chars}</span>
      <span style={{ color: skill.color }}>{pad(s, 26)}</span>
      <span className="text-[var(--terminal-muted)]">{'.skill  '}</span>
      <span style={{ color: skill.color }}>{bar(skill.proficiency)}</span>
      <span className="text-[var(--terminal-text)]">{' ' + skill.proficiency + '%'}</span>
      <span className="text-[var(--terminal-muted)]">{' · ' + skill.yearsOfExperience + 'yr'}</span>
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
      <span className="text-[var(--terminal-muted)]">Mounted  </span>
      <span style={{ color }}>{catSlug(cat.name) + '/'}</span>
      <span className="text-[var(--terminal-muted)]">{'   [' + cat.skills.length + ' skills]'}</span>
    </div>
  );
}

function jcatDetail(label: string, val: string, valColor?: string): ReactNode {
  return (
    <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
      <span className="text-[var(--color-cyan)]">{'  ' + pad(label, 14)}</span>
      <span className="text-[var(--terminal-muted)]">: </span>
      {valColor
        ? <span style={{ color: valColor }}>{val}</span>
        : <span className="text-[var(--terminal-text)]">{val}</span>}
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
  out.push(mkLine('rich', '', <div className="whitespace-pre text-sm leading-relaxed font-semibold text-[var(--terminal-text)]">{label}</div>));

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
  out.push(mkLine('dim', `  ${ALL.length} .skill files  (+${MISC.length} misc — run 'skills' to see all)`));
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
  const skill = ALL_SKILLS.find(
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
        <span className="text-[var(--terminal-muted)]">{'─── '}</span>
        <span style={{ color }}>{s + '.skill'}</span>
        <span className="text-[var(--terminal-muted)]">{' ' + '─'.repeat(Math.max(0, 46 - s.length))}</span>
      </div>
    )),
    mkLine('rich', '', jcatDetail('name',        skill.name,          color)),
    mkLine('rich', '', jcatDetail('category',    skill.catName,       color)),
    mkLine('rich', '', (
      <div className="whitespace-pre text-sm leading-relaxed flex items-baseline">
        <span className="text-[var(--color-cyan)]">{'  ' + pad('proficiency', 14)}</span>
        <span className="text-[var(--terminal-muted)]">: </span>
        <span style={{ color }}>{bar(skill.proficiency)}</span>
        <span className="text-[var(--terminal-text)]">{' ' + skill.proficiency + '%'}</span>
      </div>
    )),
    mkLine('rich', '', jcatDetail('experience',  skill.yearsOfExperience + (skill.yearsOfExperience === 1 ? ' year' : ' years'))),
    mkLine('dim', '  ' + '─'.repeat(50)),
    mkLine('blank', ''),
  ];
}

function cmdSkills(catFilter?: string): Line[] {
  let skills = ALL_SKILLS;
  if (catFilter) {
    const q = catFilter.toLowerCase().replace(/-/g, ' ');
    skills = ALL_SKILLS.filter((s) => s.catName.toLowerCase().includes(q));
    if (!skills.length) return [
      mkLine('err', `  No skills matching '${catFilter}'`),
      mkLine('dim', '  Try: languages · data-engineering · infrastructure · databases · monitoring-tools · miscellaneous'),
      mkLine('blank', ''),
    ];
  }
  const hdr = (
    <div className="whitespace-pre text-sm leading-relaxed text-[var(--terminal-muted)]">
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
        <span className="text-[var(--terminal-muted)]">{'  │'}</span>
        <span style={{ color: s.color }}>{pad(' ' + s.name, NW)}</span>
        <span className="text-[var(--terminal-muted)]">{'│'}</span>
        <span style={{ color: s.color }}>{pad(' ' + s.catName, CW)}</span>
        <span className="text-[var(--terminal-muted)]">{'│'}</span>
        <span className="text-[var(--terminal-text)]">{pad(' ' + s.proficiency + '%', PW)}</span>
        <span className="text-[var(--terminal-muted)]">{'│'}</span>
      </div>
    ))),
    mkLine('dim', bl),
    mkLine('ok',  '  8 rows in set (0.002s)'),
    mkLine('blank', ''),
  ];
}

// ── Dino game component ───────────────────────────────────────────────────────
function DinoGame({ onQuit, isDark }: { onQuit: () => void; isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onQuitRef = useRef(onQuit);
  useEffect(() => { onQuitRef.current = onQuit; }, [onQuit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    // Theme-aware color palette
    const C = isDark ? {
      bg: '#0D1117', ground: '#30363D', dino: '#5BCC7E', eye: '#0D1117',
      obstacle: '#58a6ff', score: '#FFD300', info: '#58a6ff', dead: '#FF6B6B',
    } : {
      bg: '#F3F4F6', ground: 'rgba(0,0,0,0.18)', dino: '#116329', eye: '#F3F4F6',
      obstacle: '#0550ae', score: '#953800', info: '#0550ae', dead: '#d1242f',
    };

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
      if (!g.jumping) { g.dinoVY = 11; g.jumping = true; }
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

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.strokeStyle = C.ground;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();

      // Score
      ctx.fillStyle = C.score;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('SCORE ' + Math.floor(g.score), W - 14, 18);

      if (!g.started && !g.dead) {
        ctx.fillStyle = C.info;
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE or click to start · ESC to exit', W / 2, H / 2 + 4);
      } else if (g.dead) {
        ctx.fillStyle = C.dead;
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER  —  Score: ' + Math.floor(g.score), W / 2, H / 2 - 8);
        ctx.fillStyle = C.info;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('SPACE or click to restart', W / 2, H / 2 + 12);
      } else {
        // Physics — dinoY is height above ground (positive = up), gravity pulls down
        g.dinoY += g.dinoVY * dt;
        g.dinoVY -= 0.6 * dt;
        if (g.dinoY <= 0) { g.dinoY = 0; g.dinoVY = 0; g.jumping = false; }

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
        const dinoBottom = GROUND - g.dinoY;
        for (const o of g.obstacles) {
          if (DINO_X + DINO_W - 3 > o.x + 3 &&
              DINO_X + 3 < o.x + o.w - 3 &&
              dinoBottom - 2 > GROUND - o.h) {
            g.dead = true;
          }
        }

        // Draw dino — pixel-art blocks
        const dy = GROUND - DINO_H - g.dinoY;
        ctx.fillStyle = C.dino;
        ctx.fillRect(DINO_X, dy, DINO_W, DINO_H - 8);          // body
        ctx.fillRect(DINO_X - 2, dy - 10, DINO_W + 4, 12);     // head
        ctx.fillStyle = C.eye;
        ctx.fillRect(DINO_X + DINO_W - 3, dy - 8, 4, 4);       // eye
        ctx.fillStyle = C.dino;
        const lp = Math.floor(g.score * 0.8) % 2;
        if (!g.jumping) {
          ctx.fillRect(DINO_X + 2, GROUND - 8, 5, 8);
          ctx.fillRect(DINO_X + 10, GROUND - (lp ? 8 : 14), 5, lp ? 8 : 14);
        } else {
          ctx.fillRect(DINO_X + 2, GROUND - DINO_H - g.dinoY + DINO_H - 4, 5, 4);
          ctx.fillRect(DINO_X + 10, GROUND - DINO_H - g.dinoY + DINO_H - 4, 5, 4);
        }

        // Draw obstacles
        ctx.fillStyle = C.obstacle;
        for (const o of g.obstacles) {
          ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
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
  }, [isDark]); // re-init canvas when theme changes

  return (
    <div className="border-t border-[var(--terminal-border)]">
      <div className="px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-[family-name:var(--font-jetbrains)]">
        <span className="text-[var(--color-green)]">◆ DINO.EXE</span>
        <span className="text-[var(--terminal-muted)]">SPACE / click = jump · ESC = exit</span>
      </div>
      <canvas ref={canvasRef} className="w-full block" height={130} style={{ display: 'block' }} />
    </div>
  );
}

// ── htop dashboard ────────────────────────────────────────────────────────────
function HtopView({ onQuit }: { onQuit: () => void }) {
  const onQuitRef = useRef(onQuit);
  useEffect(() => { onQuitRef.current = onQuit; }, [onQuit]);

  const [liveProfs, setLiveProfs] = useState<number[]>(() => ALL_SKILLS.map((s) => s.proficiency));
  const [history,   setHistory]   = useState<number[]>(() => {
    const base = Math.round(ALL_SKILLS.reduce((a, s) => a + s.proficiency, 0) / ALL_SKILLS.length);
    return Array.from({ length: 24 }, () => Math.round(base + (Math.random() - 0.5) * 6));
  });
  const [clock,  setClock]  = useState(() => new Date().toLocaleTimeString());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const next = ALL_SKILLS.map((s) =>
        Math.min(100, Math.max(s.proficiency - 4, s.proficiency + Math.round((Math.random() - 0.5) * 5)))
      );
      const avg = Math.round(next.reduce((a, v) => a + v, 0) / next.length);
      setLiveProfs(next);
      setHistory((prev) => [...prev.slice(1), avg]);
      setClock(new Date().toLocaleTimeString());
      setUptime((u) => u + 1);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') onQuitRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const avgProf = Math.round(liveProfs.reduce((a, v) => a + v, 0) / liveProfs.length);

  function catLiveAvg(catName: string) {
    const vals = ALL_SKILLS.map((s, i) => (s.catName === catName ? liveProfs[i] : null)).filter((v): v is number => v !== null);
    return Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
  }

  function renderBar(pct: number, w: number, color: string): ReactNode {
    const f = Math.round((pct / 100) * w);
    return (
      <>
        <span style={{ color }}>{'█'.repeat(f)}</span>
        <span style={{ color: 'var(--terminal-muted)', opacity: 0.55 }}>{'░'.repeat(w - f)}</span>
      </>
    );
  }

  function sparkline(vals: number[]): ReactNode {
    const blocks = ['▁','▂','▃','▄','▅','▆','▇','█'];
    const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
    return (
      <>
        {vals.map((v, i) => {
          const bi = Math.min(blocks.length - 1, Math.floor(((v - min) / range) * blocks.length));
          return <span key={i} style={{ color: 'var(--color-cyan)', opacity: 0.5 + (bi / blocks.length) * 0.5 }}>{blocks[bi]}</span>;
        })}
      </>
    );
  }

  return (
    <div
      className="border-t border-[var(--terminal-border)] font-[family-name:var(--font-jetbrains)] select-none"
      style={{ background: 'var(--terminal-bg)', fontSize: 11 }}
    >
      {/* ── Header bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-[var(--terminal-border)]"
        style={{ background: 'var(--terminal-titlebar)' }}
      >
        <span className="font-bold tracking-wide" style={{ color: 'var(--color-cyan)' }}>
          ⬡ skills-htop
        </span>
        <div className="flex items-center gap-5" style={{ color: 'var(--terminal-muted)', fontSize: 10 }}>
          <span>skills&nbsp;<span style={{ color: 'var(--color-green)', fontWeight: 700 }}>{ALL_SKILLS.length}</span></span>
          <span>categories&nbsp;<span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>{skillCategories.length}</span></span>
          <span>avg&nbsp;<span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>{avgProf}%</span></span>
          <span>up&nbsp;{uptime}s</span>
          <span style={{ color: 'var(--terminal-text)' }}>{clock}</span>
        </div>
      </div>

      {/* ── Category meters ── */}
      <div className="px-4 pt-3 pb-3 border-b border-[var(--terminal-border)] grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1.5">
        {skillCategories.map((cat) => {
          const color = CAT_COLOR[cat.name] ?? '#fff';
          const live  = catLiveAvg(cat.name);
          return (
            <div key={cat.name} className="flex items-center gap-2">
              <span style={{ color, minWidth: 96, fontSize: 10, fontWeight: 600 }}>
                {catSlug(cat.name).slice(0, 14)}
              </span>
              <span style={{ color: 'var(--terminal-muted)' }}>[</span>
              {renderBar(live, 20, color)}
              <span style={{ color: 'var(--terminal-muted)' }}>]</span>
              <span style={{ color, minWidth: 38, fontWeight: 700 }}>{live}%</span>
              <span style={{ color: 'var(--terminal-muted)', fontSize: 10 }}>{cat.skills.length}&nbsp;skills</span>
            </div>
          );
        })}

        {/* Sparkline history */}
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--terminal-muted)', minWidth: 96, fontSize: 10, fontWeight: 600 }}>
            avg&nbsp;history
          </span>
          <span style={{ color: 'var(--terminal-muted)' }}>[</span>
          {sparkline(history)}
          <span style={{ color: 'var(--terminal-muted)' }}>]</span>
          <span style={{ color: 'var(--color-cyan)', minWidth: 38, fontWeight: 700 }}>{history[history.length - 1]}%</span>
        </div>
      </div>

      {/* ── Skills table ── */}
      <div className="overflow-y-auto" style={{ maxHeight: 320 }} data-lenis-prevent>
        {/* Column headers */}
        <div
          className="sticky top-0 px-4 py-1 flex items-center gap-2 border-b border-[var(--terminal-border)]"
          style={{ background: 'var(--terminal-titlebar)', color: 'var(--terminal-muted)', fontSize: 10, fontWeight: 600 }}
        >
          <span style={{ width: 28 }}>PID</span>
          <span style={{ flex: '1 1 120px' }}>SKILL</span>
          <span style={{ width: 38 }}>PROF</span>
          <span style={{ width: 30 }}>EXP</span>
          <span style={{ flex: '1 1 100px' }}>CATEGORY</span>
          <span style={{ width: 128 }}>USAGE</span>
        </div>

        {ALL_SKILLS.map((skill, i) => {
          const lv = liveProfs[i] ?? skill.proficiency;
          return (
            <div
              key={skill.name}
              className="px-4 flex items-center gap-2 transition-opacity"
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                borderBottom: '1px solid var(--terminal-border)',
                opacity: 0.93,
              }}
            >
              <span style={{ color: 'var(--terminal-muted)', width: 28, fontSize: 10 }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              <span style={{ color: skill.color, flex: '1 1 120px', fontWeight: 600 }} className="truncate">
                {skill.name}
              </span>
              <span style={{ color: skill.color, width: 38, fontWeight: 700 }}>{lv}%</span>
              <span style={{ color: 'var(--terminal-muted)', width: 30, fontSize: 10 }}>{skill.yearsOfExperience}yr</span>
              <span style={{ color: 'var(--terminal-muted)', flex: '1 1 100px', fontSize: 10 }} className="truncate">
                {skill.catName}
              </span>
              <span style={{ width: 128 }}>{renderBar(lv, 14, skill.color)}</span>
            </div>
          );
        })}
      </div>

      {/* ── Footer key hints ── */}
      <div
        className="flex items-center gap-4 px-4 py-1.5 border-t border-[var(--terminal-border)]"
        style={{ background: 'var(--terminal-titlebar)', color: 'var(--terminal-muted)', fontSize: 10 }}
      >
        {(['q', 'ESC'] as const).map((k) => (
          <span key={k}>
            <span
              className="px-1 rounded-sm text-white mr-1"
              style={{ background: 'var(--color-cyan)', fontSize: 9 }}
            >
              {k}
            </span>
            {k === 'q' ? 'Quit' : 'Exit'}
          </span>
        ))}
        <span>
          <span className="px-1 rounded-sm text-white mr-1" style={{ background: 'var(--color-cyan)', fontSize: 9 }}>↑↓</span>
          Scroll
        </span>
        <span className="ml-auto opacity-50">skills-htop v1.0.0</span>
      </div>
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
    mk('info', '  ║   25 skills  ·  5 categories  ·  +7 misc     ║'),
    mk('info', '  ╚══════════════════════════════════════════════╝'),
    mk('blank', ''),
    mk('dim', '  Mounting skill filesystem...'),
    ...skillCategories.map((c) => mk('rich', '', jmount(c))),
    mk('blank', ''),
    mk('ok', '  25 skills loaded (18 core · 7 misc).'),
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
  const [showHtop, setShowHtop]         = useState(false);    // htop dashboard
  const { theme, toggleTheme }          = useTheme();

  // Header ticker — cycles top skills (idle "shows main skills")
  useEffect(() => {
    const id = setInterval(() => setHeaderIdx((i) => (i + 1) % ALL.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Scroll entrance — spring rise
  const { scrollYProgress: enterProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 0.3'] });
  const rawY    = useTransform(enterProgress, [0, 1], [80, 0]);
  const sectionY = useSpring(rawY, { stiffness: 55, damping: 18, mass: 1 });

  // Scroll exit — terminal zooms in and fades (mirrors Hero dashboard)
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const rawExitScale   = useTransform(exitProgress, [0.42, 1], [1, 1.18]);
  const rawExitOpacity = useTransform(exitProgress, [0.48, 0.88], [1, 0]);
  const rawExitY       = useTransform(exitProgress, [0.42, 1], [0, -52]);
  const exitScale   = useSpring(rawExitScale,   { stiffness: 80, damping: 20 });
  const exitOpacity = useSpring(rawExitOpacity, { stiffness: 80, damping: 20 });
  const exitY       = useSpring(rawExitY,       { stiffness: 80, damping: 20 });

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
          { id: _id++, type: 'info',  text: '  Skills commands:' },
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'out',   text: '  tree                       File tree of all skills with proficiency bars' },
          { id: _id++, type: 'out',   text: '  tree <category>            Filter tree by category name' },
          { id: _id++, type: 'out',   text: '  ls                         List skill categories' },
          { id: _id++, type: 'out',   text: '  ls <category>              List .skill files in a category' },
          { id: _id++, type: 'out',   text: '  cat <skill>                View skill details  (e.g. cat python)' },
          { id: _id++, type: 'out',   text: '  skills                     Table of all skills with proficiency' },
          { id: _id++, type: 'out',   text: '  skills --cat <name>        Filter skills table by category' },
          { id: _id++, type: 'out',   text: '  htop                       Live skills dashboard' },
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'info',  text: '  Linux commands:' },
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'out',   text: '  pwd                        Print working directory' },
          { id: _id++, type: 'out',   text: '  echo <text>                Print text to terminal' },
          { id: _id++, type: 'out',   text: '  date                       Current date and time' },
          { id: _id++, type: 'out',   text: '  uname -a                   System information' },
          { id: _id++, type: 'out',   text: '  uptime                     Session uptime' },
          { id: _id++, type: 'out',   text: '  env                        Environment variables' },
          { id: _id++, type: 'out',   text: '  alias                      List command aliases' },
          { id: _id++, type: 'out',   text: '  which <cmd>                Show command path' },
          { id: _id++, type: 'out',   text: '  man <cmd>                  Command manual' },
          { id: _id++, type: 'out',   text: '  neofetch                   System info + ASCII art' },
          { id: _id++, type: 'out',   text: '  history                    Command history' },
          { id: _id++, type: 'out',   text: '  clear                      Clear terminal  (Ctrl+L)' },
          { id: _id++, type: 'out',   text: '  reboot                     Restart terminal' },
          { id: _id++, type: 'out',   text: '  sudo reboot                Reload the entire page' },
          { id: _id++, type: 'out',   text: '  theme                      Toggle dark / light mode' },
          { id: _id++, type: 'out',   text: '  goto <section>             Scroll to a section' },
          { id: _id++, type: 'out',   text: '  view-source                Open source code on GitHub' },
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

      case 'htop':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'ok',   text: '  ⬡  Launching skills-htop...' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        setTimeout(() => {
          setShowHtop(true);
          inputRef.current?.blur();
        }, 300);
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

      case 'pwd':
        appendLines([
          { id: _id++, type: 'out', text: '  /home/tejpreet/skills' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'echo':
        appendLines([
          { id: _id++, type: 'out', text: rest ? `  ${rest}` : '' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'date':
        appendLines([
          { id: _id++, type: 'out', text: `  ${new Date().toString()}` },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'uname':
        appendLines([
          { id: _id++, type: 'out', text: '  SkillsOS 6.1.0-tejpreet #1 SMP x86_64 GNU/Linux' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'uptime': {
        const mins = Math.floor(performance.now() / 60000);
        const secs = Math.floor((performance.now() % 60000) / 1000);
        appendLines([
          { id: _id++, type: 'out', text: `  up ${mins}m ${secs}s,  1 user,  load average: 0.${ALL_SKILLS.length}, 0.${skillCategories.length}, 0.42` },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;
      }

      case 'env':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'out', text: '  USER=tejpreet' },
          { id: _id++, type: 'out', text: '  HOME=/home/tejpreet' },
          { id: _id++, type: 'out', text: '  SHELL=/bin/zsh' },
          { id: _id++, type: 'out', text: `  PWD=/home/tejpreet/skills` },
          { id: _id++, type: 'out', text: '  LANG=en_US.UTF-8' },
          { id: _id++, type: 'out', text: `  SKILLS=${ALL_SKILLS.length}` },
          { id: _id++, type: 'out', text: `  CATEGORIES=${skillCategories.length}` },
          { id: _id++, type: 'out', text: '  PIPELINE=MQTT→Kafka→Spark→DeltaLake→Grafana' },
          { id: _id++, type: 'out', text: '  TERM=skills-terminal-1.0.0' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'alias':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'out', text: "  alias ll='ls -la'" },
          { id: _id++, type: 'out', text: "  alias gs='skills'" },
          { id: _id++, type: 'out', text: "  alias gt='tree'" },
          { id: _id++, type: 'out', text: "  alias hire='sudo hire tejpreet'" },
          { id: _id++, type: 'out', text: "  alias top='htop'" },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'which': {
        const knownCmds: Record<string, string> = {
          tree: '/usr/local/bin/tree', ls: '/bin/ls', cat: '/bin/cat',
          skills: '/usr/local/bin/skills', htop: '/usr/bin/htop',
          clear: '/usr/bin/clear', history: '/usr/bin/history',
          pwd: '/bin/pwd', echo: '/bin/echo', date: '/bin/date',
          uname: '/bin/uname', uptime: '/usr/bin/uptime',
          env: '/usr/bin/env', alias: '/usr/bin/alias',
          which: '/usr/bin/which', man: '/usr/bin/man',
          neofetch: '/usr/bin/neofetch', reboot: '/usr/sbin/reboot',
          sudo: '/usr/bin/sudo', game: '/usr/games/dino',
        };
        const path = rest && knownCmds[rest.toLowerCase()];
        appendLines(path
          ? [{ id: _id++, type: 'out', text: `  ${path}` }, { id: _id++, type: 'blank', text: '' }]
          : [{ id: _id++, type: 'err', text: `  which: no ${rest} in ($PATH)` }, { id: _id++, type: 'blank', text: '' }]
        );
        break;
      }

      case 'man': {
        const manPages: Record<string, string> = {
          tree: 'List contents of directories in a tree-like format, sorted by proficiency.',
          ls: 'List directory contents. Use `ls <category>` to see skills in a category.',
          cat: 'Concatenate and display skill files. Usage: cat <skill-name>',
          skills: 'Display all skills in a formatted table. Use --cat to filter.',
          htop: 'Interactive skills viewer with live proficiency bars and history.',
          clear: 'Clear the terminal screen.',
          reboot: 'Restart the skills terminal and replay the boot animation.',
          'view-source': 'Open the portfolio source code on GitHub in a new tab.',
          sudo: 'Execute a command as superuser. Try: sudo hire tejpreet',
          game: 'Launch the DINO game. Press SPACE to jump, ESC to quit.',
          neofetch: 'Display system information alongside an ASCII art logo.',
        };
        if (!rest) {
          appendLines([
            { id: _id++, type: 'err', text: '  Usage: man <command>' },
            { id: _id++, type: 'blank', text: '' },
          ]);
        } else {
          const page = manPages[rest.toLowerCase()];
          appendLines(page
            ? [
                { id: _id++, type: 'blank', text: '' },
                { id: _id++, type: 'info',  text: `  MAN — ${rest.toUpperCase()}(1)` },
                { id: _id++, type: 'out',   text: `  ${page}` },
                { id: _id++, type: 'blank', text: '' },
              ]
            : [
                { id: _id++, type: 'err',  text: `  No manual entry for ${rest}` },
                { id: _id++, type: 'blank', text: '' },
              ]
          );
        }
        break;
      }

      case 'neofetch': {
        const avgP = Math.round(ALL_SKILLS.reduce((s, sk) => s + sk.proficiency, 0) / ALL_SKILLS.length);
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'rich', text: '', jsx: (
            <div className="whitespace-pre text-sm leading-relaxed font-[family-name:var(--font-jetbrains)] grid grid-cols-[auto_1fr] gap-x-6">
              <div style={{ color: '#5BCC7E', lineHeight: 1.55 }}>
                {[
                  '   ████████   ',
                  '  ██  ██  ██  ',
                  '  ██████████  ',
                  '   ████████   ',
                  '  ██  ██  ██  ',
                  '  ████████    ',
                  '              ',
                ].map((r, i) => <div key={i}>{r}</div>)}
              </div>
              <div style={{ lineHeight: 1.55 }}>
                <div><span style={{ color: '#5BCC7E', fontWeight: 700 }}>tejpreet</span><span style={{ color: 'var(--terminal-muted)' }}>@</span><span style={{ color: '#5BCC7E', fontWeight: 700 }}>skills</span></div>
                <div style={{ color: 'var(--terminal-muted)' }}>{'─'.repeat(22)}</div>
                <div><span style={{ color: 'var(--color-cyan)' }}>OS</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>SkillsOS 6.1.0</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Shell</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>skills-terminal v1.0.0</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Skills</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>{ALL_SKILLS.length} loaded</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Categories</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>{skillCategories.length}</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Avg Prof</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>{avgP}%</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Stack</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>Python · Kafka · Spark · Delta</span></div>
                <div><span style={{ color: 'var(--color-cyan)' }}>Role</span><span style={{ color: 'var(--terminal-muted)' }}>: </span><span style={{ color: 'var(--terminal-text)' }}>Data Engineer</span></div>
              </div>
            </div>
          )},
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;
      }

      case 'exit':
      case 'logout':
        appendLines([
          { id: _id++, type: 'dim', text: '  logout: cannot exit a browser tab — you are stuck here :)' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        break;

      case 'rm':
        if (args.includes('-rf') || args.includes('-r')) {
          appendLines([
            { id: _id++, type: 'err',  text: '  rm: cannot remove \'/\': Permission denied' },
            { id: _id++, type: 'dim',  text: '  nice try.' },
            { id: _id++, type: 'blank', text: '' },
          ]);
        } else {
          appendLines([
            { id: _id++, type: 'err',  text: `  rm: missing operand` },
            { id: _id++, type: 'blank', text: '' },
          ]);
        }
        break;

      case 'view-source':
      case 'source':
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'ok',   text: '  ↗  Opening source code...' },
          { id: _id++, type: 'dim',  text: '  github.com/singhtejpreet2004/portfolio-website' },
          { id: _id++, type: 'blank', text: '' },
        ]);
        setTimeout(() => window.open('https://github.com/singhtejpreet2004/portfolio-website', '_blank'), 400);
        break;

      case 'reboot':
      case 'restart': {
        setLines([{ id: _id++, type: 'info', text: '  System rebooting...' }]);
        setInputEnabled(false);
        setShowGame(false);
        setShowHtop(false);
        const boot = buildBoot();
        let ri = 0;
        const timers: ReturnType<typeof setTimeout>[] = [];
        const next = () => {
          if (ri >= boot.length) {
            const treeLines = cmdTree();
            const t = setTimeout(() => {
              setLines((prev) => [
                ...prev,
                { id: _id++, type: 'cmd', text: 'tree' },
                ...treeLines.filter((l): l is Line => !!l),
              ]);
              setInputEnabled(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }, 400);
            timers.push(t);
            return;
          }
          setLines((prev) => [...prev, boot[ri++]]);
          timers.push(setTimeout(next, ri <= 5 ? 100 : ri <= 11 ? 65 : 40));
        };
        timers.push(setTimeout(() => { setLines([]); setTimeout(next, 200); }, 600));
        break;
      }

      case 'theme':
      case 'toggle-theme': {
        const next = theme === 'dark' ? 'light' : 'dark';
        appendLines([
          { id: _id++, type: 'blank', text: '' },
          { id: _id++, type: 'ok',   text: `  ◑  Switching to ${next} mode...` },
          { id: _id++, type: 'blank', text: '' },
        ]);
        setTimeout(() => toggleTheme(), 300);
        break;
      }

      case 'goto':
      case 'cd': {
        const sections: Record<string, string> = {
          hero: 'hero', home: 'hero',
          about: 'about',
          skills: 'skills',
          experience: 'experience', exp: 'experience',
          projects: 'projects',
          education: 'education', edu: 'education',
          achievements: 'achievements', awards: 'achievements',
          contact: 'contact',
        };
        const target = rest ? sections[rest.toLowerCase().replace(/^#/, '')] : null;
        if (!target) {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            { id: _id++, type: 'err',  text: `  goto: ${rest || '(none)'}: section not found` },
            { id: _id++, type: 'dim',  text: '  Sections: hero · about · skills · experience · projects · education · achievements · contact' },
            { id: _id++, type: 'blank', text: '' },
          ]);
        } else {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            { id: _id++, type: 'ok',   text: `  ↓  Navigating to #${target}...` },
            { id: _id++, type: 'blank', text: '' },
          ]);
          setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 300);
        }
        break;
      }

      case 'sudo': {
        const sub = rest.trim().toLowerCase();
        if (sub === 'hire tejpreet') {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            { id: _id++, type: 'dim',   text: '  [sudo] password for root: ••••••••' },
            { id: _id++, type: 'ok',    text: '  ✓ Authentication successful' },
            { id: _id++, type: 'ok',    text: '  ★  Executing hire.sh...' },
            { id: _id++, type: 'blank', text: '' },
          ]);
          setTimeout(() => window.dispatchEvent(new CustomEvent('open-hire-popup')), 700);
        } else if (sub === 'reboot') {
          appendLines([
            { id: _id++, type: 'blank', text: '' },
            { id: _id++, type: 'dim',   text: '  [sudo] password for root: ••••••••' },
            { id: _id++, type: 'ok',    text: '  ✓ Authentication successful' },
            { id: _id++, type: 'info',  text: '  System rebooting...' },
            { id: _id++, type: 'blank', text: '' },
          ]);
          setTimeout(() => window.location.reload(), 1200);
        } else {
          appendLines([
            { id: _id++, type: 'err',  text: `  sudo: ${rest}: command not found` },
            { id: _id++, type: 'dim',  text: "  Hint: try 'sudo hire tejpreet' or 'sudo reboot'" },
            { id: _id++, type: 'blank', text: '' },
          ]);
        }
        break;
      }

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
      case 'dim':  return 'text-[var(--terminal-muted)]';
      default:     return 'text-[var(--terminal-text)]';
    }
  }

  const hs = ALL[headerIdx];
  const CHIPS = ['tree', 'htop', 'skills', 'ls', 'cat python', 'cat kafka', 'cat docker', 'ls data-engineering', 'game', 'help'];

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 md:py-32">
      {/* Deep background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--color-cyan) 0%, transparent 70%)' }}
      />
      {/* Elevated terminal highlight — mimics Hero dashboard treatment */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] opacity-[0.12] blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(88,166,255,0.5) 0%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          subtitle="// ~/skills $ tree --color --sort=proficiency"
          title="Skills"
        />

        <motion.div
          style={{ y: sectionY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Exit animation — zooms in and fades as section scrolls out (mirrors Hero dashboard) */}
          <motion.div style={{ scale: exitScale, opacity: exitOpacity, y: exitY, willChange: 'transform, opacity' }}>
          {/* Terminal window — elevated with backdrop blur + glow highlight */}
          <div
            className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
            style={{
              background: 'var(--terminal-bg)',
              boxShadow: '0 0 0 1px rgba(88,166,255,0.08) inset, 0 24px 80px rgba(0,0,0,0.45), 0 0 60px rgba(88,166,255,0.07)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-[var(--terminal-border)]"
              style={{ background: 'var(--terminal-titlebar)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--terminal-muted)]">
                  tejpreet@skills: ~/skills
                </span>
              </div>

              {/* Idle skill cycler — "shows main skills when idle" */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains)]">
                <span className="text-[var(--terminal-muted)] opacity-40">◆</span>
                <motion.span
                  key={headerIdx}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: hs?.color }}
                >
                  {hs?.name}
                </motion.span>
                <span className="text-[var(--terminal-muted)] opacity-40">
                  {bar(hs?.proficiency ?? 0, 10)}
                </span>
                <span style={{ color: hs?.color }} className="opacity-80">
                  {hs?.proficiency}%
                </span>
              </div>
            </div>

            {/* Output buffer — hidden when htop or game is fullscreen */}
            {!showHtop && (
              <div
                ref={outputRef}
                data-lenis-prevent
                className="h-[560px] md:h-[640px] overflow-y-auto p-5 font-[family-name:var(--font-jetbrains)] text-sm leading-relaxed select-text"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--terminal-scrollbar) transparent' }}
              >
                {lines.filter((l): l is Line => !!l).map((line) => (
                  <div key={line.id} className={line.type !== 'rich' ? lc(line.type) : ''}>
                    {line.jsx ? (
                      line.jsx
                    ) : line.type === 'cmd' ? (
                      <div className="whitespace-pre text-sm leading-relaxed">
                        <span className="text-[var(--color-green)]">tejpreet@skills</span>
                        <span className="text-[var(--terminal-muted)]">:~/skills$</span>
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
                    <span className="text-[var(--terminal-muted)] text-sm">:~/skills$&nbsp;</span>
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
            )}

            {/* Dino game */}
            {showGame && (
              <DinoGame isDark={theme === 'dark'} onQuit={() => {
                setShowGame(false);
                setTimeout(() => inputRef.current?.focus(), 50);
              }} />
            )}

            {/* htop dashboard — replaces the output buffer */}
            {showHtop && (
              <HtopView onQuit={() => {
                setShowHtop(false);
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
                className="px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-jetbrains)] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--terminal-muted)] hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)]/30 transition-colors cursor-pointer"
              >
                $ {cmd}
              </button>
            ))}
          </div>
          </motion.div>{/* /exit animation */}
        </motion.div>
      </div>
    </section>
  );
}
