import { motion } from "framer-motion";

const LINES = [
  { top: "12%", width: "38%", left: "5%", delay: 0 },
  { top: "27%", width: "22%", left: "60%", delay: 1.1 },
  { top: "44%", width: "50%", left: "20%", delay: 0.4 },
  { top: "61%", width: "30%", left: "2%", delay: 2 },
  { top: "73%", width: "18%", left: "70%", delay: 0.8 },
  { top: "86%", width: "42%", left: "35%", delay: 1.6 },
];

export default function GlitchBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* scanlines - slow vertical drift */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #F4F0E8 0px, #F4F0E8 1px, transparent 1px, transparent 3px)",
        }}
        animate={{ backgroundPositionY: [0, 120] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#F4F0E8 1px, transparent 1px), linear-gradient(90deg, #F4F0E8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* drifting glitch lines */}
      {LINES.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: line.top,
            left: line.left,
            width: line.width,
            background:
              i % 2 === 0
                ? "linear-gradient(90deg, transparent, #00E5FF, transparent)"
                : "linear-gradient(90deg, transparent, #FF2E88, transparent)",
          }}
          animate={{
            opacity: [0, 0.5, 0, 0.3, 0],
            x: [0, 12, -6, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: line.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #070812 95%)",
        }}
      />
    </div>
  );
}
