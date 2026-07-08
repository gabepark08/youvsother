import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar";
import MoneyValue, { formatMoney } from "./MoneyValue";
import RoundVerdict from "./RoundVerdict";
import StageProgress from "./StageProgress";
import { playWildcard } from "../lib/sfx";

const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";
const YELLOW = "#F5FF3D";

function HazardBar() {
  return (
    <div
      className="h-4 w-full"
      style={{
        background:
          "repeating-linear-gradient(45deg, #F5FF3D 0 22px, #070812 22px 44px)",
      }}
    />
  );
}

function deltaLabel(delta) {
  if (delta === 0) return "NO CHANGE";
  // formatMoney already prefixes "-" for negatives; add "+" for gains.
  return `${delta > 0 ? "+" : ""}${formatMoney(delta)}`;
}

// Full-screen no-choice event. One button applies fixed effects to both
// timelines; the wildcard is not supposed to feel fair.
export default function WildcardStage({ wildcard, stepIndex, you, other, roundsWon = { you: 0, other: 0 }, onContinue }) {
  const [absorbed, setAbsorbed] = useState(false);
  const [flash, setFlash] = useState(0);

  const absorb = useCallback(() => {
    if (absorbed) return;
    setAbsorbed(true);
    playWildcard();
    // camera-flash / shock burst
    let count = 0;
    const id = setInterval(() => {
      count += 1;
      setFlash((f) => f + 1);
      if (count >= 3) clearInterval(id);
    }, 130);
  }, [absorbed]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!absorbed && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        absorb();
      } else if (absorbed && e.key === "Enter") {
        onContinue();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [absorbed, absorb, onContinue]);

  const paragraphs = wildcard.prompt.split("\n\n");

  const sides = [
    { key: "you", label: "You", color: YOU_COLOR, base: you, effect: wildcard.you },
    { key: "other", label: "Other You", color: OTHER_COLOR, base: other, effect: wildcard.other },
  ];

  // Reconstruct the lead-tax arithmetic so the banner visibly ADDS UP:
  // the leader's shown delta is (base − swing), the trailer's is (base + boost).
  const rb = wildcard.rubberBand;
  const leadTax = rb
    ? {
        leaderLabel: rb.leaderKey === "you" ? "You" : "Other You",
        leaderColor: rb.leaderKey === "you" ? YOU_COLOR : OTHER_COLOR,
        trailerLabel: rb.trailerKey === "you" ? "You" : "Other You",
        trailerColor: rb.trailerKey === "you" ? YOU_COLOR : OTHER_COLOR,
        swing: rb.swing,
        boost: rb.boost,
        leaderNet: wildcard[rb.leaderKey].netWorthDelta,
        leaderBase: wildcard[rb.leaderKey].netWorthDelta + rb.swing,
        trailerNet: wildcard[rb.trailerKey].netWorthDelta,
      }
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* camera-flash overlay */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={flash}
            className="pointer-events-none absolute inset-0 z-50"
            style={{ background: wildcard.mood === "flash" ? "#FFFFFF" : YELLOW }}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <HazardBar />

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center px-8 py-6 text-center">
        <div className="mb-5 w-full">
          <StageProgress stepIndex={stepIndex} />
        </div>
        <motion.div
          className="mb-2 font-mono text-xs font-bold tracking-[0.3em] uppercase"
          style={{ color: YELLOW }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          {wildcard.mood === "flash" ? "// Highlight Reel Incoming" : "// Yellow Flag // Safety Car"}
        </motion.div>

        <h2 className="font-heading text-4xl font-bold tracking-tight text-text-primary uppercase md:text-5xl">
          {wildcard.label}
        </h2>

        <div className="mt-5 max-w-2xl space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-text-secondary md:text-lg">
              {p}
            </p>
          ))}
        </div>

        {/* two timelines */}
        <div className="mt-8 flex items-start justify-center gap-16">
          {sides.map((side) => {
            const netWorth = absorbed ? side.base.netWorth + side.effect.netWorthDelta : side.base.netWorth;
            const accessories = absorbed
              ? [...side.base.accessories, side.effect.item]
              : side.base.accessories;
            return (
              <div key={side.key} className="flex w-[280px] flex-col items-center gap-2">
                <div className="font-heading text-sm font-bold tracking-[0.2em] uppercase" style={{ color: side.color }}>
                  {side.label}
                </div>
                <Avatar
                  color={side.color}
                  accessories={accessories}
                  newlyAddedAccessory={absorbed ? side.effect.item : undefined}
                  isGlitching={absorbed}
                  size={190}
                />
                <div className="font-mono text-lg font-bold text-text-primary">
                  <MoneyValue value={netWorth} />
                </div>
                <AnimatePresence>
                  {absorbed && (
                    <motion.div
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
                    >
                      <span
                        className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase"
                        style={{ color: side.effect.netWorthDelta < 0 ? "#FF4D6D" : side.effect.netWorthDelta > 0 ? "#37FF8B" : side.color }}
                      >
                        {deltaLabel(side.effect.netWorthDelta)}
                      </span>
                      <span className="font-mono text-[11px] font-bold tracking-wide uppercase" style={{ color: side.color }}>
                        {side.effect.trait}
                      </span>
                      <p className="max-w-[240px] text-[13px] leading-relaxed text-text-primary/80">
                        {side.effect.beat}
                      </p>
                      <span className="font-mono text-[10px] font-bold tracking-[0.12em]" style={{ color: side.color }}>
                        Gained: {side.effect.itemLabel}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {absorbed && wildcard.rubberBand && (
            <motion.div
              className="mt-7 flex max-w-xl flex-col items-center gap-1 border-2 px-5 py-3 text-center"
              style={{ borderColor: YELLOW, background: "rgba(245,255,61,0.06)" }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.55, ease: "backOut" }}
            >
              <span className="font-heading text-sm font-bold tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
                // Lead Tax
              </span>
              <p className="font-mono text-[13px] leading-relaxed text-text-primary">
                Running in front paints a target on you.
              </p>
              <p className="mt-1 font-mono text-[13px] leading-relaxed text-text-primary">
                <span className="font-bold" style={{ color: leadTax.leaderColor }}>
                  {leadTax.leaderLabel}
                </span>{" "}
                {leadTax.leaderLabel === "You" ? "were" : "was"} set for{" "}
                <span className="font-bold">{deltaLabel(leadTax.leaderBase)}</span>, but leading skimmed{" "}
                <span className="font-bold" style={{ color: "#FF4D6D" }}>
                  -{formatMoney(leadTax.swing)}
                </span>{" "}
                &rarr; <span className="font-bold">{deltaLabel(leadTax.leaderNet)}</span>.
              </p>
              <p className="mt-1 font-mono text-[13px] leading-relaxed text-text-primary">
                <span className="font-bold" style={{ color: leadTax.trailerColor }}>
                  {leadTax.trailerLabel}
                </span>{" "}
                clawed back{" "}
                <span className="font-bold" style={{ color: "#37FF8B" }}>
                  +{formatMoney(leadTax.boost)}
                </span>{" "}
                &rarr; <span className="font-bold">{deltaLabel(leadTax.trailerNet)}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {absorbed && (
            <motion.div
              className="mt-8 flex w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <RoundVerdict
                youDelta={wildcard.you.netWorthDelta}
                otherDelta={wildcard.other.netWorthDelta}
                youTotal={you.netWorth + wildcard.you.netWorthDelta}
                otherTotal={other.netWorth + wildcard.other.netWorthDelta}
                priorWins={roundsWon}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex h-14 items-center">
          {!absorbed ? (
            <motion.button
              type="button"
              onClick={absorb}
              className="border-4 border-bg px-8 py-4 font-heading text-lg font-bold tracking-[0.16em] uppercase"
              style={{ background: YELLOW, color: "#070812" }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 26px rgba(245,255,61,0.5)" }}
              whileTap={{ scale: 0.97 }}
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ opacity: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } }}
            >
              {wildcard.button}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={onContinue}
              className="border-2 border-accent bg-accent px-6 py-3 font-heading text-sm font-bold tracking-[0.18em] text-bg uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
              whileHover={{ x: 4 }}
            >
              Continue &rarr;
            </motion.button>
          )}
        </div>
        </div>
      </div>

      <HazardBar />
    </motion.div>
  );
}
