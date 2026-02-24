# src/contexts/

React context providers for cross-component state that doesn't fit neatly into a single component or provider file.

---

## Contents

| File | Export | Description |
|---|---|---|
| `MouseContext.tsx` | `MouseContext`, `useMouseContext` | Shared spring-based mouse position for synchronized parallax across components |

---

## `MouseContext`

Provides a single, shared pair of Framer Motion `MotionValue` instances (`springX`, `springY`) to any component in the tree. Components that use the same context instance move in sync with each other.

**Context value:**
```typescript
interface MouseContextValue {
  springX: MotionValue<number>
  springY: MotionValue<number>
}
```

**Hook:**
```typescript
function useMouseContext(): MouseContextValue
```

Returns fallback `MotionValue(0)` values when called outside the provider, so components are safe to use in isolation (e.g., in tests or Storybook).

**Usage:**
```typescript
import { useMouseContext } from '@/contexts/MouseContext'

function MyComponent() {
  const { springX, springY } = useMouseContext()
  return (
    <motion.div style={{ x: springX, y: springY }} />
  )
}
```

---

## When to Use Context vs. the Hook

| Scenario | Use |
|---|---|
| Multiple components that should move **in sync** | `MouseContext` |
| A single component that needs its own independent spring | `useMouseParallax` hook |

The `MouseContext` is mounted at the top of the component tree, so all consumers share the same spring values and animate identically. The `useMouseParallax` hook creates a fresh spring per call site, allowing independent responsiveness.

---

## Dependencies

| Package | Usage |
|---|---|
| `framer-motion` | `useSpring`, `useMotionValue`, `MotionValue` |
