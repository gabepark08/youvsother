import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar";
import MoneyValue from "./MoneyValue";

function Platform({ color }) {
  return (
    <svg viewBox="0 0 220 70" className="-mt-6 h-[46px] w-[180px] overflow-visible" aria-hidden="true">
      <motion.ellipse
        cx="110"
        cy="35"
        rx="92"
        ry="22"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <ellipse cx="110" cy="35" rx="68" ry="14" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <rect x="99" y="28" width="22" height="14" fill={color} opacity="0.08" />
    </svg>
  );
}

// One player's living HUD: avatar with all accumulated accessories, animated
// net worth, current trait, latest life beat, and a temporary "gained" flash.
export default function AvatarColumn({
  identity,
  color,
  netWorth,
  trait,
  beat,
  accessories = [],
  newlyAddedAccessory,
  gainedLabel,
  isGlitching = false,
  avatarSize = 240,
}) {
  return (
    <div className="flex min-w-[210px] flex-col items-center gap-2 text-center">
      <div className="font-heading text-base font-bold tracking-[0.2em] uppercase" style={{ color }}>
        {identity}
      </div>

      <Avatar
        color={color}
        accessories={accessories}
        newlyAddedAccessory={newlyAddedAccessory}
        isGlitching={isGlitching}
        size={avatarSize}
      />
      <Platform color={color} />

      <div
        className="flex w-full flex-col items-start border bg-panel/50 px-5 py-4 text-left font-mono text-[10px] uppercase tracking-wider"
        style={{ borderColor: `${color}66` }}
      >
        <div style={{ color }}>Net Worth</div>
        <div className="mt-1 text-lg font-bold text-text-primary">
          <MoneyValue value={netWorth} />
        </div>

        <div className="mt-4" style={{ color }}>Trait</div>
        <div className="mt-1 font-bold text-text-primary">{trait}</div>

        <div className="mt-4" style={{ color }}>Beat</div>
        <div className="mt-1 max-w-[180px] normal-case leading-relaxed text-text-primary/80">{beat}</div>

        <AnimatePresence>
          {gainedLabel && (
            <motion.div
              key={gainedLabel}
              className="mt-3 w-full border-t border-[#F4F0E8]/10 pt-2 font-bold"
              style={{ color }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {identity} gained: {gainedLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
