import { motion, useReducedMotion } from "framer-motion";

const BARS = [
  { x: 6, h: 18, color: "var(--color-signal)" },
  { x: 26, h: 34, color: "var(--color-action)" },
  { x: 46, h: 24, color: "var(--color-signal)" },
  { x: 66, h: 42, color: "var(--color-action)" },
  { x: 86, h: 30, color: "var(--color-signal)" },
  { x: 106, h: 50, color: "var(--color-action)" },
];

export function LoadingState({ label = "Loading market data" }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex-1 min-h-0 flex flex-col items-center justify-center gap-5"
    >
      <svg width="132" height="72" viewBox="0 0 132 72" aria-hidden="true">
        {/* baseline */}
        <line
          x1="0"
          y1="64"
          x2="132"
          y2="64"
          stroke="var(--color-card-border)"
          strokeWidth="2"
        />

        {/* bars */}
        {BARS.map((bar, i) => (
          <motion.rect
            key={i}
            x={bar.x}
            y={64 - bar.h}
            width="16"
            height={bar.h}
            rx="3"
            fill={bar.color}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            initial={{ scaleY: 0.25, opacity: 0.6 }}
            animate={
              reduceMotion
                ? { scaleY: 1, opacity: 1 }
                : { scaleY: [0.25, 1, 0.25], opacity: [0.6, 1, 0.6] }
            }
            transition={{
              duration: 1.4,
              delay: i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      <p className="text-ice/60 text-sm sm:text-base tracking-wide">
        {label}
        {!reduceMotion && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            …
          </motion.span>
        )}
      </p>
    </div>
  );
}