import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatMoney } from "./MoneyValue";

const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";
const GAIN = "#37FF8B";
const LOSS = "#FF4D6D";

// Count a delta up from 0 to its final value on mount, so each round's money
// swing lands as a slot-machine style reveal.
function DeltaCounter({ delta, duration = 850 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (delta === 0) {
      setVal(0);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setVal(delta * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delta, duration]);

  const rounded = Math.round(val);
  const sign = delta > 0 ? "+" : delta < 0 ? "-" : "";
  const color = delta > 0 ? GAIN : delta < 0 ? LOSS : "#F4F0E8";
  return (
    <span style={{ color }}>
      {delta === 0 ? "NO CHANGE" : `${sign}${formatMoney(Math.abs(rounded))}`}
    </span>
  );
}

// Shown once a round resolves (both YOU and OTHER YOU have an outcome). Reveals
// the money swing for each side, who pulled ahead this round, and the running
// rounds-won scoreboard + overall leader — so stakes exist every single stage.
export default function RoundVerdict({ youDelta, otherDelta, youTotal, otherTotal, priorWins }) {
  const roundWinner = youDelta > otherDelta ? "you" : otherDelta > youDelta ? "other" : "tie";

  const youWins = priorWins.you + (roundWinner === "you" ? 1 : 0);
  const otherWins = priorWins.other + (roundWinner === "other" ? 1 : 0);

  const gap = Math.abs(youTotal - otherTotal);
  const leader = youTotal > otherTotal ? "you" : otherTotal > youTotal ? "other" : "tie";

  let headline;
  let headlineColor = "#F5FF3D";
  if (roundWinner === "you") {
    headline = "YOU PULLED AHEAD THIS ROUND";
    headlineColor = YOU_COLOR;
  } else if (roundWinner === "other") {
    headline = "OTHER YOU PULLED AHEAD THIS ROUND";
    headlineColor = OTHER_COLOR;
  } else {
    headline = "DEAD HEAT THIS ROUND";
  }

  const leaderLine =
    leader === "tie"
      ? "OVERALL: DEAD EVEN"
      : `OVERALL LEADER: ${leader === "you" ? "YOU" : "OTHER YOU"} BY ${formatMoney(gap)}`;
  const leaderColor = leader === "you" ? YOU_COLOR : leader === "other" ? OTHER_COLOR : "#F4F0E8";

  return (
    <motion.div
      className="w-full max-w-[760px] border-2 border-[#F4F0E8]/20 bg-panel/70"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* money swing row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <div className="text-left">
          <div className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: YOU_COLOR }}>
            You
          </div>
          <div className="mt-1 font-heading text-2xl font-bold">
            <DeltaCounter delta={youDelta} />
          </div>
        </div>

        <div className="font-heading text-lg font-bold text-text-secondary/50">VS</div>

        <div className="text-right">
          <div className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: OTHER_COLOR }}>
            Other You
          </div>
          <div className="mt-1 font-heading text-2xl font-bold">
            <DeltaCounter delta={otherDelta} />
          </div>
        </div>
      </div>

      {/* verdict headline */}
      <motion.div
        className="border-t border-[#F4F0E8]/12 px-6 py-2.5 text-center font-heading text-sm font-bold tracking-[0.16em] uppercase"
        style={{ color: headlineColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.35 }}
      >
        {headline}
      </motion.div>

      {/* running scoreboard */}
      <motion.div
        className="flex items-center justify-between gap-4 border-t border-[#F4F0E8]/12 bg-bg/40 px-6 py-3 font-mono text-xs font-bold uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.35 }}
      >
        <span className="flex items-center gap-2 tracking-[0.12em]">
          <span style={{ color: YOU_COLOR }}>YOU {youWins}</span>
          <span className="text-text-secondary/40">—</span>
          <span style={{ color: OTHER_COLOR }}>{otherWins} OTHER YOU</span>
          <span className="text-text-secondary/40">// rounds won</span>
        </span>
        <span className="tracking-[0.12em]" style={{ color: leaderColor }}>
          {leaderLine}
        </span>
      </motion.div>
    </motion.div>
  );
}
