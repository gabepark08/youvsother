import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WIDTH = 160;
const HEIGHT = 220;
const CX = 80;
const BASELINE = 190;

const GROWTH_DURATION = 5.5;
const AGES = Array.from({ length: 16 }, (_, i) => i + 1);

const PURPLE = "#B24BF3";
const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";
const STARTING_NET_WORTH = 0;

const OPTION_DATA = [
  {
    id: "A",
    title: "Charge from Day One",
    body: 'Sell the study pack for $3 and find out whether "good idea" actually means "I\'d pay for it".',
    pros: ["Proof", "First revenue", "Sales confidence"],
    costs: ["Awkward conversations", "People may judge you"],
    netWorthDelta: 1468,
    trait: "First proof",
    beat: "People still ask if you'll make another one.",
    item: "sneakers",
    itemLabel: "FIRST MONEY SHOES",
  },
  {
    id: "B",
    title: "Earn Trust First",
    body: "Drop it in the group chat for free and let everyone use it before you even think about money.",
    pros: ["Reputation", "Users", "Word of mouth"],
    costs: ["No revenue", "Weak boundaries"],
    netWorthDelta: -200,
    trait: "Loved, unpaid",
    beat: "Everyone used it. Nobody paid for it.",
    item: "heart",
    itemLabel: "LOVED, UNPAID",
  },
  {
    id: "C",
    title: "Protect the Year",
    body: "Keep it for your mates only and avoid turning school into your first customer acquisition channel.",
    pros: ["Loyalty", "Peace", "Normal teenage life"],
    costs: ["No proof", "Smaller ambition"],
    netWorthDelta: 0,
    trait: "Protected circle",
    beat: "You kept the peace and had a better year for it.",
    item: "sunglasses",
    itemLabel: "BEST YEAR DETECTED",
  },
  {
    id: "D",
    title: "Build the Vision First",
    body: "Make the name, logo, landing page, and pitch before selling anything.",
    pros: ["Vision", "Confidence", "Founder energy"],
    costs: ["No customers yet", "Reality check delayed"],
    netWorthDelta: -80,
    trait: "Pre-revenue vision",
    beat: "The idea looked funded before it existed.",
    item: "badge",
    itemLabel: "PRE-REVENUE CEO",
  },
];

const CONTROL_AGES = [1, 4, 8, 12, 16];
const CONTROL_RAW = [
  { head: { w: 32, h: 30 }, torso: { w: 24, h: 16 }, arm: { w: 5, h: 6 }, leg: { w: 6, h: 7 }, limbOpacity: 0.12 },
  { head: { w: 30, h: 28 }, torso: { w: 32, h: 30 }, arm: { w: 8, h: 20 }, leg: { w: 11, h: 22 }, limbOpacity: 1 },
  { head: { w: 26, h: 26 }, torso: { w: 34, h: 42 }, arm: { w: 8, h: 34 }, leg: { w: 12, h: 42 }, limbOpacity: 1 },
  { head: { w: 24, h: 25 }, torso: { w: 35, h: 48 }, arm: { w: 8, h: 40 }, leg: { w: 12.5, h: 50 }, limbOpacity: 1 },
  { head: { w: 22, h: 24 }, torso: { w: 36, h: 54 }, arm: { w: 8, h: 46 }, leg: { w: 13, h: 58 }, limbOpacity: 1 },
];

const STAGE_TIMES = AGES.map((_, i) => i / (AGES.length - 1));
const SPLIT_MIDDLE_WIDTH = 760;
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
const GROWING_SVG_HEIGHT = 420;

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

const partTransition = {
  duration: GROWTH_DURATION,
  times: STAGE_TIMES,
  ease: "easeInOut",
};

