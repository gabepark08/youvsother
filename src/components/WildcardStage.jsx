import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar";
import MoneyValue, { formatMoney } from "./MoneyValue";

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
  return `${delta > 0 ? "+" : ""}${formatMoney(delta).replace("$", "$")}`;
}

// Full-screen no-choice event. One button applies fixed effects to both
// timelines; the wildcard is not supposed to feel fair.
export default function WildcardStage({ wildcard, you, other, onContinue }) {
  const [absorbed, setAbsorbed] = useState(false);
  const [flash, setFlash] = useState(0);

  const absorb = useCallback(() => {
    if (absorbed) return;
    setAbsorbed(true);
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

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-6 text-center">
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

        <div className="mt-8 flex h-14 items-center">
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

      <HazardBar />
    </motion.div>
  );
}
