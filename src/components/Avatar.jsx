import { AnimatePresence, motion } from "framer-motion";
import { FIGURE, VIEWBOX } from "../game/figure";

const YELLOW = "#F5FF3D";
const MAGENTA = "#FF2E88";
const CYAN = "#00E5FF";
const GREEN = "#37FF8B";
const CREAM = "#F4F0E8";
const RED = "#FF4D6D";

// Each accessory: an origin (for the pop scale) + a render fn drawing simple,
// funny, pixel-ish geometry in figure coordinates. `color` is the identity
// colour (cyan for YOU, magenta for OTHER YOU) used where a neutral outline
// reads best; fixed thematic colours are used elsewhere.
const ACCESSORIES = {
  "fresh-sneakers": {
    origin: [80, 189],
    render: (color) => (
      <>
        <rect x={61} y={186} width={19} height={8} fill={CREAM} stroke={color} strokeWidth="2" />
        <rect x={82} y={186} width={19} height={8} fill={CREAM} stroke={color} strokeWidth="2" />
        <path d="M 54 182 L 58 178 L 62 182 L 58 186 Z" fill={YELLOW} />
      </>
    ),
  },
  "heart-sticker": {
    origin: [80, 100],
    render: () => (
      <path
        d="M 80 94 C 75 88, 66 92, 70 101 C 73 108, 80 113, 80 113 C 80 113, 87 108, 90 101 C 94 92, 85 88, 80 94 Z"
        fill={MAGENTA}
        stroke={CREAM}
        strokeWidth="1.5"
      />
    ),
  },
  sunglasses: {
    origin: [80, 64],
    render: (color) => (
      <>
        <rect x={67} y={61} width={11} height={5} fill="#070812" stroke={color} strokeWidth="1.5" />
        <rect x={82} y={61} width={11} height={5} fill="#070812" stroke={color} strokeWidth="1.5" />
        <line x1={78} y1={63.5} x2={82} y2={63.5} stroke={color} strokeWidth="1.5" />
      </>
    ),
  },
  "ceo-lanyard": {
    origin: [80, 100],
    render: (color) => (
      <>
        <path d="M 71 78 L 78 96" stroke={color} strokeWidth="2" fill="none" />
        <path d="M 89 78 L 82 96" stroke={color} strokeWidth="2" fill="none" />
        <rect x={73} y={96} width={14} height={11} fill="#070812" stroke={YELLOW} strokeWidth="2" />
        <line x1={76} y1={101} x2={84} y2={101} stroke={YELLOW} strokeWidth="1.3" />
      </>
    ),
  },
  "glowing-laptop": {
    origin: [80, 112],
    render: () => (
      <>
        <rect x={64} y={106} width={32} height={20} fill="#0A0C18" stroke={CYAN} strokeWidth="2" />
        <motion.rect
          x={67}
          y={109}
          width={26}
          height={14}
          fill={CYAN}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x={60} y={126} width={40} height={3} fill="#0A0C18" stroke={CYAN} strokeWidth="1.5" />
      </>
    ),
  },
  "template-blocks": {
    origin: [104, 104],
    render: (color) => (
      <>
        <rect x={98} y={96} width={13} height={9} fill="#070812" stroke={color} strokeWidth="1.6" />
        <rect x={101} y={104} width={13} height={9} fill="#070812" stroke={color} strokeWidth="1.6" />
        <rect x={99} y={112} width={13} height={9} fill="#070812" stroke={color} strokeWidth="1.6" />
      </>
    ),
  },
  "handshake-bracelet": {
    origin: [104, 122],
    render: () => (
      <>
        <rect x={99} y={118} width={11} height={6} rx={2} fill="none" stroke={YELLOW} strokeWidth="2.4" />
        <circle cx={104.5} cy={121} r={2} fill={YELLOW} />
      </>
    ),
  },
  "headset-clipboard": {
    origin: [80, 60],
    render: (color) => (
      <>
        <path d="M 66 62 Q 80 44 94 62" fill="none" stroke={color} strokeWidth="2.4" />
        <rect x={63} y={62} width={4} height={7} fill={color} />
        <rect x={93} y={62} width={4} height={7} fill={color} />
        <path d="M 66 69 L 72 74" stroke={color} strokeWidth="2" />
        <circle cx={73} cy={75} r={2} fill={color} />
      </>
    ),
  },
  "comparison-scar": {
    origin: [80, 90],
    render: () => (
      <>
        <path d="M 84 82 L 80 92 L 85 96 L 81 108" fill="none" stroke={RED} strokeWidth="2" strokeLinejoin="round" />
        <path d="M 82 84 L 79 84 M 83 100 L 80 100" stroke={RED} strokeWidth="1.4" />
      </>
    ),
  },
  "paddock-pass": {
    origin: [80, 102],
    render: () => (
      <>
        <path d="M 80 78 L 80 94" stroke={YELLOW} strokeWidth="1.6" />
        <rect x={72} y={94} width={16} height={12} fill="#0A0C18" stroke={YELLOW} strokeWidth="2" />
        <line x1={75} y1={98} x2={85} y2={98} stroke={YELLOW} strokeWidth="1.3" />
        <line x1={75} y1={102} x2={82} y2={102} stroke={YELLOW} strokeWidth="1.3" />
      </>
    ),
  },
  "duct-tape-patch": {
    origin: [80, 104],
    render: () => (
      <>
        <rect x={70} y={100} width={22} height={7} fill="#8A8577" stroke="#4A4636" strokeWidth="1.2" transform="rotate(18 80 104)" />
        <rect x={70} y={100} width={22} height={7} fill="#8A8577" stroke="#4A4636" strokeWidth="1.2" transform="rotate(-18 80 104)" />
      </>
    ),
  },
  "burnt-wallet": {
    origin: [104, 118],
    render: () => (
      <>
        <rect x={97} y={114} width={15} height={11} fill="#2A1810" stroke="#5A3A24" strokeWidth="1.5" />
        <rect x={104} y={117} width={5} height={5} fill="#3A251A" stroke="#5A3A24" strokeWidth="1" />
        <path d="M 101 114 Q 99 108 103 106 Q 101 111 104 114" fill={RED} />
        <path d="M 106 114 Q 105 110 108 108 Q 106 111 108 114" fill={YELLOW} />
      </>
    ),
  },
  "tired-eyes": {
    origin: [80, 70],
    render: () => (
      <>
        <path d="M 71 70 Q 74 73 77 70" fill="none" stroke="#7A6FA0" strokeWidth="1.6" />
        <path d="M 83 70 Q 86 73 89 70" fill="none" stroke="#7A6FA0" strokeWidth="1.6" />
      </>
    ),
  },
  "pause-badge": {
    origin: [80, 102],
    render: (color) => (
      <>
        <rect x={72} y={95} width={16} height={14} fill="#070812" stroke={color} strokeWidth="2" />
        <rect x={76} y={98} width={3} height={8} fill={color} />
        <rect x={81} y={98} width={3} height={8} fill={color} />
      </>
    ),
  },
  "term-sheet-folder": {
    origin: [104, 108],
    render: () => (
      <>
        <rect x={95} y={100} width={18} height={16} fill="#0A0C18" stroke={GREEN} strokeWidth="2" />
        <line x1={98} y1={105} x2={110} y2={105} stroke={GREEN} strokeWidth="1.3" />
        <line x1={98} y1={109} x2={110} y2={109} stroke={GREEN} strokeWidth="1.3" />
        <text x={104} y={114} textAnchor="middle" fill={GREEN} fontSize="6" fontFamily="monospace" fontWeight="bold">$</text>
      </>
    ),
  },
  "company-hoodie": {
    origin: [80, 66],
    render: (color) => (
      <>
        <path d="M 65 76 Q 80 48 95 76" fill="none" stroke={color} strokeWidth="2.6" />
        <path d="M 76 78 L 78 88 L 82 88 L 84 78" fill="none" stroke={color} strokeWidth="1.6" />
        <circle cx={78} cy={89} r={1.4} fill={color} />
        <circle cx={82} cy={89} r={1.4} fill={color} />
      </>
    ),
  },
  "index-fund-badge": {
    origin: [80, 102],
    render: () => (
      <>
        <rect x={71} y={95} width={18} height={14} fill="#070812" stroke={GREEN} strokeWidth="2" />
        <path d="M 74 105 L 78 101 L 81 103 L 86 97" fill="none" stroke={GREEN} strokeWidth="1.8" />
        <path d="M 84 97 L 86 97 L 86 99" fill="none" stroke={GREEN} strokeWidth="1.8" />
      </>
    ),
  },
  "film-clapper": {
    origin: [104, 110],
    render: () => (
      <>
        <rect x={95} y={104} width={20} height={14} fill="#0A0C18" stroke={CREAM} strokeWidth="1.8" />
        <path d="M 95 104 L 115 104 L 113 99 L 93 99 Z" fill="#0A0C18" stroke={CREAM} strokeWidth="1.6" />
        <path d="M 96 100 L 100 104 M 102 100 L 106 104 M 108 100 L 112 104" stroke={CREAM} strokeWidth="1.2" />
      </>
    ),
  },
  "yellow-flag-patch": {
    origin: [104, 96],
    render: () => (
      <>
        <line x1={100} y1={80} x2={100} y2={130} stroke="#4A4636" strokeWidth="2" />
        <motion.path
          d="M 100 82 L 116 86 L 100 96 Z"
          fill={YELLOW}
          stroke="#070812"
          strokeWidth="1"
          animate={{ skewX: [0, 8, -4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 88px" }}
        />
      </>
    ),
  },
  "cracked-stopwatch": {
    origin: [56, 118],
    render: () => (
      <>
        <circle cx={56} cy={118} r={9} fill="#0A0C18" stroke={CREAM} strokeWidth="2" />
        <rect x={53} y={107} width={6} height={3} fill={CREAM} />
        <path d="M 56 118 L 56 112 M 56 118 L 60 120" stroke={RED} strokeWidth="1.4" />
        <path d="M 51 114 L 56 118 L 53 124" fill="none" stroke={RED} strokeWidth="1.4" />
      </>
    ),
  },
  "racing-helmet": {
    origin: [80, 60],
    render: (color) => (
      <>
        <path d="M 66 66 Q 66 46 80 46 Q 94 46 94 66 Z" fill="#0A0C18" stroke={color} strokeWidth="2.4" />
        <path d="M 69 60 Q 80 56 91 60 L 91 65 Q 80 62 69 65 Z" fill={color} opacity="0.8" />
        <path d="M 66 66 L 94 66" stroke={color} strokeWidth="2" />
      </>
    ),
  },
  "toolbelt-cash-register": {
    origin: [80, 130],
    render: () => (
      <>
        <rect x={61} y={127} width={38} height={7} fill="#2A2418" stroke={YELLOW} strokeWidth="1.8" />
        <rect x={74} y={128} width={12} height={5} fill="#0A0C18" stroke={YELLOW} strokeWidth="1.4" />
        <rect x={64} y={129} width={5} height={4} fill={YELLOW} />
        <rect x={91} y={129} width={5} height={4} fill={YELLOW} />
      </>
    ),
  },
  "golden-ticket": {
    origin: [104, 96],
    render: () => (
      <motion.g
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "104px 96px" }}
      >
        <rect x={94} y={90} width={22} height={13} rx={1} fill={YELLOW} stroke="#070812" strokeWidth="1.4" />
        <circle cx={94} cy={96.5} r={2} fill="#070812" />
        <circle cx={116} cy={96.5} r={2} fill="#070812" />
        <text x={105} y={100} textAnchor="middle" fill="#070812" fontSize="6" fontFamily="monospace" fontWeight="bold">EXIT</text>
      </motion.g>
    ),
  },
  "strange-crown": {
    origin: [80, 50],
    render: () => (
      <>
        <path d="M 68 54 L 70 42 L 76 50 L 80 40 L 84 50 L 90 42 L 92 54 Z" fill={YELLOW} stroke="#070812" strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx={80} cy={44} r={1.6} fill={MAGENTA} />
      </>
    ),
  },
};

function Accessory({ item, color, isNew }) {
  const entry = ACCESSORIES[item];
  if (!entry) return null;
  const [ox, oy] = entry.origin;

  return (
    <motion.g
      style={{ transformOrigin: `${ox}px ${oy}px` }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isNew
          ? { opacity: [0, 1, 0.4, 1], scale: [0.5, 1.3, 0.95, 1], x: [0, -2, 2, 0] }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: isNew ? 0.55 : 0.3, ease: "easeOut" }}
    >
      {entry.render(color)}
    </motion.g>
  );
}