function stageViewBox(stage) {
  const parts = Object.values(stage);
  const minX = Math.min(...parts.map((part) => part.x));
  const minY = Math.min(...parts.map((part) => part.y));
  const maxX = Math.max(...parts.map((part) => part.x + part.width));
  const maxY = Math.max(...parts.map((part) => part.y + part.height));
  const pad = 8;
  return {
    value: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`,
    height: maxY - minY + pad * 2,
  };
}

const FINAL_VIEWBOX = stageViewBox(FINAL_STAGE);
const SPLIT_SVG_HEIGHT = (GROWING_SVG_HEIGHT * FINAL_VIEWBOX.height) / HEIGHT;

function formatMoney(value) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

function MoneyValue({ value }) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const start = displayRef.current;
    const difference = value - start;
    if (difference === 0) return;

    let rafId;
    const startedAt = performance.now();
    const duration = 650;

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = start + difference * eased;
      displayRef.current = nextValue;
      setDisplay(nextValue);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <>{formatMoney(display)}</>;
}

function AvatarAccessory({ item, color }) {
  return (
    <AnimatePresence mode="wait">
      {item === "sneakers" && (
        <motion.g
          key="sneakers"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: [0.7, 1.18, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <rect x={61} y={187} width={19} height={7} fill="#F4F0E8" stroke={color} strokeWidth="2" />
          <rect x={82} y={187} width={19} height={7} fill="#F4F0E8" stroke={color} strokeWidth="2" />
          <motion.path
            d="M 54 182 L 58 178 L 62 182 L 58 186 Z"
            fill="#F5FF3D"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.35] }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          />
        </motion.g>
      )}

      {item === "heart" && (
        <motion.path
          key="heart"
          d="M 80 129 C 75 123, 66 127, 70 136 C 73 143, 80 148, 80 148 C 80 148, 87 143, 90 136 C 94 127, 85 123, 80 129 Z"
          fill="#FF2E88"
          stroke="#F4F0E8"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: [0.4, 1.25, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}

      {item === "sunglasses" && (
        <motion.g
          key="sunglasses"
          initial={{ opacity: 0, x: -2 }}
          animate={{ opacity: [0, 1, 0.45, 1], x: [2, -2, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <rect x={67} y={101} width={11} height={5} fill="#070812" stroke={color} strokeWidth="1.5" />
          <rect x={82} y={101} width={11} height={5} fill="#070812" stroke={color} strokeWidth="1.5" />
          <line x1={78} y1={103.5} x2={82} y2={103.5} stroke={color} strokeWidth="1.5" />
        </motion.g>
      )}

      {item === "badge" && (
        <motion.g
          key="badge"
          initial={{ opacity: 0, rotate: -10, y: -4 }}
          animate={{ opacity: 1, rotate: [-10, 8, -3, 0], y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "80px 128px" }}
        >
          <path d="M 73 121 L 80 139 L 87 121" fill="none" stroke={color} strokeWidth="2" />
          <rect x={73} y={138} width={14} height={10} fill="#070812" stroke="#F5FF3D" strokeWidth="2" />
          <line x1={76} y1={142} x2={84} y2={142} stroke="#F5FF3D" strokeWidth="1.3" />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

// colorized=false renders the figure in undifferentiated PURPLE (pre-fork);
// flipping it true morphs the stroke to the identity colour over SPLIT_DURATION,
// which is what makes the merged figure read as splitting into YOU / OTHER YOU.
function Avatar({ color, item, colorized = true }) {
  const stroke = colorized ? color : PURPLE;
  const strokeTransition = { duration: SPLIT_DURATION, ease: "easeInOut" };
  return (
    <svg
      viewBox={FINAL_VIEWBOX.value}
      shapeRendering="crispEdges"
      className="w-auto overflow-visible"
      style={{ height: SPLIT_SVG_HEIGHT }}
    >
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.legL} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.legR} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.armL} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.armR} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.torso} />
      <motion.rect fill="#070812" strokeWidth="3" initial={false} animate={{ stroke }} transition={strokeTransition} {...FINAL_STAGE.head} />
      <AvatarAccessory item={item} color={color} />
    </svg>
  );
}

function AvatarPlatform({ color }) {
  return (
    <svg viewBox="0 0 220 70" className="-mt-8 h-[54px] w-[190px] overflow-visible" aria-hidden="true">
      <motion.ellipse
        cx="110"
        cy="35"
        rx="92"
        ry="24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <ellipse cx="110" cy="35" rx="70" ry="16" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M 38 35 H 182" stroke={color} strokeWidth="1" opacity="0.18" />
      <path d="M 110 11 V 59" stroke={color} strokeWidth="1" opacity="0.12" />
      <rect x="99" y="27" width="22" height="16" fill={color} opacity="0.08" />
    </svg>
  );
}

function AvatarPanel({ identity, color, option, fallbackBeat, colorized }) {
  const netWorth = option ? option.netWorthDelta : STARTING_NET_WORTH;
  const trait = option ? option.trait : "Unwritten";
  const beat = option ? option.beat : fallbackBeat;

  return (
    <div className="flex min-w-[190px] flex-col items-center gap-3 text-center">
      <div className="font-heading text-base font-bold tracking-[0.2em] uppercase" style={{ color }}>
        {identity}
      </div>
      <Avatar color={color} item={option?.item} colorized={colorized} />
      <AvatarPlatform color={color} />

      <div
        className="flex w-full flex-col items-start border bg-panel/40 px-5 py-4 text-left font-mono text-[10px] uppercase tracking-wider"
        style={{ borderColor: `${color}66` }}
      >
        <div style={{ color }}>Net Worth</div>
        <div className="mt-2 text-base font-bold text-text-primary">
          <MoneyValue value={netWorth} />
        </div>
        <div className="mt-4" style={{ color }}>Trait</div>
        <div className="mt-1 font-bold text-text-primary">{trait}</div>
        <div className="mt-4" style={{ color }}>Beat</div>
        <div className="mt-1 max-w-[170px] leading-relaxed text-text-primary/80">{beat}</div>

        <AnimatePresence>
          {option && (
            <motion.div
              key={option.itemLabel}
              className="mt-2 border-t border-[#F4F0E8]/10 pt-2 font-bold"
              style={{ color }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {identity} gained: {option.itemLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Pill({ children, tone }) {
  const className =
    tone === "pro"
      ? "border-accent/45 bg-accent/10 text-accent"
      : "border-[#FF6B8A]/45 bg-[#FF2E88]/10 text-[#FF9AB8]";

  return (
    <span className={`inline-flex border px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}

function OptionCard({ option, status, onSelect, disabled }) {
  const isYou = status === "you";
  const isOther = status === "other";
  const isCycling = status === "cycling";
  const isDim = status === "dim";

  const borderClass = isYou
    ? "border-you bg-you/10"
    : isOther || isCycling
      ? "border-other bg-other/10"
      : "border-[#F4F0E8]/20 bg-panel/60";

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.id)}
      disabled={disabled}
      className={`relative flex min-h-[230px] flex-col items-start border-2 px-5 py-4 text-left uppercase transition-opacity ${borderClass} ${isDim ? "opacity-35" : "opacity-100"}`}
      whileHover={!disabled ? { y: -4, borderColor: "rgba(244,240,232,0.5)" } : undefined}
      animate={
        isYou
          ? { scale: [1, 1.025, 1], boxShadow: "0 0 22px rgba(0,229,255,0.16)" }
          : isOther
            ? { scale: [1, 1.025, 1], boxShadow: "0 0 22px rgba(255,46,136,0.16)" }
            : isCycling
              ? { x: [0, -2, 2, 0], opacity: [1, 0.72, 1] }
              : { scale: 1, x: 0 }
      }
      transition={{ duration: isCycling ? 0.18 : 0.35, ease: "easeOut" }}
    >
      <div className="flex w-full items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-you font-mono text-base font-bold text-you">
          {option.id}
        </div>

        <div className="min-w-0">
          <div className="font-heading text-xl font-bold leading-tight text-text-primary">
            {option.title}
          </div>

          <p className="mt-3 font-mono text-[13px] leading-relaxed normal-case text-text-secondary">
            {option.body}
          </p>
        </div>
      </div>

      <div className="mt-auto w-full border-t border-[#F4F0E8]/15 pt-3">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#39FF6A]">PROS</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {option.pros.map((pro) => (
            <Pill key={pro} tone="pro">+ {pro}</Pill>
          ))}
        </div>

        <div className="mt-3 font-mono text-[10px] font-bold tracking-[0.2em] text-[#FF526B]">CONS</div>
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

