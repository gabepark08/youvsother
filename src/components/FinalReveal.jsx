import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import { formatMoney } from "./MoneyValue";
import { FAKE_LEADERBOARD, derivePersona } from "../data/stages";

const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";
const ACCENT = "#F5FF3D";

// Count from 0 -> value once, after an optional delay. Used for the dramatic
// net-worth reveal so the numbers "spin up" in front of the audience.
function CountUp({ value, duration = 1700, delay = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let rafId;
    let startedAt;
    const startTimer = setTimeout(() => {
      startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(value * eased);
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
    };
  }, [value, duration, delay]);

  return <>{formatMoney(display)}</>;
}

function Side({ identity, color, state, persona, isWinner, declared, delay }) {
  const beats = state.beats.slice(-5);
  return (
    <motion.div
      className="relative flex flex-1 flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <div className="font-heading text-2xl font-bold tracking-[0.2em] uppercase" style={{ color }}>
        {identity}
      </div>

      {/* persona title card — awarded from the choices this side made */}
      <motion.div
        className="flex w-full max-w-md flex-col items-center gap-1.5 border-2 px-4 py-3 text-center"
        style={{ borderColor: color, background: `${color}12` }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={declared ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
      >
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-text-secondary/70 uppercase">
          Your Type
        </span>
        <span className="font-heading text-2xl font-bold tracking-tight uppercase" style={{ color }}>
          {persona.title}
        </span>
        <span className="font-mono text-[11px] leading-relaxed text-text-primary/80">
          {persona.caption}
        </span>
      </motion.div>

      <motion.div
        className="relative rounded-sm"
        animate={
          isWinner && declared
            ? { boxShadow: `0 0 0px ${color}00, 0 0 46px ${color}88` }
            : { boxShadow: `0 0 0px ${color}00` }
        }
        transition={{ duration: 0.5 }}
      >
        <Avatar color={color} accessories={state.accessories} size={300} />
        <AnimatePresence>
          {isWinner && declared && (
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap border-2 px-3 py-1 font-heading text-[11px] font-bold tracking-[0.16em] uppercase"
              style={{ color: "#070812", background: ACCENT, borderColor: ACCENT }}
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
            >
              Bigger Number
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-2 flex items-center gap-3">
        <motion.div
          className="font-heading text-4xl font-bold text-text-primary md:text-5xl"
          animate={isWinner && declared ? { scale: [1, 1.12, 1], color: ["#F4F0E8", color, "#F4F0E8"] } : {}}
          transition={{ duration: 0.5 }}
        >
          <CountUp value={state.netWorth} delay={delay * 1000 + 250} />
        </motion.div>
      </div>

      <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase" style={{ color }}>
        {state.trait}
      </div>

      <div
        className="w-full max-w-md border bg-panel/40 px-5 py-4 text-left"
        style={{ borderColor: `${color}55` }}
      >
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color }}>
          The Life So Far
        </div>
        <ul className="mt-3 space-y-2">
          {beats.map((beat, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-text-primary/85">
              <span style={{ color }}>—</span>
              <span>{beat}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// Full-screen fight-card intro: avatars slam in from the sides and a big "VS"
// impacts in the middle. Auto-advances; skippable with Enter / Space / click.
function ClashIntro({ you, other, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2900);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onDone}
    >
      <motion.div
        className="font-mono text-xs font-bold tracking-[0.32em] text-accent uppercase"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Age 30 / The Meeting
      </motion.div>

      <div className="mt-8 flex w-full max-w-4xl items-center justify-center gap-4 px-6">
        <motion.div
          initial={{ x: "-70vw", opacity: 0, rotate: -8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.15 }}
        >
          <Avatar color={YOU_COLOR} accessories={you.accessories} size={220} />
        </motion.div>

        <motion.div
          className="relative font-heading text-7xl font-bold tracking-tight md:text-8xl"
          style={{ color: ACCENT }}
          initial={{ scale: 4, opacity: 0, rotate: -12 }}
          animate={{ scale: [4, 0.85, 1.08, 1], opacity: 1, rotate: [-12, 4, -2, 0] }}
          transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
        >
          VS
        </motion.div>

        <motion.div
          initial={{ x: "70vw", opacity: 0, rotate: 8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.15 }}
        >
          <Avatar color={OTHER_COLOR} accessories={other.accessories} size={220} />
        </motion.div>
      </div>

      <motion.div
        className="mt-10 flex items-center gap-6 font-heading text-lg font-bold tracking-[0.18em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <span style={{ color: YOU_COLOR }}>You</span>
        <span className="text-text-secondary/50">kept going</span>
        <span style={{ color: OTHER_COLOR }}>Other You</span>
      </motion.div>

      <motion.div
        className="absolute bottom-10 font-mono text-[10px] tracking-[0.2em] text-text-secondary/50 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1] }}
        transition={{ delay: 1.8, duration: 1.4, repeat: Infinity }}
      >
        Press Enter to reveal
      </motion.div>
    </motion.div>
  );
}

export default function FinalReveal({ you, other }) {
  const [phase, setPhase] = useState("clash"); // clash | result
  const [declared, setDeclared] = useState(false);
  const shakeControls = useRef(null);

  const youPersona = derivePersona(you.accessories);
  const otherPersona = derivePersona(other.accessories);

  const gap = Math.abs(you.netWorth - other.netWorth);
  const youBigger = you.netWorth > other.netWorth;
  const otherBigger = other.netWorth > you.netWorth;
  const denom = Math.max(Math.abs(you.netWorth), Math.abs(other.netWorth), 1);
  const isClose = gap / denom < 0.1;

  // Skip the clash intro with keyboard.
  useEffect(() => {
    function onKeyDown(e) {
      if (phase === "clash" && (e.key === "Enter" || e.key === " ")) setPhase("result");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  // After numbers finish counting up, "declare" the winner (crown + shake).
  useEffect(() => {
    if (phase !== "result") return undefined;
    const timer = setTimeout(() => setDeclared(true), 2350);
    return () => clearTimeout(timer);
  }, [phase]);

  let closingLine;
  if (isClose) {
    closingLine = "Two lives. Similar numbers. Completely different damage.";
  } else if (youBigger) {
    closingLine = "You did not choose the correct life. You chose the one with the bigger receipt.";
  } else {
    closingLine = "The Other You made more money. Annoying. Not automatically better.";
  }

  // Joke leaderboard "winners" — deterministic but meaningless.
  const richer = youBigger ? "YOU" : "OTHER YOU";
  const poorer = youBigger ? "OTHER YOU" : "YOU";
  const biggerStack = you.accessories.length >= other.accessories.length ? "YOU" : "OTHER YOU";
  const leaderboardWinners = [
    poorer,
    biggerStack,
    youBigger ? "OTHER YOU" : "YOU",
    formatMoney(gap),
    richer,
  ];

  return (
    <>
      <AnimatePresence>
        {phase === "clash" && (
          <ClashIntro you={you} other={other} onDone={() => setPhase("result")} />
        )}
      </AnimatePresence>

      {phase === "result" && (
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center gap-8 px-8 py-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="font-mono text-sm font-bold tracking-[0.28em] text-accent uppercase">
              Age 30 / The Meeting
            </div>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-text-primary md:text-4xl">
              Two versions of you kept going. Neither asked permission. Now they meet.
            </h2>
          </motion.div>

          {/* winner reveal shake wraps the head-to-head comparison */}
          <motion.div
            ref={shakeControls}
            className="flex w-full items-start justify-center gap-10"
            animate={declared ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Side
              identity="You"
              color={YOU_COLOR}
              state={you}
              persona={youPersona}
              isWinner={youBigger}
              declared={declared}
              delay={0.2}
            />

            <div className="flex w-px shrink-0 flex-col items-center self-stretch">
              <div className="h-full w-px bg-[#F4F0E8]/15" />
            </div>

            <Side
              identity="Other You"
              color={OTHER_COLOR}
              state={other}
              persona={otherPersona}
              isWinner={otherBigger}
              declared={declared}
              delay={0.35}
            />
          </motion.div>

          {/* gap + warning */}
          <motion.div
            className="flex flex-col items-center gap-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-text-secondary uppercase">
              The Gap
            </div>
            <motion.div
              className="font-heading text-3xl font-bold text-accent"
              animate={declared ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <CountUp value={gap} delay={900} />
            </motion.div>
            <div className="font-mono text-[12px] tracking-wide text-text-secondary">
              Bigger number does not mean cleaner life.
            </div>
          </motion.div>

          {/* fake leaderboard */}
          <motion.div
            className="w-full max-w-2xl border-2 border-[#F4F0E8]/15 bg-panel/50 p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <div className="flex items-center justify-between font-mono text-xs font-bold tracking-[0.2em] uppercase">
              <span className="text-accent">Fake Leaderboard</span>
              <span className="text-text-secondary/60">// No one asked</span>
            </div>
            <ul className="mt-4 divide-y divide-[#F4F0E8]/10">
              {FAKE_LEADERBOARD.map((row, i) => (
                <li key={row} className="flex items-center justify-between py-2.5 font-mono text-[13px]">
                  <span className="text-text-primary/85">
                    <span className="mr-3 text-text-secondary/60">{i + 1}.</span>
                    {row}
                  </span>
                  <span
                    className="border px-2 py-0.5 text-[10px] font-bold tracking-[0.12em]"
                    style={{
                      color: leaderboardWinners[i] === "YOU" ? YOU_COLOR : leaderboardWinners[i] === "OTHER YOU" ? OTHER_COLOR : ACCENT,
                      borderColor: leaderboardWinners[i] === "YOU" ? YOU_COLOR : leaderboardWinners[i] === "OTHER YOU" ? OTHER_COLOR : ACCENT,
                    }}
                  >
                    {leaderboardWinners[i]}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* closing */}
          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="max-w-2xl font-heading text-xl font-bold leading-snug text-text-primary md:text-2xl">
              {closingLine}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 border-2 border-[#F4F0E8]/40 px-6 py-3 font-heading text-sm font-bold tracking-[0.18em] text-text-primary uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Refresh to run the timeline again
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
