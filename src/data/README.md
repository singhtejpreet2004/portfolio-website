# src/data/

Static content files. All portfolio data lives here as typed TypeScript modules. Components import from these files directly — no API calls, no CMS.

**To update the portfolio, edit these files.**

---

## Contents

| File | Export | Type | Description |
|---|---|---|---|
| `profile.ts` | `profile` | `Profile` | Personal info — name, title, bio, social links, fun facts, avatar/resume URLs |
| `skills.ts` | `skillCategories` | `SkillCategory[]` | Skills grouped by category with proficiency (0–100) and years of experience |
| `experience.ts` | `experiences` | `Experience[]` | Work history — role, company, dates, bullets, tech stack, key achievement |
| `projects.ts` | `projects` | `Project[]` | Portfolio projects — title, description, metrics, tech stack, links, featured flag |
| `education.ts` | `education` | `Education[]` | Academic history — institution, degree, dates, GPA, coursework |
| `achievements.ts` | `achievements` | `Achievement[]` | Certifications, awards, and accomplishments with type and badge color |

All types are defined in [`src/types/index.ts`](../types/README.md).

---

## Data Structures

### `profile.ts`

```typescript
{
  name: "Tejpreet Singh",
  title: "Data Engineer",
  taglines: ["Data Engineer", "Pipeline Architect", "Streaming Specialist", ...],
  bio: [paragraph1, paragraph2, paragraph3],
  avatarUrl: "/images/avatar.png",
  resumeUrl: "/resume.pdf",
  socialLinks: [{ platform, url, icon, handle }, ...],
  funFacts: [{ icon, label, value, isCounter }, ...]
}
```

### `skills.ts`

```typescript
[
  {
    name: "Languages",
    color: "#58a6ff",
    skills: [
      { name: "Python", icon: "...", proficiency: 90, yearsOfExperience: 3, category: "Languages" },
      ...
    ]
  },
  ...
]
```

Five categories: Languages, Data Engineering, Infrastructure, Databases, Monitoring & Tools.

### `experience.ts`

```typescript
[
  {
    id: "dixon-iot",
    company: "Dixon IoT Lab, Plaksha University",
    role: "Data Engineering Intern",
    dates: { start: "May 2025", end: "Present" },
    location: "Mohali, India",
    description: "...",
    bullets: ["...", "..."],
    keyAchievement: "...",
    techStack: ["Kafka", "Spark", "k3s", ...],
    logoUrl: "..."
  },
  ...
]
```

### `projects.ts`

```typescript
[
  {
    id: "video-analytics",
    title: "Enterprise Real-Time Video Stream Analytics",
    descriptions: { short: "...", long: "..." },
    category: "Data Engineering",
    techStack: ["Kafka", "Spark", "Delta Lake", ...],
    metrics: [{ label: "Streams", value: "8+" }, ...],
    featured: true,
    date: "2025",
    githubUrl: "...",
    liveUrl: "..."
  },
  ...
]
```

### `achievements.ts`

```typescript
[
  {
    title: "...",
    type: "certification" | "award" | "accomplishment",
    issuer: "...",
    date: "...",
    description: "...",
    badgeColor: "#58a6ff",
    verificationUrl: "..."
  },
  ...
]
```

---

## Adding New Content

- **New skill:** Add to the relevant category array in `skills.ts`
- **New experience:** Prepend to `experiences` in `experience.ts` (most recent first)
- **New project:** Add to `projects` in `projects.ts`; set `featured: true` to pin it
- **New achievement:** Add to `achievements` in `achievements.ts`