export default function OriginSequence() {
  const [phase, setPhase] = useState("growing");
  const [splitExpanded, setSplitExpanded] = useState(false);
  const [displayAge, setDisplayAge] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [otherCyclingId, setOtherCyclingId] = useState(null);
  const [otherSelectedId, setOtherSelectedId] = useState(null);
  const [isResolvingOther, setIsResolvingOther] = useState(false);

  const selectedOption = useMemo(
    () => OPTION_DATA.find((option) => option.id === selectedId),
    [selectedId],
  );
  const otherSelectedOption = useMemo(
    () => OPTION_DATA.find((option) => option.id === otherSelectedId),
    [otherSelectedId],
  );

  const canSelect = phase === "settled" && !selectedId && !isResolvingOther;

  const handleSelect = useCallback((id) => {
    if (!canSelect) return;

    setSelectedId(id);
    const unchosen = OPTION_DATA.filter((option) => option.id !== id);

    setTimeout(() => {
      setIsResolvingOther(true);
      let index = 0;
      setOtherCyclingId(unchosen[0].id);

      const intervalId = setInterval(() => {
        index = (index + 1) % unchosen.length;
        setOtherCyclingId(unchosen[index].id);
      }, 170);

      const duration = 1200 + Math.random() * 600;
      setTimeout(() => {
        clearInterval(intervalId);
        const finalOption = unchosen[Math.floor(Math.random() * unchosen.length)];
        setOtherCyclingId(null);
        setOtherSelectedId(finalOption.id);
        setIsResolvingOther(false);
      }, duration);
    }, 700);
  }, [canSelect]);

  useEffect(() => {
    const id = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(id);
  }, []);

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
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (!canSelect) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < OPTION_DATA.length) {
        handleSelect(OPTION_DATA[index].id);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canSelect, handleSelect]);

  return (
    <div className="flex h-full w-full items-center justify-center gap-16 overflow-hidden">
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
                onAnimationComplete={() => {
                  setTimeout(() => {
                    setPhase("split");
                    // the split scene only mounts once the growing frame has
                    // faded out (~200ms). wait past that so the merged purple
                    // figure paints at centre, hold a beat so it's legible,
                    // THEN push apart + recolour into YOU / OTHER YOU.
                    setTimeout(() => {
                      setSplitExpanded(true);
                      setTimeout(() => setPhase("settled"), SPLIT_DURATION * 1000 + 50);
                    }, 320);
                  }, 650);
                }}
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
          <motion.div key="rest" className="mx-auto flex h-full w-full max-w-[1500px] flex-col items-center justify-center gap-4">
            <AnimatePresence>
              {phase === "settled" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid w-full grid-cols-[minmax(0,1fr)_360px] items-end gap-8 border-2 border-[#F4F0E8]/20 bg-panel/60 px-9 py-6 text-left"
                >
                  <div>
                    <div className="font-mono text-sm font-bold tracking-[0.24em] text-accent uppercase">
                      Age 16 / The First Idea
                    </div>
                    <p className="mt-4 max-w-4xl font-heading text-3xl font-bold leading-tight text-text-primary">
                      The night before a major exam, you make a one-page study
                      pack that actually helps people understand the topic.
                    </p>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
                      By lunch the next day, half the year wants a copy.
                    </p>
                    <p className="mt-4 font-heading text-2xl font-bold text-text-primary">
                      What do you do?
                    </p>
                  </div>

                  <div className="border border-[#F4F0E8]/20 bg-bg/45 px-5 py-4">
                    <div className="font-mono text-xs font-bold tracking-[0.16em] text-accent uppercase">
                      This is the first fork
                    </div>
                    <p className="mt-3 font-mono text-xs leading-relaxed text-text-secondary">
                      Every choice creates a different founder. Both lives keep
                      going.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex w-full items-stretch justify-center gap-7">
              <motion.div
                layout
                transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }}
                className="flex h-full flex-1 flex-col items-center justify-center"
              >
                {/* before the fork both figures sit on top of each other at the
                    centre; translating +50% of the (half-width) column lands
                    this one on the midline, then it slides back to 0 as it splits */}
                <motion.div
                  className="flex w-full justify-center"
                  animate={{ x: splitExpanded ? "0%" : "50%" }}
                  transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }}
                >
                  <AvatarPanel
                    identity="You"
                    color={YOU_COLOR}
                    colorized={splitExpanded}
                    option={selectedOption}
                    fallbackBeat="Waiting for the first fork."
                  />
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ width: splitExpanded ? SPLIT_MIDDLE_WIDTH : 0 }}
                transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }}
                className="shrink-0 overflow-hidden"
              >
                <AnimatePresence>
                  {phase === "settled" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                        className="grid grid-cols-2 gap-4"
                      style={{ width: SPLIT_MIDDLE_WIDTH }}
                    >
                      {OPTION_DATA.map((option) => {
                        let status = "idle";
                        if (selectedId === option.id) status = "you";
                        else if (otherSelectedId === option.id) status = "other";
                        else if (otherCyclingId === option.id) status = "cycling";
                        else if (selectedId && otherSelectedId) status = "dim";

                        return (
                          <OptionCard
                            key={option.id}
                            option={option}
                            status={status}
                            disabled={!canSelect}
                            onSelect={handleSelect}
                          />
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                layout
                transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }}
                className="flex h-full flex-1 flex-col items-center justify-center"
              >
                <motion.div
                  className="flex w-full justify-center"
                  animate={{ x: splitExpanded ? "0%" : "-50%" }}
                  transition={{ duration: SPLIT_DURATION, ease: "easeInOut" }}
                >
                  <AvatarPanel
                    identity="Other You"
                    color={OTHER_COLOR}
                    colorized={splitExpanded}
                    option={otherSelectedOption}
                    fallbackBeat="Waiting to become inconvenient."
                  />
                </motion.div>
              </motion.div>
            </div>

            <AnimatePresence>
              {selectedId && otherSelectedId && (
                <motion.button
                  type="button"
                  className="border-2 border-accent bg-accent px-6 py-3 font-heading text-sm font-bold tracking-[0.18em] text-bg uppercase"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ x: 4 }}
                  onClick={() => console.log("Continue clicked")}
                >
                  Continue to Age 17 -&gt;
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