// The reusable block avatar.
//   color: cyan (YOU) or magenta (OTHER YOU)
//   accessories: array of item ids to render (stacked)
//   newlyAddedAccessory: item id that should pop/glitch in
//   isGlitching: whole-avatar jitter (used during wildcards)
//   size: pixel height
export default function Avatar({
  color,
  accessories = [],
  newlyAddedAccessory,
  isGlitching = false,
  size = 240,
}) {
  return (
    <motion.svg
      viewBox={VIEWBOX}
      shapeRendering="crispEdges"
      className="w-auto overflow-visible"
      style={{ height: size }}
      animate={isGlitching ? { x: [0, -3, 4, -2, 0], opacity: [1, 0.7, 1, 0.85, 1] } : { x: 0, opacity: 1 }}
      transition={isGlitching ? { duration: 0.35, repeat: Infinity, repeatType: "mirror" } : { duration: 0.2 }}
    >
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.legL} />
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.legR} />
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.armL} />
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.armR} />
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.torso} />
      <rect fill="#070812" stroke={color} strokeWidth="3" {...FIGURE.head} />

      <AnimatePresence>
        {accessories.map((item) => (
          <Accessory key={item} item={item} color={color} isNew={item === newlyAddedAccessory} />
        ))}
      </AnimatePresence>
    </motion.svg>
  );
}
