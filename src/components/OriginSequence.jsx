import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// The birth → split intro. Grows a single purple figure from age 1 to 16, then
// splits it into YOU (cyan) and OTHER YOU (magenta) and hands control to the
// game engine via onComplete().

const WIDTH = 160;
const HEIGHT = 220;
const CX = 80;
const BASELINE = 190;

const GROWTH_DURATION = 5.5;
const AGES = Array.from({ length: 16 }, (_, i) => i + 1);

const PURPLE = "#B24BF3";
const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";

const CONTROL_AGES = [1, 4, 8, 12, 16];
const CONTROL_RAW = [
  { head: { w: 32, h: 30 }, torso: { w: 24, h: 16 }, arm: { w: 5, h: 6 }, leg: { w: 6, h: 7 }, limbOpacity: 0.12 },
  { head: { w: 30, h: 28 }, torso: { w: 32, h: 30 }, arm: { w: 8, h: 20 }, leg: { w: 11, h: 22 }, limbOpacity: 1 },
  { head: { w: 26, h: 26 }, torso: { w: 34, h: 42 }, arm: { w: 8, h: 34 }, leg: { w: 12, h: 42 }, limbOpacity: 1 },
  { head: { w: 24, h: 25 }, torso: { w: 35, h: 48 }, arm: { w: 8, h: 40 }, leg: { w: 12.5, h: 50 }, limbOpacity: 1 },
  { head: { w: 22, h: 24 }, torso: { w: 36, h: 54 }, arm: { w: 8, h: 46 }, leg: { w: 13, h: 58 }, limbOpacity: 1 },
];

const STAGE_TIMES = AGES.map((_, i) => i / (AGES.length - 1));
const SPLIT_MIDDLE_WIDTH = 420;
const SPLIT_DURATION = 0.9;
const DOTS = [0, 1, 2];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rawForAge(age) {
  for (let i = 0; i < CONTROL_AGES.length - 1; i++) {
    const a0 = CONTROL_AGES[i];
    const a1 = CONTROL_AGES[i + 1];
    if (age >= a0 && age <= a1) {
      const t = (age - a0) / (a1 - a0);
      const s0 = CONTROL_RAW[i];
      const s1 = CONTROL_RAW[i + 1];
      return {
        head: { w: lerp(s0.head.w, s1.head.w, t), h: lerp(s0.head.h, s1.head.h, t) },
        torso: { w: lerp(s0.torso.w, s1.torso.w, t), h: lerp(s0.torso.h, s1.torso.h, t) },
        arm: { w: lerp(s0.arm.w, s1.arm.w, t), h: lerp(s0.arm.h, s1.arm.h, t) },
        leg: { w: lerp(s0.leg.w, s1.leg.w, t), h: lerp(s0.leg.h, s1.leg.h, t) },
        limbOpacity: lerp(s0.limbOpacity, s1.limbOpacity, t),
      };
    }
  }
  return CONTROL_RAW[CONTROL_RAW.length - 1];
}

function computeStage(s) {
  const legY = BASELINE - s.leg.h;
  const torsoY = legY - s.torso.h;
  const headY = torsoY - s.head.h;
  const armY = torsoY;
  return {
    head: { x: CX - s.head.w / 2, y: headY, width: s.head.w, height: s.head.h, opacity: 1 },
    torso: { x: CX - s.torso.w / 2, y: torsoY, width: s.torso.w, height: s.torso.h, opacity: 1 },
    legL: { x: CX - s.leg.w - 2, y: legY, width: s.leg.w, height: s.leg.h, opacity: s.limbOpacity },
    legR: { x: CX + 2, y: legY, width: s.leg.w, height: s.leg.h, opacity: s.limbOpacity },
    armL: { x: CX - s.torso.w / 2 - s.arm.w - 2, y: armY, width: s.arm.w, height: s.arm.h, opacity: s.limbOpacity },
    armR: { x: CX + s.torso.w / 2 + 2, y: armY, width: s.arm.w, height: s.arm.h, opacity: s.limbOpacity },
  };
}

const STAGES = AGES.map((age) => computeStage(rawForAge(age)));
const FINAL_STAGE = STAGES[STAGES.length - 1];

function seq(part, prop) {
  return STAGES.map((s) => s[part][prop]);
}

function partAnimate(part) {
  return {
    x: seq(part, "x"),
    y: seq(part, "y"),
    width: seq(part, "width"),
    height: seq(part, "height"),
    opacity: seq(part, "opacity"),
  };
}

const partTransition = { duration: GROWTH_DURATION, times: STAGE_TIMES, ease: "easeInOut" };

