# src/hooks/

Custom React hooks.

---

## Contents

| File | Export | Description |
|---|---|---|
| `useMouseParallax.ts` | `useMouseParallax` | Spring-based mouse position tracking for parallax effects |

---

## `useMouseParallax`

Returns smoothed mouse position as Framer Motion `MotionValue` instances. Used by components that apply parallax transforms based on cursor movement.

**Signature:**
```typescript
function useMouseParallax(): { springX: MotionValue<number>, springY: MotionValue<number> }
```

**Behavior:**
- Listens to `mousemove` events on `window`
- Normalizes coordinates to a `-0.5 … 0.5` range relative to viewport size
- Applies spring physics via `useSpring` (stiffness: 40, damping: 15) for a floaty, lag-behind feel
- On touch devices (`pointer: coarse`), returns `MotionValue(0)` for both axes — no parallax on mobile

**Usage:**
```typescript
import { useMouseParallax } from '@/hooks/useMouseParallax'

function MyComponent() {
  const { springX, springY } = useMouseParallax()
  return (
    <motion.div style={{ x: springX, y: springY }}>
      Floats with the cursor
    </motion.div>
  )
}
```

**Why a hook and not a context?**
Components that need parallax values create their own independent spring instances. This avoids coupling unrelated components to a shared spring that may not match their desired responsiveness. For a shared, synchronized instance, see [`src/contexts/MouseContext.tsx`](../contexts/README.md).

---

## Dependencies

| Package | Usage |
|---|---|
| `framer-motion` | `useSpring`, `useMotionValue`, `MotionValue` |
