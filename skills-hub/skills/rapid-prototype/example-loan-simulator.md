# Example: Loan Simulator Prototype

This is a reference example of a well-built rapid prototype. Use it as a quality benchmark for output.

## What It Tests
- Real-time calculation feedback with animated number transitions
- Step-by-step reveal (simulate → review → confirmed)
- Success/confirmation state flow with AnimatePresence
- Slider-driven input with live summary updates

## Patterns Used
- **AnimatedNumber** with `useSpring` + `useTransform` for smooth number transitions
- **Stagger entrance** via `variants` with `staggerChildren: 0.08`
- **AnimatePresence** with `mode="wait"` for stage transitions (simulate/review/confirmed)
- **Spring entrance** for success checkmark icon
- **Inlined components**: Card, Button, Slider, Badge, Separator

---

## Full Source

```jsx
/**
 * Prototype: Loan Simulation
 * Tests: Real-time calculation feedback, animated number transitions,
 *        step-by-step reveal, success/confirmation state flow
 * Components: Card, Button, Slider, Badge, Separator, Alert
 * Motion: Stagger entrance, animated numbers (useSpring), AnimatePresence for state transitions
 */

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronRight, Check, Info, ArrowLeft } from "lucide-react";

// ——— Utility ————————————————————————————————————————————————————————————————
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ——— Animated Number ————————————————————————————————————————————————————————
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, (v) =>
    prefix + v.toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  );
  return <motion.span>{display}</motion.span>;
}

// ——— Components —————————————————————————————————————————————————————————————
function Button({ children, variant = "default", size = "default", className, disabled, onClick }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none";
  const variants = {
    default: "bg-zinc-50 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200",
    outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800/60 text-zinc-200",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50",
    secondary: "bg-zinc-800 text-zinc-50 hover:bg-zinc-700",
  };
  const sizes = { default: "h-10 px-5 py-2 text-sm", sm: "h-8 px-3 text-xs", lg: "h-12 px-7 text-base", icon: "h-9 w-9" };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function Card({ className, children }) {
  return <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-xl", className)}>{children}</div>;
}

function Separator() {
  return <div className="h-px w-full bg-zinc-800" />;
}

function Badge({ children, variant = "default" }) {
  const v = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-emerald-950 text-emerald-400 border border-emerald-800",
    warning: "bg-amber-950 text-amber-400 border border-amber-800",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", v[variant])}>{children}</span>;
}

function Slider({ value, onChange, min, max, step = 1 }) {
  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-zinc-800 cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f4f4f5 0%, #f4f4f5 ${((value - min) / (max - min)) * 100}%, #27272a ${((value - min) / (max - min)) * 100}%, #27272a 100%)`
        }}
      />
    </div>
  );
}

// ——— Math ———————————————————————————————————————————————————————————————————
function calcMonthlyPayment(amount, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r === 0) return amount / months;
  return (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// ——— Stages —————————————————————————————————————————————————————————————————
const STAGES = ["simulate", "review", "confirmed"];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.45 } },
};

