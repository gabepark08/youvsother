// Shared block-figure geometry for the adult (age 16+) avatar.
// This is the same final-stage figure the OriginSequence grows into, extracted
// so every in-game avatar renders from one source of truth.

const CX = 80;
const BASELINE = 190;

// Proportions of the fully-grown figure.
const RAW = {
  head: { w: 22, h: 24 },
  torso: { w: 36, h: 54 },
  arm: { w: 8, h: 46 },
  leg: { w: 13, h: 58 },
};

function computeStage(s) {
  const legY = BASELINE - s.leg.h;
  const torsoY = legY - s.torso.h;
  const headY = torsoY - s.head.h;
  const armY = torsoY;
  return {
    head: { x: CX - s.head.w / 2, y: headY, width: s.head.w, height: s.head.h },
    torso: { x: CX - s.torso.w / 2, y: torsoY, width: s.torso.w, height: s.torso.h },
    legL: { x: CX - s.leg.w - 2, y: legY, width: s.leg.w, height: s.leg.h },
    legR: { x: CX + 2, y: legY, width: s.leg.w, height: s.leg.h },
    armL: { x: CX - s.torso.w / 2 - s.arm.w - 2, y: armY, width: s.arm.w, height: s.arm.h },
    armR: { x: CX + s.torso.w / 2 + 2, y: armY, width: s.arm.w, height: s.arm.h },
  };
}

export const FIGURE = computeStage(RAW);

// Widened viewBox so accessories that reach past the body (helmets, flags,
// tools held to the side) aren't clipped.
export const VIEWBOX = "34 30 92 176";

// Handy anchor zones (in figure coordinates) for placing accessories.
export const ZONES = {
  cx: CX,
  headCenterY: FIGURE.head.y + FIGURE.head.height / 2, // ~66
  headTop: FIGURE.head.y, // 54
  eyesY: FIGURE.head.y + FIGURE.head.height * 0.45, // ~65
  chestY: FIGURE.torso.y + 14, // ~92
  torsoY: FIGURE.torso.y, // 78
  torsoBottom: FIGURE.torso.y + FIGURE.torso.height, // 132
  feetY: BASELINE, // 190
  footLeftX: CX - 9,
  footRightX: CX + 9,
  handLeftX: FIGURE.armL.x + FIGURE.armL.width / 2, // ~56
  handRightX: FIGURE.armR.x + FIGURE.armR.width / 2, // ~104
  handY: FIGURE.armL.y + FIGURE.armL.height, // ~124
};
