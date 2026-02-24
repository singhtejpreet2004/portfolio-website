# src/types/

Centralized TypeScript interface definitions. All shared types are exported from `index.ts`.

---

## Contents

| File | Description |
|---|---|
| `index.ts` | All TypeScript interfaces for data, components, and API |

---

## Type Reference (`index.ts`)

### Data Types

```typescript
interface Profile {
  name: string
  title: string
  taglines: string[]
  bio: string[]
  avatarUrl: string
  resumeUrl: string
  socialLinks: SocialLink[]
  funFacts: FunFact[]
}

interface SocialLink {
  platform: string
  url: string
  icon: string
  handle: string
}

interface FunFact {
  icon: string
  label: string
  value: string | number
  isCounter: boolean
}
```

```typescript
interface Skill {
  name: string
  icon: string
  proficiency: number          // 0–100
  yearsOfExperience: number
  category: string
}

interface SkillCategory {
  name: string
  color: string
  skills: Skill[]
}
```

```typescript
interface Experience {
  id: string
  company: string
  role: string
  dates: { start: string; end: string }
  location: string
  description: string
  bullets: string[]
  keyAchievement: string
  techStack: string[]
  logoUrl: string
}
```

```typescript
interface Project {
  id: string
  title: string
  descriptions: { short: string; long: string }
  category: string
  techStack: string[]
  metrics: { label: string; value: string }[]
  thumbnailUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  date: string
}
```

```typescript
interface Education {
  institution: string
  degree: string
  field: string
  dates: { start: string; end: string }
  gpa?: string
  coursework: string[]
  activities: string[]
  logoUrl?: string
}
```

```typescript
interface Achievement {
  title: string
  type: 'certification' | 'award' | 'accomplishment'
  issuer: string
  date: string
  description: string
  badgeColor: string
  verificationUrl?: string
}
```

### Utility Types

```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Section =
  | 'hero' | 'about' | 'skills' | 'experience'
  | 'projects' | 'education' | 'achievements' | 'contact'
```

---

## Usage

```typescript
import type { Profile, Skill, Experience } from '@/types'
```
