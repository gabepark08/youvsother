import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { formatMoney } from "./MoneyValue";
import { FAKE_LEADERBOARD } from "../data/stages";

const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";

function Side({ identity, color, state, isBigger, delay }) {
  const beats = state.beats.slice(-5);
  return (
    <motion.div
      className="flex flex-1 flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <div className="font-heading text-2xl font-bold tracking-[0.2em] uppercase" style={{ color }}>
        {identity}
      </div>

      <Avatar color={color} accessories={state.accessories} size={320} />

      <div className="mt-2 flex items-center gap-3">
        <div className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
          {formatMoney(state.netWorth)}
        </div>
        {isBigger && (
          <motion.span
            className="border border-accent bg-accent px-2 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-bg"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            BIGGER NUMBER
          </motion.span>
        )}
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

export default function FinalReveal({ you, other }) {
  const gap = Math.abs(you.netWorth - other.netWorth);
  const youBigger = you.netWorth > other.netWorth;
  const otherBigger = other.netWorth > you.netWorth;
  const denom = Math.max(Math.abs(you.netWorth), Math.abs(other.netWorth), 1);
  const isClose = gap / denom < 0.1;

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

      <div className="flex w-full items-start justify-center gap-10">
        <Side identity="You" color={YOU_COLOR} state={you} isBigger={youBigger} delay={0.2} />

        <div className="flex w-px shrink-0 flex-col items-center self-stretch">
          <div className="h-full w-px bg-[#F4F0E8]/15" />
        </div>

        <Side identity="Other You" color={OTHER_COLOR} state={other} isBigger={otherBigger} delay={0.35} />
      </div>

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
        <div className="font-heading text-3xl font-bold text-accent">{formatMoney(gap)}</div>
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
                  color: leaderboardWinners[i] === "YOU" ? YOU_COLOR : leaderboardWinners[i] === "OTHER YOU" ? OTHER_COLOR : "#F5FF3D",
                  borderColor: leaderboardWinners[i] === "YOU" ? YOU_COLOR : leaderboardWinners[i] === "OTHER YOU" ? OTHER_COLOR : "#F5FF3D",
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
  );
}
