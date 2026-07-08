import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Fake percentages that always sum to ~100 and put the forced winner on top.
function makePercents(count, winnerIndex) {
  const base = Array.from({ length: count }, () => 12 + Math.random() * 18);
  if (winnerIndex != null) base[winnerIndex] += 45;
  const total = base.reduce((a, b) => a + b, 0);
  return base.map((v) => Math.round((v / total) * 100));
}

// Presenter-only fake room vote. Purely for live demos — no backend.
//   options: [{ id, title }]
//   onChoose(id): commit the winning option as the player's pick
//   onClose(): dismiss without choosing
export default function RoomVote({ options, onChoose, onClose }) {
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [percents, setPercents] = useState(() => makePercents(options.length, null));
  const winnerRef = useRef(null);
  winnerRef.current = winnerIndex;

  const forceWinner = useCallback(
    (index) => {
      setWinnerIndex(index);
      setPercents(makePercents(options.length, index));
    },
    [options.length],
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const idx = winnerRef.current;
        if (idx != null) onChoose(options[idx].id);
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) {
        e.preventDefault();
        forceWinner(n - 1);
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [options, onChoose, onClose, forceWinner]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/88 px-8 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-3xl">
        <div className="mb-2 flex items-center justify-between font-mono text-xs font-bold tracking-[0.24em] text-accent uppercase">
          <span>Room Vote // Presenter Mode</span>
          <span className="text-text-secondary">1–4 set winner · Enter confirm · Esc close</span>
        </div>

        <div className="flex flex-col gap-3 border-2 border-accent/60 bg-panel/80 p-6">
          {options.map((option, i) => {
            const isWinner = i === winnerIndex;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => forceWinner(i)}
                className="flex w-full items-center gap-4 text-left"
              >
                <span className="w-6 shrink-0 font-mono text-sm font-bold text-text-secondary">{option.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold tracking-wide text-text-primary uppercase">
                    <span className="truncate">{option.title}</span>
                    <span className="ml-3 shrink-0 tabular-nums" style={{ color: isWinner ? "#F5FF3D" : undefined }}>
                      {percents[i]}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-4 w-full overflow-hidden border border-[#F4F0E8]/20 bg-bg">
                    <motion.div
                      className="h-full"
                      style={{ background: isWinner ? "#F5FF3D" : "#3A3B52" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percents[i]}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
                {isWinner && (
                  <motion.span
                    className="shrink-0 border border-accent bg-accent px-2 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-bg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    ROOM PICK
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-center font-mono text-[11px] tracking-wide text-text-secondary">
          {winnerIndex == null
            ? "Press 1–4 to pick the room's winner."
            : "Press Enter to lock the room pick into YOU."}
        </div>
      </div>
    </motion.div>
  );
}
