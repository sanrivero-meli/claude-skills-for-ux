---
name: rapid-prototype
description: "Generates fast React prototypes — shadcn dark mode, Inter, framer-motion. Scaffold-first: Claude fills in feature logic only. Everything else is pre-decided."
argument-hint: [concept or flow to prototype]
---

# Rapid Prototype

**One job: output runnable code immediately. No deliberation.**

Target: Claude artifact (React) or Vite project. Not Next.js unless routing is explicitly needed.

For a complete annotated example, see [example-loan-simulator.md](example-loan-simulator.md).

---

## Stack (fixed, never negotiate)

- **UI:** shadcn/ui zinc dark palette via Tailwind classes
- **Font:** Inter (injected once on mount)
- **Animation:** `framer-motion` — always imported, always used at least once
- **Icons:** `lucide-react`
- **State:** `useState` / `useReducer` only — no external state libs

---

## Output Rules

1. **Single file.** Everything inlined. No imports except `react`, `framer-motion`, `lucide-react`.
2. **Start coding immediately.** Do not explain before outputting. Comment header only.
3. **Dark by default.** Root always `bg-zinc-950 text-zinc-50`.
4. **Interactive.** Must have at least one stateful interaction — not a static render.
5. **Motion on entrance.** At minimum, a staggered page load. More if the concept calls for it.

---

## Paste-and-go Shell

Copy this, fill in the body. Do not rewrite the shell.

```jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ChevronRight, Check, X, Loader2, AlertCircle } from "lucide-react";

const cn = (...c) => c.filter(Boolean).join(" ");

// ─── shadcn Components ────────────────────────────────────────────────────────

const Button = ({ children, variant="default", size="default", className, disabled, onClick }) => {
  const v = { default:"bg-zinc-50 text-zinc-900 hover:bg-zinc-100", outline:"border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-200", secondary:"bg-zinc-800 text-zinc-50 hover:bg-zinc-700", ghost:"hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50", destructive:"bg-red-900 text-zinc-50 hover:bg-red-800" };
  const s = { default:"h-9 px-4 text-sm", sm:"h-7 px-3 text-xs", lg:"h-11 px-6 text-base", icon:"h-9 w-9" };
  return <button onClick={onClick} disabled={disabled} className={cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer", v[variant], s[size], className)}>{children}</button>;
};

const Input = ({ className, ...props }) =>
  <input className={cn("flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50", className)} {...props} />;

const Card = ({ children, className }) =>
  <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl", className)}>{children}</div>;

const Badge = ({ children, variant="default", className }) => {
  const v = { default:"bg-zinc-800 text-zinc-300", success:"bg-emerald-950 border border-emerald-800 text-emerald-400", warning:"bg-amber-950 border border-amber-800 text-amber-400", destructive:"bg-red-950 border border-red-800 text-red-400" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", v[variant], className)}>{children}</span>;
};

const Separator = ({ className }) => <div className={cn("h-px w-full bg-zinc-800", className)} />;

const Label = ({ children, className, ...props }) =>
  <label className={cn("text-sm font-medium text-zinc-200", className)} {...props}>{children}</label>;

const Skeleton = ({ className }) =>
  <div className={cn("animate-pulse rounded-md bg-zinc-800", className)} />;

// ─── Motion Presets ───────────────────────────────────────────────────────────

const fade = { hidden:{opacity:0,y:12}, show:{opacity:1,y:0,transition:{ease:[0.16,1,0.3,1],duration:0.4}} };
const stagger = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.07,delayChildren:0.05}} };

const AnimNum = ({ value, prefix="", suffix="", dec=0 }) => {
  const s = useSpring(value, { stiffness:80, damping:18 });
  const d = useTransform(s, v => prefix + v.toLocaleString("es-MX",{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix);
  return <motion.span>{d}</motion.span>;
};

// ─── Prototype ────────────────────────────────────────────────────────────────

export default function Prototype() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
    document.body.style.fontFamily = "Inter, sans-serif";
  }, []);

  // ── STATE ──
  // ── LOGIC ──

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-md mx-auto space-y-4">
        {/* CONTENT */}
      </motion.div>
    </div>
  );
}
```

---

## Motion Cheatsheet (pick and drop)

```jsx
// Entrance (wrap any element)
<motion.div variants={fade} />   // uses stagger parent

// Conditional (import AnimatePresence)
<AnimatePresence mode="wait">
  {show && <motion.div key="k" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.97}} transition={{duration:.2}} />}
</AnimatePresence>

// Layout reflow
<motion.div layout transition={{type:"spring",bounce:.15,duration:.5}} />

// Hover card
<motion.div whileHover={{y:-2}} whileTap={{scale:.98}} />

// Animated number — already in shell as <AnimNum value={n} prefix="$" />
```

---

## Zinc Dark Palette (memorize, don't look up)

| Role | Class |
|---|---|
| Page | `bg-zinc-950` |
| Card | `bg-zinc-900` |
| Control | `bg-zinc-800` |
| Border | `border-zinc-800` / `border-zinc-700` (active) |
| Text | `text-zinc-50` / `text-zinc-400` (muted) / `text-zinc-500` (placeholder) |
| Primary btn | `bg-zinc-50 text-zinc-900` |
| Radius | `rounded-md` (controls) / `rounded-2xl` (cards) |

---

## Recipes (intent → structure, no code needed)

**Calculator / Simulator** → Sliders + `AnimNum` for live output + summary Card + CTA Button

**Multi-step form** → `useState(step)` + `AnimatePresence mode="wait"` between steps + directional slide (`x: ±30`)

**List + empty state** → `AnimatePresence` on list items + `layout` on container + stagger enter

**Loading → data** → Skeleton grid → `AnimatePresence` swap to real Cards with stagger

**Confirmation flow** → Form → spinner Button → spring-in checkmark + success state

---

## What NOT to do

- Don't explain the code before writing it
- Don't ask clarifying questions for simple prompts — make a reasonable call and go
- Don't inline CSS — Tailwind classes only
- Don't use Next.js unless the user explicitly asks for routing/API routes
- Don't add more than 3 Motion effects — one entrance, one interaction, one transition
- Don't re-explain the component library — it's in the shell, just use it