// ——— Prototype ——————————————————————————————————————————————————————————————
export default function LoanSimulator() {
  const [stage, setStage] = useState("simulate");
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(24);
  const RATE = 24.9; // annual %

  const monthly = calcMonthlyPayment(amount, RATE, months);
  const totalPayment = monthly * months;
  const totalInterest = totalPayment - amount;
  const cat = RATE * 1.08; // simplified CAT

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.background = "#09090b";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-start justify-center p-6 pt-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Badge>Simulación</Badge>
            {stage === "confirmed" && <Badge variant="success">Aprobado</Badge>}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            {stage === "confirmed" ? "¡Tu crédito está listo!" : "Simula tu crédito"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {stage === "confirmed"
              ? "Hemos generado tu oferta personalizada"
              : "Sin compromiso · Resultado inmediato"}
          </p>
        </motion.div>

        {/* Stage: Simulate */}
        <AnimatePresence mode="wait">
          {stage === "simulate" && (
            <motion.div
              key="simulate"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {/* Amount */}
              <motion.div variants={item}>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">Monto</p>
                      <p className="text-3xl font-semibold tabular-nums">
                        $<AnimatedNumber value={amount} />
                      </p>
                    </div>
                    <Badge>MXN</Badge>
                  </div>
                  <Slider value={amount} onChange={setAmount} min={5000} max={200000} step={5000} />
                  <div className="flex justify-between mt-2 text-xs text-zinc-600">
                    <span>$5,000</span>
                    <span>$200,000</span>
                  </div>
                </Card>
              </motion.div>

              {/* Term */}
              <motion.div variants={item}>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">Plazo</p>
                      <p className="text-3xl font-semibold tabular-nums">
                        <AnimatedNumber value={months} /> <span className="text-base font-normal text-zinc-400">meses</span>
                      </p>
                    </div>
                    <Badge>{months <= 12 ? "Corto plazo" : months <= 36 ? "Mediano plazo" : "Largo plazo"}</Badge>
                  </div>
                  <Slider value={months} onChange={setMonths} min={3} max={60} step={3} />
                  <div className="flex justify-between mt-2 text-xs text-zinc-600">
                    <span>3 meses</span>
                    <span>60 meses</span>
                  </div>
                </Card>
              </motion.div>

              {/* Payment summary */}
              <motion.div variants={item}>
                <Card className="p-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">Tu pago mensual</p>
                  <div className="text-5xl font-semibold tabular-nums text-zinc-50 mb-1">
                    $<AnimatedNumber value={monthly} decimals={0} />
                  </div>
                  <p className="text-sm text-zinc-500 mb-5">por mes durante {months} meses</p>
                  <Separator />
                  <div className="space-y-3 mt-5">
                    {[
                      { label: "Monto del crédito", value: `$${amount.toLocaleString("es-MX")}` },
                      { label: "Total a pagar", value: `$${Math.round(totalPayment).toLocaleString("es-MX")}` },
                      { label: "Interés total", value: `$${Math.round(totalInterest).toLocaleString("es-MX")}` },
                      { label: "Tasa anual (fija)", value: `${RATE}%` },
                      { label: "CAT promedio", value: `${cat.toFixed(1)}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{label}</span>
                        <span className="font-medium text-zinc-200 tabular-nums">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Info */}
              <motion.div variants={item} className="flex items-start gap-2 px-1">
                <Info size={14} className="text-zinc-600 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Esta simulación es informativa. La oferta definitiva está sujeta a evaluación crediticia.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div variants={item}>
                <Button className="w-full" size="lg" onClick={() => setStage("review")}>
                  Solicitar este crédito <ChevronRight size={16} />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Review */}
          {stage === "review" && (
            <motion.div
              key="review"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              <motion.div variants={item}>
                <Card className="p-6 space-y-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Resumen de tu solicitud</p>
                  {[
                    { label: "Monto solicitado", value: `$${amount.toLocaleString("es-MX")} MXN` },
                    { label: "Plazo elegido", value: `${months} meses` },
                    { label: "Pago mensual", value: `$${Math.round(monthly).toLocaleString("es-MX")} MXN` },
                    { label: "Total a pagar", value: `$${Math.round(totalPayment).toLocaleString("es-MX")} MXN` },
                    { label: "Tasa anual", value: `${RATE}%` },
                  ].map(({ label, value }, i) => (
                    <div key={label}>
                      {i > 0 && <Separator />}
                      <div className={cn("flex justify-between text-sm", i > 0 && "pt-4")}>
                        <span className="text-zinc-400">{label}</span>
                        <span className="font-semibold text-zinc-50">{value}</span>
                      </div>
                    </div>
                  ))}
                </Card>
              </motion.div>

              <motion.div variants={item} className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStage("simulate")}>
                  <ArrowLeft size={14} /> Modificar
                </Button>
                <Button className="flex-1" onClick={() => setStage("confirmed")}>
                  Confirmar <ChevronRight size={16} />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Confirmed */}
          {stage === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="space-y-4"
            >
              <Card className="p-8 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-5"
                >
                  <Check className="text-emerald-400" size={22} strokeWidth={2.5} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-2">Solicitud enviada</p>
                  <p className="text-4xl font-semibold tabular-nums mb-1">
                    $<AnimatedNumber value={monthly} />
                    <span className="text-xl font-normal text-zinc-400">/mes</span>
                  </p>
                  <p className="text-sm text-zinc-500">{months} pagos · ${amount.toLocaleString("es-MX")} MXN</p>
                </motion.div>
              </Card>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button variant="outline" className="w-full" onClick={() => setStage("simulate")}>
                  Nueva simulación
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```
