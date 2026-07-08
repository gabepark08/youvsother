import { motion } from "framer-motion";

export default function StartButton({ onStart, onHoverStart, onHoverEnd }) {
  return (
    <div className="inline-flex flex-col items-start pb-6">
      <motion.button
        type="button"
        onClick={onStart}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        className="inline-flex items-center gap-3 border-4 border-[#070812] bg-[#F4F0E8] px-8 py-4 font-heading text-lg font-bold tracking-wide text-[#070812] uppercase"
        whileHover={{
          x: [4, 2, 5, 3, 5, 4],
          y: [-4, -5, -3, -5, -3, -4],
          boxShadow: "-8px -8px 0px 0px #00E5FF, 8px 8px 0px 0px #FF2E88",
        }}
        whileTap={{
          x: 2,
          y: -2,
          boxShadow: "-3px -3px 0px 0px #00E5FF, 3px 3px 0px 0px #FF2E88",
        }}
        initial={{
          boxShadow: "0px 0px 0px 0px #00E5FF, 0px 0px 0px 0px #FF2E88",
        }}
        transition={{
          x: { duration: 0.15, repeat: Infinity, repeatDelay: 0.02, ease: "easeInOut" },
          y: { duration: 0.15, repeat: Infinity, repeatDelay: 0.02, ease: "easeInOut" },
          boxShadow: { type: "spring", stiffness: 400, damping: 20 },
        }}
      >
        Start the Fork <span aria-hidden="true">&rarr;</span>
      </motion.button>

      <p className="mt-3 font-mono text-[11px] font-bold tracking-[0.2em] text-text-primary uppercase">
        Press Enter or click to begin
      </p>
    </div>
  );
}