function stageViewBox(stage) {
  const parts = Object.values(stage);
  const minX = Math.min(...parts.map((p) => p.x));
  const minY = Math.min(...parts.map((p) => p.y));
  const maxX = Math.max(...parts.map((p) => p.x + p.width));
  const maxY = Math.max(...parts.map((p) => p.y + p.height));
  const pad = 8;
  return { value: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}` };
}

const FINAL_VIEWBOX = stageViewBox(FINAL_STAGE);

// Split avatar with a stroke that morphs from PURPLE to its identity colour.
function SplitAvatar({ color, colorized }) {
  const stroke = colorized ? color : PURPLE;
  const t = { duration: SPLIT_DURATION, ease: "easeInOut" };
  return (
    <svg viewBox={FINAL_VIEWBOX.value} shapeRendering="crispEdges" className="h-[300px] w-auto overflow-visible">
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.legL} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.legR} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.armL} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.armR} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.torso} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={t} {...FINAL_STAGE.head} />
    </svg>
  );
}

export default function OriginSequence({ onComplete }) {
  const [phase, setPhase] = useState("growing"); // growing | split | settled
  const [splitExpanded, setSplitExpanded] = useState(false);
  const [displayAge, setDisplayAge] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(id);
  }, []);

  // Tick the age counter through the growth, then drive the split. This is
  // timer-based (not tied to the animation's onComplete callback) so a
  // backgrounded tab — where rAF-driven animations pause — can never get the
  // intro stuck; it always advances to the game.
  useEffect(() => {
    let age = 1;
    const timeouts = [];
    const scheduleNext = (i) => {
      if (i >= AGES.length - 1) return;
      const stepMs = (STAGE_TIMES[i + 1] - STAGE_TIMES[i]) * GROWTH_DURATION * 1000;
      const id = setTimeout(() => {
        age += 1;
        setDisplayAge(age);
        scheduleNext(i + 1);
      }, stepMs);
      timeouts.push(id);
    };
    scheduleNext(0);

    // Once fully grown, hold a beat, then split → recolour → settle.
    timeouts.push(
      setTimeout(() => {
        setPhase("split");
        timeouts.push(
          setTimeout(() => {
            setSplitExpanded(true);
            timeouts.push(setTimeout(() => setPhase("settled"), SPLIT_DURATION * 1000 + 50));
          }, 320),
        );
      }, GROWTH_DURATION * 1000 + 650),
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Once settled, hold a beat, then hand off to the game engine.
  useEffect(() => {
    if (phase !== "settled" || !onComplete) return;
    const id = setTimeout(onComplete, 1300);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "growing" ? (
          <motion.div
            key="growing"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="flex shrink-0 flex-col items-center gap-4"
          >
            <div className="flex h-10 items-center justify-center">
              <AnimatePresence>
                {showWelcome && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-heading text-2xl font-bold tracking-[0.15em] text-text-primary uppercase md:text-3xl"
                  >
                    Welcome to Life
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} shapeRendering="crispEdges" className="h-[420px] w-auto">
              <motion.rect fill="#070812" stroke={PURPLE} strokeWidth="3" animate={partAnimate("legL")} transition={partTransition} />
              <motion.rect fill="#070812" stroke={PURPLE} strokeWidth="3" animate={partAnimate("legR")} transition={partTransition} />
              <motion.rect fill="#070812" stroke={PURPLE} strokeWidth="3" animate={partAnimate("armL")} transition={partTransition} />
              <motion.rect fill="#070812" stroke={PURPLE} strokeWidth="3" animate={partAnimate("armR")} transition={partTransition} />
              <motion.rect fill="#070812" stroke={PURPLE} strokeWidth="3" animate={partAnimate("torso")} transition={partTransition} />
              <motion.rect
                fill="#070812"
                stroke={PURPLE}
                strokeWidth="3"
                animate={partAnimate("head")}
                transition={partTransition}
              />
            </svg>

            <div className="flex h-12 flex-col items-center justify-start gap-2">
              <div className="flex items-center gap-1 font-mono text-xs tracking-[0.3em] text-text-secondary uppercase">
                Growing
                {DOTS.map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                  >
                    .
                  </motion.span>
                ))}
              </div>
              <div className="font-mono text-xs tracking-[0.3em] text-text-secondary uppercase">
                Age {displayAge}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="split" className="flex w-full flex-col items-center gap-6">
            <AnimatePresence>
              {phase === "settled" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="font-mono text-sm font-bold tracking-[0.28em] text-accent uppercase">
                    The First Fork
                  </div>
                  <p className="mt-2 font-heading text-xl font-bold text-text-primary">
                    Two versions of you. Both about to keep going.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center">
              <div className="flex flex-1 justify-end">
                <motion.div animate={{ x: splitExpanded ? "0%" : "60%" }} transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }} className="flex flex-col items-center gap-3">
                  <SplitAvatar color={YOU_COLOR} colorized={splitExpanded} />
                  {phase === "settled" && (
                    <div className="font-heading text-base font-bold tracking-[0.2em] text-you uppercase">You</div>
                  )}
                </motion.div>
              </div>

              <motion.div animate={{ width: splitExpanded ? SPLIT_MIDDLE_WIDTH : 0 }} transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }} className="shrink-0" />

              <div className="flex flex-1 justify-start">
                <motion.div animate={{ x: splitExpanded ? "0%" : "-60%" }} transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }} className="flex flex-col items-center gap-3">
                  <SplitAvatar color={OTHER_COLOR} colorized={splitExpanded} />
                  {phase === "settled" && (
                    <div className="font-heading text-base font-bold tracking-[0.2em] text-other uppercase">Other You</div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
