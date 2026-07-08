import { AnimatePresence, motion } from "framer-motion";

function Pill({ children, tone }) {
  const className =
    tone === "pro"
      ? "border-pros/45 bg-pros/10 text-pros"
      : "border-costs/45 bg-costs/12 text-costs";
  return (
    <span className={`inline-flex border px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] ${className}`}>
      {children}
    </span>
  );
}

// status: "idle" | "you" | "other" | "cycling" | "dim"
export default function OptionCard({ option, status, onSelect, disabled }) {
  const isYou = status === "you";
  const isOther = status === "other";
  const isCycling = status === "cycling";
  const isDim = status === "dim";

  const borderClass = isYou
    ? "border-you bg-you/10"
    : isOther || isCycling
      ? "border-other bg-other/10"
      : "border-[#F4F0E8]/20 bg-card";

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.id)}
      disabled={disabled}
      className={`relative flex min-h-[228px] flex-col items-start border-2 px-5 py-4 text-left uppercase transition-opacity ${borderClass} ${isDim ? "opacity-35" : "opacity-100"}`}
      whileHover={!disabled ? { y: -4, borderColor: "rgba(244,240,232,0.5)" } : undefined}
      animate={
        isYou
          ? { scale: [1, 1.025, 1], boxShadow: "0 0 22px rgba(0,229,255,0.18)" }
          : isOther
            ? { scale: [1, 1.025, 1], boxShadow: "0 0 22px rgba(255,46,136,0.18)" }
            : isCycling
              ? { x: [0, -2, 2, 0], opacity: [1, 0.72, 1] }
              : { scale: 1, x: 0 }
      }
      transition={{ duration: isCycling ? 0.16 : 0.35, ease: "easeOut" }}
    >
      <div className="flex w-full items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-you font-mono text-base font-bold text-you">
          {option.id}
        </div>
        <div className="min-w-0">
          <div className="font-heading text-xl font-bold leading-tight text-text-primary">
            {option.title}
          </div>
          <p className="mt-2.5 font-mono text-[13px] leading-relaxed normal-case text-text-secondary">
            {option.body}
          </p>
        </div>
      </div>

      <div className="mt-auto w-full border-t border-[#F4F0E8]/15 pt-3">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-pros">PROS</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {option.pros.map((pro) => (
            <Pill key={pro} tone="pro">+ {pro}</Pill>
          ))}
        </div>

        <div className="mt-3 font-mono text-[10px] font-bold tracking-[0.2em] text-costs">COSTS</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {option.costs.map((cost) => (
            <Pill key={cost} tone="cost">- {cost}</Pill>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isCycling && (
          <motion.div
            className="absolute right-3 top-3 border border-other bg-bg px-2 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-other"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 1, 0.45, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            OTHER YOU?
          </motion.div>
        )}
        {isYou && (
          <motion.div
            className="absolute right-3 top-3 border border-you bg-bg px-2 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-you"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            LOCKED INTO YOU
          </motion.div>
        )}
        {isOther && (
          <motion.div
            className="absolute right-3 top-3 border border-other bg-bg px-2 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-other"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            OTHER YOU KEPT GOING
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
