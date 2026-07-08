import { motion } from "framer-motion";

const AGES = [16, 18, 21, 24, 27, 30];
const WIDTH = 640;
const HEIGHT = 320;
const PAD = 40;
const STEP = (WIDTH - PAD * 2) / (AGES.length - 1);
const XS = AGES.map((_, i) => PAD + i * STEP);

// YOU: smoother than the alternate path, but still visibly volatile.
const YOU_Y = [98, 124, 76, 86, 118, 108];
// OTHER YOU: volatile - starts together, swings hard, trades momentum twice,
// then settles at a different (not worse) endpoint. Same story, different life.
const OTHER_Y = [98, 78, 128, 108, 76, 96];

const youPoints = XS.map((x, i) => [x, YOU_Y[i]]);
const otherPoints = XS.map((x, i) => [x, OTHER_Y[i]]);

// smooth bezier through points - reads as controlled
function smoothPath(points) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const midX = (x0 + x1) / 2;
    d += ` C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

// jagged polyline that still lands exactly on each main node - reads as unpredictable
const JITTER = [9, -13, 6];
function jaggedPath(points) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const steps = JITTER.length + 1;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t + (s < steps ? JITTER[s - 1] : 0);
      d += ` L ${x} ${y}`;
    }
  }
  return d;
}

const youPath = smoothPath(youPoints);
const otherPath = jaggedPath(otherPoints);

// nodes near where the two lives trade momentum - these flash on hover
const YOU_FLASH_INDEX = 3;
const OTHER_FLASH_INDEX = 2;

export default function Timeline({ isStartHovered = false, clickPulse = 0 }) {
  return (
    <div className="w-full">
      {/* legend */}
      <div className="mb-5 flex items-center gap-7 font-mono text-sm tracking-wide">
        <span className="flex items-center gap-2 text-you">
          <span className="inline-block h-3 w-3 shrink-0 border-2 border-you" />
          YOU
        </span>
        <span className="flex items-center gap-2 text-other">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full border-2 border-other" />
          OTHER YOU
        </span>
      </div>

      <motion.div
        className="relative w-full max-w-[640px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="glitchGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#FF2E88" />
            </linearGradient>
          </defs>

          {/* click glitch flash */}
          {clickPulse > 0 && (
            <motion.rect
              key={`glitch-${clickPulse}`}
              x={0}
              y={0}
              width={WIDTH}
              height={HEIGHT}
              fill="url(#glitchGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0.05, 0.25, 0] }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          )}

          {/* YOU glow - subtle continuous breathing */}
          <motion.path
            d={youPath}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ filter: "blur(4px)" }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* YOU glow - keeps pulsing while the CTA is hovered */}
          {isStartHovered && (
            <motion.path
              d={youPath}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ filter: "blur(5px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* YOU line - solid cyan, smooth/controlled */}
          <path
            d={youPath}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* OTHER YOU line - dashed magenta, jagged/volatile, jitters briefly on hover */}
          <motion.g
            animate={
              isStartHovered
                ? { x: [0, -3, 3, -2, 2, 0] }
                : { x: 0 }
            }
            transition={
              isStartHovered
                ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.15, ease: "easeInOut" }
                : { duration: 0.2, ease: "easeOut" }
            }
          >
            <motion.path
              d={otherPath}
              fill="none"
              stroke="#FF2E88"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="9 7"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>

          {/* YOU nodes - squares */}
          {youPoints.map(([x, y], i) => (
            <motion.rect
              key={`you-${i}`}
              x={x - 6}
              y={y - 6}
              width={12}
              height={12}
              fill="#070812"
              stroke="#00E5FF"
              strokeWidth="2.5"
              animate={
                i === YOU_FLASH_INDEX && isStartHovered
                  ? { scale: [1, 1.7, 1], opacity: [1, 1, 1] }
                  : { scale: 1 }
              }
              style={{ transformOrigin: `${x}px ${y}px` }}
              transition={
                i === YOU_FLASH_INDEX && isStartHovered
                  ? { duration: 0.7, repeat: Infinity, ease: "easeOut" }
                  : { duration: 0.2, ease: "easeOut" }
              }
            />
          ))}

          {/* OTHER YOU nodes - circles */}
          {otherPoints.map(([x, y], i) => (
            <motion.circle
              key={`other-${i}`}
              cx={x}
              cy={y}
              r={6}
              fill="#070812"
              stroke="#FF2E88"
              strokeWidth="2.5"
              animate={
                i === OTHER_FLASH_INDEX && isStartHovered
                  ? { scale: [1, 1.7, 1] }
                  : { scale: 1 }
              }
              style={{ transformOrigin: `${x}px ${y}px` }}
              transition={
                i === OTHER_FLASH_INDEX && isStartHovered
                  ? { duration: 0.7, repeat: Infinity, ease: "easeOut" }
                  : { duration: 0.2, ease: "easeOut" }
              }
            />
          ))}

          {/* age labels */}
          {XS.map((x, i) => (
            <text
              key={`age-${i}`}
              x={x}
              y={HEIGHT - 24}
              textAnchor="middle"
              fill="#A7A3B7"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="14"
              letterSpacing="0.5"
            >
              {AGES[i]}
            </text>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
